import { BaseLevel } from './BaseLevel';

export class Level3 extends BaseLevel {
    constructor() {
        super('Level3', 'Victory');
    }

    protected createLevel() {
        // Ground (Broken)
        for (let x = 0; x < 2000; x += 32) {
            if (x % 200 < 100) { // Many gaps
                this.platforms.create(x, 584, 'platform').setOrigin(0, 0).refreshBody();
            }
        }

        // Verticality
        this.platforms.create(300, 450, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(500, 350, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(700, 250, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(900, 150, 'platform').setScale(2, 1).refreshBody();

        // Enemies (Piranha/Snake placeholders)
        const snake = this.enemies.create(500, 300, 'enemy');
        snake.setTint(0x00ff00); // Green snake
        snake.setVelocityX(-200);
        snake.setCollideWorldBounds(true);
        snake.setBounce(1);

        // Items
        this.items.create(900, 100, 'hairball').setTint(0x00ff00); // Catnip

        // Goal
        this.goal = this.physics.add.staticSprite(1900, 550, 'bowl');
    }
}
