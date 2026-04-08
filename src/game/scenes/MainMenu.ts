import { Scene } from "phaser";
import { AudioManager } from "../audio/AudioManager";
import { PARALLAX_SETS } from "../assets/manifest";
import { createParallaxBackground } from "../assets/parallax";
import { TILESETS } from "../assets/manifest";

export class MainMenu extends Scene {
  private parallaxLayers: Phaser.GameObjects.GameObject[] = [];
  private floorTile!: Phaser.GameObjects.TileSprite;
  private cat!: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Sprite[] = [];
  private runSpeed = 1.5; // Slower speed to avoid dizzying effect
  private bgMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;
    const audio = AudioManager.instance;

    // Unlock Web Audio on first user gesture, then start menu music.
    const unlockAndPlay = () => {
      audio.unlock();
      audio.stopMusic(); // Ensure old chiptune engine is stopped
      if (!this.bgMusic) {
        this.bgMusic = this.sound.add("intro-music", {
          loop: true,
          volume: 0.6,
        });
        this.bgMusic.play();
      }
    };
    this.input.once("pointerdown", unlockAndPlay);
    this.input.keyboard?.once("keydown", unlockAndPlay);
    // If already unlocked from a previous visit, start music immediately.
    if (audio.isUnlocked) {
      audio.stopMusic();
      if (!this.bgMusic) {
        this.bgMusic = this.sound.add("intro-music", {
          loop: true,
          volume: 0.6,
        });
        this.bgMusic.play();
      }
    }

    this.parallaxLayers = createParallaxBackground(this, {
      set: PARALLAX_SETS.industrial1,
      worldWidth: width,
      worldHeight: height,
      repeatX: true,
      depthStart: -100,
    });
    // Set scroll factor to 0 so we can manually update tilePositionX
    this.parallaxLayers.forEach((layer) => {
      layer.setScrollFactor(0, 0);
    });

    // Create floor
    this.floorTile = this.add
      .tileSprite(0, height - 32, width, 32, TILESETS.industrial.key)
      .setOrigin(0, 0)
      .setDepth(-10);

    const groundY = height - 32;

    // Create the runner cat
    this.cat = this.add
      .sprite(150, groundY - 16, "cat")
      .setOrigin(0.5, 1)
      .setDepth(-5);
    this.cat.play("walk-right");

    // Pre-spawn some enemies off-screen to run towards the cat
    const enemyTypes = ["dog1", "rat1", "bird1"];
    for (let i = 0; i < 3; i++) {
      const type = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
      const tex = `enemy_${type}`;
      const enemy = this.add
        .sprite(width + Phaser.Math.Between(200, 800), groundY - 16, tex)
        .setOrigin(0.5, 1)
        .setDepth(-6)
        .setFlipX(true) // running left
        .setName(tex);

      if (type.includes("bird")) {
        enemy.setY(groundY - Phaser.Math.Between(60, 120));
      }

      enemy.play(`enemy:${type}:move`);

      this.enemies.push(enemy);
    }

    // Title text with retro style
    this.add
      .text(width / 2, height / 3, "Cat Adventure", {
        fontSize: "64px",
        color: "#ffffff",
        fontFamily: "Arial",
        stroke: "#3b82f6",
        strokeThickness: 8,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "#0f172a",
          blur: 4,
          fill: true,
        },
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
        audio.sfx.menuSelect();
        if (this.bgMusic) {
          this.bgMusic.stop();
        }
        audio.stopMusic();
        const seed = Math.random().toString(36).slice(2, 10);
        this.registry.set("runSeed", seed);
        this.registry.set("runFloor", 1);
        this.registry.set("lives", 3);
        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("gems", 0);
        this.registry.set("maxHearts", 3);
        this.registry.set("playerHearts", 3);
        this.registry.set("objectiveStatus", "-");

        this.scene.start("RogueRun", { seed, floor: 1 });
        // UI is an overlay; launching avoids stopping the gameplay scene.
        this.scene.launch("UIScene");
        this.scene.bringToTop("UIScene");
      })
      .on("pointerover", () => {
        audio.sfx.menuHover();
        startButton.setStyle({ fill: "#ff0" });
      })
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
          shadow: {
            offsetX: 1,
            offsetY: 1,
            color: "#000",
            blur: 2,
            fill: true,
          },
        },
      )
      .setOrigin(0.5);
  }

  update(time: number, delta: number) {
    const { width } = this.scale;
    const dt = delta / 1000; // seconds

    // Move floor
    this.floorTile.tilePositionX += this.runSpeed * 60 * dt;

    // Move parallax backgrounds
    for (let i = 0; i < this.parallaxLayers.length; i++) {
      const layer = this.parallaxLayers[i];
      if (layer instanceof Phaser.GameObjects.TileSprite) {
        // layers 1 to 5 (index 0 to 4 in array) speed progressively
        // Industrial background uses spread so background is index 1
        const factor = 0.12 + i * 0.18; // rough spread
        layer.tilePositionX += this.runSpeed * 60 * dt * factor;
      }
    }

    // Move enemies and reset if offscreen
    this.enemies.forEach((enemy) => {
      enemy.x -= this.runSpeed * 60 * dt + 1; // slightly faster than background
      if (enemy.x < -100) {
        // Respawn offscreen
        enemy.x = width + Phaser.Math.Between(200, 800);

        // Random Y based on whether it's a bird or grounded
        if (enemy.name.includes("bird")) {
          enemy.setY(this.floorTile.y - 16 - Phaser.Math.Between(60, 120));
        } else {
          enemy.setY(this.floorTile.y - 16);
        }
      }
    });

    // Make the cat randomly jump
    if (this.cat.y >= this.floorTile.y - 16) {
      if (Phaser.Math.FloatBetween(0, 1) < 0.01) {
        // 1% chance per frame to jump
        this.cat.play("jump-right");
        // Add a tween for jump arc
        this.tweens.add({
          targets: this.cat,
          y: this.floorTile.y - 16 - 100,
          duration: 350,
          yoyo: true,
          ease: "Sine.easeOut",
          onComplete: () => {
            this.cat.play("walk-right");
          },
        });
      }
    }
  }
}
