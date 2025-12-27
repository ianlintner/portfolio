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
};

export type ItemSpawn = {
  key: "catnip";
  pos: PixelCoord;
};

export type GeneratedLevel = {
  widthTiles: number;
  heightTiles: number;
  tileSize: number;
  data: number[][];
  spawn: SpawnSpec;
  enemies: EnemySpawn[];
  items: ItemSpawn[];
};
