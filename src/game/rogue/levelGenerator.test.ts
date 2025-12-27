import { generateLevel } from "./levelGenerator";

describe("generateLevel", () => {
  it("is deterministic for the same seed+floor", () => {
    const a = generateLevel({ seed: "abc", floor: 1 });
    const b = generateLevel({ seed: "abc", floor: 1 });

    expect(a.widthTiles).toBe(b.widthTiles);
    expect(a.heightTiles).toBe(b.heightTiles);
    expect(a.tileSize).toBe(b.tileSize);
    expect(a.spawn).toEqual(b.spawn);
    expect(a.items).toEqual(b.items);
    expect(a.enemies).toEqual(b.enemies);
    expect(a.data).toEqual(b.data);
  });

  it("changes when floor changes", () => {
    const a = generateLevel({ seed: "abc", floor: 1 });
    const b = generateLevel({ seed: "abc", floor: 2 });

    // Not strictly guaranteed to be different every time, but extremely likely.
    expect(JSON.stringify(a.data)).not.toEqual(JSON.stringify(b.data));
  });

  it("always has a player spawn and goal within bounds", () => {
    const lvl = generateLevel({
      seed: "seed",
      floor: 3,
      widthTiles: 50,
      heightTiles: 18,
    });
    expect(lvl.spawn.player.x).toBeGreaterThanOrEqual(0);
    expect(lvl.spawn.player.y).toBeGreaterThanOrEqual(0);
    expect(lvl.spawn.goal.x).toBeLessThanOrEqual(lvl.widthTiles * lvl.tileSize);
    expect(lvl.spawn.goal.y).toBeLessThanOrEqual(
      lvl.heightTiles * lvl.tileSize,
    );
  });
});
