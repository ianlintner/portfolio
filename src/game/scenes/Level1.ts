import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";

export class Level1 extends BaseLevel {
  constructor() {
    super("Level1", "Level2");
  }

  protected createLevel() {
    const TILE_SIZE = 32;
    const COLS = 100; // Wider world
    const ROWS = 20;

    // Generate level data
    const levelData: number[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: number[] = [];
      for (let c = 0; c < COLS; c++) {
        let tileIndex = -1;

        // Ground
        if (r === ROWS - 1) {
          tileIndex = 10; // Pavement/Ground
        }

        // Platforms
        // (400, 400) -> col ~12, row ~12
        if (r === 12 && c >= 12 && c <= 16) tileIndex = 10;

        // (600, 300) -> col ~18, row ~9
        if (r === 9 && c >= 18 && c <= 20) tileIndex = 10;

        // (800, 450) -> col ~25, row ~14
        if (r === 14 && c >= 25 && c <= 28) tileIndex = 10;

        row.push(tileIndex);
      }
      levelData.push(row);
    }

    // Create Map
    const map = this.make.tilemap({
      data: levelData,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });

    const tileset = map.addTilesetImage("alleyTiles", undefined, TILE_SIZE, TILE_SIZE);
    if (tileset) {
        this.layer = map.createLayer(0, tileset, 0, 0)!;
        this.layer.setCollision([10]);
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
