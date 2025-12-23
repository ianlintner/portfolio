export type SpritesheetSpec = {
  key: string;
  url: string;
  frameWidth: number;
  frameHeight: number;
  margin?: number;
  spacing?: number;
};

export type ImageSpec = {
  key: string;
  url: string;
};

export type TilesetSpec = {
  /** Texture key used by Phaser and also the tileset name for Tilemap APIs. */
  key: string;
  url: string;
  tileWidth: number;
  tileHeight: number;
  tileMargin?: number;
  tileSpacing?: number;
};

export type ParallaxSetSpec = {
  /** Human-friendly name (for docs/debug). */
  name: string;
  /** Folder under /public/assets/free-city-backgrounds-pixel-art/ */
  folder: string;
  /** Key prefix; final keys become `${keyPrefix}${layerIndex}` */
  keyPrefix: string;
  layerCount: number;
  /** Foreground -> background scroll factors. */
  scrollFactors: number[];
};

/**
 * Centralized asset definitions.
 *
 * Keep Phaser texture keys stable and referenced from here.
 */
export const SPRITESHEETS = {
  cat: {
    key: "cat",
    url: "/assets/game/cat.png",
    frameWidth: 64,
    frameHeight: 64,
  },
  enemies: {
    key: "enemies",
    url: "/assets/game/enemies.png",
    frameWidth: 32,
    frameHeight: 32,
    margin: 0,
    spacing: 0,
  },
  items: {
    key: "items",
    url: "/assets/game/items.png",
    frameWidth: 32,
    frameHeight: 32,
  },
} satisfies Record<string, SpritesheetSpec>;

/** Plain images (non-animated). */
export const IMAGES = {
  alleyTiles: {
    key: "alleyTiles",
    url: "/assets/game/alley_tiles.png",
  },
} satisfies Record<string, ImageSpec>;

/**
 * Tilesets should be loaded with `load.image` (not spritesheet) for Tilemap.
 * Tile sizes MUST match the source image grid.
 */
export const TILESETS = {
  city: {
    key: "cityTiles",
    url: "/assets/city_tileset/city.png",
    tileWidth: 20,
    tileHeight: 20,
    tileMargin: 0,
    tileSpacing: 0,
  },
  retro: {
    key: "retroTiles",
    url: "/assets/retro_tileset_32x32_nogaps_final.png",
    tileWidth: 32,
    tileHeight: 32,
    tileMargin: 0,
    tileSpacing: 0,
  },
} satisfies Record<string, TilesetSpec>;

export const PARALLAX_SETS = {
  /**
   * Free City Backgrounds Pixel Art ("city 1" folder).
   * Layers are numbered 1..6 where 1 is foreground and 6 is background.
   */
  city1: {
    name: "Free City: city 1",
    folder: "city 1",
    keyPrefix: "cityParallax",
    layerCount: 6,
    scrollFactors: [0.85, 0.7, 0.55, 0.4, 0.25, 0.12],
  },
} satisfies Record<string, ParallaxSetSpec>;

export function getParallaxLayerKey(
  set: ParallaxSetSpec,
  layerIndex1Based: number,
): string {
  return `${set.keyPrefix}${layerIndex1Based}`;
}

export function getParallaxLayerUrl(
  set: ParallaxSetSpec,
  layerIndex1Based: number,
): string {
  const folderEncoded = encodeURIComponent(set.folder);
  return `/assets/free-city-backgrounds-pixel-art/${folderEncoded}/${layerIndex1Based}.png`;
}
