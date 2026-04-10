export type GameBootOptions = {
  autoplay?: boolean;
  headless?: boolean;
  debug?: boolean;
};

const GLOBAL_KEY = "__PHASER_BOOT_OPTIONS__";

export function setBootOptions(options: GameBootOptions) {
  (globalThis as Record<string, unknown>)[GLOBAL_KEY] = options;
}

export function getBootOptions(): GameBootOptions {
  const value = (globalThis as Record<string, unknown>)[GLOBAL_KEY];
  if (!value || typeof value !== "object") return {};
  return value as GameBootOptions;
}
