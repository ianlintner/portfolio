import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // Load Player
        this.load.spritesheet('cat', '/assets/game/cat.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        // Load placeholders for other elements (we can replace these with real assets later)
        // For now, we'll generate textures programmatically in the create method if needed,
        // or load simple colored blocks if we had them.
        // Let's create a simple 32x32 white pixel for platforms to tint.
        this.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0xffffff)
            .fillRect(0, 0, 32, 32)
            .generateTexture('platform', 32, 32);

        this.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0xff0000)
            .fillRect(0, 0, 32, 32)
            .generateTexture('enemy', 32, 32);

        this.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0x00ff00)
            .fillCircle(16, 16, 16)
            .generateTexture('hairball', 32, 32);
            
        this.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0xffff00)
            .fillCircle(16, 16, 16)
            .generateTexture('bowl', 32, 32);
    }

    create() {
        // Create Animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 3 }), // Assuming 4 frames for walk, need to verify
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('cat', { start: 1, end: 1 }), // Placeholder frame
            frameRate: 10,
            repeat: -1
        });

        this.scene.start('MainMenu');
    }
}
