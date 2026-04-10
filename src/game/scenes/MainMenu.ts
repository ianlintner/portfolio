import { Scene } from "phaser";
import { AudioManager } from "../audio/AudioManager";
import { PARALLAX_SETS, TILESETS } from "../assets/manifest";
import { createParallaxBackground } from "../assets/parallax";
import { GENERATED_TEXTURES } from "../assets/generatedTextures";
import { getBootOptions } from "../bootOptions";

interface EnemyInstance {
  sprite: Phaser.GameObjects.Sprite;
  type: string;
  speedMult: number;
}

interface MidgroundBuilding {
  image: Phaser.GameObjects.Image;
  scrollSpeed: number;
  roofInset: number;
}

export class MainMenu extends Scene {
  private parallaxLayers: Phaser.GameObjects.GameObject[] = [];
  private floorTile!: Phaser.GameObjects.TileSprite;
  private cat!: Phaser.GameObjects.Sprite;
  private enemies: EnemyInstance[] = [];
  private collectibles: Phaser.GameObjects.Image[] = [];
  private buildings: MidgroundBuilding[] = [];
  private streetLamps: Phaser.GameObjects.Image[] = [];
  private runSpeed = 1.5;
  private catIsJumping = false;
  private catDodgeCooldown = 0;
  private groundY = 0;
  private rooftopY = 0;
  private catRunY = 0;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;
    const audio = AudioManager.instance;
    const bootOptions = getBootOptions();

    this.groundY = height - 32;
    // Rooftop where the cat walks — roughly 60% down the viewport
    this.rooftopY = Math.round(height * 0.68);

    // ── Audio ───────────────────────────────────────────────────────────────
    audio.soundManager = this.sound;
    audio.mp3Key = "paws-in-downpour";
    audio.playRandomBgMusic();

    const unlockAudio = () => audio.unlock();
    this.input.once("pointerdown", unlockAudio);
    this.input.keyboard?.once("keydown", unlockAudio);

    // Fill the entire scene with a dark colour so there are no bare gray gaps
    // between the parallax art and the floor tiles.
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // ── Parallax background ─────────────────────────────────────────────────
    this.parallaxLayers = createParallaxBackground(this, {
      set: PARALLAX_SETS.industrial1,
      worldWidth: width,
      worldHeight: height,
      repeatX: true,
      depthStart: -100,
    });
    this.parallaxLayers.forEach((layer) => {
      if ("setScrollFactor" in layer) {
        (layer as Phaser.GameObjects.Image).setScrollFactor(0, 0);
      }
    });

    // ── Rain particles (fits "Paws in the Downpour") ────────────────────────
    this._createRain(width, height);

    // ── Ground fill ────────────────────────────────────────────────────────
    const floorSurfaceY = height - 32;
    const fillTop = height * 0.38;
    const fillH = floorSurfaceY - fillTop + 32;

    this.add
      .rectangle(width / 2, fillTop + fillH / 2, width, fillH, 0x1a1f35)
      .setOrigin(0.5, 0.5)
      .setDepth(-103.5)
      .setScrollFactor(0, 0);

    // Walking-surface tile strip (street level)
    this.floorTile = this.add
      .tileSprite(0, floorSurfaceY, width, 32, TILESETS.industrial.key)
      .setOrigin(0, 0)
      .setDepth(-9);

    // ── Midground buildings ─────────────────────────────────────────────────
    this._spawnBuildings(width, height);

    // ── Street lamps between buildings ──────────────────────────────────────
    this._spawnStreetLamps(width, height);

    // ── Floating collectibles above rooftops ────────────────────────────────
    this._spawnCollectibles(width);

    // ── Player cat on the rooftops ──────────────────────────────────────────
    this.cat = this.add
      .sprite(150, this.rooftopY, "cat")
      .setOrigin(0.5, 1)
      .setDepth(-4)
      .setAlpha(0);
    this.catRunY = this._getCatRoofY();
    this.cat.setY(this.catRunY);
    this.cat.play("walk-right");
    this.tweens.add({ targets: this.cat, alpha: 1, duration: 500 });

    // ── Enemies at street level ─────────────────────────────────────────────
    this._spawnEnemies(width);

    // ── Scanline CRT overlay ────────────────────────────────────────────────
    this._addScanlines(width, height);

    // ── Title sequence ───────────────────────────────────────────────────────
    this._buildTitleSequence(width, height, audio);

    if (bootOptions.autoplay) {
      this.time.delayedCall(1200, () => {
        this._startGame(audio, {
          autoplay: true,
          debug: Boolean(bootOptions.debug),
          headless: Boolean(bootOptions.headless),
        });
      });
    }
  }

  // ── Rain ─────────────────────────────────────────────────────────────────

  private _createRain(width: number, height: number) {
    if (!this.textures.exists("raindrop")) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x93c5fd, 1);
      g.fillRect(0, 0, 1, 7);
      g.generateTexture("raindrop", 1, 7);
      g.destroy();
    }

    const emitter = this.add.particles(0, 0, "raindrop", {
      x: { min: -80, max: width + 80 },
      y: -20,
      lifespan: { min: 700, max: 1100 },
      speedX: 45,
      speedY: { min: 380, max: 560 },
      quantity: 2,
      frequency: 20,
      alpha: { start: 0.45, end: 0 },
      scale: { min: 0.7, max: 1.4 },
    });
    emitter.setDepth(-50);

    // Subtle rain puddle splash rings on the floor
    if (!this.textures.exists("splash")) {
      const sg = this.make.graphics({ x: 0, y: 0 });
      sg.lineStyle(1, 0x93c5fd, 0.6);
      sg.strokeEllipse(6, 3, 12, 4);
      sg.generateTexture("splash", 12, 6);
      sg.destroy();
    }

    this.add
      .particles(0, height - 36, "splash", {
        x: { min: 0, max: width },
        y: 0,
        lifespan: 350,
        speedX: 0,
        speedY: 0,
        quantity: 1,
        frequency: 80,
        alpha: { start: 0.5, end: 0 },
        scale: { start: 0.5, end: 1.4 },
      })
      .setDepth(-9);
  }

  // ── Collectibles ──────────────────────────────────────────────────────────

  private _randomCollectibleX(width: number) {
    // Keep center lane cleaner for title/buttons readability.
    const laneLeftMin = 80;
    const laneLeftMax = Math.max(laneLeftMin + 20, Math.floor(width * 0.34));
    const laneRightMin = Math.min(width - 80, Math.ceil(width * 0.66));
    const laneRightMax = width - 80;

    if (Phaser.Math.Between(0, 1) === 0) {
      return Phaser.Math.Between(laneLeftMin, laneLeftMax);
    }
    return Phaser.Math.Between(laneRightMin, laneRightMax);
  }

  private _spawnCollectibles(width: number) {
    const texKeys = [
      GENERATED_TEXTURES.collectibleCoin,
      GENERATED_TEXTURES.collectibleGem,
      GENERATED_TEXTURES.collectibleCoin,
      GENERATED_TEXTURES.collectibleHeartSmall,
      GENERATED_TEXTURES.collectibleGem,
    ];

    texKeys.forEach((tex, i) => {
      const x =
        this._randomCollectibleX(width) + i * Phaser.Math.Between(6, 12);
      const baseY = this.rooftopY - Phaser.Math.Between(40, 100);
      const item = this.add
        .image(x, baseY, tex)
        .setDepth(-3)
        .setAlpha(0.9)
        .setScale(1.5);

      // Bob up/down with staggered phase
      this.tweens.add({
        targets: item,
        y: baseY - 14,
        duration: Phaser.Math.Between(1100, 2000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: i * 180,
      });

      this.collectibles.push(item);
    });
  }

  // ── Enemies ───────────────────────────────────────────────────────────────

  private _spawnEnemies(width: number) {
    const configs: { type: string; xOff: number; speedMult: number }[] = [
      { type: "dog1", xOff: 200, speedMult: 1.05 },
      { type: "rat1", xOff: 460, speedMult: 1.35 },
      { type: "bird1", xOff: 330, speedMult: 0.9 },
      { type: "dog2", xOff: 680, speedMult: 1.1 },
      { type: "cat1", xOff: 900, speedMult: 1.2 },
      { type: "bird2", xOff: 560, speedMult: 0.85 },
      { type: "rat2", xOff: 1100, speedMult: 1.4 },
    ];

    for (const cfg of configs) {
      const tex = `enemy_${cfg.type}`;
      const sprite = this.add
        .sprite(width + cfg.xOff, this.groundY - 16, tex)
        .setOrigin(0.5, 1)
        .setDepth(-7)
        .setFlipX(true)
        .setName(cfg.type);

      if (cfg.type.includes("bird")) {
        // Birds fly between rooftop and street level
        sprite.setY(this.rooftopY - Phaser.Math.Between(10, 60));
        sprite.setDepth(-4);
      }

      sprite.play(`enemy:${cfg.type}:move`);
      this.enemies.push({ sprite, type: cfg.type, speedMult: cfg.speedMult });
    }
  }

  // ── Midground buildings ───────────────────────────────────────────────────

  private _spawnBuildings(width: number, _height: number) {
    const roofInsetByTexture: Record<string, number> = {
      [GENERATED_TEXTURES.buildingTall]: 12,
      [GENERATED_TEXTURES.buildingMedium]: 10,
      [GENERATED_TEXTURES.buildingShort]: 10,
      [GENERATED_TEXTURES.buildingTower]: 14,
      [GENERATED_TEXTURES.buildingPlant]: 20,
    };

    // Build an overlapping skyline so the cat always has rooftop coverage.
    const buildingConfigs: {
      tex: string;
      scroll: number;
      scale: number;
    }[] = [
      {
        tex: GENERATED_TEXTURES.buildingTall,
        scroll: 0.65,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingPlant,
        scroll: 0.69,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingShort,
        scroll: 0.7,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingMedium,
        scroll: 0.6,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingTower,
        scroll: 0.64,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingTall,
        scroll: 0.68,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingShort,
        scroll: 0.72,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingPlant,
        scroll: 0.67,
        scale: 2,
      },
      {
        tex: GENERATED_TEXTURES.buildingMedium,
        scroll: 0.62,
        scale: 2,
      },
    ];

    let nextX = -40;

    for (const cfg of buildingConfigs) {
      const img = this.add
        .image(nextX, this.groundY, cfg.tex)
        .setOrigin(0, 1)
        .setScale(cfg.scale)
        .setDepth(-8);

      const sourceInset = roofInsetByTexture[cfg.tex] ?? 10;
      this.buildings.push({
        image: img,
        scrollSpeed: cfg.scroll,
        roofInset: sourceInset * cfg.scale,
      });

      nextX += img.displayWidth - Phaser.Math.Between(18, 34);
    }

    while (nextX < width + 240) {
      const cfg = Phaser.Utils.Array.GetRandom(buildingConfigs);
      const img = this.add
        .image(nextX, this.groundY, cfg.tex)
        .setOrigin(0, 1)
        .setScale(cfg.scale)
        .setDepth(-8);

      const sourceInset = roofInsetByTexture[cfg.tex] ?? 10;
      this.buildings.push({
        image: img,
        scrollSpeed: cfg.scroll,
        roofInset: sourceInset * cfg.scale,
      });

      nextX += img.displayWidth - Phaser.Math.Between(18, 34);
    }
  }

  // ── Street lamps ──────────────────────────────────────────────────────────

  private _spawnStreetLamps(width: number, _height: number) {
    const lampPositions = [
      Math.round(width * 0.2),
      Math.round(width * 0.46),
      Math.round(width * 0.74),
      width + 80,
    ];
    for (const x of lampPositions) {
      const lamp = this.add
        .image(x, this.groundY, GENERATED_TEXTURES.streetLamp)
        .setOrigin(0.5, 1)
        .setScale(1.5)
        .setDepth(-7)
        .setAlpha(0.85);

      this.streetLamps.push(lamp);
    }
  }

  // ── CRT scanlines ─────────────────────────────────────────────────────────

  private _addScanlines(width: number, height: number) {
    if (!this.textures.exists("scanline")) {
      const sg = this.make.graphics({ x: 0, y: 0 });
      sg.fillStyle(0x000000, 0.13);
      sg.fillRect(0, 0, 4, 1);
      sg.fillStyle(0x000000, 0);
      sg.fillRect(0, 1, 4, 1);
      sg.generateTexture("scanline", 4, 2);
      sg.destroy();
    }

    const scanlines = this.add
      .tileSprite(0, 0, width, height, "scanline")
      .setOrigin(0, 0)
      .setDepth(90)
      .setAlpha(0.35);

    // Slow-scroll for animated CRT feel
    this.tweens.add({
      targets: scanlines,
      tilePositionY: height,
      duration: 10000,
      repeat: -1,
      ease: "Linear",
    });
  }

  // ── Title sequence ────────────────────────────────────────────────────────

  private _buildTitleSequence(
    width: number,
    height: number,
    audio: AudioManager,
  ) {
    // Main title — punches in from slightly larger scale
    const titleY = height * 0.28;
    const title = this.add
      .text(width / 2, titleY, "CAT ADVENTURE", {
        fontSize: "72px",
        color: "#ffffff",
        fontFamily: "Arial Black, Arial",
        fontStyle: "bold",
        stroke: "#3b82f6",
        strokeThickness: 10,
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#0f172a",
          blur: 8,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(1.25)
      .setDepth(10);

    // Subtitle — slides up from below
    const subtitleTargetY = titleY + 62;
    const subtitle = this.add
      .text(width / 2, subtitleTargetY + 26, "A  RETRO  ROGUELIKE", {
        fontSize: "20px",
        color: "#60a5fa",
        fontFamily: "Arial",
        letterSpacing: 6,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: "#0f172a",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10);

    // Start button
    const btnY = height * 0.55;
    const startButton = this.add
      .text(width / 2, btnY, "▶   START  RUN", {
        fontSize: "30px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#1e3a5f",
        padding: { x: 30, y: 14 },
        shadow: { offsetX: 2, offsetY: 3, color: "#000", blur: 6, fill: true },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    startButton
      .on("pointerdown", () => this._startGame(audio))
      .on("pointerover", () => {
        audio.sfx.menuHover();
        startButton.setStyle({ color: "#fbbf24", backgroundColor: "#1e40af" });
      })
      .on("pointerout", () =>
        startButton.setStyle({ color: "#ffffff", backgroundColor: "#1e3a5f" }),
      );

    // "Watch AI Play" button — attract-mode autoplay
    const watchAIBtn = this.add
      .text(width / 2, btnY + 58, "👁  WATCH  AI  PLAY", {
        fontSize: "16px",
        color: "#94a3b8",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#0f172a",
        padding: { x: 18, y: 8 },
        shadow: { offsetX: 1, offsetY: 2, color: "#000", blur: 4, fill: true },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    watchAIBtn
      .on("pointerdown", () => this._startGame(audio, { autoplay: true }))
      .on("pointerover", () => {
        audio.sfx.menuHover();
        watchAIBtn.setStyle({ color: "#e2e8f0", backgroundColor: "#1e293b" });
      })
      .on("pointerout", () =>
        watchAIBtn.setStyle({ color: "#94a3b8", backgroundColor: "#0f172a" }),
      );

    // "Press any key" hint — blinks
    const anyKeyY = btnY + 128;
    const anyKey = this.add
      .text(width / 2, anyKeyY, "PRESS  ANY  KEY  TO  START", {
        fontSize: "13px",
        color: "#64748b",
        fontFamily: "Arial",
        letterSpacing: 4,
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10);

    // Description tagline
    const desc = this.add
      .text(
        width / 2,
        anyKeyY + 28,
        "Procedural floors  ·  Roguelike runs  ·  Pixel art action",
        {
          fontSize: "13px",
          color: "#334155",
          fontFamily: "Arial",
        },
      )
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10);

    // ── Reveal sequence ────────────────────────────────────────────────────

    // 1. Title punches in (200ms delay gives world a moment to render)
    this.tweens.add({
      targets: title,
      alpha: 1,
      scale: 1,
      duration: 620,
      ease: "Back.easeOut",
      delay: 200,
    });

    // 2. Title idle animations kick in after punch-in
    this.time.delayedCall(820, () => {
      // Gentle shimmer
      this.tweens.add({
        targets: title,
        alpha: { from: 1, to: 0.78 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      // Subtle rocking
      this.tweens.add({
        targets: title,
        angle: { from: -0.6, to: 0.6 },
        duration: 3400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // 3. Subtitle slides up
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      y: subtitleTargetY,
      duration: 500,
      ease: "Power2.easeOut",
      delay: 700,
    });

    // 4. Start button fades in, then pulses
    this.tweens.add({
      targets: startButton,
      alpha: 1,
      duration: 400,
      delay: 1100,
      onComplete: () => {
        this.tweens.add({
          targets: startButton,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 850,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      },
    });

    // 4b. Watch AI button fades in
    this.tweens.add({
      targets: watchAIBtn,
      alpha: 1,
      duration: 400,
      delay: 1350,
    });

    // 5. Hint + desc fade in, then hint blinks
    this.tweens.add({
      targets: [anyKey, desc],
      alpha: 1,
      duration: 400,
      delay: 1500,
      onComplete: () => {
        this.tweens.add({
          targets: anyKey,
          alpha: 0.15,
          duration: 650,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      },
    });

    // Any key → start
    this.input.keyboard?.on("keydown", () => {
      if (startButton.active) this._startGame(audio);
    });
  }

  // ── Start game ────────────────────────────────────────────────────────────

  private _startGame(
    audio: AudioManager,
    options: { autoplay?: boolean; debug?: boolean; headless?: boolean } = {},
  ) {
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
    this.registry.set("autoplayEnabled", Boolean(options.autoplay));
    this.registry.set("autoplayDebug", Boolean(options.debug));
    this.registry.set("autoplayHeadless", Boolean(options.headless));
    audio.sfx.menuSelect();
    this.scene.start("RogueRun", {
      seed,
      floor: 1,
      autoplay: Boolean(options.autoplay),
      debug: Boolean(options.debug),
      headless: Boolean(options.headless),
    });
    this.scene.launch("UIScene");
    this.scene.bringToTop("UIScene");
  }

  // ── Cat jumps ─────────────────────────────────────────────────────────────

  private _catJump(jumpHeight = 95) {
    this.catIsJumping = true;
    this.cat.play("jump-right");
    const baseY = this.catRunY;
    this.tweens.add({
      targets: this.cat,
      y: baseY - jumpHeight,
      duration: 340,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.cat.y = this.catRunY;
        this.cat.play("walk-right");
        this.catIsJumping = false;
      },
    });
  }

  private _catDodgeJump() {
    this.catIsJumping = true;
    this.catDodgeCooldown = 2200;
    this.cat.play("jump-right");
    const baseY = this.catRunY;
    // Higher, more dramatic arc for a dodge
    this.tweens.add({
      targets: this.cat,
      y: baseY - 120,
      duration: 300,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.cat.y = this.catRunY;
        this.cat.play("walk-right");
        this.catIsJumping = false;
      },
    });
  }

  private _getCatRoofY() {
    const catX = this.cat?.x ?? 150;

    let overlapRoofY: number | null = null;

    for (const b of this.buildings) {
      const left = b.image.x;
      const right = left + b.image.displayWidth;
      const roofY = this.groundY - b.image.displayHeight + b.roofInset;

      if (catX >= left && catX <= right) {
        if (overlapRoofY === null || roofY < overlapRoofY) {
          overlapRoofY = roofY;
        }
      }
    }

    // If cat is in a gap, use baseline rooftop path instead of nearest building
    // to avoid visual "air walking".
    return (overlapRoofY ?? this.rooftopY) - 2;
  }

  private _rightmostBuildingEdge(exclude?: Phaser.GameObjects.Image) {
    let rightmost = this.scale.width;
    for (const b of this.buildings) {
      if (exclude && b.image === exclude) continue;
      const edge = b.image.x + b.image.displayWidth;
      if (edge > rightmost) rightmost = edge;
    }
    return rightmost;
  }

  private _rightmostLampX(exclude?: Phaser.GameObjects.Image) {
    let rightmost = this.scale.width;
    for (const lamp of this.streetLamps) {
      if (exclude && lamp === exclude) continue;
      if (lamp.x > rightmost) rightmost = lamp.x;
    }
    return rightmost;
  }

  private _rightmostCollectibleX(exclude?: Phaser.GameObjects.Image) {
    let rightmost = this.scale.width;
    for (const item of this.collectibles) {
      if (exclude && item === exclude) continue;
      if (item.x > rightmost) rightmost = item.x;
    }
    return rightmost;
  }

  // ── Update loop ───────────────────────────────────────────────────────────

  update(_time: number, delta: number) {
    const { width } = this.scale;
    const dt = delta / 1000;
    const baseScroll = this.runSpeed * 60 * dt;

    // Scroll floor
    this.floorTile.tilePositionX += baseScroll;

    // Scroll parallax layers
    for (let i = 0; i < this.parallaxLayers.length; i++) {
      const layer = this.parallaxLayers[i];
      if (layer instanceof Phaser.GameObjects.TileSprite) {
        const factor = 0.12 + i * 0.18;
        layer.tilePositionX += baseScroll * factor;
      }
    }

    // Scroll midground buildings (slower than floor, faster than far parallax)
    this.buildings.forEach((b) => {
      b.image.x -= baseScroll * b.scrollSpeed;
      if (b.image.x < -b.image.displayWidth) {
        const rightmost = this._rightmostBuildingEdge(b.image);
        b.image.x = rightmost - Phaser.Math.Between(18, 34);
      }
    });

    // Scroll street lamps
    this.streetLamps.forEach((lamp) => {
      lamp.x -= baseScroll * 0.85;
      if (lamp.x < -30) {
        const rightmost = this._rightmostLampX(lamp);
        lamp.x = rightmost + Phaser.Math.Between(180, 320);
      }
    });

    // Scroll floating collectibles
    this.collectibles.forEach((item) => {
      item.x -= baseScroll * 0.55;
      if (item.x < -40) {
        const rightmost = this._rightmostCollectibleX(item);
        item.x = Math.max(
          width + 40,
          rightmost + Phaser.Math.Between(120, 220),
        );
        item.y = this.rooftopY - Phaser.Math.Between(40, 100);
      }
    });

    // Keep cat grounded on the current rooftop contour when not jumping.
    const targetRoofY = this._getCatRoofY();
    this.catRunY = Phaser.Math.Linear(this.catRunY, targetRoofY, 0.2);
    if (!this.catIsJumping) {
      this.cat.y = this.catRunY;
    }

    // Move enemies at street level; respawn when off left edge
    this.enemies.forEach(({ sprite, type, speedMult }) => {
      sprite.x -= (baseScroll + 0.8) * speedMult;
      if (sprite.x < -100) {
        sprite.x = width + Phaser.Math.Between(150, 750);
        if (type.includes("bird")) {
          sprite.setY(this.rooftopY - Phaser.Math.Between(10, 60));
        } else {
          sprite.setY(this.groundY - 16);
        }
      }
    });

    // Cat dodge: react when a bird enemy approaches at rooftop level
    if (!this.catIsJumping && this.catDodgeCooldown <= 0) {
      const incoming = this.enemies.find(
        ({ sprite, type }) =>
          type.includes("bird") &&
          sprite.x > this.cat.x - 10 &&
          sprite.x < this.cat.x + 110,
      );
      if (incoming) {
        this._catDodgeJump();
        return;
      }
    }

    // Random idle jump
    if (!this.catIsJumping && this.catDodgeCooldown <= 0) {
      if (Phaser.Math.FloatBetween(0, 1) < 0.004) {
        this._catJump(Phaser.Math.Between(40, 80));
      }
    }

    if (this.catDodgeCooldown > 0) {
      this.catDodgeCooldown -= delta;
    }
  }
}
