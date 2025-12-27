import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 3, "Cat Adventure", {
        fontSize: "64px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(width / 2, height / 2, "Start Run", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
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
      })
      .on("pointerover", () => startButton.setStyle({ fill: "#ff0" }))
      .on("pointerout", () => startButton.setStyle({ fill: "#fff" }));

    this.add
      .text(
        width / 2,
        height / 2 + 70,
        "Procedural roguelike run. New layout every floor.",
        {
          fontSize: "16px",
          color: "#94a3b8",
          fontFamily: "Arial",
        },
      )
      .setOrigin(0.5);
  }
}
