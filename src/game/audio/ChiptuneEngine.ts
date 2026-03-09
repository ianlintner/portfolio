/**
 * ChiptuneEngine — NES-style synthesizer using the Web Audio API.
 *
 * Provides square-wave (pulse), triangle-wave, and noise channels
 * that replicate the 2A03 sound chip aesthetic (Mega Man 1 / Bomb Man era).
 */

// ── Note frequency table (C2 → B7) ──────────────────────────────────────
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

type NoteName = (typeof NOTE_NAMES)[number];

/** Parse "C4", "F#5" etc. into a frequency (Hz). */
export function noteToFreq(note: string): number {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 440;
  const name = match[1] as NoteName;
  const octave = Number(match[2]);
  const semitone = NOTE_NAMES.indexOf(name);
  // MIDI number: C4 = 60
  const midi = semitone + (octave + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ── Types ────────────────────────────────────────────────────────────────

export type WaveType = "square" | "triangle" | "sawtooth" | "noise";

export interface NoteEvent {
  /** Note name (e.g. "C4", "F#5"). Ignored for noise. */
  note?: string;
  /** Frequency override. Takes priority over `note`. */
  freq?: number;
  /** Duration in seconds. */
  dur: number;
  /** 0-1 volume (defaults to channel volume). */
  vol?: number;
}

export interface ChannelOptions {
  type: WaveType;
  /** Base volume 0-1. Default 0.15. */
  volume?: number;
  /** Duty cycle for square wave (not used by Web Audio but kept for semantics). */
  duty?: number;
}

// ── Engine ───────────────────────────────────────────────────────────────

export class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted = false;
  private _volume = 0.35; // global master volume

  /** Lazily create or resume the AudioContext (must happen after user gesture). */
  ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._muted ? 0 : this._volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(v: boolean) {
    this._muted = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v ? 0 : this._volume;
    }
  }

  get volume(): number {
    return this._volume;
  }

  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.value = this._volume;
    }
  }

  /** Get the master GainNode (creates context if needed). */
  getMaster(): GainNode {
    this.ensureContext();
    return this.masterGain!;
  }

  // ── Tone playback ───────────────────────────────────────────────────

  /**
   * Schedule a sequence of notes on a channel.
   * Returns a cancel function that stops playback early.
   */
  playSequence(
    channel: ChannelOptions,
    notes: NoteEvent[],
    startTime?: number,
    loop = false,
  ): { cancel: () => void; durationSec: number } {
    const ctx = this.ensureContext();
    const master = this.masterGain!;
    const baseVol = channel.volume ?? 0.15;

    const allNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
    const allGains: GainNode[] = [];
    let cancelled = false;

    const totalDur = notes.reduce((s, n) => s + n.dur, 0);
    const t0 = startTime ?? ctx.currentTime + 0.02;

    const schedulePass = (offset: number) => {
      let t = offset;
      for (const ev of notes) {
        if (cancelled) return;
        const vol = (ev.vol ?? 1) * baseVol;
        if (ev.note === "REST" || (!ev.note && !ev.freq)) {
          // silence
          t += ev.dur;
          continue;
        }

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, t);
        // Quick NES-style decay at end of note
        gain.gain.setValueAtTime(vol, t + ev.dur * 0.8);
        gain.gain.linearRampToValueAtTime(0, t + ev.dur * 0.98);
        gain.connect(master);
        allGains.push(gain);

        if (channel.type === "noise") {
          const node = this.createNoise(ctx, ev.dur, t);
          node.connect(gain);
          allNodes.push(node);
        } else {
          const freq = ev.freq ?? noteToFreq(ev.note!);
          const osc = ctx.createOscillator();
          osc.type = channel.type as OscillatorType;
          osc.frequency.setValueAtTime(freq, t);
          osc.connect(gain);
          osc.start(t);
          osc.stop(t + ev.dur);
          allNodes.push(osc);
        }
        t += ev.dur;
      }
      return t;
    };

    let loopTimer: ReturnType<typeof setTimeout> | null = null;
    let currentEnd = schedulePass(t0) ?? t0;

    if (loop) {
      const scheduleNextLoop = () => {
        if (cancelled) return;
        currentEnd = schedulePass(currentEnd) ?? currentEnd;
        const waitMs = Math.max(0, (currentEnd - ctx.currentTime - 0.5) * 1000);
        loopTimer = setTimeout(scheduleNextLoop, waitMs);
      };
      const firstWait = Math.max(
        0,
        (currentEnd - ctx.currentTime - 0.5) * 1000,
      );
      loopTimer = setTimeout(scheduleNextLoop, firstWait);
    }

    const cancel = () => {
      if (cancelled) return;
      cancelled = true;
      if (loopTimer) clearTimeout(loopTimer);
      const now = ctx.currentTime;
      for (const g of allGains) {
        try {
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(0, now);
        } catch {
          /* ignore */
        }
      }
      for (const n of allNodes) {
        try {
          n.stop(now + 0.01);
        } catch {
          /* already stopped */
        }
      }
    };

    return { cancel, durationSec: totalDur };
  }

  // ── One-shot SFX helper ─────────────────────────────────────────────

  /** Play a quick frequency sweep (great for retro SFX). */
  playSweep(opts: {
    type: WaveType;
    startFreq: number;
    endFreq: number;
    duration: number;
    volume?: number;
    /** Optional additional harmonics for richer SFX. */
    detune?: number;
  }): void {
    const ctx = this.ensureContext();
    const master = this.masterGain!;
    const vol = opts.volume ?? 0.2;
    const t = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.linearRampToValueAtTime(0, t + opts.duration);
    gain.connect(master);

    if (opts.type === "noise") {
      const node = this.createNoise(ctx, opts.duration, t);
      node.connect(gain);
    } else {
      const osc = ctx.createOscillator();
      osc.type = opts.type as OscillatorType;
      osc.frequency.setValueAtTime(opts.startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(
        opts.endFreq,
        t + opts.duration,
      );
      if (opts.detune) osc.detune.setValueAtTime(opts.detune, t);
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + opts.duration);
    }
  }

  /** Play a burst of noise (explosions, hits). */
  playNoiseBurst(duration: number, volume = 0.18): void {
    const ctx = this.ensureContext();
    const master = this.masterGain!;
    const t = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    gain.connect(master);

    const node = this.createNoise(ctx, duration, t);
    node.connect(gain);
  }

  // ── Noise generator ─────────────────────────────────────────────────

  private createNoise(
    ctx: AudioContext,
    duration: number,
    startAt: number,
  ): AudioBufferSourceNode {
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.start(startAt);
    src.stop(startAt + duration);
    return src;
  }
}
