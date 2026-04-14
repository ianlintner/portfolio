import * as Phaser from "phaser";
import { GENERATED_TEXTURES } from "@/game/assets/generatedTextures";
import type { BuildingFootprint, LayoutType } from "@/game/rogue/types";
import { Rng } from "@/game/rogue/rng";

const TILE_SIZE = 32;

const SKYLINE_TEXTURES = [
  GENERATED_TEXTURES.buildingTall,
  GENERATED_TEXTURES.buildingMedium,
  GENERATED_TEXTURES.buildingShort,
  GENERATED_TEXTURES.buildingTower,
  GENERATED_TEXTURES.buildingPlant,
  GENERATED_TEXTURES.buildingTenementTall,
  GENERATED_TEXTURES.buildingHousingBlock,
  GENERATED_TEXTURES.buildingApartmentSpire,
] as const;

const SKYLINE_TINTS = [0x7c8fab, 0x7489a8, 0x6f85a3, 0x8394ae] as const;

const ROOFTOP_DECO_TEXTURES = [
  GENERATED_TEXTURES.tileHVAC,
  GENERATED_TEXTURES.decoACUnit,
] as const;

export class BuildingDecorator {
  private scene: Phaser.Scene;
  private group: Phaser.GameObjects.Group;
  private rng: Rng;

  constructor(scene: Phaser.Scene, seed: string) {
    this.scene = scene;
    this.group = scene.add.group();
    this.rng = new Rng(seed);
  }

  decorate(
    buildings: BuildingFootprint[],
    layout: LayoutType,
    tileSize: number,
    levelWidthTiles?: number,
    levelHeightTiles?: number,
  ) {
    const ts = tileSize || TILE_SIZE;

    for (const b of buildings) {
      this.decorateBuilding(b, layout, ts);
    }

    // Add street-level decorations for cityblock and alleyrun
    if (layout === "cityblock" || layout === "alleyrun") {
      this.addStreetDecorations(buildings, ts, layout);
    }

    // Alleyrun canyon-wall dressing (windows, pipes, fire escapes)
    if (layout === "alleyrun" && levelWidthTiles && levelHeightTiles) {
      const groundY = levelHeightTiles - 4;
      this.addAlleyWallDecorations(levelWidthTiles, groundY, ts);
    }

    // Set all decorations behind the tilemap
    this.group.setDepth(-5);
  }

  private decorateBuilding(
    b: BuildingFootprint,
    layout: LayoutType,
    ts: number,
  ) {
    const px = b.x * ts;
    const py = b.y * ts;
    const footprintWidthPx = Math.max(ts * 2, b.w * ts);
    const footprintHeightPx = Math.max(ts * 3, b.h * ts);
    const baseY = (b.y + b.h) * ts;

    const textureKey = this.pickSkylineTexture(b);
    const sourceImage = this.scene.textures
      .get(textureKey)
      .getSourceImage() as HTMLImageElement;

    const sourceW = Math.max(1, sourceImage.width || footprintWidthPx);
    const sourceH = Math.max(1, sourceImage.height || footprintHeightPx);
    let scaleX = footprintWidthPx / sourceW;
    let scaleY = footprintHeightPx / sourceH;

    // Cap aspect-ratio distortion so baked-in signs don't get extremely stretched
    const distortion = scaleX / scaleY;
    if (distortion > 1.5) {
      scaleX = scaleY * 1.5;
    } else if (distortion < 0.667) {
      scaleY = scaleX * 1.5;
    }

    const isCityLayout =
      layout === "cityblock" || layout === "alleyrun" || layout === "rooftops";
    const tint = this.rng.pick([...SKYLINE_TINTS]);

    const buildingImage = this.scene.add.image(
      px + footprintWidthPx / 2,
      baseY,
      textureKey,
    );
    buildingImage
      .setOrigin(0.5, 1)
      .setScale(scaleX, scaleY)
      .setDepth(-6)
      .setAlpha(isCityLayout ? 0.96 : 0.9)
      .setTint(tint);
    this.group.add(buildingImage);

    // For non-city layouts, keep visuals close to intro style: silhouette-only.
    if (!isCityLayout) return;

    // Fire escape visuals on both sides for traversal readability.
    if (b.h > 8) {
      const sides = [px, px + (b.w - 1) * ts];
      for (const feX of sides) {
        if (this.rng.chance(0.55)) {
          for (let ty = 3; ty < b.h - 2; ty += 4) {
            const img = this.scene.add.image(
              feX + ts / 2,
              py + ty * ts + ts / 2,
              GENERATED_TEXTURES.tileFireEscape,
            );
            img.setDepth(-4);
            this.group.add(img);
          }
        }
      }
    }

    // Rooftop edge decoration
    for (let tx = 0; tx < b.w; tx++) {
      if (this.rng.chance(0.22)) {
        const img = this.scene.add.image(
          px + tx * ts + ts / 2,
          py - ts / 2,
          GENERATED_TEXTURES.tileRooftopEdge,
        );
        img.setDepth(-4);
        this.group.add(img);
      }
    }

    // Rooftop equipment (HVAC, antenna, water tower)
    if (b.w >= 5 && this.rng.chance(0.52)) {
      const decoX = px + this.rng.int(2, b.w - 3) * ts;
      const decoY = py - ts;
      if (this.rng.chance(0.3)) {
        const img = this.scene.add.image(
          decoX + ts / 2,
          decoY - 20,
          GENERATED_TEXTURES.decoWaterTower,
        );
        img.setDepth(-4);
        this.group.add(img);
      } else if (this.rng.chance(0.4)) {
        const img = this.scene.add.image(
          decoX + ts / 2,
          decoY,
          this.rng.pick([...ROOFTOP_DECO_TEXTURES]),
        );
        img.setDepth(-4);
        this.group.add(img);
      } else {
        const img = this.scene.add.image(
          decoX + ts / 2,
          decoY - 30,
          GENERATED_TEXTURES.decoAntenna,
        );
        img.setDepth(-4);
        this.group.add(img);
      }
    }

    // Neon sign overlay (city layouts only)
    if (b.h > 7 && this.rng.chance(0.22)) {
      const signTy = this.rng.int(2, Math.min(5, b.h - 3));
      const signTx = this.rng.int(1, b.w - 2);
      const img = this.scene.add.image(
        px + signTx * ts + ts / 2,
        py + signTy * ts + ts / 2,
        GENERATED_TEXTURES.tileNeonSign,
      );
      img.setDepth(-3);

      // Random flicker to bring life to the city
      this.scene.tweens.add({
        targets: img,
        alpha: { from: 1, to: 0.5 },
        duration: this.rng.int(50, 150),
        yoyo: true,
        repeat: -1,
        repeatDelay: this.rng.int(500, 3000),
        ease: "Stepped",
      });

      this.group.add(img);
    }

    // Awning at ground level
    if (this.rng.chance(0.2)) {
      const awningTx = this.rng.int(1, Math.max(2, b.w - 2));
      const img = this.scene.add.image(
        px + awningTx * ts + ts / 2,
        py + (b.h - 2) * ts + ts / 2,
        GENERATED_TEXTURES.tileAwning,
      );
      img.setDepth(-3);
      this.group.add(img);
    }

    // Pipe running vertically
    if (b.h > 10 && this.rng.chance(0.16)) {
      const pipeTx = this.rng.chance(0.5) ? 0 : b.w - 1;
      for (let ty = 2; ty < b.h - 1; ty += 2) {
        const img = this.scene.add.image(
          px + pipeTx * ts + ts / 2,
          py + ty * ts + ts / 2,
          GENERATED_TEXTURES.tilePipe,
        );
        img.setDepth(-4);
        this.group.add(img);
      }
    }

    // Lit / dark windows scattered on the building facade
    if (b.h > 4 && b.w > 2) {
      const windowChance = layout === "alleyrun" ? 0.3 : 0.18;
      for (let ty = 2; ty < b.h - 2; ty += 2) {
        for (let tx = 1; tx < b.w - 1; tx += 2) {
          if (this.rng.chance(windowChance)) {
            const lit = this.rng.chance(0.6);
            const img = this.scene.add.image(
              px + tx * ts + ts / 2,
              py + ty * ts + ts / 2,
              lit
                ? GENERATED_TEXTURES.tileWindowLit
                : GENERATED_TEXTURES.tileWindowDark,
            );
            img.setDepth(-4).setAlpha(lit ? 0.75 : 0.5);
            this.group.add(img);

            if (lit && this.rng.chance(0.5)) {
              // Add a subtle warm glow pointlight to lit windows
              const windowLight = this.scene.add.pointlight(
                px + tx * ts + ts / 2,
                py + ty * ts + ts / 2,
                0xffaa44,
                ts * 1.5,
                0.2, // intensity
                0.05, // attenuation
              );
              windowLight.setDepth(-3);
              this.group.add(windowLight);
            }
          }
        }
      }
    }
  }

  private pickSkylineTexture(b: BuildingFootprint) {
    // Use the footprint's aspect ratio to pick a texture whose proportions
    // are close, preventing extreme stretching of baked-in signs and windows.
    const ratio = b.w / b.h;

    if (ratio < 0.55) {
      // Very tall / narrow
      return this.rng.pick([
        GENERATED_TEXTURES.buildingApartmentSpire,
        GENERATED_TEXTURES.buildingTenementTall,
        GENERATED_TEXTURES.buildingHousingBlock,
        GENERATED_TEXTURES.buildingTower,
        GENERATED_TEXTURES.buildingTall,
      ]);
    }

    if (ratio < 0.85) {
      // Tall
      return this.rng.pick([
        GENERATED_TEXTURES.buildingTall,
        GENERATED_TEXTURES.buildingTower,
        GENERATED_TEXTURES.buildingTenementTall,
        GENERATED_TEXTURES.buildingMedium,
      ]);
    }

    if (ratio < 1.2) {
      // Roughly square
      return this.rng.pick([
        GENERATED_TEXTURES.buildingMedium,
        GENERATED_TEXTURES.buildingShort,
        GENERATED_TEXTURES.buildingPlant,
      ]);
    }

    // Wide
    return this.rng.pick([
      GENERATED_TEXTURES.buildingShort,
      GENERATED_TEXTURES.buildingPlant,
      GENERATED_TEXTURES.buildingMedium,
    ]);
  }

  private addStreetDecorations(
    buildings: BuildingFootprint[],
    ts: number,
    layout: LayoutType,
  ) {
    // Add dumpsters and other street-level items between buildings
    for (let i = 0; i < buildings.length - 1; i++) {
      const a = buildings[i];
      const b = buildings[i + 1];
      const alleyStart = (a.x + a.w) * ts;
      const alleyEnd = b.x * ts;
      const alleyWidth = alleyEnd - alleyStart;

      if (alleyWidth < ts * 2) continue;

      // Ground level Y (bottom of taller building)
      const groundPx = (Math.max(a.y + a.h, b.y + b.h) + 1) * ts;

      if (this.rng.chance(0.6)) {
        const img = this.scene.add.image(
          alleyStart + alleyWidth / 2,
          groundPx - 12,
          GENERATED_TEXTURES.decoDumpster,
        );
        img.setDepth(-3);
        this.group.add(img);
      }
    }

    // Street lamps between buildings for city layouts
    if (layout === "alleyrun" || layout === "cityblock") {
      for (const b of buildings) {
        const groundPx = (b.y + b.h + 1) * ts;
        if (this.rng.chance(0.4)) {
          const lampX = (b.x + b.w) * ts + ts;
          const img = this.scene.add.image(
            lampX,
            groundPx - 24,
            GENERATED_TEXTURES.streetLamp,
          );
          img.setDepth(-3).setAlpha(0.85);

          // Subtle glow oscillation for lamp
          this.scene.tweens.add({
            targets: img,
            alpha: { from: 0.85, to: 0.65 },
            duration: this.rng.int(1000, 2000),
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });

          this.group.add(img);
        }
      }
    }
  }

  /**
   * Dress the canyon walls in alleyrun with windows, pipes, and fire escapes
   * so the tall flat walls don't look bare.
   */
  private addAlleyWallDecorations(
    widthTiles: number,
    groundY: number,
    ts: number,
  ) {
    const canyonTop = 3;

    // Left wall inner face (column 2) and right wall inner face
    const faces = [
      { tx: 2, dir: 1 },
      { tx: widthTiles - 3, dir: -1 },
    ];

    for (const face of faces) {
      // Scattered lit / dark windows
      for (let ty = canyonTop + 1; ty < groundY - 1; ty += 2) {
        if (this.rng.chance(0.28)) {
          const lit = this.rng.chance(0.55);
          const img = this.scene.add.image(
            face.tx * ts + ts / 2,
            ty * ts + ts / 2,
            lit
              ? GENERATED_TEXTURES.tileWindowLit
              : GENERATED_TEXTURES.tileWindowDark,
          );
          img.setDepth(-4).setAlpha(lit ? 0.7 : 0.45);
          this.group.add(img);
        }
      }

      // Vertical pipe run
      if (this.rng.chance(0.65)) {
        const pipeTx = face.tx;
        const pipeStartTy = canyonTop + this.rng.int(1, 4);
        for (let ty = pipeStartTy; ty < groundY - 1; ty += 2) {
          const img = this.scene.add.image(
            pipeTx * ts + ts * 0.2 * face.dir + ts / 2,
            ty * ts + ts / 2,
            GENERATED_TEXTURES.tilePipe,
          );
          img.setDepth(-4).setAlpha(0.6);
          this.group.add(img);
        }
      }

      // Fire escape segments
      if (this.rng.chance(0.55)) {
        const feStartTy = canyonTop + this.rng.int(2, 6);
        for (let ty = feStartTy; ty < groundY - 2; ty += 4) {
          const img = this.scene.add.image(
            face.tx * ts + ts / 2,
            ty * ts + ts / 2,
            GENERATED_TEXTURES.tileFireEscape,
          );
          img.setDepth(-4).setAlpha(0.65);
          this.group.add(img);
        }
      }

      // Awning near ground
      if (this.rng.chance(0.35)) {
        const awningTy = groundY - this.rng.int(2, 4);
        const img = this.scene.add.image(
          face.tx * ts + ts / 2,
          awningTy * ts + ts / 2,
          GENERATED_TEXTURES.tileAwning,
        );
        img.setDepth(-3).setAlpha(0.7);
        this.group.add(img);
      }
    }
  }

  destroy() {
    this.group.destroy(true);
  }
}
