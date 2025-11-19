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
        
        // Single Player button
        const singlePlayerButton = this.add.text(width / 2, height / 2 + 20, 'SINGLE PLAYER', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 30, y: 12 }
        });
        singlePlayerButton.setOrigin(0.5);
        singlePlayerButton.setInteractive({ useHandCursor: true });
        
        singlePlayerButton.on('pointerover', () => {
            singlePlayerButton.setStyle({ backgroundColor: '#ff5252' });
        });
        
        singlePlayerButton.on('pointerout', () => {
            singlePlayerButton.setStyle({ backgroundColor: '#ff6b6b' });
        });
        
        singlePlayerButton.on('pointerdown', () => {
            this.scene.start('GameScene', { multiplayer: false });
        });
        
        // Multiplayer button
        const multiplayerButton = this.add.text(width / 2, height / 2 + 80, 'MULTIPLAYER', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4ecdc4',
            padding: { x: 30, y: 12 }
        });
        multiplayerButton.setOrigin(0.5);
        multiplayerButton.setInteractive({ useHandCursor: true });
        
        multiplayerButton.on('pointerover', () => {
            multiplayerButton.setStyle({ backgroundColor: '#3db8af' });
        });
        
        multiplayerButton.on('pointerout', () => {
            multiplayerButton.setStyle({ backgroundColor: '#4ecdc4' });
        });
        
        multiplayerButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
        });
        
        // Controls info
        const controls = [
            'CONTROLS:',
            'WASD - Move',
            'Mouse - Aim',
            'Left Click - Shoot'
        ];
        
        controls.forEach((text, index) => {
            const controlText = this.add.text(width / 2, height / 2 + 170 + (index * 25), text, {
                fontSize: index === 0 ? '18px' : '16px',
                fontFamily: 'Arial',
                color: index === 0 ? '#4ecdc4' : '#aaaaaa'
            });
            controlText.setOrigin(0.5);
        });
    }
}
