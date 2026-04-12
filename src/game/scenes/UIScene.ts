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
  private aiModeText!: Phaser.GameObjects.Text;
  private debugHudText!: Phaser.GameObjects.Text;
  private bossBarBg!: Phaser.GameObjects.Rectangle;
  private bossBarFill!: Phaser.GameObjects.Rectangle;
  private bossBarText!: Phaser.GameObjects.Text;

  // Altitude indicator elements
  private altBarBg!: Phaser.GameObjects.Rectangle;
  private altBarFill!: Phaser.GameObjects.Rectangle;
  private altCatIcon!: Phaser.GameObjects.Text;
  private altGoalIcon!: Phaser.GameObjects.Text;
  private altLabelTop!: Phaser.GameObjects.Text;
  private altLabelBot!: Phaser.GameObjects.Text;
  private altContainer!: Phaser.GameObjects.Container;
  private zoneLabel!: Phaser.GameObjects.Text;
  private lastZone = "";

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

    const autoplayEnabled = Boolean(
      this.registry.get("autoplayEnabled") ?? false,
    );
    this.aiModeText = this.add.text(
      16,
      176,
      autoplayEnabled ? "AI: WATCH MODE" : "AI: OFF",
      {
        ...textStyle,
        fontSize: "14px",
        color: autoplayEnabled ? "#86efac" : "#64748b",
      },
    );

    this.debugHudText = this.add
      .text(16, 196, "Debug HUD [B]", {
        ...textStyle,
        fontSize: "14px",
        color: autoplayEnabled ? "#93c5fd" : "#475569",
      })
      .setVisible(autoplayEnabled);

    if (autoplayEnabled) {
      this.debugHudText.setInteractive().on("pointerdown", () => {
        this.game.scene
          .getScene("RogueRun")
          .events.emit("autoplay-toggle-debug");
      });
    }

    // Audio Menu (top-right)
    const audio = AudioManager.instance;
    this.muteText = this.add
      .text(this.scale.width - 16, 12, audio.muted ? "🔇 [M]" : "🔊 [M]", {
        ...textStyle,
        fontSize: "16px",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.muted = !audio.muted;
        updateAudioText();
      });

    const retroText = this.add
      .text(
        this.scale.width - 16,
        36,
        "Retro: " + (audio.useRetroMusic ? "ON" : "OFF"),
        {
          ...textStyle,
          fontSize: "16px",
          color: "#93c5fd",
        },
      )
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.useRetroMusic = !audio.useRetroMusic;
        // Start retro random track
        if (!audio.useRetroMusic && audio.mp3Music) {
          audio.playRandomBgMusic(); // Will fall back to MP3
        } else {
          audio.playRandomBgMusic(); // Will play chiptune
        }
        updateAudioText();
      });

    const volDecText = this.add
      .text(this.scale.width - 120, 60, "[-]", {
        ...textStyle,
        fontSize: "16px",
        color: "#fca5a5",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.volume = Math.max(0, audio.volume - 0.1);
        updateAudioText();
      });

    const volIncText = this.add
      .text(this.scale.width - 16, 60, "[+]", {
        ...textStyle,
        fontSize: "16px",
        color: "#86efac",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => {
        audio.volume = Math.min(1, audio.volume + 0.1);
        updateAudioText();
      });

    const volText = this.add
      .text(
        this.scale.width - 68,
        60,
        `Vol: ${Math.round(audio.volume * 100)}%`,
        {
          ...textStyle,
          fontSize: "16px",
        },
      )
      .setOrigin(0.5, 0);

    const updateAudioText = () => {
      this.muteText.setText(audio.muted ? "🔇 [M]" : "🔊 [M]");
      retroText.setText("Retro: " + (audio.useRetroMusic ? "ON" : "OFF"));
      volText.setText(`Vol: ${Math.round(audio.volume * 100)}%`);
    };

    // "M" key toggles mute
    this.input.keyboard?.on("keydown-M", () => {
      audio.muted = !audio.muted;
      updateAudioText();
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

    // Altitude indicator (right edge, only visible for building/vertical layouts)
    {
      const altBarH = 200;
      const altBarW = 10;
      const altX = this.scale.width - 24;
      const altY = this.scale.height / 2 - altBarH / 2;

      this.altBarBg = this.add
        .rectangle(altX, altY, altBarW, altBarH, 0x1e293b, 0.8)
        .setOrigin(0.5, 0);
      this.altBarFill = this.add
        .rectangle(altX, altY + altBarH, altBarW - 2, 0, 0x0ea5e9, 0.9)
        .setOrigin(0.5, 1);
      this.altCatIcon = this.add
        .text(altX - 14, altY + altBarH, "🐱", { fontSize: "12px" })
        .setOrigin(1, 0.5);
      this.altGoalIcon = this.add
        .text(altX + 14, altY, "★", {
          fontSize: "14px",
          color: "#fde68a",
        })
        .setOrigin(0, 0.5);
      this.altLabelTop = this.add
        .text(altX, altY - 10, "ROOF", {
          fontSize: "9px",
          color: "#94a3b8",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);
      this.altLabelBot = this.add
        .text(altX, altY + altBarH + 10, "ST", {
          fontSize: "9px",
          color: "#94a3b8",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      this.altContainer = this.add.container(0, 0, [
        this.altBarBg,
        this.altBarFill,
        this.altCatIcon,
        this.altGoalIcon,
        this.altLabelTop,
        this.altLabelBot,
      ]);
      this.altContainer.setDepth(100).setVisible(false);
    }

    // Zone transition label (centered flash)
    this.zoneLabel = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 60, "", {
        fontSize: "28px",
        color: "#0ea5e9",
        fontFamily: "Arial",
        fontStyle: "bold",
        stroke: "#0f172a",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(101);
    this.lastZone = "";

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
      const autoplay = Boolean(this.registry.get("autoplayEnabled") ?? false);
      const debugHud = Boolean(this.registry.get("autoplayDebug") ?? false);

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
      this.aiModeText.setText(autoplay ? "AI: WATCH MODE" : "AI: OFF");
      this.aiModeText.setColor(autoplay ? "#86efac" : "#64748b");
      this.debugHudText.setText(`Debug HUD: ${debugHud ? "ON" : "OFF"} [B]`);

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

      // Altitude indicator for building/vertical layouts
      const isBuildingLayout =
        layout === "cityblock" ||
        layout === "alleyrun" ||
        layout === "rooftops" ||
        layout === "tower" ||
        layout === "climb" ||
        layout === "zigzag";
      const altitude = Number(this.registry.get("playerAltitude") ?? 0);

      if (isBuildingLayout) {
        this.altContainer.setVisible(true);
        const altBarH = 200;
        const altBaseY = this.scale.height / 2 - altBarH / 2;
        const fillH = Math.max(0, Math.min(altBarH, altitude * altBarH));
        this.altBarFill.setDisplaySize(8, fillH);
        // Position the cat icon along the bar
        const catY = altBaseY + altBarH - fillH;
        this.altCatIcon.setY(catY);

        // Zone labels
        let zone = "STREET LEVEL";
        if (altitude > 0.65) zone = "ROOFTOPS";
        else if (altitude > 0.3) zone = "MID BUILDING";

        if (zone !== this.lastZone && this.lastZone !== "") {
          this.zoneLabel.setText(zone);
          this.zoneLabel.setAlpha(1);
          this.tweens.add({
            targets: this.zoneLabel,
            alpha: 0,
            duration: 2000,
            delay: 800,
            ease: "Power2",
          });
        }
        this.lastZone = zone;
      } else {
        this.altContainer.setVisible(false);
      }
    };

    render();

    this.registry.events.on("changedata", render, this);
    this.events.once("shutdown", () => {
      this.registry.events.off("changedata", render, this);
    });
  }
}
