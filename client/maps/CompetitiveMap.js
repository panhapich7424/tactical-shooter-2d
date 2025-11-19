// Competitive Map Layout
export class CompetitiveMap {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 32;
        this.mapWidth = 50;
        this.mapHeight = 40;
        
        // Spawn points
        this.redSpawn = { x: 5 * 32, y: 5 * 32 };
        this.blueSpawn = { x: 45 * 32, y: 35 * 32 };
        
        // Bomb sites
        this.siteA = { x: 15 * 32, y: 20 * 32, radius: 3 * 32 };
        this.siteB = { x: 35 * 32, y: 20 * 32, radius: 3 * 32 };
    }

    create() {
        this.createFloor();
        this.createWalls();
        this.createBombSites();
        this.createSpawnMarkers();
        
        // Set world bounds
        this.scene.physics.world.setBounds(
            0, 0,
            this.mapWidth * this.tileSize,
            this.mapHeight * this.tileSize
        );
    }

    createFloor() {
        // Create floor tiles
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tile = this.scene.add.image(
                    x * this.tileSize + 16,
                    y * this.tileSize + 16,
                    'tile'
                );
                tile.setDepth(0);
            }
        }
    }

    createWalls() {
        this.walls = this.scene.physics.add.staticGroup();
        
        // Border walls
        for (let x = 0; x < this.mapWidth; x++) {
            this.walls.create(x * this.tileSize + 16, 16, 'wall');
            this.walls.create(x * this.tileSize + 16, (this.mapHeight - 1) * this.tileSize + 16, 'wall');
        }
        for (let y = 1; y < this.mapHeight - 1; y++) {
            this.walls.create(16, y * this.tileSize + 16, 'wall');
            this.walls.create((this.mapWidth - 1) * this.tileSize + 16, y * this.tileSize + 16, 'wall');
        }
        
        // Mid walls (create lanes)
        // Vertical wall in middle
        for (let y = 10; y < 30; y++) {
            if (y < 18 || y > 22) { // Leave gap for mid
                this.walls.create(25 * this.tileSize + 16, y * this.tileSize + 16, 'wall');
            }
        }
        
        // Cover near A site
        for (let x = 12; x < 18; x++) {
            this.walls.create(x * this.tileSize + 16, 17 * this.tileSize + 16, 'wall');
            this.walls.create(x * this.tileSize + 16, 23 * this.tileSize + 16, 'wall');
        }
        
        // Cover near B site
        for (let x = 32; x < 38; x++) {
            this.walls.create(x * this.tileSize + 16, 17 * this.tileSize + 16, 'wall');
            this.walls.create(x * this.tileSize + 16, 23 * this.tileSize + 16, 'wall');
        }
        
        // Random cover boxes
        const coverPositions = [
            { x: 10, y: 10 }, { x: 40, y: 10 },
            { x: 10, y: 30 }, { x: 40, y: 30 },
            { x: 20, y: 15 }, { x: 30, y: 15 },
            { x: 20, y: 25 }, { x: 30, y: 25 }
        ];
        
        coverPositions.forEach(pos => {
            for (let dx = 0; dx < 2; dx++) {
                for (let dy = 0; dy < 2; dy++) {
                    this.walls.create(
                        (pos.x + dx) * this.tileSize + 16,
                        (pos.y + dy) * this.tileSize + 16,
                        'wall'
                    );
                }
            }
        });
    }

    createBombSites() {
        // Site A marker
        const siteAGraphics = this.scene.add.graphics();
        siteAGraphics.lineStyle(3, 0xff6b6b, 0.8);
        siteAGraphics.strokeCircle(this.siteA.x, this.siteA.y, this.siteA.radius);
        siteAGraphics.setDepth(1);
        
        const siteAText = this.scene.add.text(this.siteA.x, this.siteA.y, 'A', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        siteAText.setOrigin(0.5);
        siteAText.setDepth(1);
        siteAText.setAlpha(0.5);
        
        // Site B marker
        const siteBGraphics = this.scene.add.graphics();
        siteBGraphics.lineStyle(3, 0xff6b6b, 0.8);
        siteBGraphics.strokeCircle(this.siteB.x, this.siteB.y, this.siteB.radius);
        siteBGraphics.setDepth(1);
        
        const siteBText = this.scene.add.text(this.siteB.x, this.siteB.y, 'B', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        siteBText.setOrigin(0.5);
        siteBText.setDepth(1);
        siteBText.setAlpha(0.5);
    }

    createSpawnMarkers() {
        // Red spawn marker
        const redSpawnGraphics = this.scene.add.graphics();
        redSpawnGraphics.fillStyle(0xff0000, 0.3);
        redSpawnGraphics.fillRect(
            this.redSpawn.x - 64,
            this.redSpawn.y - 64,
            128, 128
        );
        redSpawnGraphics.setDepth(1);
        
        const redSpawnText = this.scene.add.text(this.redSpawn.x, this.redSpawn.y, 'RED SPAWN', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ff0000',
            fontStyle: 'bold'
        });
        redSpawnText.setOrigin(0.5);
        redSpawnText.setDepth(1);
        redSpawnText.setAlpha(0.7);
        
        // Blue spawn marker
        const blueSpawnGraphics = this.scene.add.graphics();
        blueSpawnGraphics.fillStyle(0x0000ff, 0.3);
        blueSpawnGraphics.fillRect(
            this.blueSpawn.x - 64,
            this.blueSpawn.y - 64,
            128, 128
        );
        blueSpawnGraphics.setDepth(1);
        
        const blueSpawnText = this.scene.add.text(this.blueSpawn.x, this.blueSpawn.y, 'BLUE SPAWN', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#0000ff',
            fontStyle: 'bold'
        });
        blueSpawnText.setOrigin(0.5);
        blueSpawnText.setDepth(1);
        blueSpawnText.setAlpha(0.7);
    }

    getSpawnPoint(team) {
        if (team === 'red') {
            // Random position within red spawn area
            return {
                x: this.redSpawn.x + Phaser.Math.Between(-48, 48),
                y: this.redSpawn.y + Phaser.Math.Between(-48, 48)
            };
        } else {
            // Random position within blue spawn area
            return {
                x: this.blueSpawn.x + Phaser.Math.Between(-48, 48),
                y: this.blueSpawn.y + Phaser.Math.Between(-48, 48)
            };
        }
    }

    isInBombSite(x, y, site) {
        const sitePos = site === 'A' ? this.siteA : this.siteB;
        const distance = Phaser.Math.Distance.Between(x, y, sitePos.x, sitePos.y);
        return distance <= sitePos.radius;
    }

    getWalls() {
        return this.walls;
    }
}
