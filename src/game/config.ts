import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { Preloader } from "./scenes/Preloader";
import { MainMenu } from "./scenes/MainMenu";
import { RogueRun } from "./scenes/RogueRun";
import { UIScene } from "./scenes/UIScene";
import { GameOver } from "./scenes/GameOver";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: process.env.NODE_ENV === "development",
    },
  },
  scene: [BootScene, Preloader, MainMenu, RogueRun, UIScene, GameOver],
};
