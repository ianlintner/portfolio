import { BootScene } from './scenes/BootScene';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Level1 } from './scenes/Level1';
import { Level2 } from './scenes/Level2';
import { Level3 } from './scenes/Level3';
import { UIScene } from './scenes/UIScene';
import { GameOver } from './scenes/GameOver';
import { Victory } from './scenes/Victory';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: process.env.NODE_ENV === 'development'
        }
    },
    scene: [
        BootScene,
        Preloader,
        MainMenu,
        Level1,
        Level2,
        Level3,
        UIScene,
        GameOver,
        Victory
    ]
};
