import * as Phaser from "phaser";
import { GENERATED_TEXTURES } from "../assets/generatedTextures";

export type MovingPlatformConfig = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed?: number;
  pauseMs?: number;
  widthTiles?: number;
};

export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  private startPos: Phaser.Math.Vector2;
  private endPos: Phaser.Math.Vector2;
  private platformSpeed: number;
  private pauseMs: number;
  private movingToEnd = true;
  private pauseUntil = 0;

  constructor(scene: Phaser.Scene, config: MovingPlatformConfig) {
    super(
      scene,
      config.startX,
      config.startY,
      GENERATED_TEXTURES.movingPlatform,
    );

    this.startPos = new Phaser.Math.Vector2(config.startX, config.startY);
    this.endPos = new Phaser.Math.Vector2(config.endX, config.endY);
    this.platformSpeed = config.speed ?? 40;
    this.pauseMs = config.pauseMs ?? 600;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const widthPx = (config.widthTiles ?? 3) * 32;
    this.setDisplaySize(widthPx, 14);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);
    body.setFrictionX(1);
    body.setSize(Math.max(16, widthPx - 8), 10).setOffset(4, 2);

    this.moveToward(this.endPos);
  }

  private moveToward(target: Phaser.Math.Vector2) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    body.setVelocity(
      Math.cos(angle) * this.platformSpeed,
      Math.sin(angle) * this.platformSpeed,
    );
  }

  update() {
    if (!this.body) return;

    const now = this.scene.time.now;
    if (now < this.pauseUntil) return;

    const target = this.movingToEnd ? this.endPos : this.startPos;
    const dist = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y,
    );

    if (dist < 4) {
      this.setPosition(target.x, target.y);
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      this.pauseUntil = now + this.pauseMs;
      this.movingToEnd = !this.movingToEnd;
      const next = this.movingToEnd ? this.endPos : this.startPos;
      this.scene.time.delayedCall(this.pauseMs, () => {
        if (this.body) this.moveToward(next);
      });
    }
  }
}
