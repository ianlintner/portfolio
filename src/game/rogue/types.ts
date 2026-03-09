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

export type LayoutType = "standard" | "parkour" | "vertical" | "boss";

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
};
