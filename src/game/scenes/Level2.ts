import { BaseLevel } from "./BaseLevel";
import { Enemy } from "../objects/Enemy";

export class Level2 extends BaseLevel {
  constructor() {
    super("Level2", "Level3");
  }

  protected createLevel() {
    this.setWorldSize(2000, 600);

    // Ground
    for (let x = 0; x < 2000; x += 32) {
      if (x < 600 || x > 800) {
        // Gap
        this.platforms.create(x, 584, "platform").setOrigin(0, 0).refreshBody();
      }
    }

    // Platforms
    this.platforms.create(700, 450, "platform").setScale(3, 1).refreshBody();
    this.platforms.create(1000, 350, "platform").setScale(2, 1).refreshBody();
    this.platforms.create(1300, 250, "platform").setScale(4, 1).refreshBody();

    // Enemies (Dog)
    const dog = new Enemy(this, 1000, 300, "dog");
    this.enemies.add(dog);

    // Goal
    this.goal = this.physics.add.staticSprite(1900, 550, "items", 0); // Golden Bowl
  }
}
