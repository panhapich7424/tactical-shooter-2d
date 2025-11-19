export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff6b6b, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
        
        // Load assets
        this.loadAssets();
    }

    loadAssets() {
        // Create placeholder graphics if assets don't exist
        this.createPlaceholderAssets();
    }

    createPlaceholderAssets() {
        // Player sprite placeholder
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.fillStyle(0x4ecdc4);
        playerGraphics.fillRect(0, 0, 32, 32);
        playerGraphics.generateTexture('player', 32, 32);
        playerGraphics.destroy();
        
        // Bullet sprite placeholder
        const bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        bulletGraphics.fillStyle(0xffff00);
        bulletGraphics.fillCircle(4, 4, 4);
        bulletGraphics.generateTexture('bullet', 8, 8);
        bulletGraphics.destroy();
        
        // Tile placeholder
        const tileGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        tileGraphics.fillStyle(0x3a3a3a);
        tileGraphics.fillRect(0, 0, 32, 32);
        tileGraphics.lineStyle(1, 0x555555);
        tileGraphics.strokeRect(0, 0, 32, 32);
        tileGraphics.generateTexture('tile', 32, 32);
        tileGraphics.destroy();
        
        // Wall placeholder
        const wallGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        wallGraphics.fillStyle(0x666666);
        wallGraphics.fillRect(0, 0, 32, 32);
        wallGraphics.generateTexture('wall', 32, 32);
        wallGraphics.destroy();
    }

    create() {
        this.scene.start('MenuScene');
    }
}
