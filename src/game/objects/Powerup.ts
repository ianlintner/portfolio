import { Scene } from "phaser";
import * as Phaser from "phaser";

export type PowerupType = "catnip" | "fish" | "yarn" | "milk" | "feather";

const POWERUP_TINT: Record<PowerupType, number> = {
  catnip: 0x22c55e,
  fish: 0x60a5fa,
  yarn: 0xa78bfa,
  milk: 0xffffff,
  feather: 0xf59e0b,
};

export class Powerup extends Phaser.Physics.Arcade.Sprite {
  public readonly powerupType: PowerupType;

  constructor(scene: Scene, x: number, y: number, type: PowerupType) {
    super(scene, x, y, "catnip");
    this.powerupType = type;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.setScale(0.05);
    this.setTint(POWERUP_TINT[type]);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(24, 24, true);
  }
}
