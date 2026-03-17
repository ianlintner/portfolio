# Vertical Mechanics Plan: Cat Goes Up

## Overview

**Date:** March 16, 2026
**Goal:** Transform the platformer from a primarily horizontal run-right game into one with meaningful vertical level design — the cat must climb **up**. Levels should challenge players on both X and Y axes, with escalating difficulty, forgiving early floors, and satisfying death/retry feedback.

**Design Philosophy:** You're a cat. Cats climb. The goal is **up**.

---

## Table of Contents

1. [Vertical Level Design](#1-vertical-level-design)
2. [Block, Terrain & Platform Updates](#2-block-terrain--platform-updates)
3. [Knockback System (Nintendo-Style)](#3-knockback-system-nintendo-style)
4. [Reachability & Path Validation](#4-reachability--path-validation)
5. [Vertical Enemy Design](#5-vertical-enemy-design)
6. [Difficulty Curve & Penalty Ramp](#6-difficulty-curve--penalty-ramp)
7. [Vertical Power-Ups](#7-vertical-power-ups)
8. [Life & Hearts Mechanics](#8-life--hearts-mechanics)
9. [Death Feedback & Transitions](#9-death-feedback--transitions)
10. [Advanced Jump Mechanics](#10-advanced-jump-mechanics)
11. [Heart Power-Ups](#11-heart-power-ups)
12. [Implementation Phases](#12-implementation-phases)
13. [Technical Changes Summary](#13-technical-changes-summary)

---

## 1. Vertical Level Design

### Current State

- World is 90×20 tiles (2880×640px) — very wide, not very tall
- "Vertical" layout exists but is rare (14% chance, floor ≥ 4) and just a staircase on flat ground
- Goal is almost always at far right on ground level
- Camera offset is -140px Y (shows some upward space)

### New Direction: Tall Worlds

**Increase world height significantly.** Levels should be designed on both axes — the goal is elevated and requires climbing, not just running right.

#### New World Dimensions by Layout Type

| Layout               | Width (tiles) | Height (tiles) | Pixel Size | Goal Position        |
| -------------------- | ------------- | -------------- | ---------- | -------------------- |
| `tower` (NEW)        | 30            | 60             | 960×1920   | Top center           |
| `climb` (NEW)        | 50            | 40             | 1600×1280  | Top-right            |
| `zigzag` (NEW)       | 40            | 50             | 1280×1600  | Top-left             |
| `standard` (updated) | 90            | 30             | 2880×960   | Right side, elevated |
| `parkour` (updated)  | 90            | 30             | 2880×960   | Right side, elevated |
| `boss` (unchanged)   | 90            | 20             | 2880×640   | Center arena         |

#### Layout: Tower

- **Narrow, tall levels** — the cat must climb a vertical shaft
- Platforms alternate left-right in a spiral/zigzag pattern upward
- Ground at the bottom is a safe start zone
- Falling drops you back down (not death until very bottom pit)
- Enemies placed on platforms, blocking upward progress
- Collectibles placed in risky off-path positions

```
Goal ★
┌─────────────────────────┐
│         [===]           │  ← platform with enemy
│    [===]                │
│              [===]      │
│      [===]              │
│                [===]    │
│    [===]                │
│         [===]           │
│   [===]                 │
│             [===]       │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← ground / start
│ Player →                │
└─────────────────────────┘
```

#### Layout: Climb

- **Wide + tall** — horizontal traversal combined with vertical ascent
- Divided into "tiers" (3-5 horizontal sections stacked vertically)
- Each tier has its own ground, gaps, and platforms
- Must find the "ramp up" — a set of platforms connecting to the next tier
- Goal at the top-right

```
Tier 3:  ─────[===]──gap──[===]──★ Goal
              ↑ ramp
Tier 2:  ──gap──[===]──[===]─────
              ↑ ramp
Tier 1:  ▓▓▓▓▓▓▓▓▓▓─gap─▓▓▓▓▓▓▓▓
         Player →
```

#### Layout: Zigzag

- **Switchback climbing** — move right across a tier, then climb up, then move left across the next tier
- Direction alternates each tier (like a zigzag/switchback)
- Forces the player to traverse the full width each tier
- Enemies and hazards placed along each horizontal run
- Falling from a tier drops to the previous one (setback, not death)

```
Tier 4: ←←←←←←←←←←←← ★ Goal
                        ↑
Tier 3: →→→→→→→→→→→→→→→↑
        ↑
Tier 2: ↑←←←←←←←←←←←←←
                        ↑
Tier 1: Player →→→→→→→→↑
```

#### Updated Standard & Parkour Layouts

- Increase height from 20 to 30 tiles
- Goal position elevated: instead of `groundY - 1`, place goal at `groundY - 6` to `groundY - 12`
- Add a climbing section near the goal — require vertical platforming to reach the exit
- Floating platforms distributed more vertically (use full height range, not just `groundY - 8`)

### Camera System Updates

- **Vertical tracking**: Camera must follow player vertically, not just horizontally
- Smooth vertical follow with separate X/Y lerp factors:
  - X lerp: 0.05 (current, smooth horizontal)
  - Y lerp: 0.08 (slightly faster vertical to keep player visible)
- **Look-ahead**: Offset camera in the direction of player movement
  - Moving up: camera offset -100px Y (show more above)
  - Moving down: camera offset +60px Y (show more below)
  - Moving horizontally: current -140px Y offset
- **Dead zone**: Small dead zone around player center to prevent jitter

---

## 2. Block, Terrain & Platform Updates

### Current State

- Only 4 functional tile types: Platform (3), Ground Top (12), Ground Fill (14), Water (4-6)
- No one-way platforms, no moving platforms, no crumbling, no wall tiles
- All collision is full-tile, axis-aligned

### New Tile/Platform Types

| Tile Type               | Index | Collision       | Behavior                                             | Use Case                                           |
| ----------------------- | ----- | --------------- | ---------------------------------------------------- | -------------------------------------------------- |
| **One-Way Platform**    | 15    | Top-only        | Player passes through from below, lands on top       | Essential for vertical — jump up through platforms |
| **Wall Tile**           | 16    | Full            | Solid vertical surface for wall jumps                | Tower/climb layouts                                |
| **Crumbling Platform**  | 17    | Top-only, timed | Breaks 0.8s after player steps on, respawns 4s later | Urgency, risk/reward                               |
| **Bounce Pad**          | 18    | Top-only        | Launches player upward with 1.5× jump force          | Quick vertical traversal, secret areas             |
| **Moving Platform (H)** | 19    | Top-only        | Moves horizontally on a fixed path                   | Gap crossing                                       |
| **Moving Platform (V)** | 20    | Top-only        | Moves vertically on a fixed path                     | Vertical transport                                 |
| **Ladder Tile**         | 21    | None (special)  | Player can grab/climb at reduced speed               | Alternative vertical traversal                     |
| **Ice Platform**        | 22    | Top-only        | Reduced friction (player slides)                     | Late-game hazard                                   |
| **Sticky Wall**         | 23    | Full            | Auto-grab when touching (cling without input)        | Beginner-friendly wall sections                    |

### One-Way Platforms (Priority: Critical)

One-way platforms are the single most important addition for verticality. Without them, climbing up through a stack of platforms is impossible.

**Implementation approach:**

- Use Phaser's `Arcade.Body.checkCollision.up/down/left/right` on the tile body
- Or: Custom collision callback that only resolves when player is falling downward (`body.velocity.y > 0`) and player's feet are above the platform top
- Player can stand on them from above, jump through them from below
- Enemies also respect one-way platforms (stand on top, don't fall through)

### Moving Platforms

**Implementation approach:**

- New `MovingPlatform` class extending `Phaser.Physics.Arcade.Sprite`
- Properties: `startPos`, `endPos`, `speed`, `axis` (horizontal/vertical), `pauseDuration`
- Moves between two points in a ping-pong loop
- Player "rides" platform: when standing on it, add platform velocity to player position
- Use `body.immovable = true` so platform isn't pushed by player

### Crumbling Platforms

**Implementation approach:**

- New `CrumblingPlatform` class
- On player overlap (standing on top): start shake animation (0.3s), then crumble (0.5s), then remove collision
- After `respawnDelay` (4s): fade back in, restore collision
- Visual: flash/shake to warn player, then alpha fade + particle dust effect

### Bounce Pads

**Implementation approach:**

- Static sprite on ground/platform surface
- On player overlap from above: set `player.body.velocity.y = BOUNCE_FORCE` (e.g., -800)
- Compress/stretch animation on activation
- SFX: spring boing sound

---

## 3. Knockback System (Nintendo-Style)

### Current State

- Player takes damage, gets 2s invulnerability (red flash + transparency)
- No knockback — player stays in place after being hit
- Enemies just overlap the player hitbox

### Classic Nintendo Knockback Design

Reference: **Mega Man**, **Castlevania**, **Super Mario Bros**

When the player takes damage:

1. **Knockback vector**: Push player away from damage source
2. **Brief stun**: Player loses control for a short window
3. **Invulnerability frames (i-frames)**: Flashing sprite, can't be hit again

#### Knockback Parameters

| Parameter         | Value  | Notes                                    |
| ----------------- | ------ | ---------------------------------------- |
| `knockbackForceX` | 250    | Horizontal push away from enemy          |
| `knockbackForceY` | -200   | Slight upward pop (classic "bounce off") |
| `stunDuration`    | 350ms  | Player can't input during this           |
| `iFrameDuration`  | 2000ms | Current value, keep as-is                |
| `flashInterval`   | 100ms  | Opacity toggle speed during i-frames     |

#### Knockback Direction Logic

```
if (enemy.x < player.x)
  → knockback player to the RIGHT (+knockbackForceX)
else
  → knockback player to the LEFT (-knockbackForceX)
Always apply knockbackForceY (upward pop)
```

#### Special Cases

- **Pit knockback safety**: If knockback would push player into a pit, reduce horizontal force by 50% and increase upward force by 50%. Don't punish players with unfair pit deaths from knockback.
- **Wall knockback**: If player hits a wall during knockback, stop horizontal movement (don't bounce off walls into more enemies)
- **Hazard knockback**: Spikes/steam use a smaller knockback (150, -150) — environmental hits feel different from enemy hits
- **Aerial knockback**: If hit while jumping, use reduced knockback (60% of normal) — momentum preservation matters for platforming

#### Visual Feedback During Knockback

1. Player sprite flashes white for 1 frame (hit flash)
2. Slight screen shake (2px, 150ms) — **important for feel**
3. Brief slow-motion (0.7× game speed for 100ms) — "hit stop" effect
4. Player sprite flickers at `flashInterval` during i-frames
5. Knockback animation: player uses a "hurt" pose (arms up, startled cat)

#### Implementation in Player.ts

```typescript
// New Player properties
private isStunned: boolean = false;
private stunTimer: number = 0;
private readonly KNOCKBACK_FORCE_X = 250;
private readonly KNOCKBACK_FORCE_Y = -200;
private readonly STUN_DURATION = 350;

applyKnockback(sourceX: number): void {
  if (this.isInvulnerable) return;

  const direction = sourceX < this.x ? 1 : -1;
  this.body.velocity.x = direction * this.KNOCKBACK_FORCE_X;
  this.body.velocity.y = this.KNOCKBACK_FORCE_Y;

  this.isStunned = true;
  this.stunTimer = this.STUN_DURATION;

  // Screen shake via camera
  this.scene.cameras.main.shake(150, 0.003);
}

update(time: number, delta: number): void {
  if (this.isStunned) {
    this.stunTimer -= delta;
    if (this.stunTimer <= 0) {
      this.isStunned = false;
    }
    return; // Skip input processing while stunned
  }
  // ... normal input handling
}
```

---

## 4. Reachability & Path Validation

### The Problem

With complex vertical layouts, procedural generation may create unreachable platforms — the player gets stuck with no way to progress. This is the #1 frustration in procedural platformers.

### Solution: Reachability Graph Validation

After generating a level, run a validation pass that ensures every required platform is reachable from the player spawn.

#### Jump Reach Calculation

First, define what the player can reach:

```
Base jump:
  - Max height: ~5.5 tiles (at base jump force -550)
  - Max horizontal reach: ~6 tiles (at speed 200)
  - Combined: parabolic arc covering roughly 6 tiles wide, 5.5 tiles high

With yarn powerup (×1.25 jump):
  - Max height: ~6.8 tiles
  - Horizontal: ~7 tiles

With feather powerup (×1.4 jump):
  - Max height: ~7.7 tiles
  - Horizontal: ~8 tiles

With wall jump (if unlocked):
  - Can gain additional height by bouncing between parallel walls
  - Effectively unlimited vertical if walls are within reach

With bounce pad:
  - Max height: ~8 tiles from bounce point
```

#### Reachability Algorithm

```
function validateReachability(level: GeneratedLevel): boolean {
  1. Build a graph of all platforms (solid surface positions)
  2. For each platform, calculate which other platforms are reachable
     via base jump arc (no powerups required for critical path)
  3. BFS/DFS from player spawn to goal platform
  4. If goal is unreachable:
     a. Identify the gap in the path
     b. Insert a "bridge" platform to connect the gap
     c. Repeat validation
  5. Return true when path exists

  // For vertical layouts specifically:
  // - Every upward step must be reachable from the step below
  // - No gap between consecutive steps > 5 tiles vertical, 6 tiles horizontal
  // - At least one safe landing zone per 8 tiles of vertical height
}
```

#### Bridge Platform Insertion

When the validator finds an unreachable segment:

1. Find the highest reachable platform closest to the gap
2. Find the lowest unreachable platform in the target direction
3. Calculate midpoint position
4. Insert a one-way platform at that midpoint
5. Size: 3 tiles wide (generous landing zone)
6. Re-validate

#### Safe Landing Zones

Every vertical section must have "rest points":

- At least every 8 tiles of vertical height, there must be a platform ≥ 4 tiles wide
- These serve as checkpoints where the player can pause, assess, and plan the next jump
- Rest points should not have enemies on them (or only stationary hazards)

### Constraint: No Dead Ends

For zigzag and climb layouts:

- Every tier must have at least 2 paths upward (redundancy)
- If one path requires advanced mechanics (wall jump), the other must be doable with base jump
- Dead-end platforms can exist for collectibles, but never for the critical path

---

## 5. Vertical Enemy Design

### Current Enemy Issues for Verticality

- All enemies patrol horizontally on ground level
- Birds fly in sine waves but don't block vertical paths
- No enemies designed to challenge climbing gameplay
- Chargers only work on flat ground

### New Enemy Behaviors for Vertical Levels

#### Dropper (New Enemy Type)

- **Placement**: On ledges, overhangs, or ceiling tiles above the player's path
- **Behavior**: Waits until player is directly below, then drops straight down
- **After drop**: Patrols the platform it lands on (becomes a standard patroller)
- **Counter**: Look up before jumping, time your approach
- **HP**: 1
- **Visual**: Clinging to ceiling, eyes track player

#### Climber (New Enemy Type)

- **Placement**: On wall tiles in tower layouts
- **Behavior**: Moves up and down along wall surfaces
- **Patrol range**: 4-8 tiles vertically
- **Damage**: Contact damage when player wall-jumps into one
- **Counter**: Time wall jumps to avoid them, or stomp from above
- **HP**: 1
- **Visual**: Gecko/spider-like creature on walls

#### Floater (New Enemy Type)

- **Placement**: In open vertical shafts
- **Behavior**: Hovers at a fixed height, moves in a slow circle (radius 2-3 tiles)
- **Acts as**: Mobile obstacle blocking jump paths
- **Counter**: Jump over/under, or shoot with hairball
- **HP**: 1
- **Visual**: Floating ghostly enemy, bobbing gently

#### Bomber (New Enemy Type)

- **Placement**: On high platforms looking down
- **Behavior**: Drops projectiles (bombs/acorns) downward at intervals
- **Range**: Drops projectiles every 2.5s when player is within 6 tiles horizontal
- **Counter**: Dodge projectiles while climbing, reach and stomp from above
- **HP**: 2
- **Visual**: Enemy on a platform, tosses objects over the edge

### Existing Enemy Vertical Adaptations

| Enemy                     | Vertical Adaptation                                                            |
| ------------------------- | ------------------------------------------------------------------------------ |
| **dog1/cat1** (patroller) | Patrol on elevated platforms, turn at edges (already works)                    |
| **dog2/cat2** (charger)   | On elevated platforms: can charge off edge toward player below (leap attack)   |
| **rat2** (shooter)        | Place on high platforms — shoots downward at angle toward player               |
| **bird1/bird2** (flyer)   | In vertical shafts: fly in horizontal sine wave pattern, blocking upward paths |

### Enemy Placement for Vertical Layouts

```
Tower layout:
- 1 enemy per 2-3 platforms (not every platform — give breathing room)
- Droppers on overhangs above the main climbing path
- Climbers on walls in areas with wall jumps
- Bombers on high platforms raining projectiles down

Climb layout:
- Patrollers on each tier's horizontal runs
- Flyers near the "ramp up" sections between tiers
- Shooters on high ground aiming down at the tier below

Zigzag layout:
- Patrollers on each switchback
- Floaters in the vertical transition zones
- Chargers on long horizontal runs (same as standard)
```

---

## 6. Difficulty Curve & Penalty Ramp

### Design Principle: Fail Forward on Floor 1, Feel Consequences by Floor 5+

### Floor 1: The Tutorial Garden

**Goal**: Teach mechanics with minimal punishment

- **Platforming**: Simple, wide platforms with short gaps (2 tiles max)
- **Vertical**: Minimal — goal is only slightly elevated (2-3 platforms up)
- **Enemies**: 2-3 basic patrollers, widely spaced
- **Fall penalty**: Falling returns player to the nearest platform below (not floor restart)
- **Knockback**: Reduced by 50% (gentler hits)
- **Death penalty**: Instant respawn in place (no life lost on floor 1)
- **Visual cues**: Arrows/sparkle particles pointing toward the goal
- **Checkpoint**: Midway checkpoint (coin-operated is too punishing here — free)

### Floors 2-4: Learning Phase

- **Platforming**: Introduce gaps of 3-4 tiles, one-way platforms
- **Vertical**: Goal elevated 5-8 tiles above ground
- **Enemies**: 4-8, mixed patrollers and 1-2 chargers
- **Fall penalty**: Fall to nearest platform below if one exists; fall to ground if none
- **Death penalty**: Lose 1 life, restart floor (current behavior)
- **New mechanic introduced each floor**:
  - Floor 2: One-way platforms
  - Floor 3: Crumbling platforms
  - Floor 4: Moving platforms

### Floors 5-9: Competence Phase

- **Platforming**: Precision jumps (4-5 tile gaps), multiple vertical tiers
- **Vertical**: Tower and climb layouts start appearing
- **Enemies**: 10-14, all types represented, some vertical enemies
- **Fall penalty**: Fall far back — landing on a lower tier (significant setback but not death)
- **Knockback**: Full force — can knock into pits
- **New challenges**: Boss at floor 5, wall jumps unlock

### Floors 10-14: Mastery Phase

- **Platforming**: Expert-level — small platforms, long gaps, crumbling paths
- **Vertical**: Tall towers (60 tile height), zigzag layouts
- **Enemies**: 15-18, with vertical enemies (droppers, climbers, bombers)
- **Fall penalty**: Falling from upper tiers means significant replay of climbing sections
- **Death**: Meaningful — restart from bottom of the vertical section
- **Checkpoints**: Available but require coins to activate (risk/reward)

### Floors 15+: Endurance Phase

- **Platforming**: Near-pixel-perfect in spots, crumbling + moving combos
- **Vertical**: Maximum height levels, multiple required paths
- **Enemies**: Full density with all vertical types
- **Fall penalty**: Falling from near the top to the bottom is emotionally devastating (by design)
- **Checkpoints**: Expensive but critical — players learn to budget coins

### Penalty Scaling Table

| Floor | Fall → Ground             | Fall → Pit                       | Death Penalty         | Knockback         | Checkpoint       |
| ----- | ------------------------- | -------------------------------- | --------------------- | ----------------- | ---------------- |
| 1     | Return to nearby platform | Respawn on ground (no life lost) | Respawn in place      | 50% force         | Free, automatic  |
| 2-4   | Return to lower platform  | Lose 1 life, restart floor       | Standard              | 75% force         | Free at midpoint |
| 5-9   | Fall to lower tier        | Lose 1 life, restart floor       | Standard              | 100% force        | Cost: 10 coins   |
| 10-14 | Fall to lower tier        | Lose 1 life, restart floor       | Standard + lose coins | 100% force        | Cost: 25 coins   |
| 15+   | Fall to bottom            | Lose 1 life, restart floor       | Standard + lose coins | 100% + pit danger | Cost: 50 coins   |

---

## 7. Vertical Power-Ups

### New Power-Ups for Climbing

| Power-Up            | Visual             | Effect                                              | Duration | Rarity    | Floors      |
| ------------------- | ------------------ | --------------------------------------------------- | -------- | --------- | ----------- |
| **Catnip+**         | Glowing green leaf | Shoot hairballs upward (aim up while shooting)      | 30s      | Common    | All         |
| **Spring Boots**    | Bouncy shoes       | Jump height ×1.6, auto-bounce off enemies           | 12s      | Uncommon  | 3+          |
| **Hover Tuna**      | Floating fish      | Hold jump to hover in place for 2s (ledge recovery) | 1 use    | Rare      | 5+          |
| **Magnet Yarn**     | Sparking yarn ball | Pull toward nearest platform above (grapple assist) | 8s       | Rare      | 8+          |
| **Gravity Flip**    | Swirling arrows    | Reverse gravity for 6s (walk on ceilings)           | 6s       | Very Rare | 12+         |
| **Nine Lives Star** | Golden star        | Invincibility + super jump + no knockback           | 8s       | Very Rare | Boss floors |

### Existing Power-Up Adjustments for Verticality

| Power-Up    | Current         | Vertical Adjustment                                                    |
| ----------- | --------------- | ---------------------------------------------------------------------- |
| **Yarn**    | Jump ×1.25, 9s  | Increase to ×1.35, 12s — more useful for vertical sections             |
| **Feather** | Jump ×1.4, 7s   | Add slow-fall effect (hold jump while falling = 40% fall speed)        |
| **Fish**    | Speed ×1.45, 8s | Also applies to climbing speed on ladders, wall-slide speed            |
| **Milk**    | Heal 1 heart    | Also grants 3s of knockback immunity (clutch while climbing)           |
| **Catnip**  | Enable shooting | Hairballs can now be aimed (up/down/diagonal) based on input direction |

### Power-Up Placement in Vertical Levels

- Place power-ups at "decision points" — where the player must choose between a safe path and a risky path
- The risky path has the power-up; the safe path has none
- **Hover Tuna** placed near difficult jumping sections (recovery tool)
- **Spring Boots** placed before major climbing sections
- **Magnet Yarn** placed in open shafts with sparse platforms (otherwise unreachable areas)

---

## 8. Life & Hearts Mechanics

### Current State

- 3 max hearts (can increase)
- 3 lives
- Lose all hearts → lose 1 life, restart floor with full hearts
- Lose all lives → Game Over

### Updated Life System

#### Hearts (Per-Life Health)

| Parameter                    | Floor 1 | Floors 2-9 | Floors 10+              |
| ---------------------------- | ------- | ---------- | ----------------------- |
| Starting max hearts          | 3       | 3          | 3                       |
| Max possible hearts          | 5       | 7          | 9                       |
| Hearts restored on life loss | Full    | Full       | 75% of max (rounded up) |
| Heart drops from enemies     | 15%     | 10%        | 5%                      |
| Heart collectibles in level  | 2-3     | 1-2        | 0-1                     |

#### Lives

| Parameter             | Value                      | Notes                    |
| --------------------- | -------------------------- | ------------------------ |
| Starting lives        | 3                          | Same as current          |
| Max lives             | 9 (it's a cat!)            | Cap to prevent hoarding  |
| Extra life cost       | 100 coins                  | At shops every 10 floors |
| Extra life from score | Every 5000 points          | Classic 1-up mechanic    |
| Extra life from boss  | +1 life on first boss kill | Incentive to fight       |

#### Max Heart Increase Sources

- **Heart Container**: Rare collectible hidden in levels (increases max by 1, permanently for the run)
- **Boss defeat**: First kill of each boss tier grants +1 max heart
- **Shop purchase**: 200 coins = +1 max heart (once per shop visit)

---

## 9. Death Feedback & Transitions

### Current Problem

> "Death transition is too sudden — don't know I died"

Currently: player dies → instant `scene.restart()` or `scene.start("GameOver")`. No transition, no feedback, no moment of understanding.

### Reference: How Classic Games Handle Death

| Game                 | Death Feedback                                                            | Duration | Why It Works                                |
| -------------------- | ------------------------------------------------------------------------- | -------- | ------------------------------------------- |
| **Super Mario Bros** | Mario shrinks/falls, death jingle, "Lives -1" text, brief pause           | ~3s      | Clear visual + audio cue, moment to process |
| **Mega Man**         | Explosion particles, screen pause, teleport-out animation                 | ~2s      | Dramatic, clear signal                      |
| **Celeste**          | Quick screen flash, respawn particles at checkpoint, minimal disruption   | ~0.5s    | Fast restart preserves flow                 |
| **Hollow Knight**    | Slow-motion, screen darkens, death sound, shade spawns                    | ~2s      | Atmospheric, lore-integrated                |
| **Shovel Knight**    | Knockback + death burst, gold drops, fade to black, respawn at checkpoint | ~3s      | Clear feedback + consequences visible       |

### New Death Sequence

#### Phase 1: Hit Reaction (0-200ms)

1. **Hit stop**: Freeze game for 100ms (everything pauses — the "impact frame")
2. **Screen flash**: Quick white flash overlay (50ms, 30% opacity)
3. **Camera shake**: Strong shake (4px, 200ms)
4. **SFX**: Current `playerDeath()` sound plays

#### Phase 2: Death Animation (200-1200ms)

1. **Player animation**: Cat does a dramatic tumble/spin animation (flip upward, then fall)
2. **Slow motion**: Game runs at 0.3× speed for 500ms
3. **Particle burst**: Small hearts/sparkles emit from player position
4. **Enemy freeze**: All enemies pause in place (focus on player's death)
5. **Tint**: Screen desaturates slightly (30% desaturation)

#### Phase 3: Death Info (1200-2500ms)

1. **Fade**: Screen fades to dark (70% black overlay, not full black)
2. **Lives display**: Show remaining lives with animation:
   ```
   ♥ ♥ ♡   (one heart goes from filled to empty, with a crack animation)
   Lives: 2
   ```
3. **Text**: Brief message based on death type:
   - Pit: "Watch your step..."
   - Enemy: "That dog was trouble..."
   - Hazard: "Hot hot hot!"
   - Knockback into pit: "Knocked off course!"
4. **Hold**: 600ms pause on this screen

#### Phase 4: Respawn (2500-3500ms)

1. **If lives remain**:
   - Fade info screen to level (or restart level)
   - Player materializes at spawn/checkpoint with a "teleport in" particle effect
   - 1.5s invulnerability on spawn (brief i-frames to prevent instant re-death)
   - Camera smoothly pans to player

2. **If no lives remain (Game Over)**:
   - Fade to full black
   - "GAME OVER" text with score display
   - Slow fade-in of final stats:
     ```
     Floors Cleared: 7
     Enemies Defeated: 34
     Coins: 248
     Final Score: 4,820
     ```
   - "Try Again" button appears after 1s delay (prevent accidental click)

#### Implementation: Death Sequence Manager

```typescript
// New file: src/game/systems/DeathSequence.ts

class DeathSequence {
  private scene: Phaser.Scene;
  private phase: "idle" | "hit" | "animate" | "info" | "respawn";

  startDeath(cause: "pit" | "enemy" | "hazard" | "knockback"): void {
    this.phase = "hit";
    // Phase 1: Hit stop + flash
    this.scene.time.timeScale = 0; // freeze
    this.scene.time.delayedCall(100, () => {
      this.scene.time.timeScale = 0.3; // slow-mo
      this.phase = "animate";
      // Play death anim, particles, etc.
      this.scene.time.delayedCall(1000, () => {
        this.scene.time.timeScale = 1;
        this.phase = "info";
        this.showDeathInfo(cause);
      });
    });
  }

  private showDeathInfo(cause: string): void {
    // Show overlay with lives remaining + message
    // After 1.3s: fade overlay → respawn or game over
  }
}
```

### Quick-Retry for Floor 1

On Floor 1 specifically, use **Celeste-style fast restart**:

- Death flash (100ms)
- Quick particle burst
- Instant respawn at nearest safe spot (no full death sequence)
- Total time: ~0.5s
- This teaches players that death is quick and painless here, encouraging experimentation

---

## 10. Advanced Jump Mechanics

### Wall Slide & Wall Jump

**When**: Available from the start on vertical layouts; unlocked at floor 5 for standard layouts (per existing redesign plan).

#### Wall Slide

- **Trigger**: Player is airborne + pressing into a wall tile + falling
- **Effect**: Reduced fall speed (gravity × 0.3)
- **Visual**: Cat clings to wall with extended claws, slides down slowly
- **Duration**: Unlimited while pressing into wall
- **Exit**: Release direction key (fall normally) or jump (wall jump)
- **Dust particles**: Small puff particles at wall contact point

#### Wall Jump

- **Trigger**: While wall sliding, press Jump
- **Effect**: Launch away from wall at 45° angle upward
  - X velocity: ±300 (away from wall)
  - Y velocity: -450 (weaker than ground jump to prevent infinite climb)
- **Input window**: 150ms after releasing wall (coyote time for wall)
- **Cooldown**: None (can chain wall jumps between parallel walls)
- **Visual**: Push-off animation, dust puff on wall
- **Sound**: Different SFX from ground jump (scraping/pushing sound)

#### Wall Jump Between Parallel Walls

When two walls are within 3-6 tiles of each other, the player can bounce between them to climb:

```
 ┃     ┃
 ┃  3→ ┃  (jump right)
 ┃ ←2  ┃  (jump left)
 ┃  1→ ┃  (jump right)
 ┃ cat ┃  (start: wall slide left wall)
 ┃▓▓▓▓▓┃
```

### Double Jump (Optional, Floor 10+)

- **Trigger**: Press Jump while airborne (once per airborne sequence)
- **Effect**: Full upward velocity (-500, slightly less than ground jump)
- **Reset**: Resets on landing, on wall jump, or on bounce pad
- **Visual**: Small puff cloud at player's feet, brief sparkle trail
- **Sound**: Lighter, airy version of jump SFX
- **Balancing**: Only available on floors 10+ or found as a rare power-up

### Variable Jump Height

Currently the jump force is fixed at -550. Add **variable jump height** based on how long the jump button is held:

- **Tap jump** (< 100ms): Jump force -350 (short hop)
- **Hold jump** (100-250ms): Jump force -550 (current full jump)
- **Implementation**: On jump button released while ascending, set Y velocity to max(velocity.y, -200) — cut the jump short

This gives players fine control over jump arcs, which is essential for precise vertical platforming.

### Coyote Time

Allow a small window after walking off a platform edge where the player can still jump:

- **Window**: 80ms after leaving ground
- **Effect**: Player can press jump within this window and still get a ground jump
- **Implementation**: Track `lastGroundedTime`; allow jump if `time - lastGroundedTime < 80`
- **Why**: Makes platforming feel fair — slightly missing the edge of a platform doesn't feel like a mistake

### Jump Buffering

If the player presses jump just before landing, buffer the input and execute it on landing:

- **Buffer window**: 100ms before landing
- **Effect**: Jump executes immediately on ground contact
- **Implementation**: Track `lastJumpPressTime`; on landing, if `time - lastJumpPressTime < 100`, auto-jump
- **Why**: Makes rapid jumping feel responsive, critical for climbing sequences

---

## 11. Heart Power-Ups

### Current Heart Collectibles

- `heart_small`: Heals 1 heart
- `heart_big`: (referenced but may not be generated frequently)

### New Heart Items

| Item                       | Effect                                    | Spawn Location                      | Rarity                   |
| -------------------------- | ----------------------------------------- | ----------------------------------- | ------------------------ |
| **Heart Small** (existing) | Heal 1 heart                              | Random on solid ground              | Common (35% per level)   |
| **Heart Big** (existing)   | Heal 2 hearts                             | Hidden/high platforms               | Uncommon (12% per level) |
| **Heart Container** (NEW)  | +1 max hearts (permanent for run)         | Boss rewards, secret areas          | Rare (1 per 5 floors)    |
| **Healing Spring** (NEW)   | Full heal (all hearts) + brief regen aura | Secret rooms behind breakable walls | Very Rare                |
| **Heart Shield** (NEW)     | Next hit does 0 damage (absorbs 1 hit)    | Dropped by mini-bosses              | Rare                     |

### Heart Drop from Enemies

- Basic enemies (1 HP): 10% chance to drop `heart_small`
- Tough enemies (2+ HP): 15% chance to drop `heart_small`, 5% chance to drop `heart_big`
- Boss enemies: Always drop `heart_container` on first kill

### Heart Economy Balance

The goal is tension — the player should usually be at 1-2 hearts, rarely at full:

- Hearts heal a fixed amount, not percentage
- Enemy damage scales: floor 1-9 = 1 heart per hit, floor 10+ = 1-2 hearts per hit
- Knockback into hazards can chain for 2 hearts quickly (spike + enemy combo)
- Vertical levels have hearts placed on risky off-path platforms (risk for reward)

---

## 12. Implementation Phases

### Phase 1: Core Vertical Infrastructure (Must-Have)

**Estimated scope: Foundation for everything else**

1. **One-way platforms** — New tile type, collision filtering
2. **Extended world height** — `heightTiles` configurable, camera vertical follow
3. **Tower layout generator** — New layout type with vertical platform placement
4. **Reachability validator** — BFS-based path checking from spawn to goal
5. **Knockback system** — Directional push + stun on damage
6. **Variable jump height** — Tap vs hold jump
7. **Coyote time + jump buffering** — Input forgiveness

### Phase 2: Movement & Enemies

8. **Wall slide + wall jump** — New movement mechanic
9. **Wall tiles** — Solid vertical surfaces for wall jumping
10. **Dropper enemy** — Ceiling-based enemy
11. **Climber enemy** — Wall-patrolling enemy
12. **Climb layout generator** — Multi-tier horizontal+vertical layout
13. **Moving platforms** — Horizontal and vertical movers

### Phase 3: Death & Feedback

14. **Death sequence system** — Multi-phase death animation + info screen
15. **Floor 1 easy mode** — Reduced penalties, fast restart
16. **Checkpoint system** — Mid-level save points
17. **Camera look-ahead** — Direction-based camera offset

### Phase 4: Power-Ups & Polish

18. **New vertical power-ups** — Spring Boots, Hover Tuna, Magnet Yarn
19. **Heart Container collectible** — Permanent max heart increase
20. **Heart Shield** — 1-hit absorb item
21. **Zigzag layout generator** — Switchback climbing layout
22. **Crumbling platforms** — Timed breakable platforms
23. **Bounce pads** — Spring launchers
24. **Existing power-up adjustments** — Feather slow-fall, aimed Catnip shots

### Phase 5: Advanced Features

25. **Double jump** — Optional late-game mechanic
26. **Ladder tiles** — Alternative climbing method
27. **Bomber enemy** — Elevated projectile dropper
28. **Floater enemy** — Hovering obstacle in vertical shafts
29. **Difficulty-based penalty scaling** — Floor-dependent fall/death consequences
30. **Gravity Flip power-up** — Late-game ceiling walking

---

## 13. Technical Changes Summary

### New Files

| File                                        | Purpose                                  |
| ------------------------------------------- | ---------------------------------------- |
| `src/game/systems/DeathSequence.ts`         | Multi-phase death animation manager      |
| `src/game/systems/KnockbackSystem.ts`       | Directional knockback + stun logic       |
| `src/game/systems/ReachabilityValidator.ts` | BFS path validation for generated levels |
| `src/game/systems/CheckpointManager.ts`     | Mid-level checkpoint save/restore        |
| `src/game/objects/MovingPlatform.ts`        | Horizontal/vertical moving platform      |
| `src/game/objects/CrumblingPlatform.ts`     | Timed breakable platform                 |
| `src/game/objects/BouncePad.ts`             | Spring launcher pad                      |
| `src/game/objects/EnemyDropper.ts`          | Ceiling-drop enemy (or Enemy.ts variant) |
| `src/game/objects/EnemyClimber.ts`          | Wall-patrol enemy (or Enemy.ts variant)  |

### Modified Files

| File                               | Changes                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/game/objects/Player.ts`       | Knockback, wall slide/jump, variable jump, coyote time, jump buffer, stun state               |
| `src/game/objects/Enemy.ts`        | New behavior types (dropper, climber, floater, bomber), vertical placement                    |
| `src/game/rogue/levelGenerator.ts` | Tower/climb/zigzag layouts, extended height, one-way platforms, wall tiles, reachability pass |
| `src/game/rogue/types.ts`          | New layout types, new tile indices, new enemy types in type definitions                       |
| `src/game/scenes/RogueRun.ts`      | New collision groups, death sequence integration, checkpoint handling, camera updates         |
| `src/game/scenes/UIScene.ts`       | Heart container display, checkpoint indicator, death info overlay                             |
| `src/game/scenes/GameOver.ts`      | Enhanced stats display, score breakdown                                                       |
| `src/game/scenes/MainMenu.ts`      | Tutorial/floor-1 easy mode flag                                                               |
| `src/game/audio/SFXLibrary.ts`     | Wall jump, wall slide, bounce, crumble, checkpoint, death sequence SFX                        |
| `src/game/config.ts`               | New constants for knockback, wall jump, coyote time, jump buffer                              |

### New Constants (for `config.ts` or inline)

```typescript
// Knockback
KNOCKBACK_FORCE_X = 250;
KNOCKBACK_FORCE_Y = -200;
STUN_DURATION_MS = 350;

// Wall mechanics
WALL_SLIDE_GRAVITY_FACTOR = 0.3;
WALL_JUMP_FORCE_X = 300;
WALL_JUMP_FORCE_Y = -450;
WALL_COYOTE_TIME_MS = 150;

// Jump feel
COYOTE_TIME_MS = 80;
JUMP_BUFFER_MS = 100;
SHORT_HOP_FORCE = -350;
FULL_JUMP_FORCE = -550;
JUMP_CUT_VELOCITY = -200;

// Variable jump threshold
JUMP_HOLD_THRESHOLD_MS = 100;

// Bounce pad
BOUNCE_PAD_FORCE = -800;

// Vertical levels
TOWER_WIDTH_TILES = 30;
TOWER_HEIGHT_TILES = 60;
CLIMB_WIDTH_TILES = 50;
CLIMB_HEIGHT_TILES = 40;
ZIGZAG_WIDTH_TILES = 40;
ZIGZAG_HEIGHT_TILES = 50;

// Death sequence
DEATH_HIT_STOP_MS = 100;
DEATH_SLOW_MO_SCALE = 0.3;
DEATH_SLOW_MO_DURATION_MS = 500;
DEATH_INFO_HOLD_MS = 1300;
DEATH_TOTAL_DURATION_MS = 3500;
FLOOR1_DEATH_DURATION_MS = 500;

// Checkpoints
CHECKPOINT_COST_BASE = 10;
CHECKPOINT_COST_PER_FLOOR = 3;
```

---

## Appendix: Design Reference Games

| Game                       | Vertical Element                 | What to Learn                                                           |
| -------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| **Celeste**                | Entire game is vertical climbing | Wall jump feel, coyote time, death/retry speed, screen-by-screen design |
| **Super Mario Bros 3**     | Vertical levels (sky world)      | Platform variety, enemy placement in vertical space                     |
| **Mega Man**               | Vertical shafts with enemies     | Ladder mechanics, precision jumping under fire                          |
| **Shovel Knight**          | Mixed vertical+horizontal        | Bounce pogo mechanic, checkpoint economy                                |
| **Hollow Knight**          | Interconnected vertical areas    | Wall cling/jump feel, atmosphere during falling                         |
| **Kid Icarus**             | Upward-scrolling stages          | Forced vertical progress, enemy density in vertical                     |
| **Donkey Kong (original)** | Pure vertical "get to the top"   | The OG vertical platformer — ramps + ladders + obstacles                |
| **Ice Climber**            | Upward platform climbing         | Breaking through platforms from below, competitive climbing             |

---

_This plan is a living document. Update as implementation progresses and playtesting reveals what works._
