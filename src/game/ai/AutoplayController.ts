import type * as Phaser from "phaser";
import type { Player } from "../objects/Player";
import type { Enemy } from "../objects/Enemy";
import type { Hazard } from "../objects/Hazard";
import { AutoplayBrain } from "./AutoplayBrain";
import { DebugOverlay } from "./DebugOverlay";
import { HeadlessLogger } from "./HeadlessLogger";
import type { GameStateSnapshot, VirtualInput } from "./types";
import { NULL_INPUT } from "./types";

export interface AutoplayControllerConfig {
  /** The RogueRun scene instance. */
  scene: Phaser.Scene;
  player: Player;
  enemies: Phaser.Physics.Arcade.Group;
  hazards: Phaser.Physics.Arcade.StaticGroup;
  collectibles: Phaser.Physics.Arcade.Group;
  items: Phaser.Physics.Arcade.Group;
  goal: Phaser.Physics.Arcade.Sprite;
  layer?: Phaser.Tilemaps.TilemapLayer;
  /** Show debug overlay for visual mode. */
  showDebug?: boolean;
  /** Log to console for headless mode. */
  headless?: boolean;
}

/**
 * Orchestrates AI autoplay: reads game state → brain decides → feeds virtual
 * input to the Player. Optionally renders a debug overlay or logs data for
 * headless QA.
 */
export class AutoplayController {
  private scene: Phaser.Scene;
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private hazards: Phaser.Physics.Arcade.StaticGroup;
  private collectibles: Phaser.Physics.Arcade.Group;
  private items: Phaser.Physics.Arcade.Group;
  private goal: Phaser.Physics.Arcade.Sprite;
  private layer?: Phaser.Tilemaps.TilemapLayer;

  private brain: AutoplayBrain;
  private debugOverlay: DebugOverlay | null = null;
  private headlessLogger: HeadlessLogger | null = null;
  private tick = 0;

  /** Last computed input for external consumers. */
  public currentInput: VirtualInput = NULL_INPUT;

  constructor(config: AutoplayControllerConfig) {
    this.scene = config.scene;
    this.player = config.player;
    this.enemies = config.enemies;
    this.hazards = config.hazards;
    this.collectibles = config.collectibles;
    this.items = config.items;
    this.goal = config.goal;
    this.layer = config.layer;

    this.brain = new AutoplayBrain();

    if (config.showDebug) {
      this.debugOverlay = new DebugOverlay(config.scene);
    }
    if (config.headless) {
      this.headlessLogger = new HeadlessLogger();
    }
  }

  /** Call once per frame from the scene's update(). */
  update() {
    this.tick++;
    const state = this.buildSnapshot();
    const input = this.brain.decide(state, this.layer);
    this.currentInput = input;

    const qa = (
      globalThis as {
        __PHASER_QA__?: Record<string, unknown>;
      }
    ).__PHASER_QA__;
    if (qa) {
      qa.lastState = state;
      qa.lastInput = input;
    }

    // Feed virtual input to the player
    this.player.setVirtualInput(input);

    // Debug overlay update
    this.debugOverlay?.update(state, input);

    // Headless logging (every 30 ticks ≈ 0.5s at 60fps)
    if (this.headlessLogger && this.tick % 30 === 0) {
      this.headlessLogger.log(state, input);
    }
  }

  /** Toggle debug overlay at runtime. */
  toggleDebug() {
    if (this.debugOverlay) {
      this.debugOverlay.destroy();
      this.debugOverlay = null;
    } else {
      this.debugOverlay = new DebugOverlay(this.scene);
    }
  }

  destroy() {
    this.debugOverlay?.destroy();
    this.headlessLogger?.flush();
  }

  private buildSnapshot(): GameStateSnapshot {
    const body = this.player.body as Phaser.Physics.Arcade.Body | null;
    const px = this.player.x;
    const py = this.player.y;

    const enemyList = this.enemies.getChildren().map((e: any) => ({
      x: e.x as number,
      y: e.y as number,
      type: (e.enemyType ?? "unknown") as string,
      dist: Phaser.Math.Distance.Between(px, py, e.x, e.y),
    }));

    const hazardList = this.hazards.getChildren().map((h: any) => ({
      x: h.x as number,
      y: h.y as number,
      type: (h.hazardType ?? "unknown") as string,
      dist: Phaser.Math.Distance.Between(px, py, h.x, h.y),
    }));

    const collectibleList = this.collectibles.getChildren().map((c: any) => ({
      x: c.x as number,
      y: c.y as number,
      type: (c.collectibleType ?? "unknown") as string,
      dist: Phaser.Math.Distance.Between(px, py, c.x, c.y),
    }));

    const itemList = this.items.getChildren().map((i: any) => ({
      x: i.x as number,
      y: i.y as number,
      dist: Phaser.Math.Distance.Between(px, py, i.x, i.y),
    }));

    return {
      tick: this.tick,
      floor: Number(this.scene.registry.get("runFloor") ?? 1),
      playerX: px,
      playerY: py,
      playerVelX: body?.velocity.x ?? 0,
      playerVelY: body?.velocity.y ?? 0,
      playerGrounded: !!(body?.blocked.down || body?.touching.down),
      playerHearts: Number(this.scene.registry.get("playerHearts") ?? 3),
      playerMaxHearts: Number(this.scene.registry.get("maxHearts") ?? 3),
      isPoweredUp: this.player.isPoweredUp,
      goalX: this.goal.x,
      goalY: this.goal.y,
      enemies: enemyList,
      hazards: hazardList,
      collectibles: collectibleList,
      items: itemList,
      score: Number(this.scene.registry.get("score") ?? 0),
      lives: Number(this.scene.registry.get("lives") ?? 3),
      coins: Number(this.scene.registry.get("coins") ?? 0),
      gems: Number(this.scene.registry.get("gems") ?? 0),
    };
  }
}
