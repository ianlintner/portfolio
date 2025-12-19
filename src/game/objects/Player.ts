import { Scene } from "phaser";
import * as Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };
  private jumpKey: Phaser.Input.Keyboard.Key;
  private shootKey: Phaser.Input.Keyboard.Key;

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

    // Adjust hitbox if needed (64x64 might be too big if the cat is small in the frame)
    this.body?.setSize(32, 32);
    this.body?.setOffset(16, 32);

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        right: scene.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.RIGHT,
        ),
        w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.jumpKey = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );
      this.shootKey = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.F,
      );
    }
  }

  update() {
    if (!this.body) return;

    const speed = 200;
    const jumpForce = -400;

    // Movement
    if (
      this.cursors.left.isDown ||
      this.wasd.left.isDown ||
      this.wasd.a.isDown
    ) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
      this.anims.play("walk", true);
    } else if (
      this.cursors.right.isDown ||
      this.wasd.right.isDown ||
      this.wasd.d.isDown
    ) {
      this.setVelocityX(speed);
      this.setFlipX(false);
      this.anims.play("walk", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("idle", true);
    }

    // Jump
    const isGrounded = this.body.touching.down;
    if (
      (this.cursors.up.isDown ||
        this.wasd.up.isDown ||
        this.wasd.w.isDown ||
        this.jumpKey.isDown) &&
      isGrounded
    ) {
      this.setVelocityY(jumpForce);
      this.anims.play("jump", true);
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
      this.scene.events.emit(
        "player-shoot",
        this.x,
        this.y,
        this.flipX ? -1 : 1,
      );
      this.lastShotTime = time;
    }
  }

  public powerUp() {
    this.isPoweredUp = true;
    this.setTint(0x00ff00); // Visual feedback
  }
}
