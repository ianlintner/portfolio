import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 3, 'Cat Adventure', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('Level1');
            this.scene.start('UIScene');
        })
        .on('pointerover', () => startButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => startButton.setStyle({ fill: '#fff' }));
    }
}
