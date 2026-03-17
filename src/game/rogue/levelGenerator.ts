import { Rng, type Seed } from "./rng";
import { TILE, type GeneratedLevel, type LayoutType } from "./types";
import type { EnemyType } from "@/game/objects/Enemy";

export type GenerateLevelOptions = {
  seed: Seed;
  floor: number;
  widthTiles?: number;
  heightTiles?: number;
  tileSize?: number;
};

const EMPTY_TILE = TILE.EMPTY;
const GROUND_TOP_TILE = TILE.GROUND_TOP;
const GROUND_FILL_TILE = TILE.GROUND_FILL;
const PLATFORM_TILE = TILE.PLATFORM;
const ONE_WAY_TILE = TILE.ONE_WAY;
const WALL_TILE = TILE.WALL;

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
    tileIndex === PLATFORM_TILE ||
    tileIndex === ONE_WAY_TILE ||
    tileIndex === WALL_TILE
  );
}

function isStandable(tileIndex: number): boolean {
  return isSolid(tileIndex);
}

function setGroundColumn(data: number[][], x: number, groundY: number) {
  if (groundY < 0 || groundY + 2 >= data.length) return;
  data[groundY][x] = GROUND_TOP_TILE;
  if (groundY + 1 < data.length) data[groundY + 1][x] = GROUND_FILL_TILE;
  if (groundY + 2 < data.length) data[groundY + 2][x] = GROUND_FILL_TILE;
}

/* ── Layout dimensions for vertical level types ───────────────────── */

function layoutDimensions(
  layout: LayoutType,
  floor: number,
): { w: number; h: number } {
  switch (layout) {
    case "tower":
      return { w: 30, h: Math.min(60, 40 + floor) };
    case "climb":
      return { w: 50, h: Math.min(45, 30 + floor) };
    case "zigzag":
      return { w: 40, h: Math.min(50, 35 + floor) };
    default:
      // standard / parkour / vertical / boss keep caller defaults
      return { w: 90, h: 20 };
  }
}

function pickLayout(rng: Rng, floor: number): LayoutType {
  if (floor % 5 === 0) return "boss";
  // New vertical layouts unlock progressively
  if (floor >= 8 && rng.chance(0.12)) return "zigzag";
  if (floor >= 5 && rng.chance(0.15)) return "tower";
  if (floor >= 6 && rng.chance(0.15)) return "climb";
  if (floor >= 6 && rng.chance(0.18)) return "parkour";
  if (floor >= 4 && rng.chance(0.14)) return "vertical";
  return "standard";
}

/* ── Reachability validation ──────────────────────────────────────── */

/**
 * Maximum jump reach in tiles (approximate, based on jump force -550 at
 * gravity 800 and speed 200). These values are conservative to ensure the
 * base-kit player can always reach validated platforms.
 */
const MAX_JUMP_HEIGHT_TILES = 5;
const MAX_JUMP_HORIZONTAL_TILES = 6;

/**
 * Collect every surface tile that a player could stand on (the tile
 * immediately above a solid tile that is itself empty or out-of-bounds).
 */
function collectSurfaces(data: number[][], w: number, h: number) {
  const surfaces: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[y][x] !== EMPTY_TILE) continue;
      // Tile below is solid → this tile is a standable surface
      if (y + 1 < h && isStandable(data[y + 1][x])) {
        surfaces.push({ x, y });
      }
    }
  }
  return surfaces;
}

/**
 * Check whether a player standing on tile (ax, ay) can reach tile (bx, by)
 * with a single jump. Uses a simple rectangular bounding-box approximation
 * of the jump parabola.
 */
function canReach(ax: number, ay: number, bx: number, by: number): boolean {
  const dx = Math.abs(bx - ax);
  const dy = ay - by; // positive = target is above
  // Can jump up to MAX_JUMP_HEIGHT_TILES high and MAX_JUMP_HORIZONTAL_TILES wide
  if (dx > MAX_JUMP_HORIZONTAL_TILES) return false;
  if (dy > MAX_JUMP_HEIGHT_TILES) return false;
  // Can always fall down (no limit on downward distance for reachability)
  return true;
}

/**
 * BFS from player spawn surface to goal surface. Returns true if a path
 * exists using only base-kit jumps (no wall jumps required).
 */
function isPathReachable(
  data: number[][],
  w: number,
  h: number,
  spawnTile: { x: number; y: number },
  goalTile: { x: number; y: number },
): boolean {
  const surfaces = collectSurfaces(data, w, h);
  // Add spawn and goal as walkable positions if not already present
  const key = (x: number, y: number) => `${x},${y}`;
  const surfaceSet = new Set(surfaces.map((s) => key(s.x, s.y)));
  if (!surfaceSet.has(key(spawnTile.x, spawnTile.y))) {
    surfaces.push(spawnTile);
    surfaceSet.add(key(spawnTile.x, spawnTile.y));
  }
  if (!surfaceSet.has(key(goalTile.x, goalTile.y))) {
    surfaces.push(goalTile);
    surfaceSet.add(key(goalTile.x, goalTile.y));
  }

  const goalKey = key(goalTile.x, goalTile.y);
  const visited = new Set<string>();
  const queue = [spawnTile];
  visited.add(key(spawnTile.x, spawnTile.y));

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (key(cur.x, cur.y) === goalKey) return true;

    for (const s of surfaces) {
      const sk = key(s.x, s.y);
      if (visited.has(sk)) continue;
      if (canReach(cur.x, cur.y, s.x, s.y)) {
        visited.add(sk);
        queue.push(s);
      }
    }
  }
  return false;
}

/**
 * Insert bridge one-way platforms to guarantee a path from spawn to goal.
 * Runs up to `maxPasses` iterations of validate→fix.
 */
function ensureReachability(
  data: number[][],
  w: number,
  h: number,
  spawnTile: { x: number; y: number },
  goalTile: { x: number; y: number },
  rng: Rng,
  maxPasses = 8,
) {
  for (let pass = 0; pass < maxPasses; pass++) {
    if (isPathReachable(data, w, h, spawnTile, goalTile)) return;

    // Find the highest reachable surface closest to the goal
    const surfaces = collectSurfaces(data, w, h);
    const keyFn = (x: number, y: number) => `${x},${y}`;
    const visited = new Set<string>();
    const queue = [spawnTile];
    visited.add(keyFn(spawnTile.x, spawnTile.y));
    let frontier = spawnTile;
    let bestDist = Infinity;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const dist = Math.abs(cur.x - goalTile.x) + Math.abs(cur.y - goalTile.y);
      if (dist < bestDist) {
        bestDist = dist;
        frontier = cur;
      }
      for (const s of surfaces) {
        const sk = keyFn(s.x, s.y);
        if (visited.has(sk)) continue;
        if (canReach(cur.x, cur.y, s.x, s.y)) {
          visited.add(sk);
          queue.push(s);
        }
      }
    }

    // Place a 3-tile one-way bridge between frontier and goal direction
    const midX = Math.round((frontier.x + goalTile.x) / 2);
    const midY = Math.round((frontier.y + goalTile.y) / 2);
    const bridgeY = Math.max(2, Math.min(h - 3, midY));
    for (let dx = -1; dx <= 1; dx++) {
      const bx = Math.max(1, Math.min(w - 2, midX + dx));
      if (data[bridgeY][bx] === EMPTY_TILE) {
        data[bridgeY][bx] = ONE_WAY_TILE;
      }
    }
  }
}

export function generateLevel(options: GenerateLevelOptions): GeneratedLevel {
  const tileSize = options.tileSize ?? 32;
  const layout = pickLayout(
    new Rng(`${options.seed}::floor:${options.floor}`),
    options.floor,
  );
  const dims = layoutDimensions(layout, options.floor);
  const widthTiles = options.widthTiles ?? dims.w;
  const heightTiles = options.heightTiles ?? dims.h;

  const rng = new Rng(`${options.seed}::floor:${options.floor}`);
  const data = emptyGrid(widthTiles, heightTiles);
  const isBossFloor = layout === "boss";

  const groundY = heightTiles - 3;

  // ── Tower layout ─────────────────────────────────────────────────
  if (layout === "tower") {
    // Solid floor at bottom for spawn safety
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Walls on left & right edges
    for (let ty = 0; ty < heightTiles - 3; ty++) {
      data[ty][0] = WALL_TILE;
      data[ty][1] = WALL_TILE;
      data[ty][widthTiles - 1] = WALL_TILE;
      data[ty][widthTiles - 2] = WALL_TILE;
    }

    // Zigzag platforms ascending
    let platLeft = true;
    const vertSpacing = Math.max(3, 5 - Math.floor(options.floor / 8));
    let py = groundY - vertSpacing;
    while (py > 4) {
      const startX = platLeft ? 4 : Math.floor(widthTiles / 2) + 2;
      const endX = platLeft ? Math.floor(widthTiles / 2) - 2 : widthTiles - 5;
      for (let tx = startX; tx <= endX; tx++) {
        data[py][tx] = rng.chance(0.3) ? ONE_WAY_TILE : PLATFORM_TILE;
      }
      platLeft = !platLeft;
      py -= vertSpacing;
    }

    // Goal platform at top center
    const goalPlatY = 3;
    const cx = Math.floor(widthTiles / 2);
    for (let dx = -2; dx <= 2; dx++) {
      data[goalPlatY][cx + dx] = PLATFORM_TILE;
    }
  }
  // ── Climb layout ─────────────────────────────────────────────────
  else if (layout === "climb") {
    // Ground floor
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Multi-tier sections with ramps
    const tiers = Math.min(6, 3 + Math.floor(options.floor / 3));
    const tierHeight = Math.floor((heightTiles - 6) / tiers);
    for (let t = 0; t < tiers; t++) {
      const ty = groundY - (t + 1) * tierHeight;
      if (ty < 3) break;
      const startX = rng.int(4, 12);
      const platLen = rng.int(8, Math.floor(widthTiles * 0.5));
      for (let dx = 0; dx < platLen; dx++) {
        const tx = startX + dx;
        if (tx >= widthTiles - 3) break;
        // Alternate between solid and one-way
        data[ty][tx] = t % 2 === 0 ? PLATFORM_TILE : ONE_WAY_TILE;
      }

      // Add short stepping-stone platforms between tiers
      const stones = rng.int(2, 4);
      for (let s = 0; s < stones; s++) {
        const sx = rng.int(4, widthTiles - 6);
        const sy = ty + rng.int(1, Math.max(2, tierHeight - 2));
        if (sy >= heightTiles - 3 || sy < 2) continue;
        for (let dx = 0; dx < rng.int(2, 3); dx++) {
          if (sx + dx < widthTiles - 2) {
            data[sy][sx + dx] = ONE_WAY_TILE;
          }
        }
      }
    }
  }
  // ── Zigzag layout ────────────────────────────────────────────────
  else if (layout === "zigzag") {
    // Ground floor
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Switchback tiers — full-width ledges alternating left/right openings
    const switchbacks = Math.min(8, 4 + Math.floor(options.floor / 3));
    const tierSpacing = Math.floor((heightTiles - 6) / switchbacks);
    for (let s = 0; s < switchbacks; s++) {
      const ty = groundY - (s + 1) * tierSpacing;
      if (ty < 3) break;
      const openLeft = s % 2 === 0;
      const gapStart = openLeft ? 3 : widthTiles - 8;
      const gapEnd = openLeft ? 8 : widthTiles - 3;
      for (let tx = 2; tx < widthTiles - 2; tx++) {
        if (tx >= gapStart && tx <= gapEnd) continue;
        data[ty][tx] = PLATFORM_TILE;
      }
    }

    // Walls on edges
    for (let ty = 0; ty < heightTiles - 3; ty++) {
      data[ty][0] = WALL_TILE;
      data[ty][widthTiles - 1] = WALL_TILE;
    }
  }
  // ── Boss layout ──────────────────────────────────────────────────
  else if (layout === "boss") {
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);
  }
  // ── Parkour layout ───────────────────────────────────────────────
  else if (layout === "parkour") {
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
  }
  // ── Vertical layout (original) ──────────────────────────────────
  else if (layout === "vertical") {
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
  }
  // ── Standard layout ──────────────────────────────────────────────
  else {
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

  // Ensure start platform is safe
  for (let tx = 0; tx < Math.min(6, widthTiles - 1); tx++) {
    setGroundColumn(data, tx, groundY);
  }

  // Ensure end platform is safe (horizontal layouts)
  const isVerticalLayout =
    layout === "tower" || layout === "climb" || layout === "zigzag";

  if (!isVerticalLayout) {
    for (let tx = widthTiles - 7; tx < widthTiles; tx++) {
      if (tx >= 0) setGroundColumn(data, tx, groundY);
    }
  }

  // Player spawn & goal placement
  const playerTile = { x: 2, y: groundY - 1 };
  let goalTile: { x: number; y: number };

  if (layout === "tower") {
    goalTile = { x: Math.floor(widthTiles / 2), y: 2 };
  } else if (layout === "climb") {
    // Goal at top of highest tier
    const topTierY = Math.max(
      3,
      groundY -
        Math.min(6, 3 + Math.floor(options.floor / 3)) *
          Math.floor(
            (heightTiles - 6) / Math.min(6, 3 + Math.floor(options.floor / 3)),
          ),
    );
    goalTile = { x: widthTiles - 6, y: topTierY - 1 };
  } else if (layout === "zigzag") {
    const topSwitchY = Math.max(
      3,
      groundY -
        Math.min(8, 4 + Math.floor(options.floor / 3)) *
          Math.floor(
            (heightTiles - 6) / Math.min(8, 4 + Math.floor(options.floor / 3)),
          ),
    );
    goalTile = { x: Math.floor(widthTiles / 2), y: topSwitchY - 1 };
  } else if (layout === "vertical") {
    goalTile = { x: widthTiles - 6, y: Math.max(2, groundY - 10) };
  } else {
    goalTile = { x: widthTiles - 4, y: groundY - 1 };
  }

  // Reachability check for vertical layouts
  if (isVerticalLayout) {
    ensureReachability(
      data,
      widthTiles,
      heightTiles,
      playerTile,
      goalTile,
      rng,
    );
  }

  // Items: catnip occasionally on a platform near the middle.
  const items: GeneratedLevel["items"] = [];
  if (rng.chance(0.55)) {
    const ix = rng.int(
      Math.min(14, widthTiles - 4),
      Math.max(15, widthTiles - 3),
    );
    // Try to place on top of a solid tile.
    let placed = false;
    for (let yTry = 2; yTry < groundY; yTry++) {
      if (
        ix >= 0 &&
        ix < widthTiles &&
        isSolid(data[yTry][ix]) &&
        data[yTry - 1][ix] === EMPTY_TILE
      ) {
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
        pos: toPx(
          Math.min(ix, widthTiles - 2),
          Math.max(2, groundY - 4),
          tileSize,
        ),
      });
    }
  }

  // Enemies — for vertical layouts place enemies on platforms throughout the
  // level instead of only at ground level.
  const enemyCount = isBossFloor
    ? Math.min(6, 2 + Math.floor(options.floor / 4))
    : Math.min(22, 6 + options.floor * 2 + rng.int(0, 2));
  const enemies: GeneratedLevel["enemies"] = [];

  const usedPositions = new Set<string>();
  for (let i = 0; i < enemyCount; i++) {
    const type = rng.pick(ENEMY_TYPES);
    const safeMinX = Math.min(10, widthTiles - 4);
    const safeMaxX = Math.max(safeMinX + 1, widthTiles - 4);
    let ex = rng.int(safeMinX, safeMaxX);

    let attempts = 0;
    while (
      (usedPositions.has(`${ex}`) || Math.abs(ex - playerTile.x) < 6) &&
      attempts < 20
    ) {
      ex = rng.int(safeMinX, safeMaxX);
      attempts++;
    }
    usedPositions.add(`${ex}`);

    // For vertical layouts, search the full column for a surface to place on
    let placed = false;
    if (isVerticalLayout) {
      for (let ey = 2; ey < heightTiles - 1; ey++) {
        if (
          isStandable(data[ey][ex]) &&
          ey - 1 >= 0 &&
          data[ey - 1][ex] === EMPTY_TILE
        ) {
          enemies.push({ type, pos: toPx(ex, ey - 1, tileSize) });
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      for (let dx = 0; dx < 10; dx++) {
        const tx = Math.min(
          widthTiles - 2,
          Math.max(2, ex + (dx % 2 === 0 ? dx : -dx)),
        );
        if (groundY < heightTiles && isSolid(data[groundY][tx])) {
          enemies.push({ type, pos: toPx(tx, groundY - 1, tileSize) });
          placed = true;
          break;
        }
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
      const hx = rng.int(
        Math.min(8, widthTiles - 4),
        Math.max(9, widthTiles - 3),
      );
      if (groundY < heightTiles && isSolid(data[groundY][hx])) {
        hazards.push({ type: "spike", pos: toPx(hx, groundY - 1, tileSize) });
      }
    }

    if (options.floor >= 3) {
      const steamCount = Math.min(6, 1 + Math.floor(options.floor / 4));
      for (let i = 0; i < steamCount; i++) {
        const hx = rng.int(
          Math.min(12, widthTiles - 4),
          Math.max(13, widthTiles - 3),
        );
        if (groundY < heightTiles && isSolid(data[groundY][hx])) {
          hazards.push({
            type: "steam",
            pos: toPx(hx, groundY - 1, tileSize),
          });
        }
      }
    }
  }

  const collectibles: GeneratedLevel["collectibles"] = [];
  const coinCount = Math.min(28, 10 + options.floor * 2);
  for (let i = 0; i < coinCount; i++) {
    const tx = rng.int(
      Math.min(6, widthTiles - 3),
      Math.max(7, widthTiles - 2),
    );
    const ty = rng.int(3, Math.max(4, groundY - 2));
    if (
      ty < heightTiles &&
      tx < widthTiles &&
      isSolid(data[ty][tx]) &&
      ty - 1 >= 0 &&
      data[ty - 1][tx] === EMPTY_TILE
    ) {
      collectibles.push({ type: "coin", pos: toPx(tx, ty - 1, tileSize) });
    }
  }

  if (rng.chance(0.35)) {
    collectibles.push({
      type: "heart_small",
      pos: toPx(
        rng.int(Math.min(14, widthTiles - 3), Math.max(15, widthTiles - 2)),
        Math.max(2, groundY - 2),
        tileSize,
      ),
    });
  }
  if (rng.chance(0.12)) {
    collectibles.push({
      type: "gem",
      pos: toPx(
        rng.int(Math.min(18, widthTiles - 3), Math.max(19, widthTiles - 2)),
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
