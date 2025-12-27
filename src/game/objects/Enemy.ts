import { Scene } from "phaser";
import * as Phaser from "phaser";

export type EnemyType =
  | "mouse"
  | "rat"
  | "chipmunk"
  | "rabbit"
  | "snake"
  | "shark"
  | "lizard";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: EnemyType;
  private walkSpeed: number = 80;
  private squished = false;

  constructor(scene: Scene, x: number, y: number, type: EnemyType) {
    super(scene, x, y, "enemies"); // Using 'enemies' texture

    this.enemyType = type;
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDragX(0);
    this.setVelocityX(
      scene.registry.get("enemyDir") === -1 ? -this.walkSpeed : this.walkSpeed,
    );

    // Tight-ish body so collisions feel fair.
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(20, 20, true);

    // Play initial animation
    this.play(this.animKey("move"));
  }

  public isSquished(): boolean {
    return this.squished;
  }

  public squish() {
    if (this.squished) return;
    this.squished = true;

    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.stop();
      body.enable = false;
    }

    // Play squish -> squished pose, then remove.
    this.play(this.animKey("squish"));
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.scene && this.scene.anims.exists(this.animKey("squished"))) {
        this.play(this.animKey("squished"));
      }
      this.scene.time.delayedCall(400, () => this.destroy());
    });
  }

  update(player?: Phaser.Physics.Arcade.Sprite) {
    if (!this.body) return;
    if (this.squished) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Basic AI: patrol; slightly speed up when player is near.
    const baseSpeed = this.walkSpeed;
    let speed = baseSpeed;
    if (player) {
      const dx = Math.abs(player.x - this.x);
      if (dx < 180) speed = baseSpeed * 1.25;
    }

    // Keep moving in current direction unless blocked.
    if (body.blocked.left) {
      body.setVelocityX(speed);
      this.setFlipX(true);
    } else if (body.blocked.right) {
      body.setVelocityX(-speed);
      this.setFlipX(false);
    } else if (Math.abs(body.velocity.x) < 5) {
      // If we got stuck, nudge.
      body.setVelocityX(this.flipX ? speed : -speed);
    }

    // Animation based on motion.
    if (Math.abs(body.velocity.x) > 2) {
      if (this.anims.currentAnim?.key !== this.animKey("move")) {
        this.play(this.animKey("move"));
      }
    } else {
      if (this.anims.currentAnim?.key !== this.animKey("idle")) {
        this.play(this.animKey("idle"));
      }
    }
  }

  private animKey(kind: "move" | "idle" | "squish" | "squished") {
    return `enemy:${this.enemyType}:${kind}`;
  }
}
