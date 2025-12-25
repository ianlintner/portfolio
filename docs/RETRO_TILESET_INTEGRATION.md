# Retro Platformer Tileset Integration

## Overview

Integrated a new **32×32 pixel retro platformer tileset** (128×128 sheet, 4×4 tiles) into the Phaser 3 game engine. The tileset provides 16 unique tiles with support for animated water.

## Tileset Specification

- **Source**: `/public/assets/retro_tileset_32x32_nogaps_final.png`
- **Dimensions**: 128×128px (4 columns × 4 rows)
- **Per-tile size**: 32×32px
- **Margin/Spacing**: None (no gaps)
- **Phaser key**: `retroTiles` (loaded via manifest)

## Tile Indices (0–15)

### Row 0

- **0** = Brick wall
- **1** = Sidewalk / pavement
- **2** = Floor bridge (wood)
- **3** = Platform brick wall w/ top ridge

### Row 1

- **4** = Water waves frame 1
- **5** = Water waves frame 2
- **6** = Water waves frame 3
- **7** = Platform bridge (wood)

### Row 2

- **8** = Tight rope start (left post)
- **9** = Tight rope middle
- **10** = Tight rope end (right post)
- **11** = Empty / filler tile

### Row 3

- **12** = Dirt w/ grass top
- **13** = Overgrown pavement/sidewalk
- **14** = Rocks/rubble/gravel
- **15** = Extra "DEBUG" tile (optional)

## Implementation Details

### 1. Asset Manifest (`src/game/assets/manifest.ts`)

Added tileset entry:

```typescript
retro: {
  key: "retroTiles",
  url: "/assets/retro_tileset_32x32_nogaps_final.png",
  tileWidth: 32,
  tileHeight: 32,
  tileMargin: 0,
  tileSpacing: 0,
}
```

### 2. Water Animation Helper (`src/game/assets/water-animation.ts`)

New utility function `setupWaterAnimation()` handles animated water tiles:

- Cycles through indices 4 → 5 → 6 → 4 on a 180ms timer
- Uses `layer.forEachTile()` to swap tile indices efficiently
- Returns a Phaser `TimerEvent` for optional cleanup

**Usage:**

```typescript
import { setupWaterAnimation } from "../assets/water-animation";

setupWaterAnimation(this, layer, 180); // 180ms per frame
```

### 3. Tilemap Helpers (`src/game/assets/tilemap.ts`)

Existing `createTilemapFromData()` function works seamlessly:

```typescript
const { map, layer } = createTilemapFromData(this, {
  data: levelData, // 2D array of tile indices
  tileset: TILESETS.retro, // Tileset spec from manifest
  scale: 1, // Native 1:1 scale
  x: 0,
  y: 0,
});

// Set collision on solid tiles
layer.setCollision([0, 3, 12, 13, 14]);
```

### 4. Level Refactoring

All three levels (Level1, Level2, Level3) now use the retro tileset with curated level layouts:

#### Level1 (`src/game/scenes/Level1.ts`)

- **Dimensions**: 16 cols × 10 rows (512×320px)
- **Layout**:
  - Brick wall border (tile 0)
  - Platform section with platforms (tile 3)
  - Animated water section (tiles 4–6)
  - Dirt/grass ground (tile 12)
- **Enemies**: Mouse, Rat
- **Items**: Catnip (Frame 2)
- **Goal**: Golden Bowl

#### Level2 (`src/game/scenes/Level2.ts`)

- **Dimensions**: 20 cols × 6 rows (640×192px)
- **Layout**:
  - Platforms with a gap to jump across
  - Dirt/grass ground with gap mid-level
- **Enemies**: Dog
- **Goal**: Golden Bowl

#### Level3 (`src/game/scenes/Level3.ts`)

- **Dimensions**: 16 cols × 6 rows (512×192px)
- **Layout**:
  - Multiple platforms at varying heights (vertical challenge)
  - Ground gap obstacle
- **Enemies**: Snake
- **Items**: Catnip (Frame 2)
- **Goal**: Golden Bowl

## Collision Setup

All levels use these solid tiles for platform collision:

```typescript
layer.setCollision([0, 3, 12, 13, 14]);
// 0 = brick wall
// 3 = platform ridge
// 12 = dirt/grass
// 13 = overgrown pavement
// 14 = rocks/rubble
```

## Camera & Rendering

Each level configures:

```typescript
this.cameras.main.setRoundPixels(true);
this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
```

This ensures **crisp pixel-perfect rendering** on modern displays.

## Testing & Validation

### Build Results

✅ `pnpm lint` — Passed  
✅ `pnpm test` — 5 test suites, 25 tests passed  
✅ `pnpm build` — Production build succeeded  
✅ `/game` route smoke test — HTTP 200

### Backward Compatibility

- Old `city` tileset (20×20, used previously) is **retained** in manifest for potential future use
- Levels 1–3 cleanly migrated to new retro tileset without breaking other systems

## Future Extensions

1. **One-way platforms**: Set collision direction on specific tiles (e.g., ropes, bridges)
2. **Animated tiles**: Add more cycling tile types (e.g., grass, lava) using `setupWaterAnimation()` pattern
3. **Tiled JSON export**: Convert procedural data to `.json` format if larger levels needed
4. **Parallax backgrounds**: Re-enable city1 parallax set alongside retro levels for visual depth
5. **Sprite blending**: Use multi-layer tilemaps (collision vs. visual) for more detailed graphics
