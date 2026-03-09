import { Scene } from "phaser";

export class UIScene extends Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private heartsText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private floorText!: Phaser.GameObjects.Text;
  private seedText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;

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
    this.heartsText = this.add.text(16, 36, "Hearts: ♥♥♥", textStyle);
    this.livesText = this.add.text(16, 60, "Lives: 3", textStyle);
    this.coinsText = this.add.text(16, 84, "Coins: 0 · Gems: 0", textStyle);
    this.floorText = this.add.text(
      16,
      108,
      "Floor: 1 · Layout: standard",
      textStyle,
    );
    this.seedText = this.add.text(16, 132, "Seed: -", {
      ...textStyle,
      fontSize: "14px",
      color: "#cbd5e1",
    });
    this.objectiveText = this.add.text(16, 154, "Objectives: -", {
      ...textStyle,
      fontSize: "14px",
      color: "#fde68a",
    });

    const render = () => {
      const score = Number(this.registry.get("score") ?? 0);
      const hearts = Number(this.registry.get("playerHearts") ?? 3);
      const maxHearts = Number(this.registry.get("maxHearts") ?? 3);
      const lives = Number(this.registry.get("lives") ?? 3);
      const coins = Number(this.registry.get("coins") ?? 0);
      const gems = Number(this.registry.get("gems") ?? 0);
      const floor = Number(this.registry.get("runFloor") ?? 1);
      const seed = String(this.registry.get("runSeed") ?? "-");
      const layout = String(this.registry.get("layout") ?? "standard");
      const objectiveStatus = String(
        this.registry.get("objectiveStatus") ?? "-",
      );

      const heartsStr = `${"♥".repeat(Math.max(0, hearts))}${"♡".repeat(
        Math.max(0, maxHearts - hearts),
      )}`;

      this.scoreText.setText(`Score: ${score}`);
      this.heartsText.setText(`Hearts: ${heartsStr}`);
      this.livesText.setText(`Lives: ${lives}`);
      this.coinsText.setText(`Coins: ${coins} · Gems: ${gems}`);
      this.floorText.setText(`Floor: ${floor} · Layout: ${layout}`);
      this.seedText.setText(`Seed: ${seed}`);
      this.objectiveText.setText(`Objectives: ${objectiveStatus}`);
    };

    render();

    this.registry.events.on("changedata", render, this);
    this.events.once("shutdown", () => {
      this.registry.events.off("changedata", render, this);
    });
  }
}
