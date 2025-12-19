import { Scene } from "phaser";

export class UIScene extends Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  create() {
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
    });
    this.livesText = this.add.text(16, 50, "Lives: 9", {
      fontSize: "32px",
      color: "#fff",
    });
  }
}
