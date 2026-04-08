import { Scene } from "phaser";
import * as Phaser from "phaser";
import { GENERATED_TEXTURES } from "../assets/generatedTextures";

export type HazardType = "spike" | "steam";

const TEXTURE_BY_TYPE: Record<HazardType, string> = {
  spike: GENERATED_TEXTURES.hazardSpike,
  steam: GENERATED_TEXTURES.hazardSteamOff,
};

export class Hazard extends Phaser.Physics.Arcade.Sprite {
  public readonly hazardType: HazardType;
  public readonly damage: number;
  private hazardActive = true;

  constructor(scene: Scene, x: number, y: number, hazardType: HazardType) {
    super(scene, x, y, TEXTURE_BY_TYPE[hazardType]);

    this.hazardType = hazardType;
    this.damage = 1;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    if (hazardType === "spike") {
      this.setDisplaySize(28, 28);
      this.setAlpha(0.98);
      body.setSize(24, 14).setOffset(2, 12);
    } else {
      this.setDisplaySize(28, 28);
      body.setSize(18, 12).setOffset(5, 16);
      this.startSteamCycle();
    }
    body.updateFromGameObject();
  }

  public isActive(): boolean {
    return this.hazardActive;
  }

  private startSteamCycle() {
    const syncSteamVisual = () => {
      this.setTexture(
        this.hazardActive
          ? GENERATED_TEXTURES.hazardSteamOn
          : GENERATED_TEXTURES.hazardSteamOff,
      );
      this.setAlpha(this.hazardActive ? 0.95 : 0.6);
    };

    syncSteamVisual();

    this.scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        this.hazardActive = !this.hazardActive;
        syncSteamVisual();

        if (this.hazardActive) {
          this.scene.tweens.add({
            targets: this,
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 180,
            yoyo: true,
            ease: "Sine.Out",
          });
        }
      },
    });
  }
}
