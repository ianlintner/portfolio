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

function createBuildingTextures(scene: Phaser.Scene) {
  // Tall factory building (64 x 128)
  withGraphics(
    scene,
    (g) => {
      // Main body
      g.fillStyle(0x1e2744);
      g.fillRect(0, 12, 64, 116);
      // Darker side edge
      g.fillStyle(0x151c34);
      g.fillRect(56, 12, 8, 116);
      // Top cap / cornice
      g.fillStyle(0x2d3a5c);
      g.fillRect(0, 8, 64, 8);
      // Red-stripe hazard band (matches industrial tileset)
      for (let x = 0; x < 64; x += 8) {
        g.fillStyle(x % 16 === 0 ? 0xdc2626 : 0xf97316);
        g.fillRect(x, 8, 4, 4);
      }
      // Rooftop pipe
      g.fillStyle(0x475569);
      g.fillRect(10, 0, 6, 14);
      g.fillStyle(0x64748b);
      g.fillRect(10, 0, 6, 2);
      // Chimney steam vent
      g.fillStyle(0x475569);
      g.fillRect(44, 2, 10, 12);
      g.fillStyle(0x64748b);
      g.fillRect(44, 2, 10, 2);
      // Windows
      drawWindows(g, 6, 22, 3, 6, 8, 6, 10, 10);
      // Door at bottom
      g.fillStyle(0x0f172a);
      g.fillRect(22, 108, 16, 20);
      g.fillStyle(0x475569);
      g.fillRect(22, 108, 16, 2);
      // Door handle
      g.fillStyle(0xfbbf24);
      g.fillRect(34, 118, 2, 2);
    },
    GENERATED_TEXTURES.buildingTall,
    64,
    128,
  );

  // Medium warehouse (80 x 96)
  withGraphics(
    scene,
    (g) => {
      // Main body
      g.fillStyle(0x232e4a);
      g.fillRect(0, 10, 80, 86);
      // Roof slab
      g.fillStyle(0x334155);
      g.fillRect(0, 6, 80, 8);
      // Roof extension / overhang
      g.fillStyle(0x3b4d6b);
      g.fillRect(-2, 6, 84, 4);
      // Red-stripe safety band
      for (let x = 0; x < 80; x += 8) {
        g.fillStyle(x % 16 === 0 ? 0xdc2626 : 0xf97316);
        g.fillRect(x, 10, 4, 3);
      }
      // Air vent / AC unit
      g.fillStyle(0x475569);
      g.fillRect(60, 0, 14, 10);
      g.fillStyle(0x64748b);
      g.fillRect(62, 2, 10, 2);
      g.fillStyle(0x1e293b);
      g.fillRect(62, 5, 10, 3);
      // Windows (2 rows of 4)
      drawWindows(g, 6, 20, 4, 2, 10, 8, 8, 12);
      // Loading dock / garage
      g.fillStyle(0x0f172a);
      g.fillRect(8, 62, 28, 34);
      g.fillStyle(0x334155);
      // Garage door lines
      for (let y = 66; y < 94; y += 6) {
        g.fillRect(8, y, 28, 1);
      }
      // Side windows on right
      drawWindows(g, 50, 62, 2, 1, 8, 8, 8, 0);
      // Pipe running down
      g.fillStyle(0x475569);
      g.fillRect(74, 14, 4, 82);
    },
    GENERATED_TEXTURES.buildingMedium,
    80,
    96,
  );

  // Short workshop (96 x 64)
  withGraphics(
    scene,
    (g) => {
      // Main body
      g.fillStyle(0x1a2340);
      g.fillRect(0, 10, 96, 54);
      // Roof
      g.fillStyle(0x2d3a5c);
      g.fillRect(0, 6, 96, 8);
      // Chimney
      g.fillStyle(0x475569);
      g.fillRect(76, 0, 8, 10);
      g.fillStyle(0x64748b);
      g.fillRect(76, 0, 8, 2);
      // Red-stripe hazard band
      for (let x = 0; x < 96; x += 8) {
        g.fillStyle(x % 16 === 0 ? 0xdc2626 : 0xf97316);
        g.fillRect(x, 10, 4, 3);
      }
      // Garage door (wide)
      g.fillStyle(0x0f172a);
      g.fillRect(6, 28, 36, 36);
      g.fillStyle(0x334155);
      for (let y = 32; y < 62; y += 6) {
        g.fillRect(6, y, 36, 1);
      }
      // Warning stripes on garage edges
      for (let y = 28; y < 64; y += 8) {
        g.fillStyle(y % 16 === 0 ? 0xf97316 : 0x1e293b);
        g.fillRect(4, y, 2, 4);
        g.fillRect(42, y, 2, 4);
      }
      // Small windows
      drawWindows(g, 54, 18, 2, 1, 10, 8, 10, 0);
      // Vent
      g.fillStyle(0x334155);
      g.fillRect(54, 40, 14, 8);
      g.fillStyle(0x1e293b);
      for (let x = 56; x < 66; x += 3) {
        g.fillRect(x, 42, 1, 4);
      }
      // Pipe
      g.fillStyle(0x475569);
      g.fillRect(90, 14, 4, 50);
    },
    GENERATED_TEXTURES.buildingShort,
    96,
    64,
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
