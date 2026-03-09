import { Scene } from "phaser";
import * as Phaser from "phaser";

export type CollectibleType = "coin" | "gem" | "heart_small" | "heart_big";

const TINT_BY_TYPE: Record<CollectibleType, number> = {
  coin: 0xfacc15,
  gem: 0x38bdf8,
  heart_small: 0xfb7185,
  heart_big: 0xef4444,
};

const SCALE_BY_TYPE: Record<CollectibleType, number> = {
  coin: 0.55,
  gem: 0.65,
  heart_small: 0.6,
  heart_big: 0.8,
};

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  public readonly collectibleType: CollectibleType;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    collectibleType: CollectibleType,
  ) {
    super(scene, x, y, "platform");

    this.collectibleType = collectibleType;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(SCALE_BY_TYPE[collectibleType]);
    this.setTint(TINT_BY_TYPE[collectibleType]);
    this.setAlpha(0.92);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setCircle(Math.round((this.displayWidth * 0.5) / 2));

    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }
}
