import { Rng, type Seed } from "./rng";
import type { GeneratedLevel } from "./types";
import type { EnemyType } from "@/game/objects/Enemy";

export type GenerateLevelOptions = {
  seed: Seed;
  floor: number;
  widthTiles?: number;
  heightTiles?: number;
  tileSize?: number;
};

// Phaser Tilemap convention: -1 means "no tile".
// Using 0 as empty will render tile index 0 everywhere, which can look like
// solid ground while having no collision (because we don't mark index 0 solid).
const EMPTY_TILE = -1;

const SOLID_TILE = 12;
const PLATFORM_TILE = 3;

const ENEMY_TYPES: EnemyType[] = [
  "mouse",
  "rat",
  "chipmunk",
  "rabbit",
  "snake",
  "shark",
  "lizard",
];

function emptyGrid(width: number, height: number): number[][] {
  const rows: number[][] = [];
  for (let y = 0; y < height; y++) {
    rows.push(new Array<number>(width).fill(EMPTY_TILE));
  }
  return rows;
}

function toPx(tileX: number, tileY: number, tileSize: number) {
  return {
    x: tileX * tileSize + tileSize / 2,
    y: tileY * tileSize + tileSize / 2,
  };
}

function isSolid(tileIndex: number): boolean {
  return tileIndex === SOLID_TILE || tileIndex === PLATFORM_TILE;
}

export function generateLevel(options: GenerateLevelOptions): GeneratedLevel {
  const tileSize = options.tileSize ?? 32;
  const widthTiles = options.widthTiles ?? 90;
  const heightTiles = options.heightTiles ?? 20;

  const rng = new Rng(`${options.seed}::floor:${options.floor}`);
  const data = emptyGrid(widthTiles, heightTiles);

  // A simple 2D platformer layout:
  // - a mostly-solid ground with occasional gaps
  // - some floating platforms
  const groundY = heightTiles - 3;

  // NOTE: Empty is -1. If you want decorative tiles, set them to a real tile index
  // but keep them out of the collision set.

  // Ground generation with gaps
  let x = 0;
  while (x < widthTiles) {
    // Keep spawn/goal safe zones mostly solid.
    const nearStart = x < 10;
    const nearEnd = x > widthTiles - 12;

    const gapChanceBase = 0.06;
    const gapChance = Math.min(
      0.18,
      gapChanceBase + Math.max(0, options.floor - 1) * 0.01
    );

    if (!nearStart && !nearEnd && rng.chance(gapChance)) {
      const gapLen = rng.int(2, 5);
      x += gapLen;
      continue;
    }

    data[groundY][x] = SOLID_TILE;
    // Add a second solid row beneath, to feel chunkier.
    data[groundY + 1][x] = SOLID_TILE;
    x += 1;
  }

  // Floating platforms
  const platformCount = Math.min(10, 3 + Math.floor(options.floor / 2));
  for (let i = 0; i < platformCount; i++) {
    const px = rng.int(8, widthTiles - 12);
    const py = rng.int(groundY - 8, groundY - 3);
    const len = rng.int(2, 7);

    // Avoid stacking platforms directly on top of gaps by checking for ground.
    for (let dx = 0; dx < len; dx++) {
      const tx = px + dx;
      if (tx <= 1 || tx >= widthTiles - 2) continue;
      data[py][tx] = PLATFORM_TILE;
    }
  }

  // Ensure start platform is safe.
  for (let tx = 0; tx < 6; tx++) {
    data[groundY][tx] = SOLID_TILE;
    data[groundY + 1][tx] = SOLID_TILE;
  }

  // Ensure end platform is safe.
  for (let tx = widthTiles - 7; tx < widthTiles; tx++) {
    data[groundY][tx] = SOLID_TILE;
    data[groundY + 1][tx] = SOLID_TILE;
  }

  const playerTile = { x: 2, y: groundY - 1 };
  const goalTile = { x: widthTiles - 4, y: groundY - 1 };

  // Items: catnip occasionally on a platform near the middle.
  const items: GeneratedLevel["items"] = [];
  if (rng.chance(0.55)) {
    const ix = rng.int(14, widthTiles - 18);
    // Try to place on top of a solid tile.
    let placed = false;
    for (let yTry = 2; yTry < groundY; yTry++) {
      if (isSolid(data[yTry][ix]) && data[yTry - 1][ix] === EMPTY_TILE) {
        items.push({ key: "catnip", pos: toPx(ix, yTry - 1, tileSize) });
        placed = true;
        break;
      }
    }
    if (!placed) {
      items.push({ key: "catnip", pos: toPx(ix, groundY - 4, tileSize) });
    }
  }

  // Enemies: more as floors increase.
  const enemyCount = Math.min(12, 2 + options.floor + rng.int(0, 2));
  const enemies: GeneratedLevel["enemies"] = [];

  const usedXs = new Set<number>();
  for (let i = 0; i < enemyCount; i++) {
    const type = rng.pick(ENEMY_TYPES);
    let ex = rng.int(10, widthTiles - 10);

    // Keep spacing.
    let attempts = 0;
    while (
      (usedXs.has(ex) || Math.abs(ex - playerTile.x) < 6) &&
      attempts < 20
    ) {
      ex = rng.int(10, widthTiles - 10);
      attempts++;
    }
    usedXs.add(ex);

    // Place on ground if solid; otherwise search nearby.
    let placed = false;
    for (let dx = 0; dx < 10; dx++) {
      const tx = Math.min(
        widthTiles - 2,
        Math.max(2, ex + (dx % 2 === 0 ? dx : -dx))
      );
      if (isSolid(data[groundY][tx])) {
        enemies.push({ type, pos: toPx(tx, groundY - 1, tileSize) });
        placed = true;
        break;
      }
    }

    if (!placed) {
      enemies.push({ type, pos: toPx(ex, groundY - 1, tileSize) });
    }
  }

  return {
    widthTiles,
    heightTiles,
    tileSize,
    data,
    spawn: {
      player: toPx(playerTile.x, playerTile.y, tileSize),
      goal: toPx(goalTile.x, goalTile.y, tileSize),
    },
    enemies,
    items,
  };
}
