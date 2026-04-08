import { Scene } from "phaser";
import * as Phaser from "phaser";
import { AudioManager } from "../audio/AudioManager";

export class UIScene extends Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private heartsText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private floorText!: Phaser.GameObjects.Text;
  private seedText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;
  private muteText!: Phaser.GameObjects.Text;
  private bossBarBg!: Phaser.GameObjects.Rectangle;
  private bossBarFill!: Phaser.GameObjects.Rectangle;
  private bossBarText!: Phaser.GameObjects.Text;

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

    // Mute toggle indicator (top-right)
    const audio = AudioManager.instance;
    this.muteText = this.add
      .text(this.scale.width - 16, 12, audio.muted ? "🔇 [M]" : "🔊 [M]", {
        ...textStyle,
        fontSize: "16px",
      })
      .setOrigin(1, 0);

    // "M" key toggles mute
    this.input.keyboard?.on("keydown-M", () => {
      audio.muted = !audio.muted;
      this.muteText.setText(audio.muted ? "🔇 [M]" : "🔊 [M]");
    });

    // Boss health bar (centered at bottom, hidden by default)
    const barWidth = 240;
    const barHeight = 14;
    const barX = this.scale.width / 2;
    const barY = this.scale.height - 30;

    this.bossBarBg = this.add
      .rectangle(barX, barY, barWidth + 4, barHeight + 4, 0x1e293b)
      .setOrigin(0.5)
      .setVisible(false);
    this.bossBarFill = this.add
      .rectangle(barX - barWidth / 2, barY, barWidth, barHeight, 0xef4444)
      .setOrigin(0, 0.5)
      .setVisible(false);
    this.bossBarText = this.add
      .text(barX, barY - 14, "BOSS", {
        fontSize: "14px",
        color: "#f43f5e",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setVisible(false);

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

      // Boss health bar
      const bossHp = Number(this.registry.get("bossHp") ?? -1);
      const bossMaxHp = Number(this.registry.get("bossMaxHp") ?? -1);
      if (bossHp >= 0 && bossMaxHp > 0) {
        const pct = Math.max(0, bossHp / bossMaxHp);
        this.bossBarBg.setVisible(true);
        this.bossBarFill.setVisible(true);
        this.bossBarText.setVisible(true);
        this.bossBarFill.setDisplaySize(pct * 240, 14);
        this.bossBarText.setText(bossHp > 0 ? "BOSS" : "BOSS DEFEATED");
        this.bossBarFill.setFillStyle(bossHp > 0 ? 0xef4444 : 0x10b981);
      } else {
        this.bossBarBg.setVisible(false);
        this.bossBarFill.setVisible(false);
        this.bossBarText.setVisible(false);
      }
    };

    render();

    this.registry.events.on("changedata", render, this);
    this.events.once("shutdown", () => {
      this.registry.events.off("changedata", render, this);
    });
  }
}
