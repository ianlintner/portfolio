import {
  IMAGES,
  PARALLAX_SETS,
  SPRITESHEETS,
  TILESETS,
  getParallaxLayerKey,
  getParallaxLayerUrl,
} from "./manifest";

describe("game asset manifest", () => {
  it("has unique keys", () => {
    const keys = [
      ...Object.values(SPRITESHEETS).map((x) => x.key),
      ...Object.values(IMAGES).map((x) => x.key),
      ...Object.values(TILESETS).map((x) => x.key),
    ];

    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dupes).toEqual([]);
  });

  it("uses absolute /assets URLs", () => {
    const urls = [
      ...Object.values(SPRITESHEETS).map((x) => x.url),
      ...Object.values(IMAGES).map((x) => x.url),
      ...Object.values(TILESETS)
        .map((x) => x.url)
        .filter((x): x is string => Boolean(x)),
    ];

    for (const url of urls) {
      expect(url.startsWith("/assets/")).toBe(true);
    }
  });

  it("parallax sets are internally consistent", () => {
    for (const set of Object.values(PARALLAX_SETS)) {
      expect(set.layerCount).toBeGreaterThan(0);
      expect(set.scrollFactors.length).toBeGreaterThan(0);

      for (let i = 1; i <= set.layerCount; i++) {
        const key = getParallaxLayerKey(set, i);
        const url = getParallaxLayerUrl(set, i);
        expect(key).toContain(set.keyPrefix);
        expect(url.startsWith("/assets/")).toBe(true);
      }
    }
  });

  it("computes correct parallax URLs (spaces encoded)", () => {
    // Base-path-only (industrial)
    expect(getParallaxLayerUrl(PARALLAX_SETS.industrial1, 1)).toBe(
      "/assets/game/2-Background/1.png",
    );
  });
});
