import Phaser from 'phaser';
import { GameConfig } from './config';

export class PhaserGame {
    private static game: Phaser.Game | null = null;

    public static getGame(): Phaser.Game | null {
        return this.game;
    }

    public static start(): Phaser.Game {
        if (!this.game) {
            this.game = new Phaser.Game(GameConfig);
        }
        return this.game;
    }

    public static stop() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}
