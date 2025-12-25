import type { Scene } from "phaser";

export const INDUSTRIAL_TILESET_KEY = "industrialTiles";

/**
 * Tile numbers present in the CraftPix Industrial Zone tileset.
 *
 * We keep this as an explicit list (instead of generating on the fly) so it can
 * be used directly for Preloader loading.
 */
export const INDUSTRIAL_TILE_NUMBERS = Array.from(
  { length: 81 },
  (_, i) => i + 1,
) as number[];

export function getIndustrialTileKey(tileNumber: number): string {
  return `industrialTile${tileNumber}`;
}

/**
 * Returns the URL for an individual tile image.
 *
 * Note: we must URL-encode path segments that contain spaces.
 */
export function getIndustrialTileUrl(tileNumber: number): string {
  const n = String(tileNumber).padStart(2, "0");
  return `/assets/game/Free%20Industrial%20Zone%20Tileset/1%20Tiles/IndustrialTile_${n}.png`;
}

export type BuildIndustrialTilesetOptions = {
  /** Number of columns in the runtime sheet. 16 works well for 81 tiles. */
  columns?: number;
  /** Override which tile numbers to stitch. If omitted, uses INDUSTRIAL_TILE_NUMBERS. */
  tileNumbers?: readonly number[];
  /** Size of each tile in pixels. Defaults to 32. */
  tileSize?: number;
};

/**
 * Builds a Phaser canvas texture containing all industrial tiles.
 *
 * - Tile index 0 is reserved for "empty" and is left transparent.
 * - Tile index N maps to the image for tile number N.
 */
export function buildIndustrialTilesetTexture(
  scene: Scene,
  options: BuildIndustrialTilesetOptions = {},
): void {
  const columns = options.columns ?? 16;
  const tileSize = options.tileSize ?? 32;
  const tileNumbers = options.tileNumbers ?? INDUSTRIAL_TILE_NUMBERS;

  const maxTile = Math.max(0, ...tileNumbers);
  const slots = maxTile + 1; // include index 0
  const rows = Math.ceil(slots / columns);

  const width = columns * tileSize;
  const height = rows * tileSize;

  // (Re)create canvas texture
  if (scene.textures.exists(INDUSTRIAL_TILESET_KEY)) {
    scene.textures.remove(INDUSTRIAL_TILESET_KEY);
  }

  const canvasTexture = scene.textures.createCanvas(
    INDUSTRIAL_TILESET_KEY,
    width,
    height,
  );

  if (!canvasTexture) {
    throw new Error("Failed to create canvas texture for industrial tileset");
  }

  const ctx = canvasTexture.getContext();
  if (!ctx) {
    throw new Error("Failed to get 2D context for industrial tileset canvas");
  }

  // Clear to transparent
  ctx.clearRect(0, 0, width, height);

  for (const tileNumber of tileNumbers) {
    const key = getIndustrialTileKey(tileNumber);
    const img = scene.textures.get(key).getSourceImage() as
      | HTMLImageElement
      | HTMLCanvasElement
      | null;

    if (!img) {
      throw new Error(
        `Missing source image for '${key}'. Did you load it in Preloader?`,
      );
    }

    const slotIndex = tileNumber;
    const col = slotIndex % columns;
    const row = Math.floor(slotIndex / columns);
    const x = col * tileSize;
    const y = row * tileSize;

    ctx.drawImage(img, x, y, tileSize, tileSize);
  }

  canvasTexture.refresh();
}
