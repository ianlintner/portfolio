import Phaser from "phaser";

/**
 * Set up animated water tiles for retro tileset.
 * Water tiles (indices 4, 5, 6) cycle with a timer.
 *
 * @param scene Phaser Scene with a tilemap layer
 * @param layer Tilemap layer containing water tiles
 * @param frameMs Milliseconds per water frame (default 180)
 * @returns Timed event handle (so you can cancel later if needed)
 */
export function setupWaterAnimation(
  scene: Phaser.Scene,
  layer: Phaser.Tilemaps.TilemapLayer,
  frameMs: number = 180,
): Phaser.Time.TimerEvent {
  const waterFrames = [4, 5, 6];
  let currentFrameIndex = 0;

  return scene.time.addEvent({
    delay: frameMs,
    loop: true,
    callback: () => {
      const current = waterFrames[currentFrameIndex];
      const next = waterFrames[(currentFrameIndex + 1) % waterFrames.length];

      // Swap all tiles with current index to next
      layer.forEachTile((tile) => {
        if (tile.index === current) {
          tile.index = next;
        }
      });

      currentFrameIndex = (currentFrameIndex + 1) % waterFrames.length;
    },
  });
}
