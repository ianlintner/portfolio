export type SpritesheetSpec = {
  key: string;
  url: string;
  frameWidth: number;
  frameHeight: number;
  margin?: number;
  spacing?: number;
};

/**
 * Optional base path for static exports hosted under a sub-path.
 *
 * Example:
 * - "" (default) -> assets resolve like "/assets/..."
 * - "/portfolio" -> assets resolve like "/portfolio/assets/..."
 */
const RAW_BASE_PATH =
  (typeof process !== "undefined" && process?.env
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : undefined) ?? "";
const NORMALIZED_BASE_PATH = RAW_BASE_PATH.replace(/\/+$/, "");

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`withBasePath expects an absolute path starting with '/', got '${path}'`);
  }

  // Empty string means "hosted at domain root".
  if (!NORMALIZED_BASE_PATH) return path;
  return `${NORMALIZED_BASE_PATH}${path}`;
}

/** Prefix for public asset URLs (used for validation/debug logging). */
export const ASSET_URL_PREFIX = withBasePath("/assets/");

export type ImageSpec = {
  key: string;
  url: string;
};

export type TilesetSpec = {
  /** Texture key used by Phaser and also the tileset name for Tilemap APIs. */
  key: string;
  /** Optional URL for tilesets loaded from disk. Runtime-built tilesets can omit this. */
  url?: string;
  tileWidth: number;
  tileHeight: number;
  tileMargin?: number;
  tileSpacing?: number;
};

export type ParallaxSetSpec = {
  /** Human-friendly name (for docs/debug). */
  name: string;
  /** Optional base path under /public/assets (absolute, starts with /assets/). */
  basePath?: string;
  /** Optional folder name appended under `basePath`. */
  folder?: string;
  /** Key prefix; final keys become `${keyPrefix}${layerIndex}` */
  keyPrefix: string;
  layerCount: number;
  /** Foreground -> background scroll factors (or background -> foreground when `foregroundFirst=false`). */
  scrollFactors: number[];

  /** If true, image 1 is foreground. If false, image 1 is background. */
  foregroundFirst?: boolean;

  /** Layer indices (1-based) that should be stretched to cover the full viewport. */
  coverLayerIndices?: number[];

  /** Controls vertical placement of each layer. */
  verticalMode?: "bottom" | "top" | "spread";

  /** Global vertical shift for the whole parallax stack (fraction of worldHeight). Positive moves UP. */
  verticalShiftY?: number;

  /** Optional normalized stops (0..1) used when `verticalMode: "spread"` (length == layerCount). */
  verticalStops?: number[];

  /** Optional per-layer vertical offsets (fraction of worldHeight). Positive moves DOWN. Keys are 1-based. */
  layerOffsetY?: Partial<Record<number, number>>;

  /** Optional solid background color drawn behind all parallax layers. Use a 0xRRGGBB number. */
  backgroundColor?: number;

  /** Uniform scale applied to all non-cover layers (e.g. 1.4 = 40% bigger). */
  layerScale?: number;
};

/**
 * Centralized asset definitions.
 *
 * Keep Phaser texture keys stable and referenced from here.
 */
export const SPRITESHEETS = {
  cat: {
    key: "cat",
    url: withBasePath("/assets/game/cat.png"),
    frameWidth: 64,
    frameHeight: 64,
  },
  enemies: {
    key: "enemies",
    url: withBasePath("/assets/game/enemies.png"),
    frameWidth: 32,
    frameHeight: 32,
    margin: 0,
    spacing: 0,
  },
  items: {
    key: "items",
    url: withBasePath("/assets/game/items.png"),
    frameWidth: 32,
    frameHeight: 32,
  },
} satisfies Record<string, SpritesheetSpec>;

/** Plain images (non-animated). */
export const IMAGES = {
  alleyTiles: {
    key: "alleyTiles",
    url: withBasePath("/assets/game/alley_tiles.png"),
  },
  catnip: {
    key: "catnip",
    url: withBasePath("/assets/game/3-Objects/Catnip.png"),
  },
  hairball: {
    key: "hairball",
    url: withBasePath("/assets/game/3-Objects/Hairball.png"),
  },
  catfoodBowl: {
    key: "catfoodBowl",
    url: withBasePath("/assets/game/3-Objects/Catfood-Bowl.png"),
  },
} satisfies Record<string, ImageSpec>;

/**
 * Tilesets should be loaded with `load.image` (not spritesheet) for Tilemap.
 * Tile sizes MUST match the source image grid.
 */
export const TILESETS: Record<string, TilesetSpec> = {
  /**
   * Industrial tileset is a prebuilt tilesheet image.
   *
   * This avoids loading 81 individual tile PNGs at startup, which can make the
   * preload bar appear stuck on slower networks/devices.
   */
  industrial: {
    key: "industrialTiles",
    url: withBasePath("/assets/game/tilesheets/industrialTiles.png"),
    tileWidth: 32,
    tileHeight: 32,
    tileMargin: 0,
    tileSpacing: 0,
  },
};

export const PARALLAX_SETS = {
  /**
   * Free Industrial Zone Tileset backgrounds.
   * Files are 1.png..5.png where 1 is the far/background (top) and 5 is the near/foreground (bottom).
   */
  industrial1: {
    name: "Industrial Zone: background 1..5",
    basePath: withBasePath("/assets/game/2-Background"),
    keyPrefix: "industrialParallax",
    layerCount: 5,
    // Background -> foreground
    scrollFactors: [0.12, 0.25, 0.4, 0.6, 0.85],
    foregroundFirst: false,
    // Vertical layout: 1 at top, 5 at bottom.
    verticalMode: "spread",
    // 1.png is a solid background; cover the full viewport.
    coverLayerIndices: [1],
    // Medium gray behind all layers.
    backgroundColor: 0x6b7280,
    // Move the stack upward a bit so we see more sky.
    verticalShiftY: 0.15,
    // Tighten spacing between layers 1 & 2.
    verticalStops: [0, 0.14, 0.5, 0.78, 1],
    // Nudge the lower industrial layers down a bit.
    layerOffsetY: {
      3: 0.05,
      4: 0.05,
      5: 0.05,
    },
    // Scale layers up to eliminate visible gaps between stacked layers.
    layerScale: 1.4,
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
  if (!set.basePath) {
    throw new Error(
      `Parallax set '${set.name}' is missing basePath; cannot build URL`,
    );
  }

  const basePathRaw = set.basePath;
  const basePath = basePathRaw.replace(/\/+$/, "");

  const folder = set.folder?.trim();
  const url = folder
    ? `${basePath}/${folder}/${layerIndex1Based}.png`
    : `${basePath}/${layerIndex1Based}.png`;

  // Use encodeURI so path separators remain intact while spaces and other
  // unsafe characters (e.g. in folder names) are encoded.
  return encodeURI(url);
}
