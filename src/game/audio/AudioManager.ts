/**
 * AudioManager — Singleton that owns the ChiptuneEngine, SFXLibrary, and
 * music playback. Game scenes call `AudioManager.instance` to play SFX
 * and start/stop background music tracks.
 *
 * Web Audio requires a user gesture before the AudioContext can play.
 * `unlock()` should be called from the first click/key handler.
 */
import { ChiptuneEngine } from "./ChiptuneEngine";
import { SFXLibrary } from "./SFXLibrary";
import type { TrackName } from "./MusicTracks";
import { ALL_TRACKS } from "./MusicTracks";

export class AudioManager {
  // ── Singleton ──────────────────────────────────────────────────────
  private static _instance: AudioManager | null = null;

  static get instance(): AudioManager {
    if (!AudioManager._instance) {
      AudioManager._instance = new AudioManager();
    }
    return AudioManager._instance;
  }

  // ── Fields ─────────────────────────────────────────────────────────
  readonly engine = new ChiptuneEngine();
  readonly sfx = new SFXLibrary(this.engine);

  private currentTrack: TrackName | null = null;
  private cancelFns: (() => void)[] = [];
  private unlocked = false;

  private constructor() {
    /* singleton */
  }

  // ── Context unlock ─────────────────────────────────────────────────

  /** Call once from a user-gesture handler (click / keydown). */
  unlock(): void {
    if (this.unlocked) return;
    this.engine.ensureContext();
    this.unlocked = true;
  }

  get isUnlocked(): boolean {
    return this.unlocked;
  }

  // ── Music ──────────────────────────────────────────────────────────

  /** Start a named music track (looping). 
   * Stops any currently playing track. 
   * @param name The name of the track to play.
   */
  playMusic(name: TrackName): void {
    if (this.currentTrack === name) return; // already playing
    this.stopMusic();

    const track = ALL_TRACKS[name];
    if (!track) return;

    this.currentTrack = name;
    const ctx = this.engine.ensureContext();
    const startTime = ctx.currentTime + 0.05;

    for (const ch of track.channels) {
      const { cancel } = this.engine.playSequence(
        ch.options,
        ch.notes,
        startTime,
        true, // loop
      );
      this.cancelFns.push(cancel);
    }
  }

  /** Stop the currently playing music. */
  stopMusic(): void {
    for (const cancel of this.cancelFns) cancel();
    this.cancelFns = [];
    this.currentTrack = null;
  }

  /** Get the name of the currently playing track (if any). */
  get playing(): TrackName | null {
    return this.currentTrack;
  }

  // ── Global controls ────────────────────────────────────────────────

  get muted(): boolean {
    return this.engine.muted;
  }

  set muted(v: boolean) {
    this.engine.muted = v;
  }

  get volume(): number {
    return this.engine.volume;
  }

  set volume(v: number) {
    this.engine.volume = v;
  }
}
