import * as Phaser from "phaser";
import { GENERATED_TEXTURES } from "@/game/assets/generatedTextures";
import type { BuildingFootprint, LayoutType } from "@/game/rogue/types";
import { Rng } from "@/game/rogue/rng";

const TILE_SIZE = 32;

const BRICK_TEXTURES = [
  GENERATED_TEXTURES.tileBrickWall,
  GENERATED_TEXTURES.tileBrickWallDark,
] as const;

const WINDOW_TEXTURES = [
  GENERATED_TEXTURES.tileWindowLit,
  GENERATED_TEXTURES.tileWindowDark,
] as const;

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
  ) {
    const ts = tileSize || TILE_SIZE;

    for (const b of buildings) {
      this.decorateBuilding(b, ts);
    }

    // Add street-level decorations for cityblock and alleyrun
    if (layout === "cityblock" || layout === "alleyrun") {
      this.addStreetDecorations(buildings, ts);
    }

    // Set all decorations behind the tilemap
    this.group.setDepth(-5);
  }

  private decorateBuilding(b: BuildingFootprint, ts: number) {
    const px = b.x * ts;
    const py = b.y * ts;

    // Fill building interior with brick textures
    for (let ty = 1; ty < b.h - 1; ty++) {
      for (let tx = 1; tx < b.w - 1; tx++) {
        const worldX = px + tx * ts;
        const worldY = py + ty * ts;

        // Windows every 2-3 tiles, skipping edges
        if (tx % 3 === 1 && ty % 3 === 1 && ty > 1 && ty < b.h - 2) {
          const key = this.rng.pick([...WINDOW_TEXTURES]);
          const img = this.scene.add.image(
            worldX + ts / 2,
            worldY + ts / 2,
            key,
          );
          img.setDepth(-5);
          this.group.add(img);
        } else if (this.rng.chance(0.6)) {
          // Brick fill
          const key = this.rng.pick([...BRICK_TEXTURES]);
          const img = this.scene.add.image(
            worldX + ts / 2,
            worldY + ts / 2,
            key,
          );
          img.setDepth(-6);
          this.group.add(img);
        }
      }
    }

    // Fire escape on one side
    if (b.h > 10 && this.rng.chance(0.7)) {
      const onRight = this.rng.chance(0.5);
      const feX = onRight ? px + (b.w - 1) * ts : px;
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

    // Rooftop edge decoration
    for (let tx = 0; tx < b.w; tx++) {
      if (this.rng.chance(0.4)) {
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
    if (b.w >= 6 && this.rng.chance(0.6)) {
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

    // Neon sign on occasionally
    if (b.h > 8 && this.rng.chance(0.35)) {
      const signTy = this.rng.int(2, Math.min(5, b.h - 3));
      const signTx = this.rng.int(1, b.w - 2);
      const img = this.scene.add.image(
        px + signTx * ts + ts / 2,
        py + signTy * ts + ts / 2,
        GENERATED_TEXTURES.tileNeonSign,
      );
      img.setDepth(-3);
      this.group.add(img);
    }

    // Awning at ground level
    if (this.rng.chance(0.4)) {
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
    if (b.h > 12 && this.rng.chance(0.3)) {
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
  }

  private addStreetDecorations(buildings: BuildingFootprint[], ts: number) {
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
  }

  destroy() {
    this.group.destroy(true);
  }
}
