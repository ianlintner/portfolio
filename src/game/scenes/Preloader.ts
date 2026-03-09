import { Scene } from "phaser";
import * as Phaser from "phaser";
import {
  ASSET_URL_PREFIX,
  ENEMY_TEXTURE_KEY,
  IMAGES,
  PARALLAX_SETS,
  SPRITESHEETS,
  TILESETS,
  getParallaxLayerKey,
  getParallaxLayerUrl,
} from "../assets/manifest";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    // Helpful debugging: remember what URL we *intended* to load for certain keys.
    // This makes it much easier to spot "url fell back to key" or encoding issues.
    const expectedUrlByKey: Record<string, string> = {};

    // Visible loading UI so we don't look "stuck" on the default background.
    const { width, height } = this.scale;
    const loadingText = this.add
      .text(width / 2, height / 2 - 40, "Loading... 0%", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const detailText = this.add
      .text(width / 2, height / 2 + 12, "", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#cbd5e1",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const barWidth = Math.min(520, width * 0.8);
    const barHeight = 16;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2;

    const barBg = this.add
      .rectangle(barX, barY, barWidth, barHeight, 0x1f2937)
      .setOrigin(0, 0)
      .setScrollFactor(0);
    const barFill = this.add
      .rectangle(barX, barY, 0, barHeight, 0x3b82f6)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    this.load.on("progress", (value: number) => {
      const pct = Math.round(value * 100);
      loadingText.setText(`Loading... ${pct}%`);
      barFill.width = Math.max(2, barWidth * value);
    });

    this.load.on(
      "fileprogress",
      (file: Phaser.Loader.File) => {
        detailText.setText(file.key);
      },
      this,
    );

    this.load.on(
      "loaderror",
      (file: Phaser.Loader.File) => {
        const key = file?.key;
        const loaderUrl = (file as any)?.url;
        const loaderSrc = (file as any)?.src;
        const loaderType = (file as any)?.type;
        const expectedUrl = key ? expectedUrlByKey[key] : undefined;

        console.error("Asset failed to load", {
          key,
          url: loaderUrl,
          src: loaderSrc,
          type: loaderType,
          expectedUrl,
          // Useful when diagnosing cached/legacy URLs.
          origin: typeof window !== "undefined" ? window.location.origin : "",
        });

        const expected = expectedUrl ? ` (expected: ${expectedUrl})` : "";
        detailText.setText(`Failed: ${key ?? "<unknown>"}${expected}`);
      },
      this,
    );

    // Spritesheets (animated)
    for (const sheet of Object.values(SPRITESHEETS)) {
      const margin =
        "margin" in sheet && typeof sheet.margin === "number"
          ? sheet.margin
          : 0;
      const spacing =
        "spacing" in sheet && typeof sheet.spacing === "number"
          ? sheet.spacing
          : 0;
      this.load.spritesheet(sheet.key, sheet.url, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
        margin,
        spacing,
      });
    }

    // Tilesets (for Tilemaps) MUST be loaded as images.
    for (const tileset of Object.values(TILESETS)) {
      if (tileset.url) {
        this.load.image(tileset.key, tileset.url);
      }
    }

    // Plain images
    for (const img of Object.values(IMAGES)) {
      this.load.image(img.key, img.url);
    }

    // Parallax backgrounds
    // Industrial parallax set(s)
    for (const set of Object.values(PARALLAX_SETS)) {
      for (let i = 1; i <= set.layerCount; i++) {
        const key = getParallaxLayerKey(set, i);
        const url = getParallaxLayerUrl(set, i);

        // Defensive: if anything ever causes the URL to become invalid (e.g. stale
        // cached bundle, accidental config mutation), skip loading rather than
        // letting Phaser treat the key as the URL.
        if (!url || !url.startsWith(ASSET_URL_PREFIX)) {
          console.error("Invalid parallax URL; skipping load", {
            key,
            url,
            expectedPrefix: ASSET_URL_PREFIX,
            set,
          });
          continue;
        }

        expectedUrlByKey[key] = url;
        this.load.image(key, url);
      }
    }
  }

  create() {
    // Create a simple 32x32 white pixel for platforms to tint.
    // Do this in create() so it can't interfere with the loader lifecycle.
    if (!this.textures.exists("platform")) {
      const platformGfx = this.make.graphics({ x: 0, y: 0 });
      platformGfx.fillStyle(0xffffff).fillRect(0, 0, 32, 32);
      platformGfx.generateTexture("platform", 32, 32);
      platformGfx.destroy();
    }

    // Pixel-art filtering: without this, sprites can look like they're
    // "zooming"/shimmering when the camera follows with sub-pixel motion.
    // Apply NEAREST to all pixel-art textures used in the game.
    const nearestKeys = [
      SPRITESHEETS.cat.key,
      // Per-animal enemy spritesheets
      SPRITESHEETS.enemy_dog1.key,
      SPRITESHEETS.enemy_dog2.key,
      SPRITESHEETS.enemy_cat1.key,
      SPRITESHEETS.enemy_cat2.key,
      SPRITESHEETS.enemy_rat1.key,
      SPRITESHEETS.enemy_rat2.key,
      SPRITESHEETS.enemy_bird1.key,
      SPRITESHEETS.enemy_bird2.key,
      SPRITESHEETS.items.key,
      "platform",
      // Plain images used as pixel art.
      IMAGES.catnip.key,
      IMAGES.hairball.key,
      IMAGES.catfoodBowl.key,
    ] as const;

    for (const key of nearestKeys) {
      const tex = this.textures.get(key);
      // TextureManager#get returns a Texture; the filter applies to all frames.
      tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    // Create Animations
    // Row 0: Idle/Sit (Frames 0-13)
    // Row 1: Walk (Frames 14-27)
    // Row 2: Run/Action (Frames 28-41)
    // Row 3: Jump (Frames 42-55)

    try {
      if (!this.anims.exists("walk-left")) {
        this.anims.create({
          key: "walk-left",
          frames: this.anims.generateFrameNumbers("cat", {
            start: 56,
            end: 59,
          }), // Row 4
          frameRate: 10,
          repeat: -1,
        });
      }

      if (!this.anims.exists("walk-right")) {
        this.anims.create({
          key: "walk-right",
          frames: this.anims.generateFrameNumbers("cat", {
            start: 70,
            end: 73,
          }), // Row 5
          frameRate: 10,
          repeat: -1,
        });
      }

      if (!this.anims.exists("idle")) {
        this.anims.create({
          key: "idle",
          frames: this.anims.generateFrameNumbers("cat", {
            start: 267,
            end: 270,
          }), // Row 0, first 3 frames only
          frameRate: 5,
          repeat: -1,
        });
      }

      if (!this.anims.exists("jump-left")) {
        this.anims.create({
          key: "jump-left",
          frames: this.anims.generateFrameNumbers("cat", {
            start: 56,
            end: 59,
          }), // Use walk frames for now to prevent glitching
          frameRate: 10,
          repeat: -1,
        });
      }

      if (!this.anims.exists("jump-right")) {
        this.anims.create({
          key: "jump-right",
          frames: this.anims.generateFrameNumbers("cat", {
            start: 70,
            end: 73,
          }), // Use walk frames for now to prevent glitching
          frameRate: 10,
          repeat: -1,
        });
      }
    } catch (err) {
      console.error("Failed to create cat animations", err);
      this.add
        .text(16, 48, "Animation init failed. Check console.", {
          color: "#ff6b6b",
        })
        .setScrollFactor(0);
    }

    // Enemy Animations
    //
    // Each enemy type has its own combined spritesheet with frames laid out as:
    //   Idle | Walk | Hurt | Death | Attack (if present)
    //
    // Frame ranges per animal (from build_enemy_sheets.py manifest):
    type AnimRange = { start: number; end: number };
    type EnemyAnimDef = {
      textureKey: string;
      idle: AnimRange;
      walk: AnimRange;
      hurt: AnimRange;
      death: AnimRange;
    };

    const ENEMY_ANIM_DEFS: Record<string, EnemyAnimDef> = {
      dog1: {
        textureKey: ENEMY_TEXTURE_KEY.dog1,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
      dog2: {
        textureKey: ENEMY_TEXTURE_KEY.dog2,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
      cat1: {
        textureKey: ENEMY_TEXTURE_KEY.cat1,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
      cat2: {
        textureKey: ENEMY_TEXTURE_KEY.cat2,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
      rat1: {
        textureKey: ENEMY_TEXTURE_KEY.rat1,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 7 },
        hurt: { start: 8, end: 9 },
        death: { start: 10, end: 13 },
      },
      rat2: {
        textureKey: ENEMY_TEXTURE_KEY.rat2,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 7 },
        hurt: { start: 8, end: 9 },
        death: { start: 10, end: 11 },
      },
      bird1: {
        textureKey: ENEMY_TEXTURE_KEY.bird1,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
      bird2: {
        textureKey: ENEMY_TEXTURE_KEY.bird2,
        idle: { start: 0, end: 3 },
        walk: { start: 4, end: 9 },
        hurt: { start: 10, end: 11 },
        death: { start: 12, end: 15 },
      },
    };

    for (const [type, def] of Object.entries(ENEMY_ANIM_DEFS)) {
      const tex = def.textureKey;

      // move (walk loop)
      const moveKey = `enemy:${type}:move`;
      if (this.anims.exists(moveKey)) this.anims.remove(moveKey);
      this.anims.create({
        key: moveKey,
        frames: this.anims.generateFrameNumbers(tex, {
          start: def.walk.start,
          end: def.walk.end,
        }),
        frameRate: 8,
        repeat: -1,
      });

      // idle
      const idleKey = `enemy:${type}:idle`;
      if (this.anims.exists(idleKey)) this.anims.remove(idleKey);
      this.anims.create({
        key: idleKey,
        frames: this.anims.generateFrameNumbers(tex, {
          start: def.idle.start,
          end: def.idle.end,
        }),
        frameRate: 5,
        repeat: -1,
      });

      // squish (hurt + first death frames, plays once)
      const squishKey = `enemy:${type}:squish`;
      if (this.anims.exists(squishKey)) this.anims.remove(squishKey);
      this.anims.create({
        key: squishKey,
        frames: [
          ...this.anims.generateFrameNumbers(tex, {
            start: def.hurt.start,
            end: def.hurt.end,
          }),
          ...this.anims.generateFrameNumbers(tex, {
            start: def.death.start,
            end: def.death.end - 1,
          }),
        ],
        frameRate: 12,
        repeat: 0,
      });

      // squished (final death frame, stays flat)
      const squishedKey = `enemy:${type}:squished`;
      if (this.anims.exists(squishedKey)) this.anims.remove(squishedKey);
      this.anims.create({
        key: squishedKey,
        frames: [{ key: tex, frame: def.death.end }],
        frameRate: 1,
        repeat: -1,
      });
    }

    this.scene.start("MainMenu");
  }
}
