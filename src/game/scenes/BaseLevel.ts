import { Scene } from "phaser";
import { Player } from "../objects/Player";

export class BaseLevel extends Scene {
  protected player!: Player;
  protected platforms!: Phaser.Physics.Arcade.StaticGroup;
  protected layer?: Phaser.Tilemaps.TilemapLayer;
  protected enemies!: Phaser.Physics.Arcade.Group;
  protected items!: Phaser.Physics.Arcade.Group;
  protected hairballs!: Phaser.Physics.Arcade.Group;
  protected goal!: Phaser.Physics.Arcade.Sprite;

  protected levelKey: string;
  protected nextLevelKey: string;

  constructor(key: string, nextLevel: string) {
    super(key);
    this.levelKey = key;
    this.nextLevelKey = nextLevel;
  }

  create() {
    // Setup groups
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group();
    this.hairballs = this.physics.add.group();

    // Create Level Layout (Override in subclasses)
    this.createLevel();

    // Player
    this.player = new Player(this, 100, 450);

    // Colliders
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.items, this.platforms);
    this.physics.add.collider(this.goal, this.platforms);

    if (this.layer) {
      this.physics.add.collider(this.player, this.layer);
      this.physics.add.collider(this.enemies, this.layer);
      this.physics.add.collider(this.items, this.layer);
      this.physics.add.collider(this.goal, this.layer);
      this.physics.add.collider(this.hairballs, this.layer, (ball) =>
        ball.destroy(),
      );
    }

    // Overlaps
    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.goal,
      this.reachGoal,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.hairballs,
      this.enemies,
      this.shootEnemy,
      undefined,
      this,
    );
    this.physics.add.collider(this.hairballs, this.platforms, (ball) =>
      ball.destroy(),
    );

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    // Adjust bounds to new scaled tilemap (approx COLS*32 x ROWS*32 => 120*32 x 24*32)
    this.cameras.main.setBounds(0, 0, 3840, 768);
    this.physics.world.setBounds(0, 0, 3840, 768);

    // Listen for shoot event
    this.events.on("player-shoot", this.spawnHairball, this);
  }

  update() {
    this.player.update();

    // Update enemies
    this.enemies.getChildren().forEach((enemy: any) => {
      if (enemy.update) {
        enemy.update();
      }
    });
  }

  protected createLevel() {
    // Override me
  }

  private spawnHairball(x: number, y: number, direction: number) {
    const ball = this.hairballs.create(x, y, "hairball");
    ball.setVelocityX(400 * direction);
    ball.setCircle(16);
    ball.setCollideWorldBounds(true);
    // Destroy after 2 seconds
    this.time.delayedCall(2000, () => ball.destroy());
  }

  private collectItem(player: any, item: any) {
    // Check item type (using texture key for simplicity)
    if (item.texture.key === "hairball") {
      // Reusing texture for catnip for now? No, let's use a different one or tint
      // Actually I used 'hairball' texture for the projectile.
      // Let's assume items are created with specific textures.
    }

    // For now, assume all items are catnip
    this.player.powerUp();
    item.destroy();
  }

  private reachGoal(player: any, goal: any) {
    this.scene.start(this.nextLevelKey);
  }

  private hitEnemy(player: any, enemy: any) {
    // Check if jumping on top
    if (
      player.body.velocity.y > 0 &&
      player.y < enemy.y - enemy.body.height / 2
    ) {
      // Kill enemy
      enemy.destroy();
      player.setVelocityY(-300); // Bounce
    } else {
      // Hurt player
      this.scene.start("GameOver");
    }
  }

  private shootEnemy(ball: any, enemy: any) {
    ball.destroy();
    enemy.destroy();
  }
}
