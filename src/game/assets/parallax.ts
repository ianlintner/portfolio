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
 * Creates a simple stacked parallax background anchored to the bottom of the world.
 *
 * Works for "long layers" (non-square) and repeating backgrounds via TileSprite.
 */
export function createParallaxBackground(
  scene: Scene,
  options: CreateParallaxOptions,
) {
  const { set, worldWidth, worldHeight } = options;
  const repeatX = options.repeatX ?? true;
  const depthStart = options.depthStart ?? -100;

  const layers = [] as Phaser.GameObjects.GameObject[];

  for (let i = 1; i <= set.layerCount; i++) {
    const key = getParallaxLayerKey(set, i);
    const last = set.scrollFactors[set.scrollFactors.length - 1];
    const scrollFactor = set.scrollFactors[i - 1] ?? last ?? 0.2;

    const texHeight = getTextureSourceHeight(scene, key);
    const height = texHeight ?? worldHeight;
    const y = worldHeight - height;

    if (repeatX) {
      const tileSprite = scene.add.tileSprite(0, y, worldWidth, height, key);
      tileSprite.setOrigin(0, 0);
      tileSprite.setScrollFactor(scrollFactor, 0);
      tileSprite.setDepth(depthStart - i);
      layers.push(tileSprite);
    } else {
      const img = scene.add.image(0, y, key);
      img.setOrigin(0, 0);
      img.setScrollFactor(scrollFactor, 0);
      img.setDepth(depthStart - i);
      layers.push(img);
    }
  }

  return layers;
}
