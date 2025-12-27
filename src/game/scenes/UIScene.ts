import { Scene } from "phaser";

export class UIScene extends Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private floorText!: Phaser.GameObjects.Text;
  private seedText!: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  create() {
    const textStyle = {
      fontSize: "20px",
      color: "#fff",
      fontFamily: "Arial",
    } as const;

    this.scoreText = this.add.text(16, 12, "Score: 0", textStyle);
    this.livesText = this.add.text(16, 36, "Lives: 3", textStyle);
    this.floorText = this.add.text(16, 60, "Floor: 1", textStyle);
    this.seedText = this.add.text(16, 84, "Seed: -", {
      ...textStyle,
      fontSize: "14px",
      color: "#cbd5e1",
    });

    const render = () => {
      const score = Number(this.registry.get("score") ?? 0);
      const lives = Number(this.registry.get("lives") ?? 3);
      const floor = Number(this.registry.get("runFloor") ?? 1);
      const seed = String(this.registry.get("runSeed") ?? "-");

      this.scoreText.setText(`Score: ${score}`);
      this.livesText.setText(`Lives: ${lives}`);
      this.floorText.setText(`Floor: ${floor}`);
      this.seedText.setText(`Seed: ${seed}`);
    };

    render();

    this.registry.events.on("changedata", render, this);
    this.events.once("shutdown", () => {
      this.registry.events.off("changedata", render, this);
    });
  }
}
