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
      .fillStyle(0xff0000)
      .fillRect(0, 0, 32, 32)
      .generateTexture("enemy", 32, 32);

    this.make
      .graphics({ x: 0, y: 0, add: false })
      .fillStyle(0x00ff00)
      .fillCircle(16, 16, 16)
      .generateTexture("hairball", 32, 32);

    this.make
      .graphics({ x: 0, y: 0, add: false })
      .fillStyle(0xffff00)
      .fillCircle(16, 16, 16)
      .generateTexture("bowl", 32, 32);
  }

  create() {
    // Create Animations
    // Row 0: Idle/Sit (Frames 0-13)
    // Row 1: Walk (Frames 14-27)
    // Row 2: Run/Action (Frames 28-41)
    // Row 3: Jump (Frames 42-55)

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("cat", { start: 14, end: 17 }), // Using first 4 frames of Row 1
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("cat", { start: 0, end: 3 }), // Using first 4 frames of Row 0
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("cat", { start: 28, end: 28 }), // Using first frame of Row 2
      frameRate: 10,
      repeat: -1,
    });

    this.scene.start("MainMenu");
  }
}
