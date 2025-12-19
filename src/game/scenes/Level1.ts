import { BaseLevel } from './BaseLevel';

export class Level1 extends BaseLevel {
    constructor() {
        super('Level1', 'Level2');
    }

    protected createLevel() {
        // Ground
        for (let x = 0; x < 2000; x += 32) {
            this.platforms.create(x, 584, 'platform').setOrigin(0, 0).refreshBody();
        }

        // Platforms
        this.platforms.create(400, 400, 'platform').setScale(4, 1).refreshBody();
        this.platforms.create(600, 300, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(800, 450, 'platform').setScale(3, 1).refreshBody();

        // Enemies
        const mouse = this.enemies.create(500, 350, 'enemy');
        mouse.setVelocityX(-100);
        mouse.setCollideWorldBounds(true);
        mouse.setBounce(1);

        // Items
        this.items.create(650, 250, 'hairball').setTint(0x00ff00); // Catnip

        // Goal
        this.goal = this.physics.add.staticSprite(1800, 550, 'bowl');
    }
}
