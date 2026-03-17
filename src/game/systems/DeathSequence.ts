import * as Phaser from "phaser";

/**
 * Multi-phase death sequence inspired by Celeste and classic platformers.
 *
 * Phases:
 *   1. Hit-stop   — brief freeze (100 ms) to sell the impact
 *   2. Slow-mo    — time scale drops to 0.3 for dramatic effect (400 ms)
 *   3. Info flash  — show lives remaining / death message (800 ms)
 *   4. Respawn     — transition back or game-over
 *
 * Floor 1 uses a fast 0.5 s Celeste-style instant restart.
 */

export interface DeathSequenceConfig {
  /** Current floor number (1-based). Floor 1 uses a quick restart. */
  floor: number;
  /** Lives remaining after this death (0 = game over). */
  livesRemaining: number;
  /** Callback to execute on respawn (e.g. scene restart). */
  onRespawn: () => void;
  /** Callback to execute on game over (0 lives left). */
  onGameOver: () => void;
}

export class DeathSequence {
  private scene: Phaser.Scene;
  private overlay: Phaser.GameObjects.Rectangle | null = null;
  private infoText: Phaser.GameObjects.Text | null = null;
  private isPlaying = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(config: DeathSequenceConfig) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const { floor, livesRemaining, onRespawn, onGameOver } = config;

    // Floor 1: fast Celeste-style restart — minimal ceremony
    if (floor <= 1) {
      this.quickRestart(livesRemaining > 0 ? onRespawn : onGameOver);
      return;
    }

    // Phase 1: Hit-stop (freeze physics, but keep tweens running)
    this.scene.physics.pause();

    // Use a tween counter instead of time.addEvent so timeScale
    // cannot block the sequence — tweens use the game loop clock.
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 100,
      onComplete: () => this.phaseSlowMo(config),
    });
  }

  private phaseSlowMo(config: DeathSequenceConfig) {
    // Phase 2: Slow-mo — resume physics briefly at reduced speed
    this.scene.physics.resume();
    this.scene.time.timeScale = 0.3;

    // Darken overlay
    const cam = this.scene.cameras.main;
    this.overlay = this.scene.add
      .rectangle(
        cam.scrollX + cam.width / 2,
        cam.scrollY + cam.height / 2,
        cam.width,
        cam.height,
        0x000000,
        0,
      )
      .setScrollFactor(0)
      .setDepth(998);

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: { from: 0, to: 0.55 },
      duration: 400,
      onComplete: () => this.phaseInfo(config),
    });
  }

  private phaseInfo(config: DeathSequenceConfig) {
    // Phase 3: Info display — freeze physics
    this.scene.physics.pause();
    this.scene.time.timeScale = 1;

    const cam = this.scene.cameras.main;
    const message =
      config.livesRemaining > 0
        ? `${config.livesRemaining} ${config.livesRemaining === 1 ? "life" : "lives"} left`
        : "Game Over";

    this.infoText = this.scene.add
      .text(cam.width / 2, cam.height / 2, message, {
        fontSize: "32px",
        fontFamily: "monospace",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(999)
      .setAlpha(0);

    this.scene.tweens.add({
      targets: this.infoText,
      alpha: { from: 0, to: 1 },
      duration: 300,
    });

    // Phase 4: Respawn after delay — use tween counter so clock
    // freeze cannot block the callback.
    this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 800,
      onComplete: () => {
        this.cleanup();
        this.scene.time.timeScale = 1;
        this.scene.physics.resume();
        if (config.livesRemaining > 0) {
          config.onRespawn();
        } else {
          config.onGameOver();
        }
      },
    });
  }

  private quickRestart(callback: () => void) {
    const cam = this.scene.cameras.main;
    this.overlay = this.scene.add
      .rectangle(
        cam.scrollX + cam.width / 2,
        cam.scrollY + cam.height / 2,
        cam.width,
        cam.height,
        0x000000,
        0,
      )
      .setScrollFactor(0)
      .setDepth(998);

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: { from: 0, to: 1 },
      duration: 250,
      onComplete: () => {
        this.cleanup();
        this.scene.time.timeScale = 1;
        callback();
      },
    });
  }

  private cleanup() {
    this.overlay?.destroy();
    this.overlay = null;
    this.infoText?.destroy();
    this.infoText = null;
    this.isPlaying = false;
  }
}
