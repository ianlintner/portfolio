import type { Scene } from "phaser";
import type { TilesetSpec } from "./manifest";

export type CreateTilemapFromDataOptions = {
  data: number[][];
  tileset: TilesetSpec;
  /** Scale applied to the resulting layer (for pixel-art upscaling). */
  scale?: number;
  x?: number;
  y?: number;
};

export function createTilemapFromData(
  scene: Scene,
  options: CreateTilemapFromDataOptions,
) {
  const { data, tileset } = options;
  const scale = options.scale ?? 1;
  const x = options.x ?? 0;
  const y = options.y ?? 0;

  const map = scene.make.tilemap({
    data,
    tileWidth: tileset.tileWidth,
    tileHeight: tileset.tileHeight,
  });

  const phaserTileset = map.addTilesetImage(
    tileset.key,
    tileset.key,
    tileset.tileWidth,
    tileset.tileHeight,
    tileset.tileMargin ?? 0,
    tileset.tileSpacing ?? 0,
  );

  if (!phaserTileset) {
    throw new Error(
      `Failed to create tileset '${tileset.key}'. Is it loaded via load.image()?`,
    );
  }

  const layer = map.createLayer(0, phaserTileset, x, y);
  if (!layer) {
    throw new Error(
      `Failed to create tilemap layer for tileset '${tileset.key}'.`,
    );
  }

  layer.setScale(scale);
  layer.setCollisionByExclusion([-1]);

  return { map, layer };
}
