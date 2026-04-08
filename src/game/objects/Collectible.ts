import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GENERATED_TEXTURES } from "../assets/generatedTextures";

export type CollectibleType = "coin" | "gem" | "heart_small" | "heart_big";

const TEXTURE_BY_TYPE: Record<CollectibleType, string> = {
  coin: GENERATED_TEXTURES.collectibleCoin,
  gem: GENERATED_TEXTURES.collectibleGem,
  heart_small: GENERATED_TEXTURES.collectibleHeartSmall,
  heart_big: GENERATED_TEXTURES.collectibleHeartBig,
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
    super(scene, x, y, TEXTURE_BY_TYPE[collectibleType]);

    this.collectibleType = collectibleType;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(SCALE_BY_TYPE[collectibleType]);
    this.setAlpha(0.92);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setCircle(Math.max(4, Math.round(this.displayWidth * 0.22)));

    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    scene.tweens.add({
      targets: this,
      angle: { from: -3, to: 3 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }
}
