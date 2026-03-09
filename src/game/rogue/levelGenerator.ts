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

// In the industrial tileset, we use a distinct top vs fill tile so the ground
// doesn't look like a thin strip with a "gap" underneath.
const GROUND_TOP_TILE = 12;
const GROUND_FILL_TILE = 14;
const PLATFORM_TILE = 3;

const ENEMY_TYPES: EnemyType[] = [
  "dog1",
  "dog2",
  "cat1",
  "cat2",
  "rat1",
  "rat2",
  "bird1",
  "bird2",
];

const POWERUP_KEYS: GeneratedLevel["items"][number]["key"][] = [
  "catnip",
  "fish",
  "yarn",
  "milk",
  "feather",
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
  return (
    tileIndex === GROUND_TOP_TILE ||
    tileIndex === GROUND_FILL_TILE ||
    tileIndex === PLATFORM_TILE
  );
}

function setGroundColumn(data: number[][], x: number, groundY: number) {
  data[groundY][x] = GROUND_TOP_TILE;
  data[groundY + 1][x] = GROUND_FILL_TILE;
  data[groundY + 2][x] = GROUND_FILL_TILE;
}

function pickLayout(rng: Rng, floor: number): GeneratedLevel["layout"] {
  if (floor % 5 === 0) return "boss";
  if (floor >= 6 && rng.chance(0.18)) return "parkour";
  if (floor >= 4 && rng.chance(0.14)) return "vertical";
  return "standard";
}

export function generateLevel(options: GenerateLevelOptions): GeneratedLevel {
  const tileSize = options.tileSize ?? 32;
  const widthTiles = options.widthTiles ?? 90;
  const heightTiles = options.heightTiles ?? 20;

  const rng = new Rng(`${options.seed}::floor:${options.floor}`);
  const data = emptyGrid(widthTiles, heightTiles);
  const layout = pickLayout(rng, options.floor);
  const isBossFloor = layout === "boss";

  // A simple 2D platformer layout:
  // - a mostly-solid ground with occasional gaps
  // - some floating platforms
  // Keep the walkable surface a couple rows above the bottom, but ensure the
  // level extends to the bottom of the viewport so players don't see (or fall
  // into) an empty band under the floor.
  const groundY = heightTiles - 3;

  // NOTE: Empty is -1. If you want decorative tiles, set them to a real tile index
  // but keep them out of the collision set.

  // Ground/layout generation
  if (layout === "boss") {
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);
  } else if (layout === "parkour") {
    // Very sparse ground with denser floating islands.
    for (let tx = 0; tx < widthTiles; tx++) {
      if (tx < 8 || tx > widthTiles - 9 || tx % 9 < 4) {
        setGroundColumn(data, tx, groundY);
      }
    }

    const islands = Math.min(20, 9 + Math.floor(options.floor / 2));
    for (let i = 0; i < islands; i++) {
      const px = rng.int(6, widthTiles - 8);
      const py = rng.int(groundY - 10, groundY - 3);
      const len = rng.int(2, 4);
      for (let dx = 0; dx < len; dx++) {
        const tx = px + dx;
        if (tx > 1 && tx < widthTiles - 2) data[py][tx] = PLATFORM_TILE;
      }
    }
  } else if (layout === "vertical") {
    // Safer ground + staircase climb to goal.
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);
    const steps = Math.min(16, 10 + Math.floor(options.floor / 2));
    let stepX = 7;
    let stepY = groundY - 2;
    for (let i = 0; i < steps; i++) {
      const len = rng.int(2, 4);
      for (let dx = 0; dx < len; dx++) {
        const tx = Math.min(widthTiles - 5, stepX + dx);
        if (stepY > 2) data[stepY][tx] = PLATFORM_TILE;
      }
      stepX += rng.int(3, 5);
      stepY = Math.max(3, stepY - rng.int(1, 2));
      if (stepX > widthTiles - 10) break;
    }
  } else {
    // Standard: ground generation with gaps.
    let x = 0;
    while (x < widthTiles) {
      const nearStart = x < 10;
      const nearEnd = x > widthTiles - 12;

      const gapChanceBase = 0.06;
      const gapChance = Math.min(
        0.18,
        gapChanceBase + Math.max(0, options.floor - 1) * 0.01,
      );

      if (!nearStart && !nearEnd && rng.chance(gapChance)) {
        const gapLen = rng.int(2, 5);
        x += gapLen;
        continue;
      }

      setGroundColumn(data, x, groundY);
      x += 1;
    }

    // Floating platforms
    const platformCount = Math.min(12, 3 + Math.floor(options.floor / 2));
    for (let i = 0; i < platformCount; i++) {
      const px = rng.int(8, widthTiles - 12);
      const py = rng.int(groundY - 8, groundY - 3);
      const len = rng.int(2, 7);

      for (let dx = 0; dx < len; dx++) {
        const tx = px + dx;
        if (tx <= 1 || tx >= widthTiles - 2) continue;
        data[py][tx] = PLATFORM_TILE;
      }
    }
  }

  // Ensure start platform is safe.
  for (let tx = 0; tx < 6; tx++) {
    setGroundColumn(data, tx, groundY);
  }

  // Ensure end platform is safe.
  for (let tx = widthTiles - 7; tx < widthTiles; tx++) {
    setGroundColumn(data, tx, groundY);
  }

  const playerTile = { x: 2, y: groundY - 1 };
  const goalTile =
    layout === "vertical"
      ? { x: widthTiles - 6, y: Math.max(2, groundY - 10) }
      : { x: widthTiles - 4, y: groundY - 1 };

  // Items: catnip occasionally on a platform near the middle.
  const items: GeneratedLevel["items"] = [];
  if (rng.chance(0.55)) {
    const ix = rng.int(14, widthTiles - 18);
    // Try to place on top of a solid tile.
    let placed = false;
    for (let yTry = 2; yTry < groundY; yTry++) {
      if (isSolid(data[yTry][ix]) && data[yTry - 1][ix] === EMPTY_TILE) {
        items.push({
          key: rng.pick(POWERUP_KEYS),
          pos: toPx(ix, yTry - 1, tileSize),
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      items.push({
        key: rng.pick(POWERUP_KEYS),
        pos: toPx(ix, groundY - 4, tileSize),
      });
    }
  }

  // Enemies: for boss floors keep count low + one boss entry.
  const enemyCount = isBossFloor
    ? Math.min(6, 2 + Math.floor(options.floor / 4))
    : Math.min(22, 6 + options.floor * 2 + rng.int(0, 2));
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
        Math.max(2, ex + (dx % 2 === 0 ? dx : -dx)),
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

  if (isBossFloor) {
    enemies.push({
      type: "dog2",
      role: "boss",
      pos: toPx(Math.floor(widthTiles / 2), groundY - 1, tileSize),
    });
  }

  const hazards: GeneratedLevel["hazards"] = [];
  if (!isBossFloor) {
    const spikeCount = Math.min(10, Math.max(2, Math.floor(options.floor / 2)));
    for (let i = 0; i < spikeCount; i++) {
      const hx = rng.int(8, widthTiles - 8);
      if (isSolid(data[groundY][hx])) {
        hazards.push({ type: "spike", pos: toPx(hx, groundY - 1, tileSize) });
      }
    }

    if (options.floor >= 3) {
      const steamCount = Math.min(6, 1 + Math.floor(options.floor / 4));
      for (let i = 0; i < steamCount; i++) {
        const hx = rng.int(12, widthTiles - 12);
        if (isSolid(data[groundY][hx])) {
          hazards.push({ type: "steam", pos: toPx(hx, groundY - 1, tileSize) });
        }
      }
    }
  }

  const collectibles: GeneratedLevel["collectibles"] = [];
  const coinCount = Math.min(28, 10 + options.floor * 2);
  for (let i = 0; i < coinCount; i++) {
    const tx = rng.int(6, widthTiles - 6);
    const ty = rng.int(3, groundY - 2);
    if (isSolid(data[ty][tx]) && data[ty - 1][tx] === EMPTY_TILE) {
      collectibles.push({ type: "coin", pos: toPx(tx, ty - 1, tileSize) });
    }
  }

  if (rng.chance(0.35)) {
    collectibles.push({
      type: "heart_small",
      pos: toPx(rng.int(14, widthTiles - 14), groundY - 2, tileSize),
    });
  }
  if (rng.chance(0.12)) {
    collectibles.push({
      type: "gem",
      pos: toPx(
        rng.int(18, widthTiles - 18),
        Math.max(3, groundY - 8),
        tileSize,
      ),
    });
  }

  return {
    widthTiles,
    heightTiles,
    tileSize,
    data,
    layout,
    isBossFloor,
    spawn: {
      player: toPx(playerTile.x, playerTile.y, tileSize),
      goal: toPx(goalTile.x, goalTile.y, tileSize),
    },
    enemies,
    items,
    hazards,
    collectibles,
  };
}
