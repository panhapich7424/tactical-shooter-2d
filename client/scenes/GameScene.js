export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Create tilemap (this creates this.walls)
        this.createMap();
        
        // Create player
        this.player = this.physics.add.sprite(640, 360, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Player properties
        this.playerSpeed = 200;
        
        // Bullets group
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 50
        });
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        // Mouse input
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.shootBullet();
            }
        });
        
        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);
        
        // UI
        this.createUI();
        
        // Setup all collisions after everything is created
        this.setupCollisions();
    }

    createMap() {
        const mapWidth = 40;
        const mapHeight = 30;
        const tileSize = 32;
        
        // Create floor tiles
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                this.add.image(x * tileSize + 16, y * tileSize + 16, 'tile');
            }
        }
        
        // Create walls group
        this.walls = this.physics.add.staticGroup();
        
        // Border walls
        for (let x = 0; x < mapWidth; x++) {
            this.walls.create(x * tileSize + 16, 16, 'wall');
            this.walls.create(x * tileSize + 16, (mapHeight - 1) * tileSize + 16, 'wall');
        }
        for (let y = 1; y < mapHeight - 1; y++) {
            this.walls.create(16, y * tileSize + 16, 'wall');
            this.walls.create((mapWidth - 1) * tileSize + 16, y * tileSize + 16, 'wall');
        }
        
        // Some interior walls for cover
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(5, mapWidth - 5);
            const y = Phaser.Math.Between(5, mapHeight - 5);
            this.walls.create(x * tileSize + 16, y * tileSize + 16, 'wall');
        }
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
    }

    setupCollisions() {
        // Collision with player and walls
        if (this.player && this.walls) {
            this.physics.add.collider(this.player, this.walls);
        }
        
        // Collision with bullets and walls
        if (this.bullets && this.walls) {
            this.physics.add.collider(this.bullets, this.walls, (bullet) => {
                bullet.destroy();
            });
        }
    }

    createUI() {
        // Health bar
        this.healthText = this.add.text(16, 16, 'Health: 100', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.healthText.setScrollFactor(0);
        
        // Ammo counter
        this.ammoText = this.add.text(16, 50, 'Ammo: ∞', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.ammoText.setScrollFactor(0);
    }

    update() {
        // Player movement
        this.player.setVelocity(0);
        
        if (this.keys.W.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
        }
        if (this.keys.S.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
        if (this.keys.A.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        }
        if (this.keys.D.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        }
        
        // Normalize diagonal movement
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        }
        
        // Player rotation to mouse
        const pointer = this.input.activePointer;
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            worldPoint.x,
            worldPoint.y
        );
        this.player.rotation = angle;
    }

    shootBullet() {
        const bullet = this.bullets.get(this.player.x, this.player.y);
        
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            
            const pointer = this.input.activePointer;
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            
            const angle = Phaser.Math.Angle.Between(
                this.player.x,
                this.player.y,
                worldPoint.x,
                worldPoint.y
            );
            
            const bulletSpeed = 600;
            bullet.setVelocity(
                Math.cos(angle) * bulletSpeed,
                Math.sin(angle) * bulletSpeed
            );
            
            // Auto-destroy bullet after 2 seconds
            this.time.delayedCall(2000, () => {
                if (bullet.active) {
                    bullet.destroy();
                }
            });
        }
    }
}
