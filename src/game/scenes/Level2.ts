import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";
import { TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";

export class Level2 extends BaseLevel {
  constructor() {
    super("Level2", "Level3");
  }

  protected createLevel() {
    const tileset = TILESETS.industrial;

    // Retro platformer level with a gap in the ground
    const levelData: number[][] = [
      [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1,
      ],
      [
        -1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
        11, -1,
      ],
      [-1, 11, 3, 3, 3, 3, 11, 11, 11, 3, 3, 3, 11, 11, 11, 11, 11, 11, 11, -1],
      [
        -1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
        11, -1,
      ],
      [
        -1, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
        14, -1,
      ],
      [
        -1, 12, 12, 12, 12, 12, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12,
        12, -1,
      ], // Ground with gap
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

    // Set collision on solid tiles (empty is -1)
    layer.setCollision([3, 12, 13, 14]);

    // Camera setup
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Enemies
    // Note: EnemyType no longer includes "dog" in the roguelike rebuild.
    const chipmunk = new Enemy(this, 320, 100, "chipmunk");
    this.enemies.add(chipmunk);

    // Goal
    {
      // The bowl art is 1024×1024; without scaling it will overlap huge areas.
      const GOAL_DISPLAY_PX = 64;
      const GOAL_SCALE = GOAL_DISPLAY_PX / 1024;

      this.goal = this.physics.add.staticSprite(608, 80, "catfoodBowl");
      this.goal.setScale(GOAL_SCALE);
      const goalBody = this.goal.body as Phaser.Physics.Arcade.StaticBody;
      goalBody.setSize(44, 44, true);
      this.goal.refreshBody();
    }
  }
}
