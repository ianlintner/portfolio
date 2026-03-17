import { generateLevel } from "./levelGenerator";
import { TILE } from "./types";

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

  it("uses TILE constants matching expected values", () => {
    expect(TILE.EMPTY).toBe(-1);
    expect(TILE.PLATFORM).toBe(3);
    expect(TILE.GROUND_TOP).toBe(12);
    expect(TILE.GROUND_FILL).toBe(14);
    expect(TILE.ONE_WAY).toBe(15);
    expect(TILE.WALL).toBe(16);
  });

  it("generates a valid level for every layout-triggering floor", () => {
    // Run many seeds × floors so we hit tower/climb/zigzag/parkour/vertical/boss
    const seeds = ["vert-a", "vert-b", "vert-c", "vert-d", "vert-e"];
    const floors = [1, 3, 5, 6, 7, 8, 10, 15];

    for (const seed of seeds) {
      for (const floor of floors) {
        const lvl = generateLevel({ seed, floor });

        // Data dimensions match
        expect(lvl.data.length).toBe(lvl.heightTiles);
        expect(lvl.data[0].length).toBe(lvl.widthTiles);

        // Spawn is inside bounds
        expect(lvl.spawn.player.x).toBeGreaterThanOrEqual(0);
        expect(lvl.spawn.player.y).toBeGreaterThanOrEqual(0);
        expect(lvl.spawn.goal.x).toBeLessThanOrEqual(
          lvl.widthTiles * lvl.tileSize,
        );
        expect(lvl.spawn.goal.y).toBeLessThanOrEqual(
          lvl.heightTiles * lvl.tileSize,
        );

        // Boss floor flag matches layout
        if (floor % 5 === 0) expect(lvl.isBossFloor).toBe(true);
      }
    }
  });

  it("includes ONE_WAY or WALL tiles in new vertical layouts", () => {
    // Generate enough levels that at least one is tower/climb/zigzag
    // Use floor 9 (not 10, which is a boss floor: 10 % 5 === 0)
    let foundVerticalTiles = false;
    for (let i = 0; i < 100 && !foundVerticalTiles; i++) {
      const lvl = generateLevel({
        seed: `vertical-sweep-${i}`,
        floor: 9,
      });
      if (
        lvl.layout === "tower" ||
        lvl.layout === "climb" ||
        lvl.layout === "zigzag"
      ) {
        // Check that the data array contains at least one ONE_WAY or WALL tile
        const flat = lvl.data.flat();
        const hasOneWay = flat.includes(TILE.ONE_WAY);
        const hasWall = flat.includes(TILE.WALL);
        if (hasOneWay || hasWall) foundVerticalTiles = true;
      }
    }
    expect(foundVerticalTiles).toBe(true);
  });
});
