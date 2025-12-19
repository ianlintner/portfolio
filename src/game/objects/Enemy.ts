import { Scene } from "phaser";
import * as Phaser from "phaser";

export type EnemyType =
  | "mouse"
  | "rat"
  | "dog"
  | "rabbit"
  | "snake"
  | "shark"
  | "lizard";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: EnemyType;
  private walkSpeed: number = 100;

  constructor(scene: Scene, x: number, y: number, type: EnemyType) {
    super(scene, x, y, "enemies"); // Using 'enemies' texture

    this.enemyType = type;
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(1);
    this.setVelocityX(-this.walkSpeed);

    // Play initial animation
    this.play(`${this.enemyType}-walk`);
  }

  update() {
    if (!this.body) return;

    // Patrol logic
    if (this.body.blocked.left) {
      this.setVelocityX(this.walkSpeed);
      this.setFlipX(true);
    } else if (this.body.blocked.right) {
      this.setVelocityX(-this.walkSpeed);
      this.setFlipX(false);
    }
  }
}
