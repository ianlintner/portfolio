import * as Phaser from "phaser";

export const GENERATED_TEXTURES = {
  platformFallback: "platform",
  movingPlatform: "movingPlatform",
  hazardSpike: "hazardSpike",
  hazardSteamOff: "hazardSteamOff",
  hazardSteamOn: "hazardSteamOn",
  enemyProjectile: "enemyProjectile",
  collectibleCoin: "collectibleCoin",
  collectibleGem: "collectibleGem",
  collectibleHeartSmall: "collectibleHeartSmall",
  collectibleHeartBig: "collectibleHeartBig",
  buildingTall: "buildingTall",
  buildingMedium: "buildingMedium",
  buildingShort: "buildingShort",
  buildingTower: "buildingTower",
  buildingPlant: "buildingPlant",
  buildingNeonShop: "buildingNeonShop",
  buildingHoloBar: "buildingHoloBar",
  buildingArcade: "buildingArcade",
  buildingClinic: "buildingClinic",
  buildingTechShop: "buildingTechShop",
  buildingMegaBlock: "buildingMegaBlock",
  buildingTerminal: "buildingTerminal",
  buildingComplex: "buildingComplex",
  buildingTenementTall: "buildingTenementTall",
  buildingHousingBlock: "buildingHousingBlock",
  buildingApartmentSpire: "buildingApartmentSpire",
  streetLamp: "streetLamp",
  powerPole: "powerPole",
  // Building tile textures (32x32, for decoration alignment)
  tileBrickWall: "tileBrickWall",
  tileBrickWallDark: "tileBrickWallDark",
  tileFireEscape: "tileFireEscape",
  tileAwning: "tileAwning",
  tileRooftop: "tileRooftop",
  tileRooftopEdge: "tileRooftopEdge",
  tileHVAC: "tileHVAC",
  tileWindowLit: "tileWindowLit",
  tileWindowDark: "tileWindowDark",
  tileNeonSign: "tileNeonSign",
  tilePipe: "tilePipe",
  // Larger decoration elements
  decoWaterTower: "decoWaterTower",
  decoAntenna: "decoAntenna",
  decoDumpster: "decoDumpster",
  decoACUnit: "decoACUnit",
  // City parallax layers (800×600 runtime-generated skylines)
  cityParallax1: "cityParallax1",
  cityParallax2: "cityParallax2",
  cityParallax3: "cityParallax3",
} as const;

function withGraphics(
  scene: Phaser.Scene,
  draw: (graphics: Phaser.GameObjects.Graphics) => void,
  key: string,
  width: number,
  height: number,
) {
  if (scene.textures.exists(key)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.setVisible(false);
  draw(graphics);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
}

function createPlatformFallback(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0xffffff).fillRect(0, 0, 32, 32);
    },
    GENERATED_TEXTURES.platformFallback,
    32,
    32,
  );
}

function createMovingPlatformTexture(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x0f172a).fillRoundedRect(0, 2, 96, 14, 4);
      g.fillStyle(0x334155).fillRoundedRect(2, 3, 92, 10, 3);
      g.fillStyle(0x64748b).fillRect(4, 5, 88, 2);
      g.fillStyle(0x475569).fillRect(4, 8, 88, 3);

      for (let x = 8; x <= 76; x += 16) {
        g.fillStyle(0xf59e0b).fillRect(x, 10, 6, 2);
        g.fillStyle(0x1f2937).fillRect(x + 6, 10, 6, 2);
      }

      g.fillStyle(0xe2e8f0).fillRect(8, 5, 10, 1);
      g.fillStyle(0xe2e8f0).fillRect(78, 5, 10, 1);
    },
    GENERATED_TEXTURES.movingPlatform,
    96,
    18,
  );
}

function createSpikeTexture(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x111827).fillRect(0, 24, 32, 8);
      g.fillStyle(0x374151).fillRect(2, 21, 28, 6);
      g.fillStyle(0x6b7280).fillRect(4, 23, 24, 1);

      const bases = [3, 11, 19];
      for (const baseX of bases) {
        g.fillStyle(0xfb923c).fillTriangle(
          baseX,
          22,
          baseX + 5,
          8,
          baseX + 10,
          22,
        );
        g.fillStyle(0xf97316).fillTriangle(
          baseX + 2,
          22,
          baseX + 5,
          12,
          baseX + 8,
          22,
        );
        g.fillStyle(0xffedd5).fillTriangle(
          baseX + 4,
          10,
          baseX + 5,
          8,
          baseX + 6,
          10,
        );
      }
    },
    GENERATED_TEXTURES.hazardSpike,
    32,
    32,
  );
}

function drawSteamVentBase(g: Phaser.GameObjects.Graphics) {
  g.fillStyle(0x111827).fillRoundedRect(5, 18, 22, 12, 3);
  g.fillStyle(0x475569).fillRoundedRect(7, 19, 18, 8, 2);
  g.fillStyle(0x94a3b8).fillRect(9, 21, 14, 1);
  g.fillStyle(0x334155).fillRect(9, 23, 14, 1);
  g.fillStyle(0x94a3b8).fillRect(9, 25, 14, 1);
  g.fillStyle(0xf59e0b).fillCircle(10, 27, 2);
  g.fillStyle(0x1e293b).fillRect(13, 16, 6, 3);
}

function createSteamVentTextures(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      drawSteamVentBase(g);
    },
    GENERATED_TEXTURES.hazardSteamOff,
    32,
    32,
  );

  withGraphics(
    scene,
    (g) => {
      drawSteamVentBase(g);
      g.fillStyle(0xe2e8f0, 0.5).fillEllipse(12, 13, 10, 9);
      g.fillStyle(0xe2e8f0, 0.65).fillEllipse(18, 10, 14, 12);
      g.fillStyle(0xf8fafc, 0.85).fillEllipse(12, 7, 12, 10);
      g.fillStyle(0xf8fafc, 0.75).fillEllipse(20, 6, 10, 8);
    },
    GENERATED_TEXTURES.hazardSteamOn,
    32,
    32,
  );
}

function createEnemyProjectileTexture(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x7f1d1d).fillRoundedRect(1, 4, 14, 8, 3);
      g.fillStyle(0xef4444).fillRoundedRect(3, 5, 10, 6, 3);
      g.fillStyle(0xfca5a5).fillRect(5, 7, 6, 2);
      g.fillStyle(0xfef2f2).fillRect(6, 6, 2, 1);
      g.fillStyle(0xfef2f2).fillRect(9, 9, 2, 1);
    },
    GENERATED_TEXTURES.enemyProjectile,
    16,
    16,
  );
}

function createCollectibleTextures(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0xb45309).fillCircle(12, 12, 9);
      g.fillStyle(0xfacc15).fillCircle(12, 12, 7);
      g.fillStyle(0xfef08a).fillCircle(10, 10, 2);
      g.fillStyle(0xeab308).fillRect(10, 8, 4, 8);
      g.fillStyle(0xeab308).fillRect(8, 10, 8, 4);
    },
    GENERATED_TEXTURES.collectibleCoin,
    24,
    24,
  );

  withGraphics(
    scene,
    (g) => {
      const points = [
        new Phaser.Geom.Point(12, 1),
        new Phaser.Geom.Point(20, 9),
        new Phaser.Geom.Point(16, 21),
        new Phaser.Geom.Point(8, 21),
        new Phaser.Geom.Point(4, 9),
      ];
      g.fillStyle(0x0f172a).fillPoints(points, true);
      g.fillStyle(0x38bdf8).fillPoints(
        [
          new Phaser.Geom.Point(12, 3),
          new Phaser.Geom.Point(18, 9),
          new Phaser.Geom.Point(15, 19),
          new Phaser.Geom.Point(9, 19),
          new Phaser.Geom.Point(6, 9),
        ],
        true,
      );
      g.fillStyle(0xe0f2fe).fillTriangle(12, 4, 16, 9, 12, 12);
    },
    GENERATED_TEXTURES.collectibleGem,
    24,
    24,
  );

  const drawHeart = (g: Phaser.GameObjects.Graphics, innerColor: number) => {
    g.fillStyle(0x7f1d1d).fillCircle(8, 8, 5);
    g.fillStyle(0x7f1d1d).fillCircle(16, 8, 5);
    g.fillStyle(0x7f1d1d).fillTriangle(3, 10, 21, 10, 12, 22);
    g.fillStyle(innerColor).fillCircle(8, 8, 3.5);
    g.fillStyle(innerColor).fillCircle(16, 8, 3.5);
    g.fillStyle(innerColor).fillTriangle(5, 10, 19, 10, 12, 19);
    g.fillStyle(0xfecdd3).fillCircle(8, 7, 1.3);
    g.fillStyle(0xfecdd3).fillCircle(15, 7, 1.3);
  };

  withGraphics(
    scene,
    (g) => drawHeart(g, 0xfb7185),
    GENERATED_TEXTURES.collectibleHeartSmall,
    24,
    24,
  );

  withGraphics(
    scene,
    (g) => drawHeart(g, 0xef4444),
    GENERATED_TEXTURES.collectibleHeartBig,
    24,
    24,
  );
}

// ── Midground buildings ──────────────────────────────────────────────────────

function drawWindows(
  g: Phaser.GameObjects.Graphics,
  startX: number,
  startY: number,
  cols: number,
  rows: number,
  winW: number,
  winH: number,
  gapX: number,
  gapY: number,
) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = startX + c * (winW + gapX);
      const wy = startY + r * (winH + gapY);
      const lit = (r + c) % 3 !== 0;
      g.fillStyle(0x0f172a, 0.85);
      g.fillRect(wx, wy, winW, winH);
      g.fillStyle(lit ? 0xfbbf24 : 0x22304b, lit ? 0.82 : 0.7);
      g.fillRect(wx + 1, wy + 1, Math.max(1, winW - 2), Math.max(1, winH - 2));
      g.fillStyle(0x111827, 0.65);
      g.fillRect(wx, wy + winH - 1, winW, 1);
      if (lit) {
        g.fillStyle(0xfef3c7, 0.4);
        g.fillRect(wx + 1, wy + 1, Math.max(1, winW - 3), 1);
      }
    }
  }
}

function drawHazardBand(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  for (let dx = 0; dx < width; dx += 8) {
    g.fillStyle((Math.floor(dx / 8) + 1) % 2 === 0 ? 0xdc2626 : 0xf97316);
    g.fillRect(x + dx, y, 4, height);
  }
}

function drawBeaconStrip(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
) {
  g.fillStyle(0x334155).fillRect(x, y, width, 3);
  for (let dx = x + 4; dx < x + width - 3; dx += 12) {
    g.fillStyle(0xf59e0b).fillRect(dx, y - 1, 3, 4);
    g.fillStyle(0xfef3c7, 0.45).fillRect(dx, y - 1, 2, 1);
  }
}

function drawServiceCap(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
) {
  g.fillStyle(0x475569).fillRect(x, y, width, 4);
  g.fillStyle(0x64748b).fillRect(x + 2, y, width - 4, 1);
  for (let dx = x + 6; dx < x + width - 6; dx += 14) {
    g.fillStyle(0x1e293b).fillRect(dx, y + 1, 8, 2);
  }
}

function drawWarningNodes(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
) {
  g.fillStyle(0x2d3a5c).fillRect(x, y, width, 3);
  for (let dx = x + 3; dx < x + width - 3; dx += 10) {
    g.fillStyle(0xef4444).fillRect(dx, y, 2, 3);
    g.fillStyle(0xfbbf24).fillRect(dx + 3, y, 2, 3);
  }
}

function drawRoofRail(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
) {
  g.fillStyle(0x64748b).fillRect(x, y, width, 2);
  for (let dx = x; dx <= x + width; dx += 10) {
    g.fillStyle(0x475569).fillRect(dx, y - 5, 2, 7);
  }
}

function drawPanelLines(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  step: number,
) {
  g.fillStyle(0x111827, 0.45);
  for (let yy = y + step; yy < y + height; yy += step) {
    g.fillRect(x, yy, width, 1);
  }
}

function drawPipeColumn(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  height: number,
) {
  g.fillStyle(0x475569).fillRect(x, y, 6, height);
  g.fillStyle(0x64748b).fillRect(x + 1, y, 4, 2);
  g.fillStyle(0x334155).fillRect(x - 2, y + 6, 10, 2);
}

function drawCrossBracePanel(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  g.fillStyle(0x23314d).fillRect(x, y, width, height);
  g.fillStyle(0x475569, 0.9);
  for (let i = 0; i < width; i += 3) {
    const y1 = y + Math.floor((i / width) * height);
    const y2 = y + height - 1 - Math.floor((i / width) * height);
    g.fillRect(x + i, y1, 2, 2);
    g.fillRect(x + i, y2, 2, 2);
  }
}

function drawVentGrille(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  g.fillStyle(0x23314d).fillRect(x, y, width, height);
  g.fillStyle(0x475569).fillRect(x, y, width, 2);
  g.fillStyle(0x111827, 0.65);
  for (let yy = y + 3; yy < y + height - 1; yy += 3) {
    g.fillRect(x + 2, yy, width - 4, 1);
  }
}

function drawNeonFrame(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
) {
  g.fillStyle(color, 0.08).fillRect(x - 4, y - 4, width + 8, height + 8);
  g.fillStyle(color, 0.14).fillRect(x - 2, y - 2, width + 4, height + 4);
  g.fillStyle(color, 0.24).fillRect(x - 1, y - 1, width + 2, height + 2);
  g.fillStyle(color, 0.8).fillRect(x, y, width, 1);
  g.fillRect(x, y + height - 1, width, 1);
  g.fillRect(x, y, 1, height);
  g.fillRect(x + width - 1, y, 1, height);
}

// ── Pixel glyph tables (A-Z, 0-9, punctuation) ─────────────────────────────
const PIXEL_GLYPHS: Record<string, number[][]> = {
  A: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  B: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
  ],
  C: [
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 1],
  ],
  D: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  F: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  G: [
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
  ],
  H: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  J: [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
  ],
  K: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  M: [
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  N: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  O: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  P: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  Q: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
    [0, 1, 1],
  ],
  R: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 0],
    [1, 0, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  U: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
  ],
  V: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  W: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
  ],
  X: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  Y: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  Z: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 0],
  ],
  "6": [
    [0, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "9": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 0],
  ],
  "+": [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "-": [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  "!": [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ],
};

function drawPixelWord(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  letters: string[],
  color: number,
) {
  g.fillStyle(color);
  let cursorX = x;
  for (const letter of letters) {
    const glyph = PIXEL_GLYPHS[letter];
    if (!glyph) {
      cursorX += 4;
      continue;
    }
    glyph.forEach((row, rowIndex) => {
      row.forEach((px, colIndex) => {
        if (px) g.fillRect(cursorX + colIndex * 2, y + rowIndex * 2, 2, 2);
      });
    });
    cursorX += (glyph[0].length + 1) * 2;
  }
}

function measurePixelWord(letters: string[]): number {
  let w = 0;
  for (const letter of letters) {
    const glyph = PIXEL_GLYPHS[letter];
    w += glyph ? (glyph[0].length + 1) * 2 : 4;
  }
  return Math.max(0, w - 2);
}

function drawCenteredPixelWord(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  letters: string[],
  color: number,
) {
  const wordWidth = measurePixelWord(letters);
  const wordHeight = 10;
  const startX = x + Math.floor((width - wordWidth) / 2);
  const startY = y + Math.floor((height - wordHeight) / 2);
  drawPixelWord(g, startX, startY, letters, color);
}

// ── Vertical glyph table (4-wide CJK + Latin) ──────────────────────────────
const VERTICAL_GLYPHS: Record<string, number[][]> = {
  // Latin
  S: [
    [0, 1, 1, 0],
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  Y: [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  N: [
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [0, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  R: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  X: [
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
  ],
  // Japanese katakana
  カ: [
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
    [0, 0, 0, 1],
  ],
  ラ: [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  オ: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
  ],
  ケ: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  ネ: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 1, 0, 1],
  ],
  コ: [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  ン: [
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
  ],
  ビ: [
    [0, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  ル: [
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 1],
    [1, 0, 1, 1],
  ],
  テ: [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  ク: [
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1],
  ],
  ノ: [
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // Chinese simplified
  面: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
  ],
  馆: [
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 0],
  ],
  茶: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
  酒: [
    [1, 0, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  药: [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
  ],
  店: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  城: [
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 1, 1],
  ],
  火: [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  // Korean
  빠: [
    [1, 1, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  른: [
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
};

function drawVerticalPixelGlyphs(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  glyphsToDraw: string[],
  color: number,
) {
  g.fillStyle(color);
  let cursorY = y;
  for (const glyphKey of glyphsToDraw) {
    const glyph = VERTICAL_GLYPHS[glyphKey];
    if (!glyph) {
      cursorY += 8;
      continue;
    }
    glyph.forEach((row, rowIndex) => {
      row.forEach((px, colIndex) => {
        if (px) g.fillRect(x + colIndex * 2, cursorY + rowIndex * 2, 2, 2);
      });
    });
    cursorY += 12;
  }
}

function drawMedicalCross(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  color: number,
) {
  g.fillStyle(color, 0.2).fillRect(x - 3, y - 3, 14, 14);
  g.fillStyle(color).fillRect(x + 3, y, 4, 8);
  g.fillRect(x, y + 3, 10, 4);
  g.fillStyle(0xdcfce7, 0.7).fillRect(x + 4, y + 1, 2, 2);
}

function drawLeafSign(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  color: number,
) {
  g.fillStyle(color, 0.18).fillEllipse(x + 6, y + 8, 18, 20);
  g.fillStyle(color).fillEllipse(x + 6, y + 8, 12, 16);
  g.fillStyle(0x166534, 0.9).fillRect(x + 5, y + 4, 2, 10);
  g.fillStyle(0xdcfce7, 0.5).fillRect(x + 6, y + 5, 1, 7);
}

function drawCapsuleSign(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  leftColor: number,
  rightColor: number,
) {
  g.fillStyle(leftColor, 0.18).fillRoundedRect(x - 2, y - 2, 24, 12, 6);
  g.fillStyle(rightColor, 0.18).fillRoundedRect(x - 2, y - 2, 24, 12, 6);
  g.fillStyle(leftColor).fillRoundedRect(x, y, 10, 8, 4);
  g.fillStyle(rightColor).fillRoundedRect(x + 10, y, 10, 8, 4);
  g.fillStyle(0xf8fafc, 0.85).fillRect(x + 10, y + 1, 1, 6);
  g.fillStyle(0xffffff, 0.55).fillRect(x + 3, y + 1, 4, 1);
  g.fillStyle(0xffffff, 0.55).fillRect(x + 13, y + 5, 4, 1);
}

function drawTacoSign(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0xf59e0b, 0.2).fillEllipse(x + 8, y + 7, 22, 14);
  g.fillStyle(0xfbbf24).fillEllipse(x + 8, y + 8, 18, 12);
  g.fillStyle(0x78350f).fillRect(x + 2, y + 8, 12, 1);
  g.fillStyle(0x22c55e).fillRect(x + 3, y + 6, 3, 2);
  g.fillRect(x + 8, y + 5, 3, 2);
  g.fillStyle(0xef4444).fillRect(x + 6, y + 8, 2, 2);
  g.fillRect(x + 11, y + 7, 2, 2);
}

// ── Cyberpunk neon palette ───────────────────────────────────────────────────

const NEON_COLORS = {
  cyan: { frame: 0x06b6d4, text: 0x67e8f9 },
  magenta: { frame: 0xf472b6, text: 0xf9a8d4 },
  amber: { frame: 0xf59e0b, text: 0xfef3c7 },
  red: { frame: 0xef4444, text: 0xfecaca },
  green: { frame: 0x22c55e, text: 0xdcfce7 },
  purple: { frame: 0xa855f7, text: 0xe9d5ff },
  pink: { frame: 0xec4899, text: 0xfce7f3 },
  orange: { frame: 0xf97316, text: 0xffedd5 },
  blue: { frame: 0x3b82f6, text: 0xdbeafe },
  lime: { frame: 0x84cc16, text: 0xecfccb },
  teal: { frame: 0x14b8a6, text: 0xccfbf1 },
  rose: { frame: 0xfb7185, text: 0xfecdd3 },
} as const;

type NeonColorKey = keyof typeof NEON_COLORS;
const NEON_COLOR_KEYS = Object.keys(NEON_COLORS) as NeonColorKey[];

type SignEntry =
  | { kind: "text"; letters: string[]; colors?: NeonColorKey[] }
  | { kind: "blade"; glyphs: string[]; colors?: NeonColorKey[] }
  | {
      kind: "icon";
      draw: (
        g: Phaser.GameObjects.Graphics,
        x: number,
        y: number,
        color: number,
      ) => void;
      colors?: NeonColorKey[];
    };

// 200 signs — mostly English, some Japanese, Korean, Chinese, Spanish
const CYBERPUNK_SIGNS: SignEntry[] = [
  // ── English text signs (~130) ──
  { kind: "text", letters: ["B", "A", "R"] },
  { kind: "text", letters: ["P", "A", "W", "N"] },
  { kind: "text", letters: ["G", "U", "N", "S"], colors: ["red", "orange"] },
  {
    kind: "text",
    letters: ["O", "P", "E", "N"],
    colors: ["cyan", "green", "lime"],
  },
  { kind: "text", letters: ["I", "M", "P", "L"] },
  { kind: "text", letters: ["D", "O", "C"], colors: ["green"] },
  { kind: "text", letters: ["C", "A", "T"], colors: ["green", "lime", "teal"] },
  { kind: "text", letters: ["R", "X"], colors: ["cyan", "blue"] },
  { kind: "text", letters: ["H", "A", "C", "K"] },
  { kind: "text", letters: ["D", "A", "T", "A"] },
  { kind: "text", letters: ["N", "E", "O", "N"] },
  { kind: "text", letters: ["B", "Y", "T", "E"] },
  { kind: "text", letters: ["N", "O", "D", "E"] },
  { kind: "text", letters: ["C", "O", "D", "E"] },
  { kind: "text", letters: ["L", "I", "N", "K"] },
  { kind: "text", letters: ["Z", "E", "R", "O"] },
  { kind: "text", letters: ["V", "O", "I", "D"] },
  { kind: "text", letters: ["P", "U", "L", "S", "E"] },
  { kind: "text", letters: ["G", "R", "I", "D"] },
  { kind: "text", letters: ["E", "D", "G", "E"] },
  { kind: "text", letters: ["D", "U", "S", "K"] },
  { kind: "text", letters: ["R", "U", "S", "T"] },
  { kind: "text", letters: ["I", "N", "K"] },
  { kind: "text", letters: ["N", "E", "T"] },
  { kind: "text", letters: ["H", "U", "B"] },
  { kind: "text", letters: ["J", "A", "C", "K"] },
  { kind: "text", letters: ["D", "E", "N"] },
  { kind: "text", letters: ["C", "R", "E", "W"] },
  { kind: "text", letters: ["F", "U", "E", "L"] },
  { kind: "text", letters: ["C", "O", "R", "E"] },
  { kind: "text", letters: ["D", "R", "O", "P"] },
  { kind: "text", letters: ["P", "O", "R", "T"] },
  { kind: "text", letters: ["S", "L", "O", "T"] },
  { kind: "text", letters: ["M", "O", "D", "S"] },
  { kind: "text", letters: ["V", "E", "N", "D"] },
  { kind: "text", letters: ["W", "I", "R", "E"] },
  { kind: "text", letters: ["T", "U", "N", "E"] },
  { kind: "text", letters: ["F", "L", "U", "X"] },
  { kind: "text", letters: ["R", "A", "V", "E"] },
  { kind: "text", letters: ["S", "H", "O", "P"] },
  { kind: "text", letters: ["C", "A", "F", "E"] },
  { kind: "text", letters: ["E", "A", "T", "S"] },
  { kind: "text", letters: ["B", "E", "E", "R"] },
  { kind: "text", letters: ["G", "L", "O", "W"] },
  { kind: "text", letters: ["B", "U", "R", "N"] },
  { kind: "text", letters: ["J", "O", "L", "T"] },
  { kind: "text", letters: ["B", "O", "O", "T"] },
  { kind: "text", letters: ["S", "C", "A", "N"] },
  { kind: "text", letters: ["D", "I", "A", "L"] },
  { kind: "text", letters: ["Z", "O", "N", "E"] },
  { kind: "text", letters: ["R", "I", "S", "K"] },
  { kind: "text", letters: ["C", "L", "U", "B"] },
  { kind: "text", letters: ["G", "A", "S"] },
  { kind: "text", letters: ["A", "R", "M", "S"] },
  { kind: "text", letters: ["B", "O", "T", "S"] },
  { kind: "text", letters: ["D", "I", "G", "S"] },
  { kind: "text", letters: ["R", "E", "N", "T"] },
  { kind: "text", letters: ["P", "A", "D"] },
  { kind: "text", letters: ["L", "A", "B"] },
  { kind: "text", letters: ["C", "H", "I", "P"] },
  { kind: "text", letters: ["S", "P", "I", "N"] },
  { kind: "text", letters: ["D", "A", "S", "H"] },
  { kind: "text", letters: ["T", "A", "N", "K"] },
  { kind: "text", letters: ["V", "A", "U", "L", "T"] },
  { kind: "text", letters: ["B", "L", "A", "D", "E"] },
  { kind: "text", letters: ["S", "T", "E", "E", "L"] },
  { kind: "text", letters: ["P", "L", "A", "S", "M", "A"] },
  { kind: "text", letters: ["C", "H", "R", "O", "M", "E"] },
  { kind: "text", letters: ["S", "Y", "N", "T", "H"] },
  { kind: "text", letters: ["P", "A", "R", "T", "S"] },
  { kind: "text", letters: ["F", "I", "X"] },
  { kind: "text", letters: ["P", "R", "O", "B", "E"] },
  { kind: "text", letters: ["S", "U", "R", "G", "E"] },
  { kind: "text", letters: ["D", "O", "J", "O"] },
  { kind: "text", letters: ["Z", "E", "N"] },
  { kind: "text", letters: ["R", "A", "M", "E", "N"] },
  { kind: "text", letters: ["S", "U", "S", "H", "I"] },
  { kind: "text", letters: ["W", "O", "K"] },
  { kind: "text", letters: ["D", "I", "M"] },
  { kind: "text", letters: ["G", "Y", "M"] },
  { kind: "text", letters: ["S", "P", "A"] },
  { kind: "text", letters: ["I", "N", "N"] },
  { kind: "text", letters: ["T", "A", "X", "I"] },
  { kind: "text", letters: ["C", "O", "P", "S"], colors: ["blue", "cyan"] },
  { kind: "text", letters: ["E", "X", "I", "T"], colors: ["red", "rose"] },
  { kind: "text", letters: ["B", "A", "N", "K"] },
  { kind: "text", letters: ["S", "A", "F", "E"] },
  { kind: "text", letters: ["D", "U", "M", "P"] },
  { kind: "text", letters: ["P", "R", "I", "N", "T"] },
  { kind: "text", letters: ["O", "I", "L"] },
  { kind: "text", letters: ["H", "O", "T", "E", "L"] },
  { kind: "text", letters: ["M", "O", "T", "E", "L"] },
  { kind: "text", letters: ["C", "L", "I", "N", "I", "C"] },
  { kind: "text", letters: ["A", "R", "C", "A", "D", "E"] },
  { kind: "text", letters: ["T", "E", "C", "H"] },
  { kind: "text", letters: ["I", "O", "N"] },
  { kind: "text", letters: ["F", "L", "A", "S", "H"] },
  { kind: "text", letters: ["B", "O", "U", "N", "T", "Y"] },
  { kind: "text", letters: ["L", "O", "O", "T"] },
  { kind: "text", letters: ["P", "I", "X", "E", "L"] },
  { kind: "text", letters: ["G", "L", "I", "T", "C", "H"] },
  { kind: "text", letters: ["W", "A", "S", "T", "E"] },
  { kind: "text", letters: ["D", "R", "O", "I", "D"] },
  { kind: "text", letters: ["C", "Y", "B", "E", "R"] },
  { kind: "text", letters: ["N", "I", "G", "H", "T"] },
  {
    kind: "text",
    letters: ["2", "4", "-", "7"],
    colors: ["amber", "orange", "red"],
  },
  { kind: "text", letters: ["L", "I", "V", "E"] },
  { kind: "text", letters: ["D", "E", "A", "D"] },
  { kind: "text", letters: ["K", "I", "L", "L"] },
  { kind: "text", letters: ["V", "I", "P"] },
  { kind: "text", letters: ["S", "A", "L", "E"] },
  { kind: "text", letters: ["F", "R", "E", "E"] },
  { kind: "text", letters: ["N", "E", "W", "!"] },
  { kind: "text", letters: ["H", "O", "T", "!"] },
  // ── Spanish text signs (~12) ──
  { kind: "text", letters: ["C", "A", "N", "T", "I", "N", "A"] },
  {
    kind: "text",
    letters: ["T", "A", "C", "O", "S"],
    colors: ["orange", "amber"],
  },
  { kind: "text", letters: ["B", "O", "D", "E", "G", "A"] },
  { kind: "text", letters: ["J", "O", "Y", "A", "S"] },
  { kind: "text", letters: ["M", "O", "D", "A"] },
  { kind: "text", letters: ["L", "U", "Z"] },
  { kind: "text", letters: ["S", "O", "L"] },
  { kind: "text", letters: ["R", "E", "D"] },
  { kind: "text", letters: ["V", "I", "D", "A"] },
  { kind: "text", letters: ["C", "A", "S", "A"] },
  { kind: "text", letters: ["A", "G", "U", "A"] },
  { kind: "text", letters: ["P", "A", "Z"] },
  // ── Vertical blade signs (~30) ──
  {
    kind: "blade",
    glyphs: ["カ", "ラ", "オ", "ケ"],
    colors: ["magenta", "pink"],
  },
  { kind: "blade", glyphs: ["面", "馆"], colors: ["red", "rose", "orange"] },
  { kind: "blade", glyphs: ["S", "Y", "N"], colors: ["cyan"] },
  { kind: "blade", glyphs: ["B", "A", "R"] },
  { kind: "blade", glyphs: ["酒", "店"] },
  { kind: "blade", glyphs: ["茶", "店"] },
  { kind: "blade", glyphs: ["药", "店"], colors: ["green"] },
  { kind: "blade", glyphs: ["火", "城"] },
  { kind: "blade", glyphs: ["ネ", "コ"], colors: ["green", "lime"] },
  { kind: "blade", glyphs: ["テ", "ク", "ノ"] },
  { kind: "blade", glyphs: ["ビ", "ル"] },
  { kind: "blade", glyphs: ["빠", "른"] },
  { kind: "blade", glyphs: ["N", "E", "X"], colors: ["cyan", "blue"] },
  { kind: "blade", glyphs: ["D", "A", "T", "A"] },
  { kind: "blade", glyphs: ["E", "D", "G", "E"] },
  { kind: "blade", glyphs: ["R", "X"], colors: ["cyan", "green"] },
  { kind: "blade", glyphs: ["城", "店"] },
  { kind: "blade", glyphs: ["A", "R", "C"] },
  { kind: "blade", glyphs: ["C", "O", "D", "E"] },
  { kind: "blade", glyphs: ["X", "E", "N"] },
  // ── Icon signs (~20) ──
  {
    kind: "icon",
    draw: (g, x, y, c) => drawMedicalCross(g, x, y, c),
    colors: ["green"],
  },
  {
    kind: "icon",
    draw: (g, x, y, c) => drawLeafSign(g, x, y, c),
    colors: ["green", "lime", "teal"],
  },
  {
    kind: "icon",
    draw: (g, x, y) => drawTacoSign(g, x, y),
    colors: ["orange", "amber"],
  },
  {
    kind: "icon",
    draw: (g, x, y, c) => drawCapsuleSign(g, x, y, c, 0xf472b6),
    colors: ["cyan", "blue"],
  },
  // Skull
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x - 1, y - 1, 14, 14);
      g.fillStyle(c)
        .fillRect(x + 2, y, 8, 8)
        .fillRect(x + 1, y + 8, 10, 4);
      g.fillStyle(0x0f172a)
        .fillRect(x + 3, y + 3, 2, 2)
        .fillRect(x + 7, y + 3, 2, 2);
      g.fillRect(x + 4, y + 9, 1, 2).fillRect(x + 7, y + 9, 1, 2);
    },
    colors: ["red", "rose", "purple"],
  },
  // Eye
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillEllipse(x + 6, y + 6, 18, 12);
      g.fillStyle(c).fillEllipse(x + 6, y + 6, 14, 8);
      g.fillStyle(0x0f172a).fillCircle(x + 6, y + 6, 3);
      g.fillStyle(0xffffff, 0.7).fillRect(x + 4, y + 3, 2, 2);
    },
  },
  // Lightning bolt
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x - 1, y - 1, 14, 16);
      g.fillStyle(c);
      g.fillRect(x + 6, y, 4, 4)
        .fillRect(x + 4, y + 4, 4, 3)
        .fillRect(x + 2, y + 7, 6, 3);
      g.fillRect(x + 4, y + 10, 4, 4);
    },
    colors: ["amber", "orange"],
  },
  // Gear
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillCircle(x + 6, y + 6, 8);
      g.fillStyle(c).fillCircle(x + 6, y + 6, 5);
      g.fillStyle(0x0f172a).fillCircle(x + 6, y + 6, 2);
      g.fillStyle(c)
        .fillRect(x + 5, y - 1, 2, 3)
        .fillRect(x + 5, y + 11, 2, 3);
      g.fillRect(x - 1, y + 5, 3, 2).fillRect(x + 11, y + 5, 3, 2);
    },
  },
  // Radiation
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillCircle(x + 6, y + 7, 8);
      g.fillStyle(c).fillTriangle(x + 6, y, x + 2, y + 8, x + 10, y + 8);
      g.fillTriangle(x + 1, y + 10, x + 6, y + 6, x + 6, y + 14);
      g.fillTriangle(x + 11, y + 10, x + 6, y + 6, x + 6, y + 14);
      g.fillStyle(0x0f172a).fillCircle(x + 6, y + 7, 2);
    },
    colors: ["amber", "red", "orange"],
  },
  // DNA helix
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 14);
      g.fillStyle(c);
      for (let i = 0; i < 7; i++) {
        const off = Math.round(Math.sin(i * 0.9) * 3);
        g.fillRect(x + 3 + off, y + i * 2, 2, 2);
        g.fillRect(x + 5 - off, y + i * 2, 2, 2);
      }
    },
    colors: ["cyan", "green", "purple"],
  },
  // Circuit
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x - 1, y - 1, 14, 14);
      g.fillStyle(c).fillRect(x + 3, y + 3, 6, 6);
      g.fillStyle(0x0f172a).fillRect(x + 4, y + 4, 4, 4);
      g.fillStyle(c)
        .fillRect(x + 5, y, 2, 3)
        .fillRect(x + 5, y + 9, 2, 3);
      g.fillRect(x, y + 5, 3, 2).fillRect(x + 9, y + 5, 3, 2);
    },
  },
  // Diamond
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 14);
      g.fillStyle(c);
      g.fillRect(x + 4, y + 1, 4, 2).fillRect(x + 2, y + 3, 8, 2);
      g.fillRect(x + 3, y + 5, 6, 2).fillRect(x + 4, y + 7, 4, 2);
      g.fillRect(x + 5, y + 9, 2, 2);
    },
    colors: ["cyan", "blue", "purple"],
  },
  // Star
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 12);
      g.fillStyle(c).fillRect(x + 5, y, 2, 2);
      g.fillRect(x + 3, y + 2, 6, 2).fillRect(x + 1, y + 4, 10, 2);
      g.fillRect(x + 3, y + 6, 6, 2)
        .fillRect(x + 2, y + 8, 3, 2)
        .fillRect(x + 7, y + 8, 3, 2);
    },
    colors: ["amber", "orange"],
  },
  // Heart
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 12);
      g.fillStyle(c)
        .fillRect(x + 1, y + 2, 4, 4)
        .fillRect(x + 7, y + 2, 4, 4);
      g.fillRect(x + 3, y + 1, 2, 2).fillRect(x + 7, y + 1, 2, 2);
      g.fillRect(x + 2, y + 6, 8, 2)
        .fillRect(x + 3, y + 8, 6, 2)
        .fillRect(x + 4, y + 10, 4, 1);
    },
    colors: ["red", "rose", "pink", "magenta"],
  },
  // Arrow up
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 14);
      g.fillStyle(c).fillRect(x + 5, y, 2, 12);
      g.fillRect(x + 3, y + 2, 2, 2).fillRect(x + 7, y + 2, 2, 2);
      g.fillRect(x + 1, y + 4, 2, 2).fillRect(x + 9, y + 4, 2, 2);
    },
  },
  // Lock
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 12, 14);
      g.fillStyle(c)
        .fillRect(x + 3, y, 6, 2)
        .fillRect(x + 2, y + 2, 2, 4)
        .fillRect(x + 8, y + 2, 2, 4);
      g.fillRect(x + 1, y + 6, 10, 7);
      g.fillStyle(0x0f172a).fillRect(x + 5, y + 8, 2, 3);
    },
    colors: ["amber", "red"],
  },
  // Wifi
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 14, 12);
      g.fillStyle(c).fillRect(x + 1, y + 2, 12, 2);
      g.fillRect(x + 3, y + 4, 8, 2).fillRect(x + 5, y + 6, 4, 2);
      g.fillRect(x + 6, y + 8, 2, 2);
    },
    colors: ["cyan", "green"],
  },
  // Atom
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillCircle(x + 6, y + 6, 8);
      g.fillStyle(c).fillCircle(x + 6, y + 6, 2);
      g.fillStyle(c, 0.7).fillEllipse(x + 6, y + 6, 16, 6);
      g.fillStyle(c, 0.5).fillEllipse(x + 6, y + 6, 6, 14);
    },
    colors: ["cyan", "purple", "blue"],
  },
  // Crown
  {
    kind: "icon",
    draw: (g, x, y, c) => {
      g.fillStyle(c, 0.2).fillRect(x, y, 14, 12);
      g.fillStyle(c).fillRect(x + 1, y + 4, 12, 6);
      g.fillRect(x + 1, y + 2, 2, 2)
        .fillRect(x + 6, y, 2, 4)
        .fillRect(x + 11, y + 2, 2, 2);
    },
    colors: ["amber", "orange", "purple"],
  },
];

// Deterministic hash for sign selection per building-texture index
function signHash(seed: number): number {
  let h = seed * 2654435761;
  h = ((h >>> 16) ^ h) * 0x45d9f3b;
  h = (h >>> 16) ^ h;
  return Math.abs(h);
}

function pickColor(
  sign: SignEntry,
  hash: number,
): { frame: number; text: number } {
  if (sign.colors && sign.colors.length > 0) {
    const key = sign.colors[hash % sign.colors.length];
    return NEON_COLORS[key];
  }
  return NEON_COLORS[NEON_COLOR_KEYS[hash % NEON_COLOR_KEYS.length]];
}

/**
 * Draw a single random sign on a building.
 * @param slotType  "front" for horizontal text / icon, "blade" for vertical blade
 * @param x,y,w,h  sign slot rectangle
 * @param seed      unique seed per building-texture to make choice deterministic
 */
function drawRandomSign(
  g: Phaser.GameObjects.Graphics,
  slotType: "front" | "blade",
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
) {
  const hash1 = signHash(seed);
  const hash2 = signHash(seed + 7919);

  // Filter candidates to matching slot type
  const candidates = CYBERPUNK_SIGNS.filter((s) =>
    slotType === "blade" ? s.kind === "blade" : s.kind !== "blade",
  );
  const sign = candidates[hash1 % candidates.length];
  const pal = pickColor(sign, hash2);

  if (sign.kind === "text") {
    drawNeonFrame(g, x, y, w, h, pal.frame);
    drawCenteredPixelWord(g, x, y, w, h, sign.letters, pal.text);
  } else if (sign.kind === "blade") {
    // Glow backing
    g.fillStyle(pal.frame, 0.08).fillRect(x - 1, y - 2, w + 2, h + 4);
    g.fillStyle(0x0f172a, 0.92).fillRect(x, y, w, h);
    drawNeonFrame(g, x, y, w, h, pal.frame);
    g.fillStyle(pal.text, 0.18).fillRect(x + 1, y + 1, w - 2, h - 2);
    drawVerticalPixelGlyphs(g, x + 2, y + 4, sign.glyphs, pal.text);
  } else if (sign.kind === "icon") {
    drawNeonFrame(g, x, y, w, h, pal.frame);
    sign.draw(g, x + (w - 12) / 2, y + (h - 12) / 2, pal.text);
  }
}

function createBuildingTextures(scene: Phaser.Scene) {
  // Tall factory building (64 x 128)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1b2440);
      g.fillRect(0, 12, 64, 116);
      g.fillStyle(0x12192f);
      g.fillRect(54, 12, 10, 116);
      g.fillStyle(0x2d3a5c);
      g.fillRect(0, 8, 64, 8);
      drawWarningNodes(g, 0, 8, 64);
      drawRoofRail(g, 6, 11, 48);
      drawPipeColumn(g, 8, 0, 14);
      drawPipeColumn(g, 46, 2, 12);
      g.fillStyle(0x172038).fillRect(2, 36, 14, 54);
      drawVentGrille(g, 5, 42, 8, 18);
      drawVentGrille(g, 5, 66, 8, 18);
      g.fillStyle(0x334155).fillRect(20, 20, 20, 82);
      drawPanelLines(g, 20, 20, 20, 82, 10);
      drawWindows(g, 4, 24, 2, 5, 8, 6, 12, 10);
      drawWindows(g, 44, 24, 1, 5, 8, 6, 10, 10);
      drawCrossBracePanel(g, 42, 64, 12, 22);
      g.fillStyle(0x475569).fillRect(6, 104, 50, 4);
      g.fillStyle(0x0f172a).fillRect(22, 108, 16, 20);
      g.fillStyle(0x475569).fillRect(22, 108, 16, 2);
      g.fillStyle(0xeab308).fillRect(34, 118, 2, 2);
      g.fillStyle(0x64748b).fillRect(28, 58, 4, 28);
      g.fillStyle(0x94a3b8, 0.55).fillRect(29, 58, 2, 28);
      g.fillStyle(0x1e293b).fillRect(0, 96, 64, 2);
      // Signs
      drawRandomSign(g, "front", 14, 82, 34, 12, 100);
      drawRandomSign(g, "blade", 52, 30, 10, 44, 111);
    },
    GENERATED_TEXTURES.buildingTall,
    64,
    128,
  );

  // Medium warehouse (80 x 96)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x202a46);
      g.fillRect(0, 10, 80, 86);
      g.fillStyle(0x2f3d5b);
      g.fillRect(0, 6, 80, 8);
      g.fillStyle(0x3b4d6b);
      g.fillRect(-2, 6, 84, 4);
      drawBeaconStrip(g, 0, 10, 80);
      drawRoofRail(g, 10, 9, 56);
      g.fillStyle(0x263451).fillTriangle(6, 10, 20, 0, 34, 10);
      g.fillStyle(0x1e293b).fillTriangle(34, 10, 48, 2, 60, 10);
      g.fillStyle(0x475569).fillRect(58, 0, 16, 10);
      g.fillStyle(0x64748b).fillRect(60, 2, 12, 2);
      g.fillStyle(0x1e293b).fillRect(60, 5, 12, 3);
      drawWindows(g, 6, 20, 4, 2, 10, 8, 8, 12);
      drawCrossBracePanel(g, 40, 56, 18, 22);
      g.fillStyle(0x0f172a).fillRect(8, 62, 28, 34);
      g.fillStyle(0x334155);
      for (let y = 66; y < 94; y += 6) {
        g.fillRect(8, y, 28, 1);
      }
      g.fillStyle(0x475569).fillRect(42, 58, 4, 38);
      g.fillStyle(0x334155).fillRect(46, 58, 18, 6);
      drawWindows(g, 50, 68, 2, 1, 8, 8, 8, 0);
      drawPipeColumn(g, 74, 14, 82);
      g.fillStyle(0x111827).fillRect(0, 46, 80, 2);
      // Signs
      drawRandomSign(g, "front", 6, 50, 34, 12, 201);
      drawRandomSign(g, "front", 48, 68, 28, 10, 212);
    },
    GENERATED_TEXTURES.buildingMedium,
    80,
    96,
  );

  // Short workshop (96 x 64)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1a2340);
      g.fillRect(0, 10, 96, 54);
      g.fillStyle(0x2d3a5c);
      g.fillRect(0, 6, 96, 8);
      drawServiceCap(g, 0, 10, 96);
      drawRoofRail(g, 6, 9, 70);
      drawPipeColumn(g, 76, 0, 10);
      g.fillStyle(0x334155).fillRect(44, 12, 22, 8);
      g.fillStyle(0x64748b).fillRect(46, 14, 18, 2);
      g.fillStyle(0x0f172a).fillRect(6, 28, 36, 36);
      g.fillStyle(0x334155);
      for (let y = 32; y < 62; y += 6) {
        g.fillRect(6, y, 36, 1);
      }
      for (let y = 28; y < 64; y += 8) {
        g.fillStyle(y % 16 === 0 ? 0xf97316 : 0x1e293b);
        g.fillRect(4, y, 2, 4);
        g.fillRect(42, y, 2, 4);
      }
      drawWindows(g, 54, 18, 2, 1, 10, 8, 10, 0);
      drawVentGrille(g, 54, 30, 18, 10);
      g.fillStyle(0x334155).fillRect(54, 40, 14, 8);
      g.fillStyle(0x1e293b);
      for (let x = 56; x < 66; x += 3) {
        g.fillRect(x, 42, 1, 4);
      }
      g.fillStyle(0x334155).fillRect(72, 26, 14, 24);
      drawPanelLines(g, 72, 26, 14, 24, 6);
      g.fillStyle(0x475569).fillRect(90, 14, 4, 50);
      // Signs
      drawRandomSign(g, "front", 46, 48, 30, 12, 302);
      drawRandomSign(g, "front", 72, 28, 20, 10, 313);
    },
    GENERATED_TEXTURES.buildingShort,
    96,
    64,
  );

  // Narrow tower with rooftop tank (72 x 144)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x19233e).fillRect(8, 18, 56, 126);
      g.fillStyle(0x12192f).fillRect(54, 18, 10, 126);
      g.fillStyle(0x334155).fillRect(6, 14, 60, 8);
      drawBeaconStrip(g, 8, 18, 56);
      drawRoofRail(g, 14, 17, 42);
      g.fillStyle(0x475569).fillRect(18, 2, 20, 14);
      g.fillStyle(0x64748b).fillRect(20, 4, 16, 2);
      g.fillStyle(0x334155).fillRect(16, 16, 24, 2);
      drawPipeColumn(g, 44, 0, 18);
      g.fillStyle(0x263451).fillRect(10, 52, 8, 60);
      drawVentGrille(g, 10, 58, 8, 18);
      drawVentGrille(g, 10, 82, 8, 18);
      drawWindows(g, 14, 30, 2, 7, 10, 7, 12, 9);
      drawCrossBracePanel(g, 40, 82, 12, 24);
      g.fillStyle(0x475569).fillRect(14, 112, 36, 6);
      g.fillStyle(0x0f172a).fillRect(24, 118, 18, 26);
      g.fillStyle(0x111827).fillRect(8, 72, 56, 2);
      // Signs
      drawRandomSign(g, "blade", 48, 32, 12, 54, 403);
      drawRandomSign(g, "front", 14, 112, 30, 10, 414);
    },
    GENERATED_TEXTURES.buildingTower,
    72,
    144,
  );

  // Industrial plant with stacks and catwalk (112 x 88)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1b2440).fillRect(0, 24, 112, 64);
      g.fillStyle(0x111827).fillRect(0, 70, 112, 2);
      g.fillStyle(0x2d3a5c).fillRect(0, 20, 112, 8);
      drawHazardBand(g, 0, 24, 54, 3);
      drawServiceCap(g, 54, 24, 58);
      drawRoofRail(g, 8, 23, 58);
      drawPipeColumn(g, 10, 0, 24);
      drawPipeColumn(g, 28, 6, 18);
      g.fillStyle(0x334155).fillEllipse(86, 30, 26, 18);
      g.fillStyle(0x64748b, 0.65).fillEllipse(84, 28, 10, 4);
      g.fillStyle(0x334155).fillRect(52, 8, 22, 16);
      g.fillStyle(0x64748b).fillRect(54, 10, 18, 2);
      g.fillStyle(0x475569).fillRect(36, 38, 58, 6);
      drawPanelLines(g, 36, 44, 58, 30, 7);
      drawCrossBracePanel(g, 38, 46, 18, 22);
      g.fillStyle(0x0f172a).fillRect(8, 46, 24, 42);
      g.fillStyle(0x334155).fillRect(8, 46, 24, 2);
      for (let y = 52; y < 84; y += 6) {
        g.fillStyle(0x334155).fillRect(8, y, 24, 1);
      }
      drawWindows(g, 74, 30, 2, 3, 10, 8, 10, 10);
      g.fillStyle(0x475569).fillRect(96, 28, 6, 60);
      g.fillStyle(0x64748b).fillRect(96, 34, 14, 4);
      g.fillStyle(0x94a3b8).fillRect(100, 35, 8, 2);
      // Signs
      drawRandomSign(g, "front", 38, 46, 30, 12, 706);
      drawRandomSign(g, "front", 74, 32, 22, 10, 717);
    },
    GENERATED_TEXTURES.buildingPlant,
    112,
    88,
  );

  // Tall tenement tower (92 x 156)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x18213a).fillRect(6, 18, 80, 138);
      g.fillStyle(0x111827).fillRect(72, 18, 14, 138);
      g.fillStyle(0x2a3658).fillRect(4, 14, 84, 8);
      drawWarningNodes(g, 6, 18, 80);
      drawRoofRail(g, 12, 17, 64);

      g.fillStyle(0x334155).fillRect(16, 2, 20, 14);
      g.fillStyle(0x64748b).fillRect(18, 4, 16, 2);
      drawPipeColumn(g, 58, 0, 18);

      drawWindows(g, 10, 30, 3, 7, 8, 6, 8, 10);
      drawWindows(g, 44, 30, 2, 7, 10, 6, 10, 10);

      g.fillStyle(0x243255).fillRect(10, 116, 60, 18);
      drawPanelLines(g, 10, 116, 60, 18, 6);

      g.fillStyle(0x0f172a).fillRect(34, 132, 20, 24);
      g.fillStyle(0x334155).fillRect(34, 132, 20, 2);
      g.fillStyle(0xeab308).fillRect(48, 144, 2, 2);

      g.fillStyle(0x475569).fillRect(6, 152, 80, 4);

      drawRandomSign(g, "front", 14, 96, 34, 12, 1401);
      drawRandomSign(g, "blade", 76, 46, 10, 46, 1412);
      drawRandomSign(g, "front", 50, 112, 22, 10, 1423);
    },
    GENERATED_TEXTURES.buildingTenementTall,
    92,
    156,
  );

  // Brutalist housing block (96 x 164)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x19223d).fillRect(4, 20, 88, 144);
      g.fillStyle(0x243255).fillRect(4, 16, 88, 8);
      drawBeaconStrip(g, 4, 20, 88);
      drawRoofRail(g, 10, 19, 72);

      g.fillStyle(0x334155).fillRect(18, 4, 24, 12);
      g.fillStyle(0x64748b).fillRect(20, 6, 20, 2);
      g.fillStyle(0x334155).fillRect(56, 6, 18, 10);
      g.fillStyle(0x64748b).fillRect(58, 8, 14, 2);
      drawPipeColumn(g, 80, 2, 18);

      drawWindows(g, 10, 30, 4, 7, 8, 6, 8, 10);
      g.fillStyle(0x111827).fillRect(44, 30, 6, 108);

      g.fillStyle(0x1e293b).fillRect(12, 122, 72, 20);
      drawPanelLines(g, 12, 122, 72, 20, 6);

      g.fillStyle(0x0f172a).fillRect(36, 140, 24, 24);
      g.fillStyle(0x334155).fillRect(36, 140, 24, 2);
      g.fillStyle(0xeab308).fillRect(52, 152, 2, 2);

      g.fillStyle(0x475569).fillRect(4, 160, 88, 4);

      drawRandomSign(g, "front", 12, 100, 34, 12, 1501);
      drawRandomSign(g, "front", 52, 100, 30, 12, 1512);
      drawRandomSign(g, "blade", 82, 54, 10, 48, 1523);
    },
    GENERATED_TEXTURES.buildingHousingBlock,
    96,
    164,
  );

  // Apartment spire (84 x 176)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x161f37).fillRect(10, 20, 64, 156);
      g.fillStyle(0x101827).fillRect(62, 20, 12, 156);
      g.fillStyle(0x2a3658).fillRect(8, 16, 68, 8);
      drawWarningNodes(g, 10, 20, 64);
      drawRoofRail(g, 14, 19, 52);

      g.fillStyle(0x334155).fillRect(22, 2, 20, 14);
      g.fillStyle(0x64748b).fillRect(24, 4, 16, 2);
      drawPipeColumn(g, 50, 0, 20);

      drawWindows(g, 14, 30, 2, 9, 10, 6, 12, 10);
      drawWindows(g, 42, 30, 2, 9, 8, 6, 10, 10);

      g.fillStyle(0x243255).fillRect(16, 138, 52, 18);
      drawCrossBracePanel(g, 18, 140, 22, 14);
      drawVentGrille(g, 44, 140, 22, 14);

      g.fillStyle(0x0f172a).fillRect(30, 154, 20, 22);
      g.fillStyle(0x334155).fillRect(30, 154, 20, 2);
      g.fillStyle(0xeab308).fillRect(44, 166, 2, 2);

      g.fillStyle(0x475569).fillRect(10, 172, 64, 4);

      drawRandomSign(g, "blade", 64, 54, 10, 52, 1601);
      drawRandomSign(g, "front", 16, 116, 28, 10, 1612);
      drawRandomSign(g, "front", 46, 116, 24, 10, 1623);
    },
    GENERATED_TEXTURES.buildingApartmentSpire,
    84,
    176,
  );

  // Neon convenience storefront (112 x 72)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x18203a).fillRect(0, 14, 112, 58);
      g.fillStyle(0x243255).fillRect(0, 10, 112, 8);
      drawServiceCap(g, 0, 14, 112);
      drawRoofRail(g, 8, 13, 92);
      g.fillStyle(0x0f172a).fillRect(6, 28, 38, 44);
      drawWindows(g, 10, 20, 2, 1, 10, 8, 10, 0);
      g.fillStyle(0x1e293b).fillRect(48, 24, 58, 48);
      g.fillStyle(0x111827).fillRect(48, 52, 58, 2);
      g.fillStyle(0x7c3aed, 0.35).fillRect(50, 56, 54, 6);
      g.fillStyle(0xa78bfa, 0.8).fillRect(52, 58, 50, 2);
      g.fillStyle(0x334155).fillRect(58, 34, 14, 18);
      g.fillStyle(0xfef3c7, 0.55).fillRect(60, 36, 10, 14);
      g.fillStyle(0x334155).fillRect(78, 34, 20, 18);
      g.fillStyle(0xfef3c7, 0.45).fillRect(80, 36, 16, 14);
      g.fillStyle(0x475569).fillRect(0, 68, 112, 4);
      // Signs
      drawRandomSign(g, "front", 54, 18, 38, 12, 504);
      drawRandomSign(g, "blade", 6, 30, 10, 32, 515);
    },
    GENERATED_TEXTURES.buildingNeonShop,
    112,
    72,
  );

  // Holo bar storefront (120 x 76)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x151d35).fillRect(0, 18, 120, 58);
      g.fillStyle(0x29385d).fillRect(0, 14, 120, 8);
      drawWarningNodes(g, 0, 18, 48);
      drawBeaconStrip(g, 48, 18, 72);
      g.fillStyle(0x0f172a).fillRect(8, 36, 28, 40);
      g.fillStyle(0x243255).fillRect(42, 26, 70, 50);
      g.fillStyle(0x06b6d4, 0.22).fillEllipse(94, 28, 18, 8);
      g.fillStyle(0x67e8f9, 0.8).fillEllipse(94, 28, 10, 3);
      g.fillStyle(0xa855f7, 0.3).fillRect(44, 58, 64, 6);
      g.fillStyle(0xe879f9, 0.82).fillRect(48, 60, 56, 2);
      g.fillStyle(0x334155).fillRect(48, 34, 16, 18);
      g.fillStyle(0xfef3c7, 0.45).fillRect(50, 36, 12, 14);
      g.fillStyle(0x334155).fillRect(70, 34, 14, 18);
      g.fillStyle(0xfef3c7, 0.35).fillRect(72, 36, 10, 14);
      g.fillStyle(0x475569).fillRect(0, 72, 120, 4);
      drawVentGrille(g, 10, 44, 12, 16);
      // Signs
      drawRandomSign(g, "front", 50, 20, 34, 12, 605);
      drawRandomSign(g, "front", 10, 38, 24, 10, 616);
    },
    GENERATED_TEXTURES.buildingHoloBar,
    120,
    76,
  );

  // Arcade building — tall narrow with marquee (80 x 96)
  withGraphics(
    scene,
    (g) => {
      // Main wall
      g.fillStyle(0x1a1f3d).fillRect(0, 16, 80, 80);
      g.fillStyle(0x252b52).fillRect(0, 12, 80, 8);
      drawServiceCap(g, 0, 16, 80);
      // Marquee band across top
      g.fillStyle(0x7c3aed, 0.4).fillRect(4, 18, 72, 6);
      g.fillStyle(0xa78bfa, 0.9).fillRect(6, 20, 68, 2);
      // Windows
      drawWindows(g, 8, 30, 3, 2, 8, 6, 10, 12);
      // Door alcove
      g.fillStyle(0x0f172a).fillRect(28, 60, 24, 36);
      g.fillStyle(0x334155).fillRect(28, 60, 24, 2);
      // Side vent
      drawVentGrille(g, 4, 64, 16, 20);
      // Pipes
      drawPipeColumn(g, 66, 28, 60);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 92, 80, 4);
      // Signs
      drawRandomSign(g, "blade", 68, 24, 10, 44, 807);
      drawRandomSign(g, "front", 8, 30, 30, 10, 818);
    },
    GENERATED_TEXTURES.buildingArcade,
    80,
    96,
  );

  // Clinic — wide, low, with cross motif (100 x 64)
  withGraphics(
    scene,
    (g) => {
      // Main wall
      g.fillStyle(0x172035).fillRect(0, 14, 100, 50);
      g.fillStyle(0x22304d).fillRect(0, 10, 100, 8);
      drawRoofRail(g, 6, 13, 86);
      drawHazardBand(g, 0, 14, 52, 3);
      // Large window panels
      g.fillStyle(0x0f172a).fillRect(8, 24, 32, 26);
      g.fillStyle(0xfef3c7, 0.3).fillRect(10, 26, 28, 22);
      g.fillStyle(0x0f172a).fillRect(60, 24, 32, 26);
      g.fillStyle(0xfef3c7, 0.3).fillRect(62, 26, 28, 22);
      // Center door
      g.fillStyle(0x0f172a).fillRect(42, 32, 16, 32);
      g.fillStyle(0x334155).fillRect(42, 32, 16, 2);
      // Rooftop unit
      g.fillStyle(0x334155).fillRect(38, 4, 24, 10);
      g.fillStyle(0x64748b).fillRect(40, 6, 20, 2);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 60, 100, 4);
      // Signs
      drawRandomSign(g, "front", 42, 18, 30, 12, 908);
      drawRandomSign(g, "front", 8, 50, 28, 10, 919);
    },
    GENERATED_TEXTURES.buildingClinic,
    100,
    64,
  );

  // Tech shop — medium with antenna cluster (88 x 80)
  withGraphics(
    scene,
    (g) => {
      // Main wall
      g.fillStyle(0x161c38).fillRect(0, 20, 88, 60);
      g.fillStyle(0x28335a).fillRect(0, 16, 88, 8);
      drawServiceCap(g, 0, 20, 88);
      drawWarningNodes(g, 0, 20, 44);
      // Antenna cluster on roof
      g.fillStyle(0x475569).fillRect(14, 2, 2, 18);
      g.fillStyle(0x475569).fillRect(22, 6, 2, 14);
      g.fillStyle(0x64748b).fillRect(10, 0, 8, 4);
      g.fillStyle(0xef4444, 0.8).fillRect(14, 0, 2, 2); // Red beacon
      // Storefront display
      g.fillStyle(0x1e293b).fillRect(6, 32, 50, 30);
      g.fillStyle(0x0f172a).fillRect(8, 34, 46, 26);
      drawWindows(g, 10, 36, 2, 2, 6, 5, 10, 10);
      // Side section with pipes
      g.fillStyle(0x243255).fillRect(60, 28, 28, 52);
      drawPanelLines(g, 60, 34, 28, 36, 6);
      drawPipeColumn(g, 80, 28, 44);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 76, 88, 4);
      // Signs
      drawRandomSign(g, "front", 6, 24, 34, 12, 1009);
      drawRandomSign(g, "blade", 74, 34, 10, 36, 1020);
    },
    GENERATED_TEXTURES.buildingTechShop,
    88,
    80,
  );

  // Mega residential block — wide (140 x 100)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x19233d).fillRect(0, 16, 140, 84);
      g.fillStyle(0x2a3658).fillRect(0, 12, 140, 8);
      drawRoofRail(g, 8, 15, 120);
      drawBeaconStrip(g, 0, 16, 70);
      drawHazardBand(g, 70, 16, 70, 3);
      // Rooftop units
      g.fillStyle(0x334155).fillRect(20, 2, 26, 12);
      g.fillStyle(0x64748b).fillRect(22, 4, 22, 2);
      g.fillStyle(0x334155).fillRect(80, 4, 20, 10);
      g.fillStyle(0x64748b).fillRect(82, 6, 16, 2);
      drawPipeColumn(g, 110, 0, 16);
      // Left window block
      drawWindows(g, 6, 24, 3, 4, 8, 6, 10, 10);
      // Center door
      g.fillStyle(0x0f172a).fillRect(50, 56, 18, 44);
      g.fillStyle(0x334155).fillRect(50, 56, 18, 2);
      g.fillStyle(0xeab308).fillRect(62, 88, 2, 2);
      // Right window block
      drawWindows(g, 76, 24, 3, 4, 8, 6, 10, 10);
      // Panel section
      g.fillStyle(0x1e293b).fillRect(120, 30, 18, 50);
      drawPanelLines(g, 120, 30, 18, 50, 8);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 96, 140, 4);
      // Signs
      drawRandomSign(g, "front", 8, 46, 34, 12, 1101);
      drawRandomSign(g, "front", 76, 46, 34, 12, 1112);
      drawRandomSign(g, "blade", 126, 32, 10, 40, 1123);
    },
    GENERATED_TEXTURES.buildingMegaBlock,
    140,
    100,
  );

  // Transit terminal — extra wide low (160 x 72)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x172038).fillRect(0, 18, 160, 54);
      g.fillStyle(0x263451).fillRect(0, 14, 160, 8);
      drawServiceCap(g, 0, 18, 80);
      drawWarningNodes(g, 80, 18, 80);
      drawRoofRail(g, 10, 17, 136);
      // Canopy overhang
      g.fillStyle(0x334155).fillRect(30, 10, 100, 8);
      g.fillStyle(0x475569).fillRect(32, 12, 96, 2);
      // Long window strip
      g.fillStyle(0x0f172a).fillRect(6, 28, 148, 16);
      g.fillStyle(0xfef3c7, 0.3).fillRect(8, 30, 32, 12);
      g.fillStyle(0xfef3c7, 0.25).fillRect(44, 30, 28, 12);
      g.fillStyle(0xfef3c7, 0.35).fillRect(76, 30, 32, 12);
      g.fillStyle(0xfef3c7, 0.2).fillRect(112, 30, 38, 12);
      // Doors
      g.fillStyle(0x0f172a).fillRect(26, 48, 14, 24);
      g.fillStyle(0x334155).fillRect(26, 48, 14, 2);
      g.fillStyle(0x0f172a).fillRect(72, 48, 14, 24);
      g.fillStyle(0x334155).fillRect(72, 48, 14, 2);
      g.fillStyle(0x0f172a).fillRect(120, 48, 14, 24);
      g.fillStyle(0x334155).fillRect(120, 48, 14, 2);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 68, 160, 4);
      // Signs
      drawRandomSign(g, "front", 8, 20, 36, 12, 1201);
      drawRandomSign(g, "front", 92, 20, 36, 12, 1212);
      drawRandomSign(g, "front", 50, 50, 20, 10, 1223);
    },
    GENERATED_TEXTURES.buildingTerminal,
    160,
    72,
  );

  // Commercial complex — wide tall (130 x 110)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1b2240).fillRect(0, 20, 130, 90);
      g.fillStyle(0x2d3a5c).fillRect(0, 16, 130, 8);
      drawBeaconStrip(g, 0, 20, 130);
      drawRoofRail(g, 8, 19, 110);
      // Rooftop antenna + unit
      g.fillStyle(0x475569).fillRect(18, 4, 2, 16);
      g.fillStyle(0x64748b).fillRect(14, 2, 10, 4);
      g.fillStyle(0xef4444, 0.8).fillRect(18, 0, 2, 2);
      g.fillStyle(0x334155).fillRect(80, 6, 28, 12);
      g.fillStyle(0x64748b).fillRect(82, 8, 24, 2);
      drawPipeColumn(g, 120, 8, 12);
      // Left section — windows
      drawWindows(g, 6, 28, 3, 5, 8, 6, 10, 10);
      // Center storefront
      g.fillStyle(0x1e293b).fillRect(42, 40, 44, 46);
      g.fillStyle(0x0f172a).fillRect(44, 42, 40, 42);
      g.fillStyle(0xfef3c7, 0.35).fillRect(46, 44, 18, 18);
      g.fillStyle(0xfef3c7, 0.25).fillRect(66, 44, 16, 18);
      g.fillStyle(0x334155).fillRect(56, 66, 14, 20);
      g.fillStyle(0xeab308).fillRect(66, 78, 2, 2);
      // Right section — vent and pipes
      g.fillStyle(0x243255).fillRect(92, 28, 36, 62);
      drawVentGrille(g, 96, 34, 16, 20);
      drawPanelLines(g, 92, 56, 36, 34, 7);
      drawPipeColumn(g, 122, 28, 60);
      // Sidewalk edge
      g.fillStyle(0x475569).fillRect(0, 106, 130, 4);
      // Signs
      drawRandomSign(g, "front", 44, 28, 38, 12, 1301);
      drawRandomSign(g, "blade", 6, 62, 10, 40, 1312);
      drawRandomSign(g, "front", 96, 60, 26, 10, 1323);
    },
    GENERATED_TEXTURES.buildingComplex,
    130,
    110,
  );
}

// ── Street lamp ──────────────────────────────────────────────────────────────

function createStreetLampTexture(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      // Pole
      g.fillStyle(0x475569);
      g.fillRect(5, 8, 4, 56);
      // Base
      g.fillStyle(0x334155);
      g.fillRect(2, 60, 10, 4);
      // Arm
      g.fillStyle(0x475569);
      g.fillRect(5, 8, 14, 3);
      // Lamp housing
      g.fillStyle(0x64748b);
      g.fillRect(14, 4, 8, 8);
      // Light glow
      g.fillStyle(0xfbbf24, 0.8);
      g.fillRect(15, 5, 6, 6);
      // Glow halo
      g.fillStyle(0xfbbf24, 0.15);
      g.fillCircle(18, 8, 10);
    },
    GENERATED_TEXTURES.streetLamp,
    28,
    64,
  );
}

function createPowerPoleTexture(scene: Phaser.Scene) {
  withGraphics(
    scene,
    (g) => {
      // Wooden pole body
      g.fillStyle(0x3f2a1c).fillRect(12, 4, 8, 76);
      g.fillStyle(0x5a3a24).fillRect(13, 4, 2, 76);
      g.fillStyle(0x2a1a12).fillRect(18, 4, 1, 76);

      // Cross arm
      g.fillStyle(0x4b3120).fillRect(2, 14, 28, 4);
      g.fillStyle(0x2f1f15).fillRect(2, 17, 28, 1);

      // Insulators
      g.fillStyle(0x7c3aed).fillRect(4, 18, 3, 2);
      g.fillStyle(0x7c3aed).fillRect(14, 18, 3, 2);
      g.fillStyle(0x7c3aed).fillRect(24, 18, 3, 2);

      // Base footing
      g.fillStyle(0x243255).fillRect(10, 78, 12, 2);
    },
    GENERATED_TEXTURES.powerPole,
    32,
    80,
  );
}

/* ── Building tile textures (32×32) ────────────────────────────── */

function createBuildingTileTextures(scene: Phaser.Scene) {
  // tileBrickWall — Dark brick with mortar lines (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1e293b).fillRect(0, 0, 32, 32);
      // Brick rows (offset every other row)
      for (let row = 0; row < 4; row++) {
        const y = row * 8;
        const offset = row % 2 === 0 ? 0 : 8;
        g.fillStyle(0x334155);
        for (let bx = offset; bx < 32; bx += 16) {
          g.fillRect(bx + 1, y + 1, 14, 6);
        }
        // Mortar lines
        g.fillStyle(0x0f172a);
        g.fillRect(0, y, 32, 1);
        for (let mx = offset; mx < 32; mx += 16) {
          g.fillRect(mx, y, 1, 8);
        }
      }
      // Subtle highlight
      g.fillStyle(0x475569).fillRect(5, 5, 6, 1);
      g.fillStyle(0x475569).fillRect(21, 21, 6, 1);
    },
    GENERATED_TEXTURES.tileBrickWall,
    32,
    32,
  );

  // tileBrickWallDark — Darker variant with moss hints (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x111827).fillRect(0, 0, 32, 32);
      for (let row = 0; row < 4; row++) {
        const y = row * 8;
        const offset = row % 2 === 0 ? 0 : 8;
        g.fillStyle(0x1e293b);
        for (let bx = offset; bx < 32; bx += 16) {
          g.fillRect(bx + 1, y + 1, 14, 6);
        }
        g.fillStyle(0x0a0f1a);
        g.fillRect(0, y, 32, 1);
        for (let mx = offset; mx < 32; mx += 16) {
          g.fillRect(mx, y, 1, 8);
        }
      }
      // Moss accents
      g.fillStyle(0x166534).fillRect(2, 25, 3, 2);
      g.fillStyle(0x14532d).fillRect(18, 29, 4, 2);
    },
    GENERATED_TEXTURES.tileBrickWallDark,
    32,
    32,
  );

  // tileFireEscape — Metal grate platform (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x374151).fillRect(0, 0, 32, 32);
      // Metal grate pattern
      g.fillStyle(0x4b5563);
      for (let y = 0; y < 32; y += 4) {
        g.fillRect(0, y, 32, 2);
      }
      for (let x = 0; x < 32; x += 4) {
        g.fillRect(x, 0, 2, 32);
      }
      // Railing top
      g.fillStyle(0x6b7280).fillRect(0, 0, 32, 3);
      g.fillStyle(0x9ca3af).fillRect(0, 0, 32, 1);
      // Support brackets
      g.fillStyle(0x1f2937).fillRect(0, 28, 32, 4);
      g.fillStyle(0x374151).fillRect(2, 29, 6, 2);
      g.fillStyle(0x374151).fillRect(24, 29, 6, 2);
    },
    GENERATED_TEXTURES.tileFireEscape,
    32,
    32,
  );

  // tileAwning — Striped canvas overhang (32×32)
  withGraphics(
    scene,
    (g) => {
      // Awning canopy
      g.fillStyle(0xdc2626).fillRect(0, 4, 32, 20);
      // Stripes
      g.fillStyle(0xfef2f2);
      for (let x = 0; x < 32; x += 8) {
        g.fillRect(x, 4, 4, 20);
      }
      // Shadow underneath
      g.fillStyle(0x0f172a).fillRect(0, 24, 32, 4);
      // Top mounting bar
      g.fillStyle(0x6b7280).fillRect(0, 0, 32, 4);
      g.fillStyle(0x9ca3af).fillRect(0, 0, 32, 2);
      // Bottom edge
      g.fillStyle(0x991b1b).fillRect(0, 22, 32, 2);
    },
    GENERATED_TEXTURES.tileAwning,
    32,
    32,
  );

  // tileRooftop — Flat concrete with edge lip (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x374151).fillRect(0, 0, 32, 32);
      // Concrete texture noise
      g.fillStyle(0x4b5563).fillRect(3, 4, 8, 2);
      g.fillStyle(0x4b5563).fillRect(18, 12, 10, 2);
      g.fillStyle(0x4b5563).fillRect(6, 22, 12, 2);
      // Top lip/edge
      g.fillStyle(0x6b7280).fillRect(0, 0, 32, 4);
      g.fillStyle(0x9ca3af).fillRect(0, 0, 32, 2);
      // Tar seam
      g.fillStyle(0x1f2937).fillRect(0, 16, 32, 1);
    },
    GENERATED_TEXTURES.tileRooftop,
    32,
    32,
  );

  // tileRooftopEdge — Rooftop with railing (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x374151).fillRect(0, 8, 32, 24);
      // Railing posts
      g.fillStyle(0x6b7280);
      g.fillRect(2, 0, 2, 10);
      g.fillRect(14, 0, 2, 10);
      g.fillRect(28, 0, 2, 10);
      // Rail bar
      g.fillStyle(0x9ca3af).fillRect(0, 0, 32, 2);
      g.fillStyle(0x6b7280).fillRect(0, 2, 32, 1);
      // Concrete surface
      g.fillStyle(0x4b5563).fillRect(4, 12, 6, 2);
      g.fillStyle(0x4b5563).fillRect(20, 18, 8, 2);
    },
    GENERATED_TEXTURES.tileRooftopEdge,
    32,
    32,
  );

  // tileHVAC — AC unit / vent box (32×32)
  withGraphics(
    scene,
    (g) => {
      // Unit body
      g.fillStyle(0x475569).fillRect(2, 8, 28, 22);
      g.fillStyle(0x334155).fillRect(4, 10, 24, 18);
      // Vent slats
      g.fillStyle(0x1e293b);
      for (let y = 12; y < 26; y += 3) {
        g.fillRect(6, y, 20, 1);
      }
      // Top cap
      g.fillStyle(0x64748b).fillRect(0, 4, 32, 6);
      g.fillStyle(0x9ca3af).fillRect(0, 4, 32, 2);
      // Fan circle
      g.fillStyle(0x1e293b).fillCircle(16, 20, 6);
      g.fillStyle(0x374151).fillCircle(16, 20, 4);
      g.fillStyle(0x64748b).fillCircle(16, 20, 1);
      // Base
      g.fillStyle(0x374151).fillRect(4, 28, 24, 4);
    },
    GENERATED_TEXTURES.tileHVAC,
    32,
    32,
  );

  // tileWindowLit — Lit window in brick frame (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1e293b).fillRect(0, 0, 32, 32);
      // Window frame
      g.fillStyle(0x475569).fillRect(4, 4, 24, 24);
      // Glass (lit warm)
      g.fillStyle(0xfbbf24).fillRect(6, 6, 20, 20);
      g.fillStyle(0xfde68a).fillRect(8, 8, 8, 8);
      // Window cross bars
      g.fillStyle(0x374151).fillRect(15, 6, 2, 20);
      g.fillStyle(0x374151).fillRect(6, 15, 20, 2);
      // Sill
      g.fillStyle(0x64748b).fillRect(3, 28, 26, 3);
    },
    GENERATED_TEXTURES.tileWindowLit,
    32,
    32,
  );

  // tileWindowDark — Unlit window (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1e293b).fillRect(0, 0, 32, 32);
      g.fillStyle(0x475569).fillRect(4, 4, 24, 24);
      // Dark glass
      g.fillStyle(0x0f172a).fillRect(6, 6, 20, 20);
      g.fillStyle(0x1e293b).fillRect(8, 8, 6, 6);
      // Cross bars
      g.fillStyle(0x374151).fillRect(15, 6, 2, 20);
      g.fillStyle(0x374151).fillRect(6, 15, 20, 2);
      // Sill
      g.fillStyle(0x64748b).fillRect(3, 28, 26, 3);
    },
    GENERATED_TEXTURES.tileWindowDark,
    32,
    32,
  );

  // tileNeonSign — Glowing neon rectangle (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1e293b).fillRect(0, 0, 32, 32);
      // Neon border glow
      g.fillStyle(0x0ea5e9).fillRect(2, 6, 28, 20);
      g.fillStyle(0x0f172a).fillRect(4, 8, 24, 16);
      // Neon text (abstract bars)
      g.fillStyle(0x0ea5e9).fillRect(7, 12, 18, 2);
      g.fillStyle(0x38bdf8).fillRect(10, 17, 12, 2);
      // Glow effect
      g.fillStyle(0x0ea5e9).fillRect(1, 5, 1, 22);
      g.fillStyle(0x0ea5e9).fillRect(30, 5, 1, 22);
    },
    GENERATED_TEXTURES.tileNeonSign,
    32,
    32,
  );

  // tilePipe — Exposed horizontal pipe (32×32)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x1e293b).fillRect(0, 0, 32, 32);
      // Pipe body
      g.fillStyle(0x475569).fillRect(0, 12, 32, 8);
      g.fillStyle(0x64748b).fillRect(0, 12, 32, 3);
      g.fillStyle(0x334155).fillRect(0, 18, 32, 2);
      // Brackets
      g.fillStyle(0x374151).fillRect(4, 8, 4, 16);
      g.fillStyle(0x374151).fillRect(24, 8, 4, 16);
      // Rivets
      g.fillStyle(0x9ca3af).fillRect(5, 10, 2, 2);
      g.fillStyle(0x9ca3af).fillRect(25, 10, 2, 2);
    },
    GENERATED_TEXTURES.tilePipe,
    32,
    32,
  );
}

/* ── Larger decoration textures ───────────────────────────────── */

function createDecorationTextures(scene: Phaser.Scene) {
  // decoWaterTower — Rooftop water tower (48×64)
  withGraphics(
    scene,
    (g) => {
      // Legs
      g.fillStyle(0x374151);
      g.fillRect(8, 40, 4, 24);
      g.fillRect(36, 40, 4, 24);
      g.fillRect(22, 44, 4, 20);
      // Cross bracing
      g.fillStyle(0x475569);
      g.fillRect(10, 50, 28, 2);
      // Tank body
      g.fillStyle(0x64748b).fillRect(4, 8, 40, 34);
      g.fillStyle(0x475569).fillRect(6, 10, 36, 30);
      // Wood slat lines
      g.fillStyle(0x374151);
      for (let y = 14; y < 38; y += 4) {
        g.fillRect(6, y, 36, 1);
      }
      // Metal bands
      g.fillStyle(0x9ca3af).fillRect(4, 16, 40, 2);
      g.fillStyle(0x9ca3af).fillRect(4, 30, 40, 2);
      // Cone top
      g.fillStyle(0x64748b).fillRect(8, 4, 32, 6);
      g.fillStyle(0x475569).fillTriangle(14, 4, 24, 0, 34, 4);
      // Pipe
      g.fillStyle(0x374151).fillRect(38, 34, 6, 4);
    },
    GENERATED_TEXTURES.decoWaterTower,
    48,
    64,
  );

  // decoAntenna — Radio antenna / satellite dish (16×80)
  withGraphics(
    scene,
    (g) => {
      // Main pole
      g.fillStyle(0x6b7280).fillRect(6, 0, 4, 80);
      g.fillStyle(0x9ca3af).fillRect(7, 0, 2, 80);
      // Cross arms
      g.fillStyle(0x475569).fillRect(0, 10, 16, 2);
      g.fillStyle(0x475569).fillRect(2, 24, 12, 2);
      g.fillStyle(0x475569).fillRect(0, 40, 16, 2);
      // Beacon light
      g.fillStyle(0xef4444).fillRect(6, 0, 4, 4);
      g.fillStyle(0xfca5a5).fillRect(7, 1, 2, 2);
      // Dish at mid
      g.fillStyle(0x64748b).fillRect(0, 30, 14, 8);
      g.fillStyle(0x475569).fillRect(2, 32, 10, 4);
      // Base mount
      g.fillStyle(0x374151).fillRect(4, 76, 8, 4);
    },
    GENERATED_TEXTURES.decoAntenna,
    16,
    80,
  );

  // decoDumpster — Street-level obstacle (32×24)
  withGraphics(
    scene,
    (g) => {
      // Body
      g.fillStyle(0x166534).fillRect(2, 4, 28, 18);
      g.fillStyle(0x15803d).fillRect(4, 6, 24, 14);
      // Lid
      g.fillStyle(0x14532d).fillRect(0, 0, 32, 6);
      g.fillStyle(0x166534).fillRect(2, 0, 28, 4);
      // Handle
      g.fillStyle(0x6b7280).fillRect(14, 0, 4, 2);
      // Rust spots
      g.fillStyle(0x92400e).fillRect(8, 10, 3, 2);
      g.fillStyle(0x92400e).fillRect(22, 14, 2, 2);
      // Wheels
      g.fillStyle(0x1f2937).fillRect(6, 20, 4, 4);
      g.fillStyle(0x1f2937).fillRect(22, 20, 4, 4);
    },
    GENERATED_TEXTURES.decoDumpster,
    32,
    24,
  );

  // decoACUnit — Wall-mounted AC unit (24×16)
  withGraphics(
    scene,
    (g) => {
      g.fillStyle(0x475569).fillRect(0, 0, 24, 16);
      g.fillStyle(0x374151).fillRect(2, 2, 20, 12);
      // Vent slats
      g.fillStyle(0x1e293b);
      for (let y = 4; y < 12; y += 2) {
        g.fillRect(4, y, 16, 1);
      }
      // Mounting bracket
      g.fillStyle(0x6b7280).fillRect(0, 14, 24, 2);
      // Drip
      g.fillStyle(0x38bdf8).fillRect(18, 14, 2, 2);
    },
    GENERATED_TEXTURES.decoACUnit,
    24,
    16,
  );
}

function createCityParallaxTextures(scene: Phaser.Scene) {
  // cityParallax1 — Full sky + stars + distant building silhouettes (800×600)
  withGraphics(
    scene,
    (g) => {
      // Dark sky background
      g.fillStyle(0x0f172a).fillRect(0, 0, 800, 600);
      // Horizon gradient (purple tint near horizon)
      g.fillStyle(0x1e1b4b, 0.35).fillRect(0, 280, 800, 320);
      // Stars
      g.fillStyle(0xffffff);
      for (let i = 0; i < 90; i++) {
        const sx = (i * 137 + 17) % 800;
        const sy = (i * 89 + 11) % 260;
        g.fillRect(sx, sy, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
      // Moon
      g.fillStyle(0xfde68a, 0.85).fillCircle(680, 55, 18);
      g.fillStyle(0x0f172a, 0.25).fillCircle(672, 50, 14); // crescent shadow
      // Very distant building silhouettes (dark, low contrast)
      const silos = [
        { x: 0, w: 55, h: 160 },
        { x: 65, w: 35, h: 120 },
        { x: 110, w: 75, h: 200 },
        { x: 195, w: 45, h: 145 },
        { x: 250, w: 28, h: 90 },
        { x: 288, w: 68, h: 180 },
        { x: 366, w: 42, h: 130 },
        { x: 418, w: 88, h: 230 },
        { x: 516, w: 32, h: 100 },
        { x: 558, w: 58, h: 165 },
        { x: 626, w: 38, h: 140 },
        { x: 674, w: 86, h: 210 },
        { x: 770, w: 30, h: 125 },
      ];
      g.fillStyle(0x0d1117);
      for (const b of silos) {
        g.fillRect(b.x, 600 - b.h, b.w, b.h);
      }
    },
    GENERATED_TEXTURES.cityParallax1,
    800,
    600,
  );

  // cityParallax2 — Mid-city buildings with lit windows (transparent bg, 800×600)
  withGraphics(
    scene,
    (g) => {
      // Mid-distance buildings (semi-opaque background to blend with layer 1)
      const midBuildings = [
        { x: 20, w: 72, h: 300, color: 0x1e293b },
        { x: 102, w: 52, h: 220, color: 0x172033 },
        { x: 164, w: 95, h: 355, color: 0x1e293b },
        { x: 269, w: 62, h: 265, color: 0x172033 },
        { x: 341, w: 82, h: 315, color: 0x1e293b },
        { x: 433, w: 57, h: 245, color: 0x172033 },
        { x: 500, w: 105, h: 385, color: 0x1e293b },
        { x: 615, w: 68, h: 280, color: 0x172033 },
        { x: 693, w: 78, h: 325, color: 0x1e293b },
        { x: 781, w: 19, h: 195, color: 0x172033 },
      ];
      for (const b of midBuildings) {
        g.fillStyle(b.color).fillRect(b.x, 600 - b.h, b.w, b.h);
        // Warm (yellow) lit windows
        g.fillStyle(0xfbbf24, 0.55);
        for (let wy = 600 - b.h + 14; wy < 600 - 22; wy += 20) {
          for (let wx = b.x + 8; wx < b.x + b.w - 10; wx += 14) {
            if ((wx + wy) % 3 !== 0) {
              g.fillRect(wx, wy, 6, 8);
            }
          }
        }
        // Cool (blue) lit windows
        g.fillStyle(0x93c5fd, 0.4);
        for (let wy = 600 - b.h + 8; wy < 600 - 30; wy += 26) {
          for (let wx = b.x + 5; wx < b.x + b.w - 9; wx += 19) {
            if ((wx * wy) % 5 === 0) {
              g.fillRect(wx, wy, 7, 9);
            }
          }
        }
      }
    },
    GENERATED_TEXTURES.cityParallax2,
    800,
    600,
  );

  // cityParallax3 — Near buildings with neon glow effects (transparent bg, 800×600)
  withGraphics(
    scene,
    (g) => {
      // Near buildings — tallest, most detailed
      const nearBuildings = [
        { x: 0, w: 82, h: 425, color: 0x1e293b },
        { x: 92, w: 62, h: 345, color: 0x172033 },
        { x: 164, w: 104, h: 465, color: 0x1e293b },
        { x: 278, w: 77, h: 395, color: 0x172033 },
        { x: 365, w: 88, h: 435, color: 0x1e293b },
        { x: 463, w: 67, h: 355, color: 0x172033 },
        { x: 540, w: 112, h: 485, color: 0x1e293b },
        { x: 662, w: 82, h: 405, color: 0x172033 },
        { x: 754, w: 46, h: 365, color: 0x1e293b },
      ];
      const neonPalette = [0x0ea5e9, 0x8b5cf6, 0xf97316, 0x10b981, 0xf43f5e];
      for (const b of nearBuildings) {
        g.fillStyle(b.color).fillRect(b.x, 600 - b.h, b.w, b.h);
        // Dense warm windows
        g.fillStyle(0xfde68a, 0.65);
        for (let wy = 600 - b.h + 12; wy < 600 - 16; wy += 16) {
          for (let wx = b.x + 6; wx < b.x + b.w - 8; wx += 12) {
            if ((wx + wy) % 4 !== 0) {
              g.fillRect(wx, wy, 5, 7);
            }
          }
        }
        // Neon sign strip near top of building
        if (b.w > 60) {
          const neonColor = neonPalette[b.x % neonPalette.length];
          const signY = 600 - b.h + 35;
          // Glow halo
          g.fillStyle(neonColor, 0.2).fillRect(
            b.x + 6,
            signY - 4,
            b.w - 12,
            16,
          );
          // Sign bar
          g.fillStyle(neonColor, 0.8).fillRect(b.x + 8, signY, b.w - 16, 7);
        }
        // Rooftop beacon light
        g.fillStyle(0xef4444, 0.9).fillRect(
          b.x + Math.floor(b.w / 2) - 2,
          600 - b.h - 5,
          4,
          5,
        );
        // Rooftop antenna
        g.fillStyle(0x475569).fillRect(
          b.x + Math.floor(b.w / 2) - 1,
          600 - b.h - 18,
          2,
          14,
        );
      }
    },
    GENERATED_TEXTURES.cityParallax3,
    800,
    600,
  );
}

export function ensureGeneratedGameTextures(scene: Phaser.Scene) {
  createPlatformFallback(scene);
  createMovingPlatformTexture(scene);
  createSpikeTexture(scene);
  createSteamVentTextures(scene);
  createEnemyProjectileTexture(scene);
  createCollectibleTextures(scene);
  createBuildingTextures(scene);
  createStreetLampTexture(scene);
  createPowerPoleTexture(scene);
  createBuildingTileTextures(scene);
  createDecorationTextures(scene);
  createCityParallaxTextures(scene);
}
