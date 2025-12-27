export type Seed = string | number;

function xmur3(str: string) {
  // Deterministic string -> uint32 hash.
  // Public domain-ish pattern commonly used for seeded RNG.
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private nextFloat: () => number;

  constructor(seed: Seed) {
    const seedStr = typeof seed === "number" ? String(seed) : seed;
    const seedFn = xmur3(seedStr);
    this.nextFloat = mulberry32(seedFn());
  }

  /** Returns a float in [0, 1). */
  next(): number {
    return this.nextFloat();
  }

  /** Returns an integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    const lo = Math.ceil(Math.min(min, max));
    const hi = Math.floor(Math.max(min, max));
    return Math.floor(this.next() * (hi - lo + 1)) + lo;
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) {
      throw new Error("Rng.pick() called with empty array");
    }
    return arr[this.int(0, arr.length - 1)];
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
