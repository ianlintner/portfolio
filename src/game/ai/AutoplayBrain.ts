import * as Phaser from "phaser";
import type { Player } from "../objects/Player";
import type { Enemy } from "../objects/Enemy";
import type { Hazard } from "../objects/Hazard";
import type { Collectible } from "../objects/Collectible";
import type { Powerup } from "../objects/Powerup";
import type { GameStateSnapshot, VirtualInput } from "./types";
import { SOLID_TILES } from "../rogue/types";

/**
 * Heuristic AI brain that reads a GameStateSnapshot and produces VirtualInput.
 *
 * Strategy overview:
 * 1. Always move toward the goal (right bias since levels scroll right).
 * 2. Jump over hazards and pits detected by ray-casting the tilemap.
 * 3. Stomp enemies from above when safe; dodge otherwise.
 * 4. Collect nearby items/powerups/collectibles on the path.
 * 5. Shoot enemies when powered up and they're in range.
 */
export class AutoplayBrain {
  private prevJump = false;
  private jumpHoldFrames = 0;
  private tickCount = 0;

  /** How many tiles ahead to scan for pits. */
  private static readonly PIT_LOOK_AHEAD = 3;
  /** Horizontal distance at which the AI tries to stomp an enemy. */
  private static readonly STOMP_RANGE_X = 80;
  /** Vertical tolerance for stomp positioning. */
  private static readonly STOMP_RANGE_Y = 120;
  /** Range to grab collectibles / items. */
  private static readonly COLLECT_RANGE = 160;
  /** Shoot range. */
  private static readonly SHOOT_RANGE = 280;

  reset() {
    this.prevJump = false;
    this.jumpHoldFrames = 0;
    this.tickCount = 0;
  }

  /**
   * Given a snapshot of the game world, decide what virtual inputs to emit.
   */
  decide(
    state: GameStateSnapshot,
    layer?: Phaser.Tilemaps.TilemapLayer,
  ): VirtualInput {
    this.tickCount++;

    let left = false;
    let right = false;
    let jump = false;
    let shoot = false;

    const {
      playerX,
      playerY,
      playerVelY,
      playerGrounded,
      goalX,
      goalY,
      enemies,
      hazards,
      collectibles,
      items,
      isPoweredUp,
    } = state;

    // ─── 1. Default: move toward goal ──────────────────────────────────
    const goalDx = goalX - playerX;
    if (goalDx > 20) {
      right = true;
    } else if (goalDx < -20) {
      left = true;
    }

    // If goal is above, we probably need to jump at platforms
    const goalDy = goalY - playerY;

    // ─── 2. Nearby collectibles / items — slight detour ────────────────
    const nearCollectible = [...collectibles, ...items]
      .filter((c) => c.dist < AutoplayBrain.COLLECT_RANGE)
      .sort((a, b) => a.dist - b.dist)[0];

    if (nearCollectible) {
      const dx = nearCollectible.x - playerX;
      const dy = nearCollectible.y - playerY;
      if (Math.abs(dx) > 10) {
        left = dx < 0;
        right = dx > 0;
      }
      // Jump up to reach elevated collectibles
      if (dy < -30 && playerGrounded) {
        jump = true;
      }
    }

    // ─── 3. Enemy handling ─────────────────────────────────────────────
    const nearEnemy = enemies
      .filter((e) => e.dist < 200)
      .sort((a, b) => a.dist - b.dist)[0];

    if (nearEnemy) {
      const edx = nearEnemy.x - playerX;
      const edy = nearEnemy.y - playerY;

      // Can we stomp? We need to be above and reasonably close horizontally.
      if (
        edy > 20 &&
        Math.abs(edx) < AutoplayBrain.STOMP_RANGE_X &&
        playerVelY >= 0
      ) {
        // Position above enemy for stomp
        if (edx > 10) right = true;
        else if (edx < -10) left = true;
        // Don't jump — we want to fall on them
      } else if (
        edy > -AutoplayBrain.STOMP_RANGE_Y &&
        Math.abs(edx) < AutoplayBrain.STOMP_RANGE_X * 2
      ) {
        // Above or near — jump and position for stomp
        if (playerGrounded) jump = true;
        if (edx > 10) right = true;
        else if (edx < -10) left = true;
      } else if (Math.abs(edx) < 120 && Math.abs(edy) < 40) {
        // Same height, close — jump over
        if (playerGrounded) jump = true;
        // Keep moving in goal direction
      }

      // Shoot if powered up and enemy is in range ahead
      if (
        isPoweredUp &&
        Math.abs(edx) < AutoplayBrain.SHOOT_RANGE &&
        Math.abs(edy) < 60
      ) {
        shoot = true;
      }
    }

    // ─── 4. Hazard avoidance ───────────────────────────────────────────
    const nearHazard = hazards
      .filter((h) => h.dist < 100)
      .sort((a, b) => a.dist - b.dist)[0];

    if (nearHazard) {
      const hdx = nearHazard.x - playerX;
      if (Math.abs(hdx) < 60 && playerGrounded) {
        jump = true;
      }
    }

    // ─── 5. Pit detection via tilemap ──────────────────────────────────
    if (layer && playerGrounded) {
      const tileSize = layer.layer.tileWidth;
      const dir = right ? 1 : left ? -1 : 1;
      const feetY = playerY + 20; // approximation: slightly below player center

      let hasPit = false;
      for (let i = 1; i <= AutoplayBrain.PIT_LOOK_AHEAD; i++) {
        const checkX = playerX + dir * i * tileSize;
        const tile = layer.getTileAtWorldXY(checkX, feetY + tileSize, true);
        if (!tile || !SOLID_TILES.includes(tile.index as any)) {
          hasPit = true;
          break;
        }
      }

      if (hasPit) {
        jump = true;
      }
    }

    // ─── 6. Jump if goal is significantly above ────────────────────────
    if (goalDy < -60 && playerGrounded && Math.abs(goalDx) < 300) {
      jump = true;
    }

    // ─── 7. Manage jump hold for variable-height jump ──────────────────
    if (jump && !this.prevJump) {
      this.jumpHoldFrames = 0;
    }
    if (jump) {
      this.jumpHoldFrames++;
    } else {
      this.jumpHoldFrames = 0;
    }

    // Hold jump for higher jumps (up to ~18 frames ≈ 300ms at 60fps)
    const shouldHoldJump = this.jumpHoldFrames > 0 && this.jumpHoldFrames < 18;

    const jumpJustPressed = jump && !this.prevJump;
    this.prevJump = jump;

    return {
      left,
      right,
      jump: jump || shouldHoldJump,
      jumpJustPressed,
      shoot,
    };
  }
}
