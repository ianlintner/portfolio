import { Scene } from "phaser";

export class Victory extends Scene {
  constructor() {
    super("Victory");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "You Win!", {
        fontSize: "64px",
        color: "#00ff00",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 100, "Click to Play Again", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu");
      });
  }
}
