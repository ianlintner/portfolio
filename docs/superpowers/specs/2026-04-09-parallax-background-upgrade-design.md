# Parallax Background Upgrade via DALL-E 3

**Date:** 2026-04-09
**Status:** Draft
**Scope:** Single-set parallax background replacement using AI-generated pixel art

## Objective

Replace the current low-resolution (576x324, indexed PNG) parallax backgrounds with high-resolution (1152x648, RGBA) AI-generated pixel art, doubling visual fidelity while maintaining the industrial alley theme and the game's retro aesthetic.

## Current State

The game "Cat Adventure" uses a 5-layer parallax background system defined in `src/game/assets/manifest.ts` under `PARALLAX_SETS.industrial1`. The current assets:

| Layer | Depth Role | File | Resolution | File Size |
|-------|-----------|------|-----------|-----------|
| 1 | Sky / far background | `2-Background/1.png` | 576x324 | 1.2 KB |
| 2 | Distant buildings | `2-Background/2.png` | 576x324 | 5.7 KB |
| 3 | Mid-ground structures | `2-Background/3.png` | 576x324 | 2.4 KB |
| 4 | Near-background | `2-Background/4.png` | 576x324 | 3.6 KB |
| 5 | Foreground elements | `2-Background/5.png` | 576x324 | 2.7 KB |

These are 8-bit indexed PNGs from a free "Industrial Zone Tileset" pack. At the game's 800x600 viewport with `layerScale: 1.4`, they are stretched to roughly 3.3x their native width, causing visible pixelation.

## Solution

### Architecture

The solution has two parts:

1. **Offline generation script** (`scripts/generate-parallax.ts`) — calls OpenAI DALL-E 3 API to generate each layer, then post-processes to game-ready format
2. **Drop-in replacement** — generated images replace existing files at the same paths, requiring zero game engine code changes

### Generation Script

**Location:** `scripts/generate-parallax.ts`
**Runtime:** Node.js with TypeScript (ts-node or tsx)
**Dependencies:** `openai` (API client), `sharp` (image processing) — both as devDependencies

#### Execution Flow

1. Read `OPENAI_API_KEY` from environment
2. For each layer (1-5), call DALL-E 3 with a layer-specific prompt
3. Download the generated image
4. Post-process: resize to 1152x648, quantize colors, optimize PNG
5. Back up original to `public/assets/game/2-Background/originals/`
6. Save processed image to `public/assets/game/2-Background/{n}.png`

#### DALL-E 3 Prompts

Each prompt follows the pattern: `"Pixel art game background, [layer-specific content], industrial urban alley theme, 16-bit retro style, muted gray-brown palette with amber/orange accents, seamless horizontal tile, no text, no characters"`

| Layer | Content Description |
|-------|-------------------|
| 1 (sky) | Gradient sky from deep navy to dusty orange, distant smokestacks silhouetted on horizon, hazy atmosphere |
| 2 (far buildings) | Distant industrial skyline, factories and warehouses, water towers, faint window lights |
| 3 (mid structures) | Mid-distance industrial buildings, metal scaffolding, pipes, catwalks, cranes |
| 4 (near details) | Close industrial structures, brick walls, ventilation units, ladders, rust and grime |
| 5 (foreground) | Foreground alley elements, dumpsters, chain-link fences, pipes, fire escapes, closest to camera |

**DALL-E 3 parameters:**
- Model: `dall-e-3`
- Size: `1792x1024` (closest available aspect ratio to 16:9)
- Quality: `hd`
- Style: `natural` (less DALL-E artistic embellishment)

#### Post-Processing Pipeline (via sharp)

1. **Resize** from 1792x1024 to 1152x648 (bicubic downscale)
2. **Color quantization** to ~64 colors per layer using sharp's palette option, maintaining pixel-art aesthetic
3. **PNG optimization** with maximum compression
4. Layer 1 (sky): quantize to 128 colors instead of 64 to preserve gradient smoothness

#### Error Handling

- Retry each API call up to 3 times with exponential backoff
- Save raw DALL-E output to `public/assets/game/2-Background/raw/` before post-processing (for debugging/iteration)
- If any layer fails after retries, skip it and log which layers need manual regeneration
- Script is idempotent — safe to re-run; backs up originals only on first run

### Game Integration

**No engine code changes required.** The parallax system reads images by path convention (`{basePath}/{layerIndex}.png`).

**Optional tuning:** After generation, evaluate whether `layerScale` in `manifest.ts` should be reduced from `1.4` to `1.0-1.2` since higher-resolution images need less upscaling to fill the viewport.

### File Changes

| File | Action | Description |
|------|--------|-------------|
| `scripts/generate-parallax.ts` | Create | Generation + post-processing script |
| `package.json` | Modify | Add `openai`, `sharp` as devDependencies; add `"generate:parallax"` script |
| `.env.example` | Modify | Add `OPENAI_API_KEY=` entry |
| `.gitignore` | Modify | Add `public/assets/game/2-Background/raw/` |
| `public/assets/game/2-Background/originals/` | Create | Backup of current 1-5.png |
| `public/assets/game/2-Background/1..5.png` | Replace | AI-generated high-res parallax layers |
| `src/game/assets/manifest.ts` | Optional | Adjust `layerScale` if needed |

### Cost

- 5 DALL-E 3 HD images at ~$0.040 each = ~$0.20 total per generation run
- Additional runs for iteration: same cost

### Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| DALL-E 3 can't produce strict pixel-art grid | Color quantization + downscaling simulates the effect; prompts emphasize "16-bit retro" style |
| Layers may not feel stylistically unified | All prompts share the same theme/palette description; raw outputs saved for manual review |
| Seamless tiling may not work perfectly | Post-processing can crop/blend edges; parallax system uses TileSprite which repeats horizontally |
| Generated images too detailed for pixel-art game | Aggressive color quantization (64 colors) forces simplification |

## Success Criteria

1. All 5 parallax layers are replaced with AI-generated versions at 1152x648 resolution
2. The industrial alley theme is preserved with a cohesive look across layers
3. No visible seams or artifacts when scrolling horizontally
4. The generation script runs successfully with a single command (`npm run generate:parallax`)
5. Original assets are backed up and easily restorable
6. The game loads and displays the new backgrounds without code changes
