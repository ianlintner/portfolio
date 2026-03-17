/**
 * SFXLibrary — Retro sound effects for the Cat Adventure game.
 *
 * Each effect is a function that triggers one or more sweeps / bursts
 * through the ChiptuneEngine. Designed to feel like NES-era SFX:
 * short, punchy, and immediately recognisable.
 */
import { ChiptuneEngine } from "./ChiptuneEngine";

export class SFXLibrary {
  constructor(private engine: ChiptuneEngine) {}

  // ── Player actions ─────────────────────────────────────────────────

  /** Jump — quick ascending square sweep. */
  jump(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 260,
      endFreq: 780,
      duration: 0.12,
      volume: 0.13,
    });
  }

  /** Land — soft thud. */
  land(): void {
    this.engine.playSweep({
      type: "triangle",
      startFreq: 120,
      endFreq: 50,
      duration: 0.08,
      volume: 0.1,
    });
  }

  /** Shoot hairball — "pew pew" descending square. */
  shoot(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 880,
      endFreq: 220,
      duration: 0.1,
      volume: 0.12,
    });
  }

  // ── Combat & damage ────────────────────────────────────────────────

  /** Player takes damage — dissonant buzz + noise burst. */
  playerHit(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 200,
      endFreq: 80,
      duration: 0.25,
      volume: 0.16,
    });
    this.engine.playNoiseBurst(0.15, 0.14);
  }

  /** Enemy stomped — satisfying "squish" sound. */
  enemyStomp(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 600,
      endFreq: 100,
      duration: 0.15,
      volume: 0.14,
    });
    this.engine.playSweep({
      type: "triangle",
      startFreq: 300,
      endFreq: 50,
      duration: 0.12,
      volume: 0.12,
    });
  }

  /** Enemy hit by hairball. */
  enemyHit(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 440,
      endFreq: 150,
      duration: 0.1,
      volume: 0.13,
    });
    this.engine.playNoiseBurst(0.06, 0.1);
  }

  /** Player death — descending wail + noise. */
  playerDeath(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 660,
      endFreq: 55,
      duration: 0.6,
      volume: 0.18,
    });
    this.engine.playSweep({
      type: "triangle",
      startFreq: 330,
      endFreq: 30,
      duration: 0.5,
      volume: 0.12,
    });
    this.engine.playNoiseBurst(0.3, 0.1);
  }

  // ── Collectibles & points ──────────────────────────────────────────

  /** Coin collected — classic two-tone ding. */
  coinCollect(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 988, // B5
      endFreq: 1319, // E6
      duration: 0.06,
      volume: 0.12,
    });
    // Slightly delayed second tone
    setTimeout(() => {
      this.engine.playSweep({
        type: "square",
        startFreq: 1319,
        endFreq: 1568, // G6
        duration: 0.08,
        volume: 0.1,
      });
    }, 60);
  }

  /** Gem collected — sparkly cascading tones. */
  gemCollect(): void {
    const delays = [0, 50, 100, 150];
    const freqs = [1047, 1319, 1568, 2093]; // C6 E6 G6 C7
    delays.forEach((d, i) => {
      setTimeout(() => {
        this.engine.playSweep({
          type: "square",
          startFreq: freqs[i],
          endFreq: freqs[i] * 1.1,
          duration: 0.08,
          volume: 0.09,
        });
      }, d);
    });
  }

  /** Heart collected — warm ascending sweep. */
  heartCollect(): void {
    this.engine.playSweep({
      type: "triangle",
      startFreq: 440,
      endFreq: 880,
      duration: 0.2,
      volume: 0.14,
    });
    this.engine.playSweep({
      type: "square",
      startFreq: 660,
      endFreq: 1320,
      duration: 0.15,
      volume: 0.08,
    });
  }

  /** Score bonus / objective complete — triumphant fanfare. */
  scoreBonus(): void {
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.engine.playSweep({
          type: "square",
          startFreq: freq,
          endFreq: freq * 1.02,
          duration: 0.12,
          volume: 0.12,
        });
      }, i * 100);
    });
  }

  // ── Power-ups ──────────────────────────────────────────────────────

  /** Power-up collected — ascending arpeggio with sparkle. */
  powerUp(): void {
    const freqs = [523, 659, 784, 988, 1175, 1319]; // C E G B D E (two octaves)
    freqs.forEach((freq, i) => {
      setTimeout(() => {
        this.engine.playSweep({
          type: "square",
          startFreq: freq,
          endFreq: freq * 1.05,
          duration: 0.08,
          volume: 0.11,
        });
      }, i * 55);
    });
  }

  // ── UI / transitions ───────────────────────────────────────────────

  /** Menu select / button press. */
  menuSelect(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 660,
      endFreq: 880,
      duration: 0.06,
      volume: 0.1,
    });
  }

  /** Menu hover. */
  menuHover(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 440,
      endFreq: 523,
      duration: 0.04,
      volume: 0.06,
    });
  }

  /** Floor/level cleared — big fanfare. */
  floorCleared(): void {
    const fanfare = [
      { freq: 523, delay: 0 }, // C5
      { freq: 659, delay: 120 }, // E5
      { freq: 784, delay: 240 }, // G5
      { freq: 1047, delay: 400 }, // C6
    ];
    fanfare.forEach(({ freq, delay }) => {
      setTimeout(() => {
        this.engine.playSweep({
          type: "square",
          startFreq: freq,
          endFreq: freq,
          duration: 0.2,
          volume: 0.13,
        });
        this.engine.playSweep({
          type: "triangle",
          startFreq: freq / 2,
          endFreq: freq / 2,
          duration: 0.2,
          volume: 0.1,
        });
      }, delay);
    });
  }

  /** Pause on / pause off. */
  pause(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 440,
      endFreq: 220,
      duration: 0.08,
      volume: 0.08,
    });
  }

  /** Boss appearance — ominous rumble. */
  bossAppear(): void {
    this.engine.playSweep({
      type: "triangle",
      startFreq: 80,
      endFreq: 40,
      duration: 0.8,
      volume: 0.18,
    });
    this.engine.playNoiseBurst(0.5, 0.12);
    setTimeout(() => {
      this.engine.playSweep({
        type: "square",
        startFreq: 110,
        endFreq: 55,
        duration: 0.4,
        volume: 0.14,
      });
    }, 300);
  }

  /** Hazard damage — sharp buzz. */
  hazardHit(): void {
    this.engine.playSweep({
      type: "sawtooth",
      startFreq: 300,
      endFreq: 100,
      duration: 0.12,
      volume: 0.12,
    });
    this.engine.playNoiseBurst(0.08, 0.08);
  }

  /** Wall slide — soft scraping loop. */
  wallSlide(): void {
    this.engine.playNoiseBurst(0.06, 0.04);
  }

  /** Wall jump — quick spring-like upward sweep. */
  wallJump(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 250,
      endFreq: 700,
      duration: 0.1,
      volume: 0.12,
    });
  }

  /** Bounce off a surface — soft boing. */
  bounce(): void {
    this.engine.playSweep({
      type: "triangle",
      startFreq: 200,
      endFreq: 500,
      duration: 0.08,
      volume: 0.1,
    });
    this.engine.playSweep({
      type: "triangle",
      startFreq: 500,
      endFreq: 300,
      duration: 0.06,
      volume: 0.08,
    });
  }

  /** Checkpoint reached — cheerful ascending arpeggio. */
  checkpoint(): void {
    this.engine.playSweep({
      type: "square",
      startFreq: 440,
      endFreq: 660,
      duration: 0.1,
      volume: 0.1,
    });
    this.engine.playSweep({
      type: "square",
      startFreq: 550,
      endFreq: 880,
      duration: 0.1,
      volume: 0.1,
    });
  }
}
