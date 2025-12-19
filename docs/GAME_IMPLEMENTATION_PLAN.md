# Cat Adventure Platformer - Implementation Plan

## 1. Overview
This document outlines the plan to integrate a browser-based 2D platformer game into the software engineering portfolio. The game features a cat protagonist navigating through 3 levels to find its food bowl, battling enemies, and collecting power-ups.

**Framework**: Phaser 3 (Game Engine) integrated into Next.js 15 (App Router).

## 2. Technical Architecture

### 2.1. Tech Stack
- **Game Engine**: `phaser` (v3.80+)
- **Frontend**: Next.js 15 (Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (for the game container and outer UI)

### 2.2. Integration Strategy
- The game will run in a dedicated Client Component (`GameCanvas.tsx`).
- We will use a `useEffect` hook to initialize the Phaser `Game` instance on mount and destroy it on unmount to prevent memory leaks.
- Dynamic import with `ssr: false` will be used to load the game component to avoid server-side rendering issues with the Canvas API.

## 3. Game Design

### 3.1. Core Mechanics
- **Genre**: 2D Side-scrolling Platformer.
- **Goal**: Reach the "Food Bowl" at the end of the level.
- **Health**: Player starts with 9 lives (cats!).
- **Combat**:
  - **Jump**: Landing on top of enemies defeats them.
  - **Hairball (Power-up)**: Ranged projectile attack.

### 3.2. Controls
- **Move Left**: Left Arrow / A
- **Move Right**: Right Arrow / D
- **Jump**: Space / Up Arrow / W
- **Shoot**: F / Shift (only when powered up)

### 3.3. Entities
- **Player (Cat)**:
  - Animations: Idle, Walk, Jump, Fall, Shoot.
  - States: Normal, Powered-up (Catnip).
- **Enemies**:
  - **Mouse**: Basic patroller (walks back and forth).
  - **Dog**: Chases player when in range.
  - **Bird**: Flies in a pattern.
  - **Piranha**: Jumps out of "water" pits.
  - **Snake/Lizard**: Ground hazards.
  - **Evil Cat**: Boss/Mini-boss behavior.
- **Items**:
  - **Catnip Leaf**: Grants "Hairball" ability.
  - **Food Bowl**: Level exit/victory condition.

### 3.4. Levels
1.  **Level 1: The Garden**: Simple platforming, Mouse and Bird enemies.
2.  **Level 2: The Streets**: Harder jumps, Dog and Evil Cat enemies.
3.  **Level 3: The House**: Verticality, Piranha (fish tank) and Snake enemies. Final Food Bowl.

## 4. File Structure

```
src/
  app/
    game/
      page.tsx        # Route entry point
      layout.tsx      # Game layout
  components/
    Game/
      GameWrapper.tsx # Next.js Client Component wrapper
      PhaserGame.ts   # Game Config & Initialization
  game/               # Core Game Logic
    scenes/
      BootScene.ts    # Load minimal assets
      Preloader.ts    # Load all assets
      MainMenu.ts     # Start screen
      Level1.ts       # Game Level 1
      Level2.ts       # Game Level 2
      Level3.ts       # Game Level 3
      UIScene.ts      # HUD (Lives, Score)
      GameOver.ts     # Death screen
      Victory.ts      # Win screen
    objects/
      Player.ts       # Cat logic
      Enemy.ts        # Base Enemy class
      Hairball.ts     # Projectile
    config.ts         # Constants (Gravity, Speed)
```

## 5. Implementation Steps

### Phase 1: Setup & Configuration
1.  Install `phaser`.
2.  Create `src/game` directory structure.
3.  Create `GameWrapper` component to host Phaser.
4.  Set up the `/game` route in Next.js.

### Phase 2: Core Engine & Player
1.  Implement `BootScene` and `Preloader`.
2.  Load existing cat sprite sheets.
3.  Create `Player` class with movement physics and animations.
4.  Implement basic tilemap collision (using simple block placeholders initially if tilemaps aren't ready).

### Phase 3: Game Mechanics
1.  Implement "Jump on Enemy" logic.
2.  Implement "Catnip" power-up state.
3.  Implement "Hairball" shooting mechanic.
4.  Add Health/Lives system.

### Phase 4: Level Design
1.  Design Level 1 (Garden) layout.
2.  Design Level 2 (Streets) layout.
3.  Design Level 3 (House) layout.
4.  Place enemies and items.

### Phase 5: UI & Polish
1.  Create Main Menu with "Start Game" button.
2.  Create HUD (Heads Up Display) for lives.
3.  Add sound effects (placeholders or generated).
4.  Add "Game Over" and "Victory" screens.

## 6. Asset Requirements
- **Sprites**:
  - Cat (Walk, Idle, Jump) - *Existing in `public/images/cats/`*
  - Enemies (Mouse, Dog, etc.) - *Need to source or use placeholders*
  - Tileset (Ground, Platforms) - *Need to source or use placeholders*
  - Items (Bowl, Leaf) - *Need to source or use placeholders*
