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
  streetLamp: "streetLamp",
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
      g.fillStyle(lit ? 0xfbbf24 : 0x1e293b, lit ? 0.85 : 0.6);
      g.fillRect(wx, wy, winW, winH);
      if (lit) {
        // Window shine
        g.fillStyle(0xfef3c7, 0.4);
        g.fillRect(wx, wy, winW, 1);
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

function drawSlitWindows(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  count: number,
  spacing: number,
  height: number,
) {
  for (let i = 0; i < count; i++) {
    const wx = x + i * spacing;
    g.fillStyle(0x0f172a).fillRect(wx, y, 4, height);
    g.fillStyle(0xfbbf24, i % 2 === 0 ? 0.85 : 0.5).fillRect(
      wx + 1,
      y + 1,
      2,
      height - 2,
    );
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
      drawHazardBand(g, 0, 8, 64, 4);
      drawRoofRail(g, 6, 11, 48);
      drawPipeColumn(g, 8, 0, 14);
      drawPipeColumn(g, 46, 2, 12);
      g.fillStyle(0x172038).fillRect(2, 36, 14, 54);
      drawSlitWindows(g, 6, 42, 2, 6, 16);
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
      drawHazardBand(g, 0, 10, 80, 3);
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
      drawHazardBand(g, 0, 10, 96, 3);
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
      drawSlitWindows(g, 56, 30, 2, 8, 10);
      g.fillStyle(0x334155).fillRect(54, 40, 14, 8);
      g.fillStyle(0x1e293b);
      for (let x = 56; x < 66; x += 3) {
        g.fillRect(x, 42, 1, 4);
      }
      g.fillStyle(0x334155).fillRect(72, 26, 14, 24);
      drawPanelLines(g, 72, 26, 14, 24, 6);
      g.fillStyle(0x475569).fillRect(90, 14, 4, 50);
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
      drawHazardBand(g, 8, 18, 56, 3);
      drawRoofRail(g, 14, 17, 42);
      g.fillStyle(0x475569).fillRect(18, 2, 20, 14);
      g.fillStyle(0x64748b).fillRect(20, 4, 16, 2);
      g.fillStyle(0x334155).fillRect(16, 16, 24, 2);
      drawPipeColumn(g, 44, 0, 18);
      g.fillStyle(0x263451).fillRect(10, 52, 8, 60);
      drawSlitWindows(g, 11, 58, 1, 4, 18);
      drawWindows(g, 14, 30, 2, 7, 10, 7, 12, 9);
      drawCrossBracePanel(g, 40, 82, 12, 24);
      g.fillStyle(0x475569).fillRect(14, 112, 36, 6);
      g.fillStyle(0x0f172a).fillRect(24, 118, 18, 26);
      g.fillStyle(0x111827).fillRect(8, 72, 56, 2);
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
      drawHazardBand(g, 0, 24, 112, 3);
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
    },
    GENERATED_TEXTURES.buildingPlant,
    112,
    88,
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

export function ensureGeneratedGameTextures(scene: Phaser.Scene) {
  createPlatformFallback(scene);
  createMovingPlatformTexture(scene);
  createSpikeTexture(scene);
  createSteamVentTextures(scene);
  createEnemyProjectileTexture(scene);
  createCollectibleTextures(scene);
  createBuildingTextures(scene);
  createStreetLampTexture(scene);
}
