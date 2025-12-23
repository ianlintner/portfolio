import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";
import { TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";

export class Level3 extends BaseLevel {
  constructor() {
    super("Level3", "Victory");
  }

  protected createLevel() {
    const tileset = TILESETS.retro;

    // Retro platformer level with verticality and a gap
    const levelData: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 11, 3, 3, 11, 11, 11, 3, 3, 11, 11, 11, 3, 3, 11, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0],
      [0, 12, 12, 12, 12, 12, 11, 11, 11, 12, 12, 12, 12, 12, 12, 0], // Ground with gap
    ];

    const WORLD_WIDTH = levelData[0].length * tileset.tileWidth;
    const WORLD_HEIGHT = levelData.length * tileset.tileHeight;
    this.setWorldSize(WORLD_WIDTH, WORLD_HEIGHT);

    const { layer } = createTilemapFromData(this, {
      data: levelData,
      tileset,
      scale: 1,
      x: 0,
      y: 0,
    });
    this.layer = layer;

    // Set collision on solid tiles
    layer.setCollision([0, 3, 12, 13, 14]);

    // Camera setup
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Enemies (Snake)
    const snake = new Enemy(this, 256, 100, "snake");
    this.enemies.add(snake);

    // Items
    this.items.create(288, 100, "items", 2); // Catnip

    // Goal
    this.goal = this.physics.add.staticSprite(480, 100, "items", 0); // Golden Bowl
  }
}
