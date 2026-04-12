import type * as Phaser from "phaser";
import type { GameStateSnapshot, VirtualInput } from "./types";

/**
 * In-game debug overlay that renders real-time AI and game state data.
 * Shown only when AI autoplay is active and debug is toggled on.
 */
export class DebugOverlay {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private bg!: Phaser.GameObjects.Rectangle;
  private textLines!: Phaser.GameObjects.Text;

  private static readonly WIDTH = 260;
  private static readonly LINE_HEIGHT = 14;
  private static readonly MAX_LINES = 20;
  private static readonly PADDING = 8;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const h =
      DebugOverlay.LINE_HEIGHT * DebugOverlay.MAX_LINES +
      DebugOverlay.PADDING * 2;

    this.bg = this.scene.add
      .rectangle(0, 0, DebugOverlay.WIDTH, h, 0x000000, 0.7)
      .setOrigin(0, 0);

    this.textLines = this.scene.add
      .text(DebugOverlay.PADDING, DebugOverlay.PADDING, "", {
        fontSize: "11px",
        fontFamily: "monospace",
        color: "#00ff88",
        lineSpacing: 2,
      })
      .setOrigin(0, 0);

    this.container = this.scene.add
      .container(this.scene.scale.width - DebugOverlay.WIDTH - 4, 80, [
        this.bg,
        this.textLines,
      ])
      .setDepth(9999)
      .setScrollFactor(0);
  }

  update(state: GameStateSnapshot, input: VirtualInput) {
    const lines: string[] = [
      `── AI DEBUG ──────────`,
      `Tick: ${state.tick}  Floor: ${state.floor}`,
      `Cat: (${state.playerX.toFixed(0)}, ${state.playerY.toFixed(0)})`,
      `Vel: (${state.playerVelX.toFixed(0)}, ${state.playerVelY.toFixed(0)})`,
      `Grounded: ${state.playerGrounded}`,
      `Hearts: ${state.playerHearts}/${state.playerMaxHearts}`,
      `Powered: ${state.isPoweredUp}`,
      `Score: ${state.score}  Lives: ${state.lives}`,
      `Coins: ${state.coins}  Gems: ${state.gems}`,
      `Goal: (${state.goalX.toFixed(0)}, ${state.goalY.toFixed(0)})`,
      `GoalDist: ${Math.hypot(state.goalX - state.playerX, state.goalY - state.playerY).toFixed(0)}`,
      `Altitude: ${(state.altitude * 100).toFixed(1)}%  Zone: ${state.zone}`,
      `── INPUT ─────────────`,
      `L:${input.left ? "■" : "□"} R:${input.right ? "■" : "□"} J:${input.jump ? "■" : "□"} S:${input.shoot ? "■" : "□"}`,
      `── NEARBY ────────────`,
      `Enemies: ${state.enemies.filter((e) => e.dist < 200).length}`,
      `Hazards: ${state.hazards.filter((h) => h.dist < 150).length}`,
      `Collect: ${state.collectibles.length + state.items.length}`,
    ];

    // Nearest enemy detail
    const nearest = state.enemies.sort((a, b) => a.dist - b.dist)[0];
    if (nearest) {
      lines.push(`NearEnemy: ${nearest.type} d=${nearest.dist.toFixed(0)}`);
    }

    this.textLines.setText(lines.slice(0, DebugOverlay.MAX_LINES).join("\n"));
  }

  destroy() {
    this.container?.destroy(true);
  }
}
