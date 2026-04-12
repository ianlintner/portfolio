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

  it("boss arena is 40 tiles wide with platforms and walls", () => {
    const lvl = generateLevel({ seed: "boss-test", floor: 5 });
    expect(lvl.isBossFloor).toBe(true);
    expect(lvl.layout).toBe("boss");
    expect(lvl.widthTiles).toBe(40);

    const flat = lvl.data.flat();
    // Boss arena should have platforms for tactical movement
    const hasPlatforms = flat.includes(TILE.PLATFORM);
    const hasOneWay = flat.includes(TILE.ONE_WAY);
    const hasWalls = flat.includes(TILE.WALL);
    expect(hasPlatforms || hasOneWay).toBe(true);
    expect(hasWalls).toBe(true);
  });

  it("boss spawns closer to player spawn (left third of arena)", () => {
    const lvl = generateLevel({ seed: "boss-pos", floor: 5 });
    const bossEnemy = lvl.enemies.find((e) => e.role === "boss");
    expect(bossEnemy).toBeDefined();
    // Boss should be in the left third (tile ~13 = ~13*32+16 = 432px)
    const leftThirdPx = Math.floor(lvl.widthTiles / 3) * lvl.tileSize;
    expect(bossEnemy!.pos.x).toBeLessThanOrEqual(leftThirdPx + lvl.tileSize);
  });

  it("standard layouts have platform chains on later floors", () => {
    // Generate several standard layouts at floor 4+ and check for ONE_WAY tiles
    // (chains use ONE_WAY_TILE)
    let foundChains = false;
    for (let i = 0; i < 50 && !foundChains; i++) {
      const lvl = generateLevel({ seed: `chain-${i}`, floor: 4 });
      if (lvl.layout === "standard") {
        const flat = lvl.data.flat();
        if (flat.includes(TILE.ONE_WAY)) foundChains = true;
      }
    }
    expect(foundChains).toBe(true);
  });

  it("parkour layout can appear as early as floor 2", () => {
    let foundParkour = false;
    for (let i = 0; i < 200 && !foundParkour; i++) {
      const lvl = generateLevel({ seed: `parkour-early-${i}`, floor: 2 });
      if (lvl.layout === "parkour") foundParkour = true;
    }
    expect(foundParkour).toBe(true);
  });

  it("cityblock layout generates buildings with walls and rooftop platforms", () => {
    let found = false;
    for (let i = 0; i < 300 && !found; i++) {
      const lvl = generateLevel({ seed: `city-${i}`, floor: 4 });
      if (lvl.layout === "cityblock") {
        found = true;
        // Should have building footprints
        expect(lvl.buildings.length).toBeGreaterThanOrEqual(1);
        // Tile data must have WALL and PLATFORM tiles
        const flat = lvl.data.flat();
        expect(flat.includes(TILE.WALL)).toBe(true);
        expect(flat.includes(TILE.PLATFORM)).toBe(true);
        // All building footprints within tile bounds
        for (const b of lvl.buildings) {
          expect(b.x).toBeGreaterThanOrEqual(0);
          expect(b.y).toBeGreaterThanOrEqual(0);
          expect(b.x + b.w).toBeLessThanOrEqual(lvl.widthTiles);
          expect(b.y + b.h).toBeLessThanOrEqual(lvl.heightTiles);
        }
      }
    }
    expect(found).toBe(true);
  });

  it("alleyrun layout generates building structures on canyon walls", () => {
    let found = false;
    for (let i = 0; i < 300 && !found; i++) {
      const lvl = generateLevel({ seed: `alley-${i}`, floor: 3 });
      if (lvl.layout === "alleyrun") {
        found = true;
        // Alleyrun has canyon walls — must include WALL tiles
        const flat = lvl.data.flat();
        expect(flat.includes(TILE.WALL)).toBe(true);
        // Spawn inside bounds
        expect(lvl.spawn.player.x).toBeGreaterThanOrEqual(0);
        expect(lvl.spawn.player.y).toBeGreaterThanOrEqual(0);
        // Level is the correct wide shape (90 tiles)
        expect(lvl.widthTiles).toBe(90);
      }
    }
    expect(found).toBe(true);
  });

  it("rooftops layout generates building columns with platforms at varying heights", () => {
    let found = false;
    for (let i = 0; i < 300 && !found; i++) {
      const lvl = generateLevel({ seed: `roof-${i}`, floor: 4 });
      if (lvl.layout === "rooftops") {
        found = true;
        // Rooftops layout: buildings contain footprints and PLATFORM tiles
        const flat = lvl.data.flat();
        expect(flat.includes(TILE.PLATFORM)).toBe(true);
        // Should have multiple building footprints
        expect(lvl.buildings.length).toBeGreaterThanOrEqual(1);
        // All buildings within tile bounds
        for (const b of lvl.buildings) {
          expect(b.x).toBeGreaterThanOrEqual(0);
          expect(b.y).toBeGreaterThanOrEqual(0);
          expect(b.x + b.w).toBeLessThanOrEqual(lvl.widthTiles);
          expect(b.y + b.h).toBeLessThanOrEqual(lvl.heightTiles);
        }
      }
    }
    expect(found).toBe(true);
  });

  it("city layouts include ONE_WAY tiles for fire escapes and bridges", () => {
    const cityLayouts = ["cityblock", "alleyrun"] as const;
    for (const targetLayout of cityLayouts) {
      let found = false;
      for (let i = 0; i < 300 && !found; i++) {
        const lvl = generateLevel({
          seed: `city-oneways-${targetLayout}-${i}`,
          floor: 4,
        });
        if (lvl.layout === targetLayout) {
          found = true;
          const flat = lvl.data.flat();
          // City layouts should have ONE_WAY tiles for fire escapes / bridges
          expect(flat.includes(TILE.ONE_WAY)).toBe(true);
        }
      }
      expect(found).toBe(true);
    }
  });
});
