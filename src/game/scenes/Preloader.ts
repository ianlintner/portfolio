import { Scene } from "phaser";
import {
  IMAGES,
  PARALLAX_SETS,
  SPRITESHEETS,
  TILESETS,
  getParallaxLayerKey,
  getParallaxLayerUrl,
} from "../assets/manifest";
import {
  INDUSTRIAL_TILE_NUMBERS,
  buildIndustrialTilesetTexture,
  getIndustrialTileKey,
  getIndustrialTileUrl,
} from "../assets/industrial-tileset";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    // Spritesheets (animated)
    for (const sheet of Object.values(SPRITESHEETS)) {
      const margin = "margin" in sheet ? (sheet.margin ?? 0) : 0;
      const spacing = "spacing" in sheet ? (sheet.spacing ?? 0) : 0;
      this.load.spritesheet(sheet.key, sheet.url, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
        margin,
        spacing,
      });
    }

    // Tilesets (for Tilemaps) MUST be loaded as images.
    for (const tileset of Object.values(TILESETS)) {
      if (tileset.url) {
        this.load.image(tileset.key, tileset.url);
      }
    }

    // Industrial tiles are individual PNGs that will be stitched into a single runtime tilesheet.
    for (const n of INDUSTRIAL_TILE_NUMBERS) {
      this.load.image(getIndustrialTileKey(n), getIndustrialTileUrl(n));
    }

    // Plain images
    for (const img of Object.values(IMAGES)) {
      this.load.image(img.key, img.url);
    }

    // Parallax backgrounds
    // (Currently: Free City "city 1" set, layers 1..6)
    for (const set of Object.values(PARALLAX_SETS)) {
      for (let i = 1; i <= set.layerCount; i++) {
        this.load.image(
          getParallaxLayerKey(set, i),
          getParallaxLayerUrl(set, i),
        );
      }
    }

    // Load placeholders for other elements (we can replace these with real assets later)
    // For now, we'll generate textures programmatically in the create method if needed,
    // or load simple colored blocks if we had them.
    // Let's create a simple 32x32 white pixel for platforms to tint.
    const platformGfx = this.make.graphics({ x: 0, y: 0 });
    platformGfx.fillStyle(0xffffff).fillRect(0, 0, 32, 32);
    platformGfx.generateTexture("platform", 32, 32);
    platformGfx.destroy();

    const hairballGfx = this.make.graphics({ x: 0, y: 0 });
    hairballGfx.fillStyle(0x00ff00).fillCircle(16, 16, 16);
    hairballGfx.generateTexture("hairball", 32, 32);
    hairballGfx.destroy();
  }

  create() {
    // Create Animations
    // Row 0: Idle/Sit (Frames 0-13)
    // Row 1: Walk (Frames 14-27)
    // Row 2: Run/Action (Frames 28-41)
    // Row 3: Jump (Frames 42-55)

    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("cat", { start: 56, end: 59 }), // Row 4
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("cat", { start: 70, end: 73 }), // Row 5
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("cat", { start: 267, end: 270 }), // Row 0, first 3 frames only
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jump-left",
      frames: this.anims.generateFrameNumbers("cat", { start: 56, end: 59 }), // Use walk frames for now to prevent glitching
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jump-right",
      frames: this.anims.generateFrameNumbers("cat", { start: 70, end: 73 }), // Use walk frames for now to prevent glitching
      frameRate: 10,
      repeat: -1,
    });

    // Enemy Animations
    const enemyTypes = [
      "mouse",
      "rat",
      "dog",
      "rabbit",
      "snake",
      "shark",
      "lizard",
    ];
    // Assuming 5 columns per row (Idle A, Idle B, Attack, Hit, Defeated)
    // We'll use frames 0 and 1 for a simple walk/idle loop
    enemyTypes.forEach((type, index) => {
      const startFrame = index * 5; // 5 frames per row
      this.anims.create({
        key: `${type}-walk`,
        frames: this.anims.generateFrameNumbers("enemies", {
          start: startFrame,
          end: startFrame + 1,
        }),
        frameRate: 4,
        repeat: -1,
      });
    });

    // Build the runtime industrial tileset texture (tile index 0 is transparent).
    try {
      buildIndustrialTilesetTexture(this);
    } catch (err) {
      // Surface the error so we don't silently start a broken game.
      // (Still start MainMenu so users can see something rather than a blank screen.)
      // eslint-disable-next-line no-console
      console.error("Failed to build industrial tileset texture", err);
      this.add
        .text(
          16,
          16,
          "Failed to build tileset texture. Check console for details.",
          { color: "#ff6b6b" },
        )
        .setScrollFactor(0);
    }

    this.scene.start("MainMenu");
  }
}
