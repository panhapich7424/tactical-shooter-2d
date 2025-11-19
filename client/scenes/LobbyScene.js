import { rtdb } from '../network/rt-db.js';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        const title = this.add.text(width / 2, 80, 'MULTIPLAYER LOBBY', {
            fontSize: '42px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Status text
        this.statusText = this.add.text(width / 2, 140, 'Connecting...', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4ecdc4'
        });
        this.statusText.setOrigin(0.5);
        
        // Create Room button
        const createButton = this.add.text(width / 2 - 150, height / 2 - 50, 'CREATE ROOM', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4ecdc4',
            padding: { x: 30, y: 15 }
        });
        createButton.setOrigin(0.5);
        createButton.setInteractive({ useHandCursor: true });
        
        createButton.on('pointerover', () => {
            createButton.setStyle({ backgroundColor: '#3db8af' });
        });
        
        createButton.on('pointerout', () => {
            createButton.setStyle({ backgroundColor: '#4ecdc4' });
        });
        
        createButton.on('pointerdown', () => {
            this.createRoom();
        });
        
        // Join Room button
        const joinButton = this.add.text(width / 2 + 150, height / 2 - 50, 'JOIN ROOM', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ffe66d',
            padding: { x: 30, y: 15 }
        });
        joinButton.setOrigin(0.5);
        joinButton.setInteractive({ useHandCursor: true });
        
        joinButton.on('pointerover', () => {
            joinButton.setStyle({ backgroundColor: '#ffd93d' });
        });
        
        joinButton.on('pointerout', () => {
            joinButton.setStyle({ backgroundColor: '#ffe66d' });
        });
        
        joinButton.on('pointerdown', () => {
            this.showJoinPrompt();
        });
        
        // Room code display (hidden initially)
        this.roomCodeText = this.add.text(width / 2, height / 2 + 50, '', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        });
        this.roomCodeText.setOrigin(0.5);
        this.roomCodeText.setVisible(false);
        
        // Start Game button (hidden initially)
        this.startButton = this.add.text(width / 2, height / 2 + 120, 'START GAME', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 40, y: 15 }
        });
        this.startButton.setOrigin(0.5);
        this.startButton.setInteractive({ useHandCursor: true });
        this.startButton.setVisible(false);
        
        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ backgroundColor: '#ff5252' });
        });
        
        this.startButton.on('pointerout', () => {
            this.startButton.setStyle({ backgroundColor: '#ff6b6b' });
        });
        
        this.startButton.on('pointerdown', () => {
            this.startGame();
        });
        
        // Back button
        const backButton = this.add.text(50, 50, '← BACK', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        });
        backButton.setInteractive({ useHandCursor: true });
        
        backButton.on('pointerover', () => {
            backButton.setStyle({ color: '#ffffff' });
        });
        
        backButton.on('pointerout', () => {
            backButton.setStyle({ color: '#aaaaaa' });
        });
        
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // Initialize Firebase
        this.initializeFirebase();
    }

    async initializeFirebase() {
        try {
            await rtdb.initialize();
            this.statusText.setText(`Connected as: ${rtdb.getUserId().substring(0, 8)}...`);
        } catch (error) {
            console.error('Firebase init error:', error);
            this.statusText.setText('Connection failed. Check console.');
        }
    }

    async createRoom() {
        try {
            this.statusText.setText('Creating room...');
            const roomId = await rtdb.createRoom('Tactical Shooter Room');
            await rtdb.joinRoom(roomId);
            
            this.roomCodeText.setText(`Room Code: ${roomId}`);
            this.roomCodeText.setVisible(true);
            this.startButton.setVisible(true);
            this.statusText.setText('Room created! Share the code with friends.');
        } catch (error) {
            console.error('Create room error:', error);
            this.statusText.setText('Failed to create room. Try again.');
        }
    }

    showJoinPrompt() {
        const roomCode = prompt('Enter Room Code:');
        if (roomCode) {
            this.joinRoom(roomCode.toUpperCase());
        }
    }

    async joinRoom(roomId) {
        try {
            this.statusText.setText('Joining room...');
            await rtdb.joinRoom(roomId);
            
            this.roomCodeText.setText(`Room Code: ${roomId}`);
            this.roomCodeText.setVisible(true);
            this.startButton.setVisible(true);
            this.statusText.setText('Joined room! Waiting for host to start...');
        } catch (error) {
            console.error('Join room error:', error);
            this.statusText.setText('Failed to join room. Check the code.');
        }
    }

    startGame() {
        // Pass room info to GameScene
        this.scene.start('GameScene', {
            multiplayer: true,
            roomId: rtdb.getRoomId()
        });
    }
}
