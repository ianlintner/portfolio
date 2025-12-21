import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";
import { PARALLAX_SETS, TILESETS } from "../assets/manifest";
import { createParallaxBackground } from "../assets/parallax";
import { createTilemapFromData } from "../assets/tilemap";

export class Level1 extends BaseLevel {
  constructor() {
    super("Level1", "Level2");
  }

  protected createLevel() {
    const tileset = TILESETS.city;
    const TILE_SIZE = tileset.tileWidth; // native tile size of city tileset
    const SCALE = 32 / TILE_SIZE; // upscale to ~32px feel
    const COLS = 120;
    const ROWS = 24;
    const WORLD_WIDTH = COLS * TILE_SIZE * SCALE;
    const WORLD_HEIGHT = ROWS * TILE_SIZE * SCALE;

    this.setWorldSize(WORLD_WIDTH, WORLD_HEIGHT);

    // Generate level data
    const levelData: number[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: number[] = [];
      for (let c = 0; c < COLS; c++) {
        let tileIndex = -1;

        // Ground: pick solid bricks at index 0
        if (r >= ROWS - 2) {
          tileIndex = 0;
        }

        // Platforms: choose another solid tile (index 9)
        if (r === ROWS - 5 && c >= 18 && c <= 26) tileIndex = 9;
        if (r === ROWS - 8 && c >= 32 && c <= 36) tileIndex = 9;
        if (r === ROWS - 6 && c >= 48 && c <= 54) tileIndex = 9;

        row.push(tileIndex);
      }
      levelData.push(row);
    }

    // Parallax backgrounds (non-square, long layers; repeat horizontally)
    createParallaxBackground(this, {
      set: PARALLAX_SETS.city1,
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      repeatX: true,
      depthStart: -50,
    });

    // Tilemap layer from procedural data
    const { layer } = createTilemapFromData(this, {
      data: levelData,
      tileset,
      scale: SCALE,
      x: 0,
      y: 0,
    });
    this.layer = layer;

    // Enemies
    const mouse = new Enemy(this, 500, 350, "mouse");
    this.enemies.add(mouse);

    const rat = new Enemy(this, 700, 250, "rat");
    this.enemies.add(rat);

    // Items
    this.items.create(650, 250, "items", 2); // Catnip (Frame 2)

    // Goal
    this.goal = this.physics.add.staticSprite(1800, 550, "items", 0); // Golden Bowl (Frame 0)
  }
}
