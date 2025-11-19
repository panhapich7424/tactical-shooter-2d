export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        const title = this.add.text(width / 2, height / 3, 'TACTICAL SHOOTER 2D', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(width / 2, height / 3 + 60, 'Top-Down Tactical Combat', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#4ecdc4'
        });
        subtitle.setOrigin(0.5);
        
        // Play button
        const playButton = this.add.text(width / 2, height / 2 + 50, 'PLAY', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 40, y: 15 }
        });
        playButton.setOrigin(0.5);
        playButton.setInteractive({ useHandCursor: true });
        
        playButton.on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#ff5252' });
        });
        
        playButton.on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '#ff6b6b' });
        });
        
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Controls info
        const controls = [
            'CONTROLS:',
            'WASD - Move',
            'Mouse - Aim',
            'Left Click - Shoot'
        ];
        
        controls.forEach((text, index) => {
            const controlText = this.add.text(width / 2, height / 2 + 150 + (index * 25), text, {
                fontSize: index === 0 ? '18px' : '16px',
                fontFamily: 'Arial',
                color: index === 0 ? '#4ecdc4' : '#aaaaaa'
            });
            controlText.setOrigin(0.5);
        });
    }
}
