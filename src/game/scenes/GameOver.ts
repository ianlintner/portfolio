import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2, 'Game Over', {
            fontSize: '64px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 100, 'Click to Restart', {
            fontSize: '32px',
            color: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Level1');
            this.scene.start('UIScene');
        });
    }
}
