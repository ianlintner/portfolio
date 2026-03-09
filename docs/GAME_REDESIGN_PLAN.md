# Game Redesign Plan: Simple Action Platformer

## Chief Designer's Analysis & Recommendations

**Date:** March 9, 2026  
**Project:** Portfolio Game - Rogue Run Platformer  
**Design Philosophy:** Maximize fun through meaningful choices, varied challenges, and progressive mastery

---

## Current State Analysis

### What's Working ✅

- **Solid movement mechanics** - Jump, run, stomp feel responsive
- **Procedural generation** - Good foundation with seeded RNG
- **Enemy variety** - 8 enemy types with size variation
- **Smart enemy AI** - Pit avoidance, player awareness
- **Progression system** - Floor-based difficulty scaling
- **Stomp mechanic** - Classic Mario-style satisfying feedback

### Critical Issues ⚠️

1. **Shallow Gameplay Loop** - Run right → avoid/stomp → repeat
2. **Binary Powerup System** - You have shooting or you don't
3. **No Meaningful Choices** - Optimal play is always obvious
4. **Level Monotony** - Same ground + platforms on every floor
5. **Passive Hazards** - Only pits, no active threats
6. **No Risk/Reward** - Catnip is just "better" with no tradeoff
7. **Enemy Homogeneity** - All patrol and chase, no special behaviors
8. **Single Win Condition** - Just reach the goal
9. **No Player Progression** - Get harder levels but no new abilities
10. **Limited Replayability** - Same strategy works every time

---

## Core Design Pillars

### 1. **Meaningful Choice**

Every floor should present decisions with clear tradeoffs:

- Safe path (slow) vs risky path (fast/rewarding)
- Collect powerups vs conserve time
- Fight enemies vs avoid them
- Explore secrets vs speedrun

### 2. **Progressive Mastery**

Players should feel increasingly skillful:

- Unlock new abilities over time
- Learn enemy patterns
- Discover level generation tricks
- Master advanced movement tech

### 3. **Varied Challenge**

No two floors should feel identical:

- Environmental themes with unique hazards
- Boss fights every 5 floors
- Special challenge floors
- Dynamic events mid-level

### 4. **Risk/Reward Balance**

High risk should mean high reward:

- Dangerous paths have better items
- Optional challenges give bonuses
- Time pressure vs completionism
- Death penalties vs comeback mechanics

---

## Redesigned Systems

## 🎮 ENHANCED PLAYER MECHANICS

### **Movement Upgrades** (Unlocked via progression)

```
Floor 1-4:   Basic (walk, jump, stomp)
Floor 5:     Wall Slide + Wall Jump unlocked
Floor 10:    Double Jump unlocked
Floor 15:    Dash unlocked (short burst)
Floor 20:    Glide unlocked (hold jump while falling)
```

### **Combat Evolution**

- **Stomp Chain Bonus:** Stomp 3+ enemies in a row → invincibility frames
- **Combo System:** Multiple stomps increase score multiplier (2x, 3x, 4x...)
- **Charged Jump:** Hold jump on ground → super jump (reaches high platforms)
- **Slide Attack:** Crouch + move → low slide under projectiles

### **Power System Rework**

Replace binary "powered up" with **stacking powerups**:

| Powerup         | Effect              | Duration | Stack             |
| --------------- | ------------------- | -------- | ----------------- |
| **Catnip**      | Shoot hairballs     | 30s      | Yes (↑ fire rate) |
| **Fish Can**    | Speed boost +50%    | 20s      | No                |
| **Yarn Ball**   | Double jump refresh | 25s      | No                |
| **Milk Saucer** | Invincibility       | 10s      | Extends           |
| **Feather Toy** | Triple jump height  | 30s      | No                |

Powerups appear randomly (25% chance each) in item boxes, creating build variety.

---

## 🎨 ENVIRONMENTAL THEMES

### **5 Distinct Biomes** (Cycle every 5 floors)

#### 1. **Industrial Zone** (Floors 1-5, 21-25...)

- Current aesthetic
- Hazards: Steam vents (periodic damage), conveyor belts
- Platform types: Metal grates, moving platforms
- Background: Factories, smokestacks

#### 2. **Alley Streets** (Floors 6-10, 26-30...)

- Urban nighttime setting
- Hazards: Dumpsters (spawn enemies), broken glass (slows movement)
- Platform types: Fire escapes, awnings, clotheslines
- Background: Neon signs, apartment windows
- Special: Rainy weather effect (slippery platforms)

#### 3. **Rooftop Gardens** (Floors 11-15, 31-35...)

- Bright, colorful vegetation
- Hazards: Thorny vines (barriers), water puddles (slippery)
- Platform types: Planters, pergolas, garden beds
- Background: Sky, clouds, distant city
- Special: Wind gusts (push player left/right)

#### 4. **Haunted Manor** (Floors 16-20, 36-40...)

- Spooky Victorian interior
- Hazards: Falling chandeliers, ghost platforms (appear/disappear)
- Platform types: Floating books, picture frames, banisters
- Background: Gothic architecture, moonlit windows
- Special: Darkness (limited visibility cone around player)

#### 5. **Digital Realm** (Floors 21+, special)

- Cyberpunk/matrix aesthetic
- Hazards: Data streams (flow barriers), glitch tiles (teleport)
- Platform types: Floating code blocks, laser grids
- Background: Neon circuits, binary rain
- Special: Gravity flips in sections

---

## 👾 ENHANCED ENEMY SYSTEM

### **Enemy Classes** (Give each type unique behavior)

#### **Patrollers** (Current behavior)

- **Dog1, Cat1, Rat1:** Walk back/forth, turn at edges
- Behavior: Speed up near player
- Counter: Stomp or shoot

#### **Chargers** (New)

- **Dog2, Cat2:** Detect player → charge for 2s → cooldown
- Behavior: Fast burst, vulnerable after charge
- Counter: Bait charge, then stomp during cooldown

#### **Flyers** (New)

- **Bird1, Bird2:** Fly in sine wave pattern, dive bomb player
- Behavior: Hard to stomp, weak to projectiles
- Counter: Shoot or time jump carefully

#### **Shooters** (New)

- **Rat2:** Stay at distance, shoot acorns at player
- Behavior: Retreat when approached
- Counter: Close distance fast or deflect with hairball

### **Special Enemies** (Floor-specific)

| Enemy          | Floors | Behavior                                |
| -------------- | ------ | --------------------------------------- |
| **Tank Dog**   | 8+     | Takes 3 hits, slow, blocks paths        |
| **Ninja Cat**  | 12+    | Teleports every 5s, fast attacks        |
| **Swarm Rats** | 6+     | Spawn in groups of 4, weak individually |
| **Robot Bird** | 15+    | Shoots laser grid, flies in patterns    |

### **Boss Fights** (Every 5 floors)

#### **Floor 5: Big Dog Boss**

- **Pattern:** Charge → Stomp → Spawn 2 small dogs → Repeat
- **Weakness:** Stomp on head after charge stuns
- **Reward:** +1 max life, 500 points

#### **Floor 10: Cat King**

- **Pattern:** Teleport around arena → Throw yarn bombs → Ground pound
- **Weakness:** Yarn bombs can be shot back at him
- **Reward:** Permanent double jump, 1000 points

#### **Floor 15: Rat Mech**

- **Pattern:** Walk on ceiling → Drop spike balls → Laser sweep
- **Weakness:** Shoot weak spots (glowing vents) 5 times
- **Reward:** Dash ability, 1500 points

#### **Floor 20: Bird Flock Mother**

- **Pattern:** Circle arena → Send smaller birds → Dive bomb center
- **Weakness:** Stomp small birds to fill meter → Stun → Ground attack
- **Reward:** Glide ability, 2000 points

---

## 🗺️ IMPROVED LEVEL GENERATION

### **Layout Variations**

#### **Current:** Flat ground + random platforms (70%)

#### **New Types:**

1. **Parkour Run** (15%)
   - No ground after start
   - Must chain platform jumps perfectly
   - High risk, bonus items every 5 platforms
   - Teaches precision jumping

2. **Vertical Climb** (10%)
   - Start at bottom, goal at top
   - Wall jump sections required
   - Falling enemies spawn above
   - Tests climbing skills

3. **Gauntlet** (5%)
   - Narrow corridor filled with enemies
   - Timed powerup at start
   - Must kill all to unlock goal
   - Combat focused

4. **Maze** (5%)
   - Multiple branching paths
   - Keys hidden in side areas
   - Dead ends with traps
   - Rewards exploration

5. **Auto-Scroller** (3%)
   - Screen scrolls automatically
   - Must keep pace or die
   - Focuses on quick decisions
   - High pressure

6. **Boss Arena** (Every 5th floor)
   - Flat arena, no pits
   - Enemies don't spawn
   - Boss-specific mechanics
   - Pure skill test

### **Hazard Distribution**

| Hazard             | Floors | Damage   | Behavior                       |
| ------------------ | ------ | -------- | ------------------------------ |
| **Pits**           | All    | Death    | Static gaps in floor           |
| **Spikes**         | 3+     | 1 Heart  | Static floor/ceiling traps     |
| **Steam Vents**    | 1-10   | 1 Heart  | Periodic blast (2s on, 2s off) |
| **Sawblades**      | 6+     | 2 Hearts | Circular patrol path           |
| **Fireballs**      | 8+     | 1 Heart  | Shoot from walls (3s interval) |
| **Falling Blocks** | 10+    | 1 Heart  | Drop when player passes under  |
| **Laser Grids**    | 15+    | 2 Hearts | Sweep across screen            |
| **Darkness Zones** | 16+    | 0 (Fear) | Limited vision, spawn ghosts   |
| **Gravity Wells**  | 20+    | 0        | Pull player toward center      |

### **Interactive Elements**

- **Switches:** Toggle platforms, open doors, stop hazards
- **Checkpoints:** Every 30 tiles (mini-goal, saves progress in floor)
- **Secret Walls:** Hidden passages to bonus areas (breakable tiles)
- **Bounce Pads:** Launch player high (access secret areas)
- **Moving Platforms:** Horizontal/vertical/circular paths
- **Crumbling Platforms:** Break 1s after stepping on
- **Conveyor Belts:** Push player left/right

---

## 🏆 GOALS & OBJECTIVES

### **Primary Goal:** Reach cat food bowl (unchanged)

### **Secondary Goals** (Optional, bonus rewards)

1. **Speed Run:** Beat floor in < 60s → +100 points, time bonus
2. **Pacifist:** Don't kill any enemies → +200 points, special badge
3. **Exterminator:** Kill all enemies → +150 points, extra life chance
4. **Collector:** Get all items (catnip + secrets) → +250 points
5. **No Damage:** Complete floor without taking damage → +300 points, health refill

### **Meta Progression**

- **Unlockables:** Cosmetic skins for cat (every 5 floors)
- **Achievements:** 30+ achievements (first stomp, 100 enemies killed, etc.)
- **High Scores:** Leaderboard per seed
- **Daily Challenge:** Specific seed with modifiers (e.g., "No Shooting", "Double Enemies")

---

## 💎 COLLECTIBLES & ECONOMY

### **Coins** (New)

- Drop from enemies (50%), found in secret areas
- **Uses:**
  - Buy powerup from shop (appears every 10 floors)
  - Extend time in timed challenges
  - Unlock cosmetics
  - Continue after game over (costs 100 coins)

### **Gems** (New, Rare)

- Hidden in secret areas (3 per floor max)
- **Uses:**
  - Permanent upgrades (HP +1, starting powerup, etc.)
  - Unlock secret levels
  - Trophy collection (completionist goal)

### **Health Drops**

- Small hearts: +1 HP (drop from destructible crates 10% chance)
- Big hearts: +2 HP (hidden in secrets)
- Max HP increase: From gem shop

---

## 🎲 DIFFICULTY PROGRESSION

### **Current:** More enemies + slight gap frequency increase

### **New Dynamic System:**

| Aspect                  | Floors 1-5 | Floors 6-10  | Floors 11-15  | Floors 16-20 | Floor 21+     |
| ----------------------- | ---------- | ------------ | ------------- | ------------ | ------------- |
| **Enemy Count**         | 7-9        | 10-13        | 14-17         | 18-22        | 23-30         |
| **Enemy HP**            | 1 hit      | 1-2 hits     | 2 hits        | 2-3 hits     | 3 hits        |
| **Hazard Density**      | Low        | Medium       | Medium-High   | High         | Extreme       |
| **Platform Difficulty** | Easy jumps | Medium jumps | Precise jumps | Expert jumps | Frame-perfect |
| **Special Enemies**     | 0          | 1-2          | 2-3           | 3-4          | 4+            |
| **Boss Frequency**      | Floor 5    | Every 5      | Every 5       | Every 5      | Every 3       |

### **Difficulty Modifiers** (Unlock after Floor 20)

Players can opt-in for harder runs with better rewards:

- **Hard Mode:** +50% enemies, +30% damage, +2x score
- **Iron Cat:** One life only, permanent death, +5x score
- **Speed Demon:** 90s time limit per floor, +3x score
- **Pacifist Run:** No combat allowed, +4x score

---

## 🎯 IMPLEMENTATION PRIORITY

### **Phase 1: Core Improvements** (Do First)

1. ✅ Multi-heart health system (3 hearts = 3 hits)
2. ✅ Enhanced enemy behaviors (chargers, flyers, shooters)
3. ✅ New hazards (spikes, steam vents, sawblades)
4. ✅ Collectible coins + basic economy
5. ✅ Level layout variations (parkour, vertical, gauntlet)
6. ✅ Boss fight at Floor 5

### **Phase 2: Depth & Variety** (Do Second)

1. ✅ Biome themes (Industrial, Alley, Rooftop)
2. ✅ Powerup variety (5+ types)
3. ✅ Movement upgrades (wall jump, double jump, dash)
4. ✅ Secondary objectives (speed run, pacifist, etc.)
5. ✅ Secret areas + gems
6. ✅ Interactive elements (switches, bounce pads)

### **Phase 3: Polish & Replayability** (Do Third)

1. ✅ Meta progression (unlockables, achievements)
2. ✅ Daily challenges
3. ✅ Difficulty modifiers
4. ✅ More boss fights (Floor 10, 15, 20)
5. ✅ Leaderboards
6. ✅ Sound effects + music per biome

---

## 🛠️ TECHNICAL CHANGES NEEDED

### **New Classes/Files**

- `src/game/objects/Powerup.ts` - Generic powerup class with types
- `src/game/objects/Hazard.ts` - Base class for environmental hazards
- `src/game/objects/Boss.ts` - Base class for boss enemies
- `src/game/objects/Projectile.ts` - Generalized projectile (hairball + enemy attacks)
- `src/game/objects/Collectible.ts` - Coins, gems, hearts
- `src/game/objects/Interactive.ts` - Switches, bounce pads, etc.

### **Enhanced Existing Files**

- `levelGenerator.ts`:
  - Add biome theme selection
  - Add layout type selection (parkour, vertical, etc.)
  - Add hazard placement logic
  - Add secret area generation
  - Add checkpoint placement
- `Player.ts`:
  - Multi-heart health system (hearts[] array)
  - Ability unlock tracking (hasWallJump, hasDoubleJump, etc.)
  - Powerup stack management (powerups[])
  - Combo tracking
- `Enemy.ts`:
  - Add behavior types (patrol, charge, fly, shoot)
  - Add HP tracking
  - Add special enemy variants
- `RogueRun.ts`:
  - Biome-specific asset loading
  - Boss arena setup on floor 5, 10, etc.
  - Secondary objective tracking
  - Coin/gem economy

### **New Data Structures**

```typescript
type BiomeTheme = "industrial" | "alley" | "rooftop" | "manor" | "digital";
type LayoutType =
  | "standard"
  | "parkour"
  | "vertical"
  | "gauntlet"
  | "maze"
  | "autoscroll"
  | "boss";
type PowerupType = "catnip" | "fish" | "yarn" | "milk" | "feather";
type HazardType =
  | "spike"
  | "steam"
  | "sawblade"
  | "fireball"
  | "falling_block"
  | "laser"
  | "darkness";
type CollectibleType = "coin" | "gem" | "heart_small" | "heart_big";

interface PlayerAbilities {
  hasWallJump: boolean;
  hasDoubleJump: boolean;
  hasDash: boolean;
  hasGlide: boolean;
}

interface FloorObjectives {
  primary: boolean; // Reached goal
  speedRun: boolean; // Beat in < 60s
  pacifist: boolean; // No kills
  exterminator: boolean; // All kills
  collector: boolean; // All items
  noDamage: boolean; // No hits
}
```

---

## 📊 SUCCESS METRICS

### **Player Engagement**

- Average floors per run: Target **8-12** (up from ~3-5)
- Session length: Target **10-15 minutes** (up from 2-5)
- Return rate: Target **60%+ next-day** (measure via analytics)

### **Skill Mastery**

- Floor 10 completion rate: Target **40%** (challenging but achievable)
- Floor 20 completion rate: Target **10%** (expert level)
- Boss defeat rate (first attempt): Target **25%** (learnable with practice)

### **Variety Experienced**

- Players should see each biome in first 20 floors
- Players should encounter each layout type by Floor 15
- Players should unlock all 4 movement abilities by Floor 20

---

## 🎨 ART & ANIMATION NEEDS

### **New Sprites Required**

- ✅ Heart icons (full, half, empty)
- ✅ Coin sprite (animated spin)
- ✅ Gem sprite (sparkle effect)
- ✅ Sawblade (spinning animation)
- ✅ Spike tile variants
- ✅ Steam vent (idle + active)
- ✅ Boss sprites (Big Dog, Cat King, Rat Mech, Bird Mother)
- ✅ Powerup icons (fish, yarn, milk, feather)
- ✅ Switch/button sprites

### **Existing Assets to Utilize**

- `public/assets/game/cat.png` - Player ✅
- `public/assets/game/enemies/` - Enemy sprites ✅
- `public/assets/game/items.png` - Use for powerups/collectibles
- `public/assets/game/Free Industrial Zone Tileset/` - Industrial biome ✅
- `public/assets/game/alley_tiles.png` - Alley biome ✅

---

## 🎵 AUDIO DESIGN

### **Sound Effects Needed**

- Jump/double jump/wall jump sounds
- Stomp impact (with pitch variation for combos)
- Powerup collect (different per type)
- Coin/gem collect
- Damage taken
- Boss roar/attack sounds
- Hazard activation (saw spin, steam hiss, etc.)
- UI sounds (menu, pause, objective complete)

### **Music Strategy**

- **Layer-based system:** Start with simple melody, add layers as floor increases
- **Biome themes:** Each biome has distinct music style
- **Boss music:** Intense track for boss fights (crossfade from normal)
- **Danger state:** Music intensifies when low on health

---

## 🚀 CONCLUSION

This redesign transforms the game from a simple "run and jump" experience into a **deep, replayable action platformer** with:

- ✅ **Meaningful choices** through optional objectives and routes
- ✅ **Progressive mastery** via unlockable abilities and skill-based challenges
- ✅ **Varied challenge** through biomes, layouts, enemies, and bosses
- ✅ **Risk/reward balance** through economy, secrets, and difficulty modifiers

**The game remains simple to pick up** (walk, jump, stomp) **but offers depth to master** (combos, wall jumps, boss patterns, speedrunning).

**Next Steps:**

1. Review and approve Phase 1 priorities
2. Begin implementation of multi-heart health system
3. Prototype first boss fight (Floor 5 Big Dog)
4. Test new enemy behaviors with playtesters
5. Iterate based on feedback

**No sacred cows. Let's make this fun.** 🎮✨

---

_End of Game Redesign Plan_
