import { Scene } from "phaser";
import * as Phaser from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Load minimal assets needed for the preloader (e.g., loading bar background)
    // this.load.image('background', 'assets/bg.png');
  }

  create() {
    if (this.input.keyboard) {
      this.input.keyboard.addCapture([
        Phaser.Input.Keyboard.KeyCodes.SPACE,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
      ]);
    }
    this.scene.start("Preloader");
  }
}
