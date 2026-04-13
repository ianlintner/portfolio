import { Rng, type Seed } from "./rng";
import {
  TILE,
  type GeneratedLevel,
  type LayoutType,
  type BuildingFootprint,
} from "./types";
import type { EnemyType } from "@/game/objects/Enemy";
import type { MovingPlatformSpawn } from "./types";

export type GenerateLevelOptions = {
  seed: Seed;
  floor: number;
  widthTiles?: number;
  heightTiles?: number;
  tileSize?: number;
  layoutOverride?: LayoutType;
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

/** Enemy types exclusive to vertical layouts (tower, climb, zigzag). */
const VERTICAL_ENEMY_TYPES: EnemyType[] = ["dropper", "climber"];

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
    case "boss":
      return { w: 40, h: 20 };
    case "cityblock":
      return { w: 60, h: 50 };
    case "alleyrun":
      return { w: 90, h: 35 };
    case "rooftops":
      return { w: 90, h: 40 };
    default:
      // standard / parkour / vertical keep caller defaults
      return { w: 90, h: 20 };
  }
}

function pickLayout(rng: Rng, floor: number): LayoutType {
  if (floor % 5 === 0) return "boss";
  // Periodic guaranteed rooftop-focused floor for intro-like traversal feel.
  if (floor >= 3 && floor % 7 === 0) return "rooftops";
  // Building layouts unlock progressively
  if (floor >= 3 && rng.chance(0.24)) return "rooftops";
  if (floor >= 3 && rng.chance(0.2)) return "cityblock";
  if (floor >= 2 && rng.chance(0.15)) return "alleyrun";
  // New vertical layouts unlock progressively
  if (floor >= 8 && rng.chance(0.12)) return "zigzag";
  if (floor >= 5 && rng.chance(0.15)) return "tower";
  if (floor >= 6 && rng.chance(0.15)) return "climb";
  if (floor >= 2 && rng.chance(0.2)) return "parkour";
  if (floor >= 3 && rng.chance(0.16)) return "vertical";
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
  const layout =
    options.layoutOverride ??
    pickLayout(
      new Rng(`${options.seed}::floor:${options.floor}`),
      options.floor,
    );
  const dims = layoutDimensions(layout, options.floor);
  const widthTiles = options.widthTiles ?? dims.w;
  const heightTiles = options.heightTiles ?? dims.h;

  const rng = new Rng(`${options.seed}::floor:${options.floor}`);
  const data = emptyGrid(widthTiles, heightTiles);
  const isBossFloor = layout === "boss";
  const buildings: BuildingFootprint[] = [];

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
    // Smaller arena so player and boss are close together
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Elevated platforms for tactical movement — three tiers
    // Tier 1: two mid-height platforms on left and right
    const tier1Y = groundY - 4;
    for (let dx = 0; dx < 5; dx++) {
      data[tier1Y][4 + dx] = PLATFORM_TILE;
      data[tier1Y][widthTiles - 9 + dx] = PLATFORM_TILE;
    }
    // Tier 2: center platform higher up
    const tier2Y = groundY - 7;
    const centerX = Math.floor(widthTiles / 2);
    for (let dx = -3; dx <= 3; dx++) {
      if (centerX + dx >= 2 && centerX + dx < widthTiles - 2) {
        data[tier2Y][centerX + dx] = ONE_WAY_TILE;
      }
    }
    // Tier 3: small escape platforms on the sides
    const tier3Y = groundY - 10;
    for (let dx = 0; dx < 3; dx++) {
      if (8 + dx < widthTiles - 2) data[tier3Y][8 + dx] = ONE_WAY_TILE;
      if (widthTiles - 11 + dx >= 2)
        data[tier3Y][widthTiles - 11 + dx] = ONE_WAY_TILE;
    }

    // Walls on edges to keep the fight contained
    for (let ty = 0; ty < heightTiles - 3; ty++) {
      data[ty][0] = WALL_TILE;
      data[ty][widthTiles - 1] = WALL_TILE;
    }
  }
  // ── Parkour layout ───────────────────────────────────────────────
  else if (layout === "parkour") {
    // Wider gaps between ground islands — true platforming
    for (let tx = 0; tx < widthTiles; tx++) {
      if (tx < 8 || tx > widthTiles - 9 || tx % 9 < 3) {
        setGroundColumn(data, tx, groundY);
      }
    }

    // More islands with varied sizes
    const islands = Math.min(24, 10 + Math.floor(options.floor / 2));
    for (let i = 0; i < islands; i++) {
      const px = rng.int(6, widthTiles - 8);
      const py = rng.int(groundY - 12, groundY - 3);
      const len = rng.int(2, 5);
      for (let dx = 0; dx < len; dx++) {
        const tx = px + dx;
        if (tx > 1 && tx < widthTiles - 2)
          data[py][tx] = rng.chance(0.4) ? ONE_WAY_TILE : PLATFORM_TILE;
      }
    }

    // Add a few high-altitude bonus platforms
    const highPlats = rng.int(2, 4);
    for (let i = 0; i < highPlats; i++) {
      const hx = rng.int(10, widthTiles - 12);
      const hy = rng.int(groundY - 14, groundY - 10);
      if (hy < 2) continue;
      for (let dx = 0; dx < rng.int(2, 3); dx++) {
        if (hx + dx < widthTiles - 2) data[hy][hx + dx] = ONE_WAY_TILE;
      }
    }

    // Minimal decorative buildings with rooftop/firescape routes.
    // Keep collision light (no full-height skinny columns) to avoid visual jank.
    const useParkourBuildings = rng.chance(0.62);
    if (useParkourBuildings) {
      const parkourBuildings = rng.int(1, 3);
      const usedParkourRanges: { start: number; end: number }[] = [];
      for (let b = 0; b < parkourBuildings; b++) {
        const bw = rng.int(5, 8);
        const bh = rng.int(5, 10);
        const by = groundY - bh;
        if (by < 3) continue;

        let placed = false;
        for (let attempt = 0; attempt < 16; attempt++) {
          const bx = rng.int(12, Math.max(13, widthTiles - bw - 12));
          const spanStart = bx - 3;
          const spanEnd = bx + bw + 3;
          const overlaps = usedParkourRanges.some(
            (r) => !(spanEnd < r.start || spanStart > r.end),
          );
          if (overlaps || bx + bw >= widthTiles - 3) continue;

          usedParkourRanges.push({ start: spanStart, end: spanEnd });
          buildings.push({ x: bx, y: by, w: bw, h: bh });

          // Rooftop run surface.
          for (let tx = bx; tx < bx + bw; tx++) {
            data[by][tx] = PLATFORM_TILE;
          }

          // Side fire-escape ledges for alternate ascent/descent.
          const feSide = rng.chance(0.5) ? bx - 1 : bx + bw;
          if (feSide > 1 && feSide < widthTiles - 2) {
            for (
              let ty = by + 2;
              ty < Math.min(groundY - 1, by + bh - 1);
              ty += 3
            ) {
              data[ty][feSide] = ONE_WAY_TILE;
            }
          }

          placed = true;
          break;
        }

        if (!placed) continue;
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
  // ── Cityblock layout ─────────────────────────────────────────────
  else if (layout === "cityblock") {
    // Ground strip at the very bottom
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Generate 3-5 buildings side by side with alleys between them
    const buildingCount = rng.int(3, 5);
    let cursor = 2; // starting x position
    const cityBuildings: { x: number; w: number; h: number; roofY: number }[] =
      [];

    for (let b = 0; b < buildingCount; b++) {
      const bw = rng.int(8, 16); // building width
      const bh = rng.int(15, Math.min(40, heightTiles - 8)); // building height
      const roofY = groundY - bh;
      if (cursor + bw >= widthTiles - 2) break;

      cityBuildings.push({ x: cursor, w: bw, h: bh, roofY });
      buildings.push({ x: cursor, y: roofY, w: bw, h: bh });

      // WALL on left edge
      for (let ty = roofY; ty <= groundY; ty++) {
        data[ty][cursor] = WALL_TILE;
      }
      // WALL on right edge
      for (let ty = roofY; ty <= groundY; ty++) {
        data[ty][cursor + bw - 1] = WALL_TILE;
      }
      // PLATFORM rooftop
      for (let tx = cursor; tx < cursor + bw; tx++) {
        data[roofY][tx] = PLATFORM_TILE;
      }
      // Interior floors every 5-7 tiles with ONE_WAY (like floors inside building)
      const floorSpacing = rng.int(5, 7);
      for (
        let fy = groundY - floorSpacing;
        fy > roofY + 2;
        fy -= floorSpacing
      ) {
        for (let tx = cursor + 1; tx < cursor + bw - 1; tx++) {
          // Leave a 2-tile gap for traversal
          const gapX = cursor + rng.int(2, bw - 4);
          if (tx >= gapX && tx <= gapX + 1) continue;
          data[fy][tx] = ONE_WAY_TILE;
        }
      }

      // Fire escape (ONE_WAY platforms) on exterior every 4-6 tiles
      const escapeSpacing = rng.int(4, 6);
      const escapeOnLeft = rng.chance(0.5);
      const escapeX = escapeOnLeft ? cursor - 1 : cursor + bw;
      if (escapeX > 0 && escapeX < widthTiles - 1) {
        for (
          let fy = groundY - escapeSpacing;
          fy > roofY;
          fy -= escapeSpacing
        ) {
          // 2-tile wide fire escape ledge
          const feStart = escapeOnLeft ? Math.max(1, escapeX - 1) : escapeX;
          const feEnd = escapeOnLeft
            ? escapeX + 1
            : Math.min(widthTiles - 1, escapeX + 2);
          for (let tx = feStart; tx < feEnd; tx++) {
            if (data[fy][tx] === EMPTY_TILE) {
              data[fy][tx] = ONE_WAY_TILE;
            }
          }
        }
      }

      // Alley between buildings (3-5 tiles wide)
      cursor += bw + rng.int(3, 5);
    }

    // Inter-building connecting platforms (bridge between rooftops)
    for (let i = 0; i < cityBuildings.length - 1; i++) {
      const a = cityBuildings[i];
      const b = cityBuildings[i + 1];
      const bridgeY = Math.min(a.roofY, b.roofY) + rng.int(0, 2);
      const bridgeStart = a.x + a.w;
      const bridgeEnd = b.x;
      if (bridgeEnd - bridgeStart <= MAX_JUMP_HORIZONTAL_TILES) continue; // jumpable
      // Place ONE_WAY bridge in the middle of the alley
      const midX = Math.floor((bridgeStart + bridgeEnd) / 2);
      for (let dx = -1; dx <= 1; dx++) {
        const tx = midX + dx;
        if (tx > 0 && tx < widthTiles - 1 && bridgeY > 1) {
          data[bridgeY][tx] = ONE_WAY_TILE;
        }
      }
    }
  }
  // ── Alleyrun layout ──────────────────────────────────────────────
  else if (layout === "alleyrun") {
    // Canyon-style corridor between two tall walls
    for (let tx = 0; tx < widthTiles; tx++) setGroundColumn(data, tx, groundY);

    // Tall walls on both sides forming a narrow canyon
    const canyonTop = 3;
    const wallHeight = groundY - canyonTop;

    // Left wall: runs most of the level with gaps for entry/exit
    for (let ty = canyonTop; ty <= groundY; ty++) {
      for (let tx = 0; tx < 3; tx++) data[ty][tx] = WALL_TILE;
    }
    // Right wall
    for (let ty = canyonTop; ty <= groundY; ty++) {
      for (let tx = widthTiles - 3; tx < widthTiles; tx++)
        data[ty][tx] = WALL_TILE;
    }

    // Building-like structures jutting from walls at intervals
    const structCount = rng.int(4, 7);
    for (let s = 0; s < structCount; s++) {
      const fromLeft = rng.chance(0.5);
      const sx = fromLeft ? 3 : widthTiles - 3 - rng.int(4, 8);
      const sw = rng.int(4, 8);
      const sh = rng.int(6, Math.min(15, wallHeight - 4));
      const sy = rng.int(canyonTop + 2, groundY - sh - 2);

      buildings.push({ x: sx, y: sy, w: sw, h: sh });

      for (let ty = sy; ty < sy + sh; ty++) {
        for (let tx = sx; tx < sx + sw && tx < widthTiles - 1 && tx > 0; tx++) {
          if (ty === sy) {
            data[ty][tx] = PLATFORM_TILE; // roof
          } else if (tx === sx || tx === sx + sw - 1) {
            data[ty][tx] = WALL_TILE; // walls
          }
        }
      }

      // ONE_WAY ledges on exterior for wall-jumps
      const ledgeCount = rng.int(1, 3);
      for (let l = 0; l < ledgeCount; l++) {
        const ly = sy + rng.int(2, Math.max(3, sh - 2));
        const lx = fromLeft ? sx + sw : sx - 2;
        if (lx > 1 && lx < widthTiles - 2 && ly < groundY - 1) {
          data[ly][lx] = ONE_WAY_TILE;
          if (lx + 1 < widthTiles - 2) data[ly][lx + 1] = ONE_WAY_TILE;
        }
      }
    }

    // Scattered platforms in the alley for navigation
    const alleyPlats = rng.int(6, 10);
    for (let i = 0; i < alleyPlats; i++) {
      const px = rng.int(5, widthTiles - 7);
      const py = rng.int(canyonTop + 3, groundY - 3);
      const plen = rng.int(2, 4);
      for (let dx = 0; dx < plen; dx++) {
        const tx = px + dx;
        if (tx > 3 && tx < widthTiles - 4 && data[py][tx] === EMPTY_TILE) {
          data[py][tx] = ONE_WAY_TILE;
        }
      }
    }
  }
  // ── Rooftops layout ──────────────────────────────────────────────
  else if (layout === "rooftops") {
    // Building-top hopping — a sequence of flat rooftops at varying heights
    // Minimal ground, must jump across rooftops
    // Small ground at start
    for (let tx = 0; tx < 8; tx++) setGroundColumn(data, tx, groundY);

    const rooftopCount = rng.int(6, 10);
    let rx = 9;
    let prevRoofY = groundY - 4;

    for (let r = 0; r < rooftopCount; r++) {
      const rw = rng.int(5, 12); // rooftop width
      // Height variation: up or down from previous, within jump range
      const dy = rng.int(-MAX_JUMP_HEIGHT_TILES + 1, MAX_JUMP_HEIGHT_TILES - 1);
      const roofY = Math.max(4, Math.min(groundY - 3, prevRoofY + dy));

      if (rx + rw >= widthTiles - 8) break;

      buildings.push({ x: rx, y: roofY, w: rw, h: groundY - roofY });

      // Rooftop platform
      for (let tx = rx; tx < rx + rw; tx++) {
        data[roofY][tx] = PLATFORM_TILE;
      }

      // Building body below rooftop (walls on edges, fill to ground)
      for (let ty = roofY + 1; ty <= groundY + 2; ty++) {
        if (ty < heightTiles) {
          data[ty][rx] = WALL_TILE;
          if (rx + rw - 1 < widthTiles) data[ty][rx + rw - 1] = WALL_TILE;
        }
      }

      // Optional HVAC/obstacle on rooftop (1-tile wall block)
      if (rng.chance(0.3)) {
        const ox = rx + rng.int(2, rw - 3);
        if (ox > 0 && ox < widthTiles - 1 && roofY - 1 > 1) {
          data[roofY - 1][ox] = WALL_TILE;
        }
      }

      prevRoofY = roofY;
      // Gap between buildings (must be jumpable)
      rx += rw + rng.int(2, MAX_JUMP_HORIZONTAL_TILES - 1);
    }

    // Safe landing area at end
    for (let tx = Math.max(0, widthTiles - 8); tx < widthTiles; tx++) {
      setGroundColumn(data, tx, groundY);
    }
  }
  // ── Standard layout ──────────────────────────────────────────────
  else {
    let x = 0;
    while (x < widthTiles) {
      const nearStart = x < 10;
      const nearEnd = x > widthTiles - 12;

      const gapChanceBase = 0.09;
      const gapChance = Math.min(
        0.22,
        gapChanceBase + Math.max(0, options.floor - 1) * 0.012,
      );

      if (!nearStart && !nearEnd && rng.chance(gapChance)) {
        const gapLen = rng.int(3, 6);
        x += gapLen;
        continue;
      }

      setGroundColumn(data, x, groundY);
      x += 1;
    }

    // More platforms at varying heights — creates multi-level paths
    const platformCount = Math.min(16, 4 + Math.floor(options.floor * 0.8));
    for (let i = 0; i < platformCount; i++) {
      const px = rng.int(8, widthTiles - 12);
      const py = rng.int(groundY - 10, groundY - 3);
      const len = rng.int(3, 7);

      for (let dx = 0; dx < len; dx++) {
        const tx = px + dx;
        if (tx <= 1 || tx >= widthTiles - 2) continue;
        data[py][tx] = rng.chance(0.3) ? ONE_WAY_TILE : PLATFORM_TILE;
      }
    }

    // Platform chains: sequences of small platforms requiring consecutive jumps
    if (options.floor >= 2) {
      const chains = rng.int(1, Math.min(3, 1 + Math.floor(options.floor / 3)));
      for (let c = 0; c < chains; c++) {
        let cx = rng.int(12, Math.floor(widthTiles / 2));
        let cy = rng.int(groundY - 7, groundY - 4);
        const steps = rng.int(3, 5);
        for (let s = 0; s < steps; s++) {
          const platLen = rng.int(2, 3);
          for (let dx = 0; dx < platLen; dx++) {
            if (cx + dx > 1 && cx + dx < widthTiles - 2 && cy > 2) {
              data[cy][cx + dx] = ONE_WAY_TILE;
            }
          }
          cx += rng.int(3, 5);
          cy -= rng.int(1, 3);
        }
      }
    }

    // Elevated alternate path on later floors
    if (options.floor >= 3 && rng.chance(0.6)) {
      const altY = groundY - rng.int(6, 9);
      if (altY > 2) {
        const altStart = rng.int(15, 25);
        const altEnd = rng.int(
          altStart + 12,
          Math.min(altStart + 25, widthTiles - 10),
        );
        for (let ax = altStart; ax < altEnd; ax++) {
          // Alternate between solid and gaps for challenge
          if (rng.chance(0.15)) continue;
          data[altY][ax] = ONE_WAY_TILE;
        }
      }
    }

    // Minimal decorative buildings with intentional traversal surfaces.
    // Wider footprints + short support columns prevent awkward thin wall spikes.
    const useStandardBuildings =
      options.floor >= 4 ? rng.chance(0.58) : rng.chance(0.34);
    if (useStandardBuildings) {
      const buildingCount = rng.int(2, 4);
      const usedRanges: { start: number; end: number }[] = [];
      for (let b = 0; b < buildingCount; b++) {
        const bw = rng.int(6, 11);
        const bh = rng.int(6, 12);
        const by = groundY - bh;
        if (by < 3) continue;

        let placed = false;
        for (let attempt = 0; attempt < 18; attempt++) {
          const bx = rng.int(12, Math.max(13, widthTiles - bw - 14));
          const spanStart = bx - 4;
          const spanEnd = bx + bw + 4;
          const nearSpawnOrGoal = bx < 12 || bx + bw > widthTiles - 12;
          const overlaps = usedRanges.some(
            (r) => !(spanEnd < r.start || spanStart > r.end),
          );
          if (nearSpawnOrGoal || overlaps || bx + bw >= widthTiles - 3) {
            continue;
          }

          usedRanges.push({ start: spanStart, end: spanEnd });
          buildings.push({ x: bx, y: by, w: bw, h: bh });

          // Rooftop platform as the main building challenge surface.
          for (let tx = bx; tx < bx + bw; tx++) {
            data[by][tx] = PLATFORM_TILE;
          }

          // Internal mezzanine one-way ledges (light collision, better flow).
          if (bh >= 8 && rng.chance(0.65)) {
            const midY = by + Math.floor(bh / 2);
            for (let tx = bx + 1; tx < bx + bw - 1; tx++) {
              if ((tx - bx) % 4 !== 0) data[midY][tx] = ONE_WAY_TILE;
            }
          }

          // Fire escape one-way ledges on one exterior side.
          const feSide = rng.chance(0.5) ? bx - 1 : bx + bw;
          if (feSide > 1 && feSide < widthTiles - 2) {
            for (
              let ty = by + 2;
              ty < Math.min(groundY - 1, by + bh - 1);
              ty += 3
            ) {
              data[ty][feSide] = ONE_WAY_TILE;
            }
          }

          placed = true;
          break;
        }

        if (!placed) continue;
      }
    }
  }

  // Ensure start platform is safe
  for (let tx = 0; tx < Math.min(6, widthTiles - 1); tx++) {
    setGroundColumn(data, tx, groundY);
  }
  // Clear spawn area above ground so the player doesn't spawn inside a wall
  // (cityblock / alleyrun place WALL tiles that overlap the spawn column).
  for (let tx = 0; tx < Math.min(6, widthTiles - 1); tx++) {
    for (let ty = Math.max(0, groundY - 3); ty < groundY; ty++) {
      if (data[ty][tx] !== EMPTY_TILE) {
        data[ty][tx] = EMPTY_TILE;
      }
    }
  }

  // Ensure end platform is safe (horizontal layouts)
  const isVerticalLayout =
    layout === "tower" ||
    layout === "climb" ||
    layout === "zigzag" ||
    layout === "cityblock";

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
  } else if (layout === "cityblock") {
    // Goal at the top of the tallest building (scan for highest PLATFORM)
    let highestY = groundY;
    let highestX = Math.floor(widthTiles / 2);
    for (let ty = 0; ty < heightTiles; ty++) {
      for (let tx = 0; tx < widthTiles; tx++) {
        if (data[ty][tx] === PLATFORM_TILE && ty < highestY) {
          highestY = ty;
          highestX = tx;
        }
      }
    }
    goalTile = { x: highestX + 2, y: Math.max(1, highestY - 1) };
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
    // In vertical layouts, mix in dropper and climber enemies
    let type: EnemyType;
    if (isVerticalLayout && rng.chance(0.3)) {
      type = rng.pick(VERTICAL_ENEMY_TYPES);
    } else {
      type = rng.pick(ENEMY_TYPES);
    }
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
      // Dropper: place under an overhang/ceiling (tile above is solid, tile is empty)
      if (type === "dropper") {
        for (let ey = 2; ey < heightTiles - 3; ey++) {
          if (
            ex >= 0 &&
            ex < widthTiles &&
            ey - 1 >= 0 &&
            isStandable(data[ey - 1][ex]) &&
            data[ey][ex] === EMPTY_TILE
          ) {
            enemies.push({ type, pos: toPx(ex, ey, tileSize) });
            placed = true;
            break;
          }
        }
      }
      // Climber: place adjacent to a wall tile
      else if (type === "climber") {
        for (let ey = 4; ey < heightTiles - 6; ey++) {
          // Check for wall tile to the left or right
          if (
            ex > 1 &&
            data[ey][ex - 1] === WALL_TILE &&
            data[ey][ex] === EMPTY_TILE
          ) {
            enemies.push({ type, pos: toPx(ex, ey, tileSize) });
            placed = true;
            break;
          }
          if (
            ex < widthTiles - 2 &&
            data[ey][ex + 1] === WALL_TILE &&
            data[ey][ex] === EMPTY_TILE
          ) {
            enemies.push({ type, pos: toPx(ex, ey, tileSize) });
            placed = true;
            break;
          }
        }
      } else {
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
    // Spawn boss closer to the player (1/3 of arena width, not center)
    // so the encounter begins quickly
    const bossX = Math.min(
      Math.floor(widthTiles / 3),
      Math.floor(widthTiles / 2),
    );
    enemies.push({
      type: "dog2",
      role: "boss",
      pos: toPx(bossX, groundY - 1, tileSize),
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

    // Building hazards — steam vents on building rooftops/platforms
    if (
      buildings.length > 0 &&
      (layout === "cityblock" || layout === "rooftops")
    ) {
      const buildingHazardCount = Math.min(
        buildings.length * 2,
        2 + Math.floor(options.floor / 3),
      );
      for (let i = 0; i < buildingHazardCount; i++) {
        const bld = rng.pick(buildings);
        const hx = bld.x + rng.int(1, Math.max(2, bld.w - 2));
        // Place on rooftop
        const hy = bld.y - 1;
        if (hy > 0 && hx > 0 && hx < widthTiles - 1) {
          hazards.push({
            type: rng.chance(0.5) ? "steam" : "spike",
            pos: toPx(hx, hy, tileSize),
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

  // ── Moving Platforms ──────────────────────────────────────────────
  const movingPlatforms: MovingPlatformSpawn[] = [];
  if (!isBossFloor && options.floor >= 3) {
    // Place moving platforms across gaps and in vertical sections
    const platCount = isVerticalLayout
      ? rng.int(2, Math.min(5, 2 + Math.floor(options.floor / 3)))
      : rng.int(0, Math.min(3, Math.floor(options.floor / 4)));

    for (let i = 0; i < platCount; i++) {
      const px = rng.int(
        Math.min(8, widthTiles - 10),
        Math.max(9, widthTiles - 8),
      );

      if (isVerticalLayout) {
        // Vertical movers: travel up/down between tiers
        const sy = rng.int(
          Math.max(6, Math.floor(heightTiles * 0.3)),
          Math.max(7, groundY - 6),
        );
        const ey = Math.max(4, sy - (rng.int(4, 8) * tileSize) / tileSize);
        movingPlatforms.push({
          startPos: toPx(px, sy, tileSize),
          endPos: toPx(px, Math.max(3, sy - rng.int(4, 8)), tileSize),
          speed: 30 + rng.int(0, 20),
          widthTiles: rng.int(2, 4),
        });
      } else {
        // Horizontal movers: bridge gaps
        const py = rng.int(Math.max(4, groundY - 8), Math.max(5, groundY - 3));
        movingPlatforms.push({
          startPos: toPx(px, py, tileSize),
          endPos: toPx(px + rng.int(4, 8), py, tileSize),
          speed: 35 + rng.int(0, 25),
          widthTiles: rng.int(2, 4),
        });
      }
    }
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
    movingPlatforms,
    buildings,
  };
}
