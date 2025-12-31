import { Scene } from "phaser";
import * as Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private shootKey!: Phaser.Input.Keyboard.Key;

  public isPoweredUp: boolean = false;
  private lastShotTime: number = 0;
  private lastDirection: "left" | "right" = "right";

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "cat");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setDragX(1000); // Friction

    // Physics body alignment
    //
    // The cat sprite is 64×64, but we want a smaller hitbox for fair platforming.
    // Previously the body was centered (offset 16,16), which made the sprite appear
    // sunk into the floor because the sprite's feet extended below the body.
    //
    // The cat sprite frames include transparent padding at the bottom.
    // If we anchor the body to the sprite's bottom, the *visible* feet can look
    // like they're floating above the ground even though collision is correct.
    //
    // To match what the player sees, we raise the physics body slightly within
    // the sprite so the body's bottom lines up with the visible feet.
    const body = this.body as Phaser.Physics.Arcade.Body | undefined;
    if (body) {
      const bodyW = 32;
      const bodyH = 32;

      // Empirically tuned for the current cat spritesheet.
      const FOOT_PAD_PX = 12;

      // Center horizontally; anchor vertically at the sprite's feet.
      const offsetX = (this.displayWidth - bodyW) / 2;
      const offsetY = this.displayHeight - bodyH - FOOT_PAD_PX;
      body.setSize(bodyW, bodyH);
      body.setOffset(offsetX, offsetY);
    }

    const keyboard = scene.input.keyboard;

    // Phaser scenes should have keyboard input, but we keep a safe fallback so
    // the code remains type-safe and doesn't crash if the plugin is disabled.
    if (!keyboard) {
      const nullKey = { isDown: false } as Phaser.Input.Keyboard.Key;
      this.cursors = {
        up: nullKey,
        down: nullKey,
        left: nullKey,
        right: nullKey,
        space: nullKey,
        shift: nullKey,
      } as Phaser.Types.Input.Keyboard.CursorKeys;

      this.wasd = {
        up: nullKey,
        left: nullKey,
        down: nullKey,
        right: nullKey,
        w: nullKey,
        a: nullKey,
        s: nullKey,
        d: nullKey,
      };

      this.jumpKey = nullKey;
      this.shootKey = nullKey;
      return;
    }

    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shootKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  update() {
    if (!this.body) return;

    const speed = 200;
    const jumpForce = -550;

    // Movement
    if (
      this.cursors.left.isDown ||
      this.wasd.left.isDown ||
      this.wasd.a.isDown
    ) {
      this.setVelocityX(-speed);
      this.setFlipX(false);
      this.anims.play("walk-left", true);
      this.lastDirection = "left";
    } else if (
      this.cursors.right.isDown ||
      this.wasd.right.isDown ||
      this.wasd.d.isDown
    ) {
      this.setVelocityX(speed);
      this.setFlipX(false);
      this.anims.play("walk-right", true);
      this.lastDirection = "right";
    } else {
      this.setVelocityX(0);
      this.anims.play("idle", true);
      this.setFlipX(this.lastDirection === "left");
    }

    // Jump
    const isGrounded = this.body.blocked.down || this.body.touching.down;
    if (
      (this.cursors.up.isDown ||
        this.wasd.up.isDown ||
        this.wasd.w.isDown ||
        this.jumpKey.isDown) &&
      isGrounded
    ) {
      this.setVelocityY(jumpForce);
    }

    // Air animation (Jump/Fall)
    if (!isGrounded) {
      if (this.lastDirection === "left") {
        this.anims.play("jump-left", true);
        this.setFlipX(false);
      } else {
        this.anims.play("jump-right", true);
        this.setFlipX(false);
      }
    }

    // Shoot
    if (this.isPoweredUp && Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.shoot();
    }
  }

  private shoot() {
    const time = this.scene.time.now;
    if (time > this.lastShotTime + 500) {
      // Create hairball
      // This would ideally call a method on the scene or emit an event
      const direction = this.lastDirection === "left" ? -1 : 1;
      this.scene.events.emit("player-shoot", this.x, this.y, direction);
      this.lastShotTime = time;
    }
  }

  public powerUp() {
    this.isPoweredUp = true;
    this.setTint(0x00ff00); // Visual feedback
  }
}
