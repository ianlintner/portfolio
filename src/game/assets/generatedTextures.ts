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

export function ensureGeneratedGameTextures(scene: Phaser.Scene) {
  createPlatformFallback(scene);
  createMovingPlatformTexture(scene);
  createSpikeTexture(scene);
  createSteamVentTextures(scene);
  createEnemyProjectileTexture(scene);
  createCollectibleTextures(scene);
}
