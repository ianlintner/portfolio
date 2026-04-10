/**
 * Virtual input state that the AI controller feeds to the Player each frame.
 */
export interface VirtualInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  /** True only on the first frame the jump is pressed (for JustDown logic). */
  jumpJustPressed: boolean;
  shoot: boolean;
}

/** Snapshot of game state for AI decision-making and debug logging. */
export interface GameStateSnapshot {
  tick: number;
  floor: number;
  playerX: number;
  playerY: number;
  playerVelX: number;
  playerVelY: number;
  playerGrounded: boolean;
  playerHearts: number;
  playerMaxHearts: number;
  isPoweredUp: boolean;
  goalX: number;
  goalY: number;
  enemies: { x: number; y: number; type: string; dist: number }[];
  hazards: { x: number; y: number; type: string; dist: number }[];
  collectibles: { x: number; y: number; type: string; dist: number }[];
  items: { x: number; y: number; dist: number }[];
  score: number;
  lives: number;
  coins: number;
  gems: number;
}

export const NULL_INPUT: VirtualInput = {
  left: false,
  right: false,
  jump: false,
  jumpJustPressed: false,
  shoot: false,
};
