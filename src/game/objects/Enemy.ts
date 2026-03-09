import { Scene } from "phaser";
import * as Phaser from "phaser";
import { ENEMY_TEXTURE_KEY } from "../assets/manifest";

export type EnemyType =
  | "dog1"
  | "dog2"
  | "cat1"
  | "cat2"
  | "rat1"
  | "rat2"
  | "bird1"
  | "bird2";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: EnemyType;
  private walkSpeed: number = 80;
  private squished = false;
  private direction: 1 | -1 = 1;
  private terrainLayer?: Phaser.Tilemaps.TilemapLayer;
  private maxHp = 1;
  private hp = 1;
  private isBossEnemy = false;
  private lastActionAt = 0;
  private baseY = 0;

  /**
   * Display sizes per enemy type.  Dogs & cats are large (48px source art),
   * rats & birds are small (32px source art).  Sizes are tuned relative to
   * the 64×64 player cat so enemies are clearly visible but still smaller
   * than the player.
   */
  private static readonly DISPLAY_SIZE: Record<EnemyType, number> = {
    dog1: 56,
    dog2: 56,
    cat1: 52,
    cat2: 48,
    rat1: 40,
    rat2: 36,
    bird1: 40,
    bird2: 36,
  };

  constructor(scene: Scene, x: number, y: number, type: EnemyType) {
    // Each enemy type has its own texture key.
    const textureKey = ENEMY_TEXTURE_KEY[type] ?? "enemy_dog1";
    super(scene, x, y, textureKey);

    this.enemyType = type;
    this.scene = scene;
    this.baseY = y;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDragX(0);

    // Persisted direction can be used to add variety across spawns.
    this.direction = scene.registry.get("enemyDir") === -1 ? -1 : 1;
    this.setVelocityX(this.direction * this.walkSpeed);
    this.setFlipX(this.direction === -1);

    if (type === "dog2" || type === "cat2") {
      this.walkSpeed = 95;
    }
    if (type === "bird1" || type === "bird2") {
      this.walkSpeed = 110;
    }
    if (type === "rat2") {
      this.walkSpeed = 60;
    }

    // Scale to the per-type display size.
    const displayPx = Enemy.DISPLAY_SIZE[type] ?? 48;
    this.setDisplaySize(displayPx, displayPx);

    // Physics body: ~80% of display size for fair collision.
    const bodyPx = Math.round(displayPx * 0.8);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(bodyPx, bodyPx);
    body.setOffset(
      (this.displayWidth - bodyPx) / 2,
      (this.displayHeight - bodyPx) / 2,
    );

    if (type === "bird1" || type === "bird2") {
      body.setAllowGravity(false);
      body.setVelocityY(0);
    }

    this.maxHp = type === "dog2" || type === "cat2" ? 2 : 1;
    this.hp = this.maxHp;

    // Play initial animation
    this.play(this.animKey("move"));
  }

  public setBossMode() {
    this.isBossEnemy = true;
    this.maxHp = Math.max(this.maxHp, 8);
    this.hp = this.maxHp;
    this.walkSpeed = Math.max(this.walkSpeed, 120);
    this.setScale(this.scale * 1.65);
    this.setTint(0xf43f5e);
  }

  public isBoss(): boolean {
    return this.isBossEnemy;
  }

  public isSquished(): boolean {
    return this.squished;
  }

  public squish() {
    if (this.squished) return;
    this.squished = true;

    const body = this.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.stop();
      body.enable = false;
    }

    // Play squish -> squished pose, then remove.
    this.play(this.animKey("squish"));
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.scene && this.scene.anims.exists(this.animKey("squished"))) {
        this.play(this.animKey("squished"));
      }
      this.scene.time.delayedCall(400, () => this.destroy());
    });
  }

  public takeHit(amount = 1): boolean {
    if (this.squished) return false;
    this.hp = Math.max(0, this.hp - amount);

    if (this.hp <= 0) {
      this.squish();
      return true;
    }

    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(90, () => {
      if (!this.squished) this.clearTint();
    });
    return false;
  }

  /** Optional: provide the collidable terrain layer so enemies can avoid pits/edges. */
  public setTerrainLayer(layer?: Phaser.Tilemaps.TilemapLayer) {
    this.terrainLayer = layer;
  }

  update(player?: Phaser.Physics.Arcade.Sprite) {
    if (!this.body) return;
    if (this.squished) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Basic AI: patrol; slightly speed up when player is near.
    const baseSpeed = this.walkSpeed;
    let speed = baseSpeed;
    if (player) {
      const dx = Math.abs(player.x - this.x);
      if (dx < 180) speed = baseSpeed * 1.25;

      // Chargers: quick burst toward player every couple seconds.
      if (
        (this.enemyType === "dog2" || this.enemyType === "cat2") &&
        dx < 260 &&
        this.scene.time.now > this.lastActionAt + 2200
      ) {
        this.direction = player.x >= this.x ? 1 : -1;
        body.setVelocityX(this.direction * (this.isBossEnemy ? 320 : 250));
        this.lastActionAt = this.scene.time.now;
      }

      // Shooters: rat2 periodically shoots and keeps a bit of distance.
      if (this.enemyType === "rat2") {
        const faceRight = player.x >= this.x;
        this.direction = faceRight ? 1 : -1;
        if (dx < 160) {
          body.setVelocityX(-this.direction * 80);
        } else if (dx > 260) {
          body.setVelocityX(this.direction * 70);
        }

        if (dx < 360 && this.scene.time.now > this.lastActionAt + 1800) {
          this.scene.events.emit(
            "enemy-shoot",
            this.x,
            this.y - 8,
            this.direction,
          );
          this.lastActionAt = this.scene.time.now;
        }
      }
    }

    // Flyers: hovering sine-wave motion.
    if (this.enemyType === "bird1" || this.enemyType === "bird2") {
      const t = this.scene.time.now * 0.004;
      const sine = Math.sin(t + this.x * 0.02) * 40;
      this.setY(this.baseY + sine);
      if (player) {
        this.direction = player.x >= this.x ? 1 : -1;
      }
      body.setVelocityX(this.direction * (this.isBossEnemy ? 180 : 130));
      this.setFlipX(this.direction === -1);
      if (this.anims.currentAnim?.key !== this.animKey("move")) {
        this.play(this.animKey("move"));
      }
      return;
    }

    // Reverse at world bounds / solid walls.
    if (body.blocked.left) this.direction = 1;
    if (body.blocked.right) this.direction = -1;

    // Avoid pits: if we're on the ground and there is no collidable tile just
    // ahead of our feet, turn around.
    if (this.terrainLayer && body.blocked.down && this.enemyType !== "rat2") {
      const lookAheadPx = 14;
      const aheadX = body.center.x + this.direction * lookAheadPx;
      const feetY = body.bottom + 2;

      const tileBelowAhead = this.terrainLayer.getTileAtWorldXY(
        aheadX,
        feetY,
        true,
      );

      // `collides` reflects the layer's collision settings.
      if (!tileBelowAhead || !tileBelowAhead.collides) {
        this.direction = this.direction === 1 ? -1 : 1;
      }
    }

    body.setVelocityX(this.direction * speed);
    this.setFlipX(this.direction === -1);

    // Keep a stable animation to avoid flicker when velocity briefly hits 0 at
    // walls/turn-arounds. These enemies are patrol movers, so always use "move".
    if (this.anims.currentAnim?.key !== this.animKey("move")) {
      this.play(this.animKey("move"));
    }
  }

  private animKey(kind: "move" | "idle" | "squish" | "squished") {
    return `enemy:${this.enemyType}:${kind}`;
  }
}
