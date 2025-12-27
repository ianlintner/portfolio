import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Game Over", {
        fontSize: "64px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 100, "Click for New Run", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        const seed = Math.random().toString(36).slice(2, 10);
        this.registry.set("runSeed", seed);
        this.registry.set("runFloor", 1);
        this.registry.set("lives", 3);
        this.registry.set("score", 0);

        this.scene.start("RogueRun", { seed, floor: 1 });
        // UI is an overlay; launching avoids stopping the gameplay scene.
        this.scene.launch("UIScene");
        this.scene.bringToTop("UIScene");
      });
  }
}
