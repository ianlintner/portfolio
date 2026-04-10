import * as Phaser from "phaser";
import { GameConfig } from "./config";
import { setBootOptions, type GameBootOptions } from "./bootOptions";

export class PhaserGame {
  private static game: Phaser.Game | null = null;

  public static getGame(): Phaser.Game | null {
    return this.game;
  }

  public static start(options: GameBootOptions = {}): Phaser.Game {
    if (!this.game) {
      setBootOptions(options);
      this.game = new Phaser.Game(GameConfig);

      // Helpful for Playwright E2E/visual tests and local debugging.
      // Keep this out of production to avoid leaking internals.
      if (process.env.NODE_ENV !== "production") {
        (globalThis as any).__PHASER_GAME__ = this.game;
        (globalThis as any).__PHASER_QA__ = {
          mode: options,
          logs: [],
        };
      }
    }
    return this.game;
  }

  public static stop() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;

      if (process.env.NODE_ENV !== "production") {
        (globalThis as any).__PHASER_GAME__ = null;
        (globalThis as any).__PHASER_QA__ = null;
      }
    }
  }
}
