import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";
import { TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";

export class Level3 extends BaseLevel {
  constructor() {
    super("Level3", "Victory");
  }

  protected createLevel() {
    const tileset = TILESETS.industrial;

    // Retro platformer level with verticality and a gap
    const levelData: number[][] = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, -1],
      [-1, 11, 3, 3, 11, 11, 11, 3, 3, 11, 11, 11, 3, 3, 11, -1],
      [-1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, -1],
      [-1, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, -1],
      [-1, 12, 12, 12, 12, 12, 11, 11, 11, 12, 12, 12, 12, 12, 12, -1], // Ground with gap
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

    // Enemies (Snake)
    const snake = new Enemy(this, 256, 100, "snake");
    this.enemies.add(snake);

    // Items
    {
      // Source art is 1024×1024; scale + body size keep it "sprite-sized" in-game.
      const ITEM_DISPLAY_PX = 48;
      const ITEM_SCALE = ITEM_DISPLAY_PX / 1024;

      const item = this.items.create(288, 100, "catnip");
      item.setScale(ITEM_SCALE);
      item.body.setSize(28, 28, true);
    }

    // Goal
    {
      // The bowl art is 1024×1024; without scaling it will overlap huge areas.
      const GOAL_DISPLAY_PX = 64;
      const GOAL_SCALE = GOAL_DISPLAY_PX / 1024;

      this.goal = this.physics.add.staticSprite(480, 100, "catfoodBowl");
      this.goal.setScale(GOAL_SCALE);
      const goalBody = this.goal.body as Phaser.Physics.Arcade.StaticBody;
      goalBody.setSize(44, 44, true);
      this.goal.refreshBody();
    }
  }
}
