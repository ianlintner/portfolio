import { Scene } from "phaser";
import * as Phaser from "phaser";

export type EnemyType =
  | "mouse"
  | "rat"
  | "chipmunk"
  | "rabbit"
  | "snake"
  | "shark"
  | "lizard";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private enemyType: EnemyType;
  private walkSpeed: number = 80;
  private squished = false;
  private direction: 1 | -1 = 1;
  private terrainLayer?: Phaser.Tilemaps.TilemapLayer;

  /** Tile-sized enemies (our world/tile grid is 32px). */
  private static readonly DISPLAY_PX = 32;
  /** Keep collisions fair: slightly smaller than the full 32×32 frame. */
  private static readonly BODY_PX = 26;

  constructor(scene: Scene, x: number, y: number, type: EnemyType) {
    super(scene, x, y, "enemies"); // Using 'enemies' texture

    this.enemyType = type;
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDragX(0);

    // Persisted direction can be used to add variety across spawns.
    this.direction = scene.registry.get("enemyDir") === -1 ? -1 : 1;
    this.setVelocityX(this.direction * this.walkSpeed);
    this.setFlipX(this.direction === -1);

    // Ensure enemies are consistently tile-sized in world pixels.
    // (If any parent scene/camera scaling changes, this keeps them on the 32px grid.)
    this.setDisplaySize(Enemy.DISPLAY_PX, Enemy.DISPLAY_PX);

    // Tight-ish body so collisions feel fair, but not so small that debug looks wrong.
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(Enemy.BODY_PX, Enemy.BODY_PX);
    body.setOffset(
      (this.displayWidth - Enemy.BODY_PX) / 2,
      (this.displayHeight - Enemy.BODY_PX) / 2
    );

    // Play initial animation
    this.play(this.animKey("move"));
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
    }

    // Reverse at world bounds / solid walls.
    if (body.blocked.left) this.direction = 1;
    if (body.blocked.right) this.direction = -1;

    // Avoid pits: if we're on the ground and there is no collidable tile just
    // ahead of our feet, turn around.
    if (this.terrainLayer && body.blocked.down) {
      const lookAheadPx = 14;
      const aheadX = body.center.x + this.direction * lookAheadPx;
      const feetY = body.bottom + 2;

      const tileBelowAhead = this.terrainLayer.getTileAtWorldXY(
        aheadX,
        feetY,
        true
      );

      // `collides` reflects the layer's collision settings.
      if (!tileBelowAhead || !tileBelowAhead.collides) {
        this.direction = this.direction === 1 ? -1 : 1;
      }
    }

    body.setVelocityX(this.direction * speed);
    this.setFlipX(this.direction === -1);

    // Animation based on motion.
    if (Math.abs(body.velocity.x) > 2) {
      if (this.anims.currentAnim?.key !== this.animKey("move")) {
        this.play(this.animKey("move"));
      }
    } else {
      if (this.anims.currentAnim?.key !== this.animKey("idle")) {
        this.play(this.animKey("idle"));
      }
    }
  }

  private animKey(kind: "move" | "idle" | "squish" | "squished") {
    return `enemy:${this.enemyType}:${kind}`;
  }
}
