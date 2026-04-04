import type { EnemyType } from "@/game/objects/Enemy";

export type TileCoord = { x: number; y: number };
export type PixelCoord = { x: number; y: number };

export type SpawnSpec = {
  player: PixelCoord;
  goal: PixelCoord;
};

export type EnemySpawn = {
  type: EnemyType;
  pos: PixelCoord;
  role?: "normal" | "boss";
};

export type ItemSpawn = {
  key: "catnip" | "fish" | "yarn" | "milk" | "feather";
  pos: PixelCoord;
};

export type HazardType = "spike" | "steam";

export type HazardSpawn = {
  type: HazardType;
  pos: PixelCoord;
};

export type CollectibleType = "coin" | "gem" | "heart_small" | "heart_big";

export type CollectibleSpawn = {
  type: CollectibleType;
  pos: PixelCoord;
};

export type MovingPlatformSpawn = {
  startPos: PixelCoord;
  endPos: PixelCoord;
  speed?: number;
  widthTiles?: number;
};

export type LayoutType =
  | "standard"
  | "parkour"
  | "vertical"
  | "boss"
  | "tower"
  | "climb"
  | "zigzag";

/** Tile indices used by the level generator. */
export const TILE = {
  EMPTY: -1,
  PLATFORM: 3,
  WATER_1: 4,
  WATER_2: 5,
  WATER_3: 6,
  GROUND_TOP: 12,
  GROUND_DECO: 13,
  GROUND_FILL: 14,
  ONE_WAY: 15,
  WALL: 16,
} as const;

/** All tile indices that count as solid for collision. */
export const SOLID_TILES = [
  TILE.PLATFORM,
  TILE.GROUND_TOP,
  TILE.GROUND_DECO,
  TILE.GROUND_FILL,
  TILE.ONE_WAY,
  TILE.WALL,
] as const;

/** Tile indices that are only solid from above (one-way). */
export const ONE_WAY_TILES = [TILE.ONE_WAY] as const;

export type GeneratedLevel = {
  widthTiles: number;
  heightTiles: number;
  tileSize: number;
  data: number[][];
  spawn: SpawnSpec;
  layout: LayoutType;
  isBossFloor: boolean;
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  hazards: HazardSpawn[];
  collectibles: CollectibleSpawn[];
  movingPlatforms: MovingPlatformSpawn[];
};
