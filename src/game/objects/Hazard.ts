import { Scene } from "phaser";
import * as Phaser from "phaser";

export type HazardType = "spike" | "steam";

const TINT_BY_TYPE: Record<HazardType, number> = {
  spike: 0xf97316,
  steam: 0x94a3b8,
};

export class Hazard extends Phaser.Physics.Arcade.Sprite {
  public readonly hazardType: HazardType;
  public readonly damage: number;
  private hazardActive = true;

  constructor(scene: Scene, x: number, y: number, hazardType: HazardType) {
    super(scene, x, y, "platform");

    this.hazardType = hazardType;
    this.damage = hazardType === "steam" ? 1 : 1;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setTint(TINT_BY_TYPE[hazardType]);
    this.setAlpha(hazardType === "steam" ? 0.45 : 0.95);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    if (hazardType === "spike") {
      this.setDisplaySize(24, 24);
      body.setSize(20, 18).setOffset(2, 6);
    } else {
      this.setDisplaySize(20, 30);
      body.setSize(16, 26).setOffset(2, 2);
      this.startSteamCycle();
    }
    body.updateFromGameObject();
  }

  public isActive(): boolean {
    return this.hazardActive;
  }

  private startSteamCycle() {
    this.scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        this.hazardActive = !this.hazardActive;
        this.setAlpha(this.hazardActive ? 0.85 : 0.2);
      },
    });
  }
}
