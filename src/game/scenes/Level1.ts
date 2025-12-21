import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";

export class Level1 extends BaseLevel {
  constructor() {
    super("Level1", "Level2");
  }

  protected createLevel() {
    const TILE_SIZE = 20; // native tile size of city tileset
    const SCALE = 32 / 20; // upscale to ~32px feel
    const COLS = 120;
    const ROWS = 24;
    const WORLD_WIDTH = COLS * TILE_SIZE * SCALE;
    const WORLD_HEIGHT = ROWS * TILE_SIZE * SCALE;

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

    // Parallax backgrounds (6 layers: 1 = foreground -> 6 = background)
    const parallaxLayers = [
      { key: "cityParallax1", scrollFactor: 0.85 },
      { key: "cityParallax2", scrollFactor: 0.7 },
      { key: "cityParallax3", scrollFactor: 0.55 },
      { key: "cityParallax4", scrollFactor: 0.4 },
      { key: "cityParallax5", scrollFactor: 0.25 },
      { key: "cityParallax6", scrollFactor: 0.12 },
    ];

    parallaxLayers.forEach((layer, index) => {
      const texture = this.textures.get(layer.key);
      const source = texture.getSourceImage() as HTMLImageElement;
      const height = source?.height ?? WORLD_HEIGHT;
      const sprite = this.add.tileSprite(
        0,
        WORLD_HEIGHT - height,
        WORLD_WIDTH,
        height,
        layer.key,
      );
      sprite.setOrigin(0, 0);
      sprite.setScrollFactor(layer.scrollFactor, 0);
      sprite.setDepth(-(index + 1));
    });

    // Create Map
    const map = this.make.tilemap({
      data: levelData,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });

    // When creating from data, addTilesetImage creates a new tileset if we pass the key
    const tileset = map.addTilesetImage(
      "cityTiles",
      "cityTiles",
      TILE_SIZE,
      TILE_SIZE,
      0,
      0,
    );

    if (tileset) {
      this.layer = map.createLayer(0, tileset, 0, 0)!;
      this.layer.setScale(SCALE);
      // Collide with all non-empty tiles
      this.layer.setCollisionByExclusion([-1]);
    } else {
      console.error("Failed to load tileset 'cityTiles'");
    }

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
