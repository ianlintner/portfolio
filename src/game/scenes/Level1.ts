import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";
import { TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";
import { setupWaterAnimation } from "../assets/water-animation";

export class Level1 extends BaseLevel {
  constructor() {
    super("Level1", "Level2");
  }

  protected createLevel() {
    // Runtime industrial tileset: 32×32 tiles, stitched during Preloader
    const tileset = TILESETS.industrial;

    // Build a retro platformer level
    const levelData: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 11, 3, 3, 3, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0],
      [0, 4, 5, 6, 4, 5, 6, 4, 5, 6, 4, 5, 6, 4, 5, 0], // Animated water
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
      [0, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11, 0],
      [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
    ];

    // Level dimensions
    const WORLD_WIDTH = levelData[0].length * tileset.tileWidth;
    const WORLD_HEIGHT = levelData.length * tileset.tileHeight;
    this.setWorldSize(WORLD_WIDTH, WORLD_HEIGHT);

    // Create tilemap from data
    const { map, layer } = createTilemapFromData(this, {
      data: levelData,
      tileset,
      scale: 1,
      x: 0,
      y: 0,
    });
    this.layer = layer;

    // Set collision on solid tiles (avoid 0 which we reserve as empty)
    layer.setCollision([3, 12, 13, 14]);

    // Animate water tiles
    setupWaterAnimation(this, layer, 180);

    // Camera setup
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Enemies
    const mouse = new Enemy(this, 224, 200, "mouse");
    this.enemies.add(mouse);

    const rat = new Enemy(this, 320, 150, "rat");
    this.enemies.add(rat);

    // Items
    {
      // Source art is 1024×1024; scale + body size keep it "sprite-sized" in-game.
      const ITEM_DISPLAY_PX = 48;
      const ITEM_SCALE = ITEM_DISPLAY_PX / 1024;

      const item = this.items.create(224, 150, "catnip");
      item.setScale(ITEM_SCALE);
      item.body.setSize(28, 28, true);
    }

    // Goal
    {
      // The bowl art is 1024×1024; without scaling it will overlap the player immediately.
      const GOAL_DISPLAY_PX = 64;
      const GOAL_SCALE = GOAL_DISPLAY_PX / 1024;

      this.goal = this.physics.add.staticSprite(448, 180, "catfoodBowl");
      this.goal.setScale(GOAL_SCALE);
      const goalBody = this.goal.body as Phaser.Physics.Arcade.StaticBody;
      goalBody.setSize(44, 44, true);
      this.goal.refreshBody();
    }
  }
}
