import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Load minimal assets needed for the preloader (e.g., loading bar background)
    // this.load.image('background', 'assets/bg.png');
  }

  create() {
    this.scene.start("Preloader");
  }
}
