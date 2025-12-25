import type { Scene } from "phaser";
import type { ParallaxSetSpec } from "./manifest";
import { getParallaxLayerKey } from "./manifest";

export type CreateParallaxOptions = {
  set: ParallaxSetSpec;
  worldWidth: number;
  worldHeight: number;
  /**
   * If true, uses TileSprites (repeatable) so the layer can scroll forever.
   * If false, uses regular Images.
   */
  repeatX?: boolean;
  depthStart?: number;
};

function getTextureSourceHeight(scene: Scene, key: string): number | undefined {
  try {
    const texture = scene.textures.get(key);
    if (!texture || texture.key === "__MISSING") return undefined;
    const src = texture.getSourceImage() as unknown as HTMLImageElement | null;
    return src?.height;
  } catch {
    return undefined;
  }
}

/**
 * Creates a parallax background stack with optional layout controls.
 *
 * Supports:
 * - foreground/background ordering via `foregroundFirst`
 * - repeating layers via TileSprite
 * - vertical placement: bottom/top/spread (+ optional stops & offsets)
 * - cover layers (stretch to world size)
 * - uniform layer scaling (non-cover)
 * - optional solid background color
 */
export function createParallaxBackground(
  scene: Scene,
  options: CreateParallaxOptions,
) {
  const { set, worldWidth, worldHeight } = options;
  const repeatX = options.repeatX ?? true;
  const depthStart = options.depthStart ?? -100;
  const foregroundFirst = set.foregroundFirst ?? true;
  const cover = new Set<number>(set.coverLayerIndices ?? []);
  const verticalMode = set.verticalMode ?? "bottom";
  const verticalStops = set.verticalStops;
  const verticalShiftPx = (set.verticalShiftY ?? 0) * worldHeight;
  const layerScale = set.layerScale ?? 1;

  const layers = [] as Phaser.GameObjects.GameObject[];

  if (typeof set.backgroundColor === "number") {
    const bg = scene.add
      .rectangle(0, 0, worldWidth, worldHeight, set.backgroundColor, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(depthStart - set.layerCount - 20);
    layers.push(bg);
  }

  // rankBgToFg: 0 = background, layerCount-1 = foreground
  const getRankBgToFg = (layerIndex1Based: number) =>
    foregroundFirst ? set.layerCount - layerIndex1Based : layerIndex1Based - 1;

  const getScrollFactorForLayer = (rankBgToFg: number) => {
    if (set.scrollFactors.length === 0) return 0;
    const idx = foregroundFirst
      ? set.layerCount - 1 - rankBgToFg
      : rankBgToFg;
    const clamped = Math.max(0, Math.min(set.scrollFactors.length - 1, idx));
    const last = set.scrollFactors[set.scrollFactors.length - 1];
    return set.scrollFactors[clamped] ?? last ?? 0.2;
  };

  const getSpreadStop = (rankBgToFg: number) => {
    if (Array.isArray(verticalStops) && verticalStops.length === set.layerCount) {
      return verticalStops[rankBgToFg] ?? (rankBgToFg / Math.max(1, set.layerCount - 1));
    }
    return rankBgToFg / Math.max(1, set.layerCount - 1);
  };

  for (let layerIndex1Based = 1; layerIndex1Based <= set.layerCount; layerIndex1Based++) {
    const key = getParallaxLayerKey(set, layerIndex1Based);
    const rankBgToFg = getRankBgToFg(layerIndex1Based);
    const scrollFactor = getScrollFactorForLayer(rankBgToFg);

    const isCover = cover.has(layerIndex1Based);
    const texHeight = getTextureSourceHeight(scene, key);
    const baseHeight = texHeight ?? worldHeight;

    // Depth: background behind, foreground in front (still behind gameplay due to negative range)
    const depth = depthStart - (set.layerCount - rankBgToFg);

    // Create object (position computed after scale/display sizing)
    const obj: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite = (() => {
      if (isCover) {
        const img = scene.add.image(0, 0, key);
        img.setOrigin(0, 0);
        img.setScrollFactor(scrollFactor, 0);
        img.setDepth(depth);
        img.setDisplaySize(worldWidth, worldHeight);
        return img;
      }

      if (repeatX) {
        const tileSprite = scene.add.tileSprite(0, 0, worldWidth, baseHeight, key);
        tileSprite.setOrigin(0, 0);
        tileSprite.setScrollFactor(scrollFactor, 0);
        tileSprite.setDepth(depth);
        tileSprite.setScale(layerScale);
        return tileSprite;
      }

      const img = scene.add.image(0, 0, key);
      img.setOrigin(0, 0);
      img.setScrollFactor(scrollFactor, 0);
      img.setDepth(depth);
      img.setScale(layerScale);
      return img;
    })();

    // Compute vertical placement.
    // For cover layers, always start at y=0.
    let y = 0;
    if (!isCover) {
      const displayHeight = obj.displayHeight ?? baseHeight;

      if (verticalMode === "top") {
        y = 0;
      } else if (verticalMode === "bottom") {
        y = worldHeight - displayHeight;
      } else {
        const stop = getSpreadStop(rankBgToFg);
        const clamped = Math.max(0, Math.min(1, stop));
        y = clamped * (worldHeight - displayHeight);
      }

      // Global shift: positive moves UP.
      y -= verticalShiftPx;

      // Per-layer offset: positive moves DOWN.
      const layerOffset = set.layerOffsetY?.[layerIndex1Based] ?? 0;
      y += layerOffset * worldHeight;
    }

    // Apply computed y (origin is 0,0)
    obj.setY(y);

    layers.push(obj);
  }

  return layers;
}
