import * as Phaser from "phaser";

export type ArcadeDebugToggleOptions = {
  /** Key to toggle debug. Default: O */
  key?: string;
  /** Start with debug enabled? Default: false */
  enabledByDefault?: boolean;
};

function setArcadeDebug(scene: Phaser.Scene, enabled: boolean) {
  const world = scene.physics.world as Phaser.Physics.Arcade.World;

  // Ensure a debug graphic exists when enabling.
  if (enabled) {
    if (!world.debugGraphic) {
      world.createDebugGraphic();
    }

    // Keep debug on top of everything.
    world.debugGraphic?.setDepth(10_000);
    world.debugGraphic?.setVisible(true);
    world.drawDebug = true;
    return;
  }

  // Disable + hide.
  world.drawDebug = false;
  if (world.debugGraphic) {
    world.debugGraphic.clear();
    world.debugGraphic.setVisible(false);
  }
}

/**
 * Installs a keybinding to toggle Arcade Physics debug rendering.
 *
 * Note: `arcade.debug` should be false in the global config so debug starts
 * hidden; this helper can enable it at runtime.
 */
export function installArcadeDebugToggle(
  scene: Phaser.Scene,
  options: ArcadeDebugToggleOptions = {},
) {
  const key = (options.key ?? "O").toUpperCase();
  const enabledByDefault = options.enabledByDefault ?? false;

  const keyboard = scene.input.keyboard;
  if (!keyboard) return;

  // Start hidden by default.
  setArcadeDebug(scene, enabledByDefault);

  const handler = () => {
    const world = scene.physics.world as Phaser.Physics.Arcade.World;
    const enabled = !world.drawDebug;
    setArcadeDebug(scene, enabled);
  };

  keyboard.on(`keydown-${key}`, handler);

  // Cleanup on shutdown/destroy to avoid leaking listeners across restarts.
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    keyboard.off(`keydown-${key}`, handler);
  });
  scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
    keyboard.off(`keydown-${key}`, handler);
  });
}
