import { Scene } from "phaser";
import type * as Phaser from "phaser";

import { PARALLAX_SETS, TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";
import { createParallaxBackground } from "../assets/parallax";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import { generateLevel } from "../rogue/levelGenerator";
import { SPRITE_SIZES } from "../sprites/constants";

type RogueRunInit = {
  seed?: string;
  floor?: number;
};

export class RogueRun extends Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private hairballs!: Phaser.Physics.Arcade.Group;
  private goal!: Phaser.Physics.Arcade.Sprite;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private worldWidthPx = 800;
  private worldHeightPx = 600;

  private seed = "run";
  private floor = 1;

  create(data?: RogueRunInit) {
    // Seed/floor come from scene start/restart, falling back to registry.
    const registrySeed = String(this.registry.get("runSeed") ?? "run");
    const registryFloor = Number(this.registry.get("runFloor") ?? 1);

    this.seed = data?.seed ?? registrySeed;
    this.floor = data?.floor ?? registryFloor;

    this.registry.set("runSeed", this.seed);
    this.registry.set("runFloor", this.floor);

    // Groups
    this.enemies = this.physics.add.group();
    this.items = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.hairballs = this.physics.add.group();

    // Parallax background (simple + reliable)
    createParallaxBackground(this, {
      set: PARALLAX_SETS.industrial1,
      worldWidth: 99999,
      worldHeight: 600,
      repeatX: true,
      depthStart: -100,
    });

    // Procedural level
    const tileset = TILESETS.industrial;
    const level = generateLevel({ seed: this.seed, floor: this.floor });

    this.worldWidthPx = level.widthTiles * level.tileSize;
    this.worldHeightPx = level.heightTiles * level.tileSize;

    const { layer } = createTilemapFromData(this, {
      data: level.data,
      tileset,
      scale: 1,
      x: 0,
      y: 0,
    });
    this.layer = layer;

    // Collision: we only generate a couple of solid tile indices.
    layer.setCollision([3, 12, 13, 14]);

    // Player
    this.player = new Player(this, level.spawn.player.x, level.spawn.player.y);

    // Goal
    this.goal = this.physics.add.staticSprite(
      level.spawn.goal.x,
      level.spawn.goal.y,
      "catfoodBowl",
    );
    {
      const { sourcePx, displayPx, bodyPx } = SPRITE_SIZES.catfoodBowl;
      const scale = displayPx / sourcePx;
      this.goal.setScale(scale);
      const body = this.goal.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(bodyPx, bodyPx, true);
      this.goal.refreshBody();
    }

    // Items
    for (const it of level.items) {
      const item = this.items.create(it.pos.x, it.pos.y, it.key);
      const { sourcePx, displayPx, bodyPx } = SPRITE_SIZES.catnip;
      const scale = displayPx / sourcePx;
      item.setScale(scale);
      item.body.setSize(bodyPx, bodyPx, true);
    }

    // Enemies
    for (const e of level.enemies) {
      const enemy = new Enemy(this, e.pos.x, e.pos.y, e.type);
      this.enemies.add(enemy);
    }

    // Physics
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.enemies, this.layer);
    this.physics.add.collider(this.goal, this.layer);

    this.physics.add.overlap(
      this.player,
      this.items,
      (_player, item) => {
        item.destroy();
        this.player.powerUp();
        // Score is optional; keep it simple.
        const score = Number(this.registry.get("score") ?? 0) + 10;
        this.registry.set("score", score);
      },
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.goal,
      () => this.advanceFloor(),
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      (playerObj, enemyObj) => this.onPlayerEnemy(playerObj, enemyObj),
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.hairballs,
      this.enemies,
      (ball, enemyObj) => {
        (enemyObj as Enemy).squish();
        ball.destroy();
      },
      undefined,
      this,
    );

    // Hairball vs world
    this.physics.add.collider(this.hairballs, this.layer, (ball) =>
      ball.destroy(),
    );

    // Camera
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, this.worldWidthPx, this.worldHeightPx);
    this.physics.world.setBounds(0, 0, this.worldWidthPx, this.worldHeightPx);

    // Shoot event
    this.events.on("player-shoot", this.spawnHairball, this);

    // Ensure registry defaults
    if (this.registry.get("lives") == null) this.registry.set("lives", 3);
    if (this.registry.get("score") == null) this.registry.set("score", 0);
  }

  update() {
    this.player.update();

    this.enemies
      .getChildren()
      .forEach((enemy: any) => enemy.update?.(this.player));

    // Fall death
    if (this.player.y > this.worldHeightPx + 64) {
      this.loseLifeAndMaybeGameOver();
    }
  }

  private spawnHairball(x: number, y: number, direction: number) {
    const ball = this.hairballs.create(x, y, "hairball");
    const { sourcePx, displayPx, bodyRadius } = SPRITE_SIZES.hairball;
    ball.setScale(displayPx / sourcePx);

    ball.setVelocityX(420 * direction);
    ball.setCircle(bodyRadius);
    ball.setCollideWorldBounds(true);

    this.time.delayedCall(1800, () => ball.destroy());
  }

  private onPlayerEnemy(playerObj: unknown, enemyObj: unknown) {
    const player = playerObj as Player;
    const enemy = enemyObj as Enemy;

    if (enemy.isSquished()) return;

    // Stomp check: player moving down and above enemy.
    const pBody = player.body as Phaser.Physics.Arcade.Body | null;
    if (pBody && pBody.velocity.y > 0 && player.y < enemy.y - 6) {
      enemy.squish();
      player.setVelocityY(-320);
      const score = Number(this.registry.get("score") ?? 0) + 25;
      this.registry.set("score", score);
      return;
    }

    this.loseLifeAndMaybeGameOver();
  }

  private loseLifeAndMaybeGameOver() {
    const lives = Math.max(0, Number(this.registry.get("lives") ?? 3) - 1);
    this.registry.set("lives", lives);

    if (lives <= 0) {
      this.scene.stop("UIScene");
      this.scene.start("GameOver");
      return;
    }

    // Restart current floor with same seed for fairness.
    this.scene.restart({
      seed: this.seed,
      floor: this.floor,
    } satisfies RogueRunInit);
  }

  private advanceFloor() {
    const nextFloor = this.floor + 1;
    this.registry.set("runFloor", nextFloor);
    this.scene.restart({
      seed: this.seed,
      floor: nextFloor,
    } satisfies RogueRunInit);
  }
}
