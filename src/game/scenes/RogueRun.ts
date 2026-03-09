import { Scene } from "phaser";
import type * as Phaser from "phaser";

import { PARALLAX_SETS, TILESETS } from "../assets/manifest";
import { createTilemapFromData } from "../assets/tilemap";
import { createParallaxBackground } from "../assets/parallax";
import { Player } from "../objects/Player";
import { Enemy } from "../objects/Enemy";
import { Hazard } from "../objects/Hazard";
import { Collectible } from "../objects/Collectible";
import { Powerup } from "../objects/Powerup";
import { generateLevel } from "../rogue/levelGenerator";
import { SPRITE_SIZES } from "../sprites/constants";
import { installArcadeDebugToggle } from "../utils/arcadeDebugToggle";

type RogueRunInit = {
  seed?: string;
  floor?: number;
};

export class RogueRun extends Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private hairballs!: Phaser.Physics.Arcade.Group;
  private enemyProjectiles!: Phaser.Physics.Arcade.Group;
  private goal!: Phaser.Physics.Arcade.Sprite;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private worldWidthPx = 800;
  private worldHeightPx = 600;

  private seed = "run";
  private floor = 1;
  private layout: "standard" | "parkour" | "vertical" | "boss" = "standard";
  private isBossFloor = false;
  private floorStartMs = 0;
  private tookDamageThisFloor = false;
  private killsThisFloor = 0;
  private totalEnemiesThisFloor = 0;
  private collectedCoinsThisFloor = 0;
  private totalCoinsThisFloor = 0;

  constructor() {
    super("RogueRun");
  }

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
    this.hazards = this.physics.add.staticGroup();
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.hairballs = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

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
    this.layout = level.layout;
    this.isBossFloor = level.isBossFloor;
    this.floorStartMs = this.time.now;
    this.tookDamageThisFloor = false;
    this.killsThisFloor = 0;
    this.totalEnemiesThisFloor = level.enemies.length;
    this.collectedCoinsThisFloor = 0;
    this.totalCoinsThisFloor = level.collectibles.filter(
      (c) => c.type === "coin",
    ).length;
    this.registry.set("layout", this.layout);

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

    // Powerups/items
    for (const it of level.items) {
      const item = new Powerup(this, it.pos.x, it.pos.y, it.key);
      this.items.add(item);
    }

    // Hazards
    for (const hz of level.hazards) {
      const hazard = new Hazard(this, hz.pos.x, hz.pos.y, hz.type);
      this.hazards.add(hazard);
    }

    // Collectibles
    for (const c of level.collectibles) {
      const collectible = new Collectible(this, c.pos.x, c.pos.y, c.type);
      this.collectibles.add(collectible);
    }

    // Enemies
    for (const e of level.enemies) {
      const enemy = new Enemy(this, e.pos.x, e.pos.y, e.type);
      enemy.setTerrainLayer?.(this.layer);
      if (e.role === "boss") {
        enemy.setBossMode();
      }
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
        const powerup = item as Powerup;
        this.player.applyPowerup(powerup.powerupType);
        const score = Number(this.registry.get("score") ?? 0) + 30;
        this.registry.set("score", score);
      },
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.hazards,
      (playerObj, hazardObj) => this.onPlayerHazard(playerObj, hazardObj),
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      (_playerObj, collectibleObj) => {
        const collectible = collectibleObj as Collectible;
        collectible.destroy();

        if (collectible.collectibleType === "coin") {
          this.collectedCoinsThisFloor += 1;
          const coins = Number(this.registry.get("coins") ?? 0) + 1;
          this.registry.set("coins", coins);
          this.registry.set(
            "score",
            Number(this.registry.get("score") ?? 0) + 5,
          );
        } else if (collectible.collectibleType === "gem") {
          const gems = Number(this.registry.get("gems") ?? 0) + 1;
          this.registry.set("gems", gems);
          this.registry.set(
            "score",
            Number(this.registry.get("score") ?? 0) + 60,
          );
        } else if (collectible.collectibleType === "heart_small") {
          this.player.heal(1);
        } else if (collectible.collectibleType === "heart_big") {
          this.player.heal(2);
        }
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
        const enemy = enemyObj as Enemy;
        const died = enemy.takeHit(1);
        if (died) {
          this.killsThisFloor += 1;
          const killScore = enemy.isBoss() ? 400 : 25;
          this.registry.set(
            "score",
            Number(this.registry.get("score") ?? 0) + killScore,
          );
        }
        ball.destroy();
      },
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.enemyProjectiles,
      (_playerObj, projectileObj) => {
        projectileObj.destroy();
        this.applyPlayerDamage(1);
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
    // Composition: keep the player a bit lower in the viewport so the ground,
    // platforms, and goal aren't clustered too high.
    // Negative followOffsetY makes the camera track a point slightly ABOVE the
    // player, which moves the world DOWN on screen.
    const followOffsetY = -140;
    this.cameras.main.startFollow(
      this.player,
      true,
      0.08,
      0.08,
      0,
      followOffsetY,
    );

    // Avoid showing "empty" bands beyond the world when bounds are smaller than
    // the 800×600 canvas.
    const boundsWidth = Math.max(this.worldWidthPx, this.scale.width);
    const boundsHeight = Math.max(this.worldHeightPx, this.scale.height);
    this.cameras.main.setBounds(0, 0, boundsWidth, boundsHeight);
    this.physics.world.setBounds(0, 0, boundsWidth, boundsHeight);

    // Debug visuals (hitboxes, velocities, collision tiles): hidden by default.
    // Toggle with the "O" key.
    installArcadeDebugToggle(this, { key: "O", enabledByDefault: false });

    // Shoot event
    this.events.on("player-shoot", this.spawnHairball, this);
    this.events.on("enemy-shoot", this.spawnEnemyProjectile, this);

    // Ensure registry defaults
    if (this.registry.get("lives") == null) this.registry.set("lives", 3);
    if (this.registry.get("score") == null) this.registry.set("score", 0);
    if (this.registry.get("coins") == null) this.registry.set("coins", 0);
    if (this.registry.get("gems") == null) this.registry.set("gems", 0);
    if (this.registry.get("playerHearts") == null)
      this.registry.set("playerHearts", 3);
    if (this.registry.get("maxHearts") == null)
      this.registry.set("maxHearts", 3);

    this.events.once("shutdown", () => {
      this.events.off("player-shoot", this.spawnHairball, this);
      this.events.off("enemy-shoot", this.spawnEnemyProjectile, this);
    });
  }

  update() {
    this.player.update();

    this.enemies
      .getChildren()
      .forEach((enemy: any) => enemy.update?.(this.player));

    // Fall death (pits are instant life loss)
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

  private spawnEnemyProjectile(x: number, y: number, direction: number) {
    const bullet = this.enemyProjectiles.create(x, y, "platform");
    bullet.setDisplaySize(12, 8);
    bullet.setTint(0xef4444);
    bullet.setVelocityX(240 * direction);
    bullet.setCircle(4);
    bullet.setCollideWorldBounds(true);

    this.physics.add.collider(bullet, this.layer, () => bullet.destroy());
    this.time.delayedCall(2600, () => bullet.destroy());
  }

  private onPlayerEnemy(playerObj: unknown, enemyObj: unknown) {
    const player = playerObj as Player;
    const enemy = enemyObj as Enemy;

    if (enemy.isSquished()) return;

    // Stomp check: player moving down and above enemy.
    const pBody = player.body as Phaser.Physics.Arcade.Body | null;
    if (pBody && pBody.velocity.y > 0 && player.y < enemy.y - 6) {
      const died = enemy.takeHit(1);
      player.setVelocityY(-320);
      if (died) {
        this.killsThisFloor += 1;
      }
      const score =
        Number(this.registry.get("score") ?? 0) + (enemy.isBoss() ? 80 : 25);
      this.registry.set("score", score);
      return;
    }

    this.applyPlayerDamage(1);
  }

  private onPlayerHazard(playerObj: unknown, hazardObj: unknown) {
    const player = playerObj as Player;
    const hazard = hazardObj as Hazard;
    if (player !== this.player) return;
    if (hazard.hazardType === "steam" && !hazard.isActive()) return;
    this.applyPlayerDamage(hazard.damage);
  }

  private applyPlayerDamage(amount: number) {
    this.tookDamageThisFloor = true;
    const died = this.player.takeDamage(amount);
    if (died) this.handlePlayerDeath();
  }

  private handlePlayerDeath() {
    const lives = Math.max(0, Number(this.registry.get("lives") ?? 3) - 1);
    this.registry.set("lives", lives);

    if (lives <= 0) {
      this.scene.stop("UIScene");
      this.scene.start("GameOver");
      return;
    }

    // New life starts with full hearts.
    const maxHearts = Number(this.registry.get("maxHearts") ?? 3);
    this.registry.set("playerHearts", maxHearts);

    // Restart current floor with same seed (player gets full hearts back)
    this.scene.restart({
      seed: this.seed,
      floor: this.floor,
    } satisfies RogueRunInit);
  }

  private loseLifeAndMaybeGameOver() {
    // Pits are instant death regardless of current hearts.
    this.handlePlayerDeath();
  }

  private advanceFloor() {
    if (this.isBossFloor) {
      const bossAlive = this.enemies
        .getChildren()
        .some((e) => e instanceof Enemy && e.isBoss() && !e.isSquished());
      if (bossAlive) {
        this.registry.set("objectiveStatus", "Defeat boss before using goal");
        return;
      }
    }

    const elapsedSec = (this.time.now - this.floorStartMs) / 1000;
    const speedRun = elapsedSec < 60;
    const noDamage = !this.tookDamageThisFloor;
    const exterminator = this.killsThisFloor >= this.totalEnemiesThisFloor;
    const collector =
      this.totalCoinsThisFloor > 0 &&
      this.collectedCoinsThisFloor >= this.totalCoinsThisFloor;

    let bonus = 0;
    const badges: string[] = [];
    if (speedRun) {
      bonus += 100;
      badges.push("Speed");
    }
    if (noDamage) {
      bonus += 200;
      badges.push("NoHit");
    }
    if (exterminator) {
      bonus += 150;
      badges.push("Exterminator");
    }
    if (collector) {
      bonus += 100;
      badges.push("Collector");
    }

    if (bonus > 0) {
      this.registry.set(
        "score",
        Number(this.registry.get("score") ?? 0) + bonus,
      );
    }
    this.registry.set(
      "objectiveStatus",
      badges.length ? badges.join(" · ") : "Goal Cleared",
    );

    const nextFloor = this.floor + 1;
    this.registry.set("runFloor", nextFloor);
    this.scene.restart({
      seed: this.seed,
      floor: nextFloor,
    } satisfies RogueRunInit);
  }
}
