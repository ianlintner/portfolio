import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";

export class Level1 extends BaseLevel {
  constructor() {
    super("Level1", "Level2");
  }

  protected createLevel() {
    // Ground
    for (let x = 0; x < 2000; x += 32) {
      this.platforms.create(x, 584, "platform").setOrigin(0, 0).refreshBody();
    }

    // Platforms
    this.platforms.create(400, 400, "platform").setScale(4, 1).refreshBody();
    this.platforms.create(600, 300, "platform").setScale(2, 1).refreshBody();
    this.platforms.create(800, 450, "platform").setScale(3, 1).refreshBody();

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
