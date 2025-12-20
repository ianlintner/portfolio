import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    // Load Player
    this.load.spritesheet("cat", "/assets/game/cat.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Load Enemies
    // Note: Adjust margin/spacing if the sprite sheet has labels or padding
    this.load.spritesheet("enemies", "/assets/game/enemies.png", {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0,
    });

    // Load Items
    this.load.spritesheet("items", "/assets/game/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Load Tiles
    this.load.image("alleyTiles", "/assets/game/alley_tiles.png");

    // Load placeholders for other elements (we can replace these with real assets later)
    // For now, we'll generate textures programmatically in the create method if needed,
    // or load simple colored blocks if we had them.
    // Let's create a simple 32x32 white pixel for platforms to tint.
    this.make
      .graphics({ x: 0, y: 0, add: false })
      .fillStyle(0xffffff)
      .fillRect(0, 0, 32, 32)
      .generateTexture("platform", 32, 32);

    this.make
      .graphics({ x: 0, y: 0, add: false })
      .fillStyle(0x00ff00)
      .fillCircle(16, 16, 16)
      .generateTexture("hairball", 32, 32);
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
      frames: this.anims.generateFrameNumbers("cat", { start: 0, end: 2 }), // Row 0, first 3 frames only
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

    this.scene.start("MainMenu");
  }
}
