import { Scene } from "phaser";
import { Player } from "../objects/Player";
import { PARALLAX_SETS, type ParallaxSetSpec } from "../assets/manifest";
import { createParallaxBackground } from "../assets/parallax";

export class BaseLevel extends Scene {
  protected player!: Player;
  protected platforms!: Phaser.Physics.Arcade.StaticGroup;
  protected layer?: Phaser.Tilemaps.TilemapLayer;
  protected enemies!: Phaser.Physics.Arcade.Group;
  protected items!: Phaser.Physics.Arcade.Group;
  protected hairballs!: Phaser.Physics.Arcade.Group;
  protected goal!: Phaser.Physics.Arcade.Sprite;
  protected parallaxLayers?: Phaser.GameObjects.GameObject[];

  /**
   * Levels can set these via setWorldSize(). If a tilemap layer exists,
   * we will prefer deriving bounds from the layer's display size.
   */
  protected worldWidth: number = 800;
  protected worldHeight: number = 600;

  protected levelKey: string;
  protected nextLevelKey: string;

  /** Default parallax set for the current industrial art style. Levels can override via `getParallaxSet()`. */
  protected defaultParallaxSet: ParallaxSetSpec = PARALLAX_SETS.industrial1;

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

    // Parallax background (behind tilemap + entities)
    this.createParallax();

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
    // Keep the player lower in the frame (more forward view) to avoid the
    // floor/platforms reading as "too high" in an 800x600 viewport.
    const followOffsetY = -160;
    this.cameras.main.startFollow(
      this.player,
      true,
      0.05,
      0.05,
      0,
      followOffsetY,
    );

    const derivedWidth = this.layer?.displayWidth ?? this.worldWidth;
    const derivedHeight = this.layer?.displayHeight ?? this.worldHeight;

    const cameraTopMarginPx = 200;
    this.cameras.main.setBounds(
      0,
      -cameraTopMarginPx,
      derivedWidth,
      derivedHeight + cameraTopMarginPx,
    );
    this.physics.world.setBounds(0, 0, derivedWidth, derivedHeight);

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

  /** Levels can override to disable or swap parallax sets. */
  protected getParallaxSet(): ParallaxSetSpec | undefined {
    return this.defaultParallaxSet;
  }

  protected createParallax() {
    const set = this.getParallaxSet();
    if (!set) return;

    const worldWidth = this.layer?.displayWidth ?? this.worldWidth;
    const worldHeight = this.layer?.displayHeight ?? this.worldHeight;

    this.parallaxLayers = createParallaxBackground(this, {
      set,
      worldWidth,
      worldHeight,
      repeatX: true,
      depthStart: -100,
    });
  }

  protected setWorldSize(width: number, height: number) {
    this.worldWidth = width;
    this.worldHeight = height;
  }

  private spawnHairball(x: number, y: number, direction: number) {
    const ball = this.hairballs.create(x, y, "hairball");

    // Hairball art is 1024×1024; keep the projectile visually small and its
    // physics body tight so it doesn't collide with half the level.
    const HAIRBALL_DISPLAY_PX = 24;
    const HAIRBALL_SCALE = HAIRBALL_DISPLAY_PX / 1024;
    ball.setScale(HAIRBALL_SCALE);

    ball.setVelocityX(400 * direction);
    ball.setCircle(10);
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
