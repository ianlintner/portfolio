import type { GameStateSnapshot, VirtualInput } from "./types";

/**
 * Logs game-state snapshots to the console for headless/CLI QA runs.
 * Designed to be consumed by Playwright or CI pipelines.
 */
export class HeadlessLogger {
  private logBuffer: string[] = [];
  private static readonly BUFFER_SIZE = 50;

  log(state: GameStateSnapshot, input: VirtualInput) {
    const entry = {
      t: state.tick,
      floor: state.floor,
      pos: [Math.round(state.playerX), Math.round(state.playerY)],
      vel: [Math.round(state.playerVelX), Math.round(state.playerVelY)],
      grounded: state.playerGrounded,
      hp: `${state.playerHearts}/${state.playerMaxHearts}`,
      score: state.score,
      lives: state.lives,
      coins: state.coins,
      gems: state.gems,
      enemies: state.enemies.length,
      goalDist: Math.round(
        Math.hypot(state.goalX - state.playerX, state.goalY - state.playerY),
      ),
      altitude: Math.round(state.altitude * 100),
      zone: state.zone,
      input: `${input.left ? "L" : "."}${input.right ? "R" : "."}${input.jump ? "J" : "."}${input.shoot ? "S" : "."}`,
    };

    const line = `[AI] ${JSON.stringify(entry)}`;

    console.log(line);

    const qa = (
      globalThis as {
        __PHASER_QA__?: { logs?: string[] };
      }
    ).__PHASER_QA__;
    qa?.logs?.push(line);

    this.logBuffer.push(line);
    if (this.logBuffer.length > HeadlessLogger.BUFFER_SIZE) {
      this.logBuffer.shift();
    }
  }

  /** Return buffered log entries for test assertions. */
  getBuffer(): string[] {
    return [...this.logBuffer];
  }

  flush() {
    this.logBuffer = [];
  }
}
