import { BaseLevel } from "./BaseLevel";

export class Level2 extends BaseLevel {
  constructor() {
    super("Level2", "Level3");
  }

  protected createLevel() {
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

    // Enemies (Dog placeholder)
    const dog = this.enemies.create(1000, 300, "enemy");
    dog.setTint(0xff0000); // Red for danger
    dog.setVelocityX(-150);
    dog.setCollideWorldBounds(true);
    dog.setBounce(1);

    // Goal
    this.goal = this.physics.add.staticSprite(1900, 550, "bowl");
  }
}
