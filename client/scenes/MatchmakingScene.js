import { rtdb } from '../network/rt-db.js';
import { matchmaking } from '../network/matchmaking.js';

export default class MatchmakingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MatchmakingScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        const title = this.add.text(width / 2, 80, 'COMPETITIVE MATCHMAKING', {
            fontSize: '42px',
            fontFamily: 'Arial',
            color: '#ff6b6b',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Status text
        this.statusText = this.add.text(width / 2, 140, 'Ready to find match', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4ecdc4'
        });
        this.statusText.setOrigin(0.5);
        
        // Player count
        this.playerCountText = this.add.text(width / 2, height / 2 - 50, '0/4 Players', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.playerCountText.setOrigin(0.5);
        
        // Start Match button
        this.startButton = this.add.text(width / 2, height / 2 + 50, 'START MATCH', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4ecdc4',
            padding: { x: 40, y: 15 }
        });
        this.startButton.setOrigin(0.5);
        this.startButton.setInteractive({ useHandCursor: true });
        
        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ backgroundColor: '#3db8af' });
        });
        
        this.startButton.on('pointerout', () => {
            this.startButton.setStyle({ backgroundColor: '#4ecdc4' });
        });
        
        this.startButton.on('pointerdown', () => {
            this.startMatchmaking();
        });
        
        // Cancel button (hidden initially)
        this.cancelButton = this.add.text(width / 2, height / 2 + 120, 'CANCEL', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 30, y: 12 }
        });
        this.cancelButton.setOrigin(0.5);
        this.cancelButton.setInteractive({ useHandCursor: true });
        this.cancelButton.setVisible(false);
        
        this.cancelButton.on('pointerover', () => {
            this.cancelButton.setStyle({ backgroundColor: '#ff5252' });
        });
        
        this.cancelButton.on('pointerout', () => {
            this.cancelButton.setStyle({ backgroundColor: '#ff6b6b' });
        });
        
        this.cancelButton.on('pointerdown', () => {
            this.cancelMatchmaking();
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
        
        // Searching animation dots
        this.searchingDots = this.add.text(width / 2, height / 2 + 200, '', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#4ecdc4'
        });
        this.searchingDots.setOrigin(0.5);
        
        // Initialize Firebase
        this.initializeFirebase();
        
        // State
        this.isSearching = false;
        this.matchmakingListener = null;
    }

    async initializeFirebase() {
        try {
            await rtdb.initialize();
            this.statusText.setText(`Ready to find match`);
        } catch (error) {
            console.error('Firebase init error:', error);
            this.statusText.setText('Connection failed. Check console.');
        }
    }

    async startMatchmaking() {
        if (this.isSearching) return;
        
        this.isSearching = true;
        this.startButton.setVisible(false);
        this.cancelButton.setVisible(true);
        this.statusText.setText('Searching for match...');
        
        // Start searching animation
        this.startSearchingAnimation();
        
        try {
            // Join matchmaking queue
            await matchmaking.joinQueue();
            
            // Listen for match found
            this.listenForMatch();
            
        } catch (error) {
            console.error('Matchmaking error:', error);
            this.statusText.setText('Failed to start matchmaking');
            this.cancelMatchmaking();
        }
    }

    async cancelMatchmaking() {
        this.isSearching = false;
        this.startButton.setVisible(true);
        this.cancelButton.setVisible(false);
        this.statusText.setText('Ready to find match');
        this.searchingDots.setText('');
        
        // Leave matchmaking queue
        await matchmaking.leaveQueue();
        
        // Stop listening
        matchmaking.stopListening();
    }

    listenForMatch() {
        matchmaking.listenToQueue((queueData) => {
            const playersInQueue = Object.keys(queueData || {}).length;
            this.playerCountText.setText(`${playersInQueue}/4 Players`);
            
            // Check if match is ready (4 players for 2v2)
            if (playersInQueue >= 4) {
                this.onMatchFound(queueData);
            }
        });
    }

    async onMatchFound(queueData) {
        this.statusText.setText('Match found! Loading...');
        this.searchingDots.setText('');
        
        // Stop listening to prevent multiple triggers
        matchmaking.stopListening();
        
        try {
            // Create match (only first player creates it)
            const players = Object.keys(queueData).sort(); // Sort for consistency
            const userId = rtdb.getUserId();
            
            let matchId;
            if (players[0] === userId) {
                // First player creates the match
                console.log('I am host, creating match...');
                matchId = await matchmaking.createMatch(queueData);
                console.log('Created match:', matchId);
                
                // Store match ID in a shared location
                await matchmaking.storeMatchId(matchId, players);
            } else {
                // Other players wait and retrieve match ID
                console.log('Waiting for host to create match...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                matchId = await matchmaking.getMatchIdForPlayers(players);
                console.log('Retrieved match ID:', matchId);
            }
            
            if (matchId) {
                // Wait a moment for all players to sync
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Start game
                this.scene.start('GameScene', {
                    multiplayer: true,
                    matchId: matchId,
                    competitive: true
                });
            } else {
                throw new Error('Failed to get match ID');
            }
        } catch (error) {
            console.error('Error starting match:', error);
            this.statusText.setText('Failed to start match. Try again.');
            this.cancelMatchmaking();
        }
    }

    startSearchingAnimation() {
        let dots = 0;
        this.searchingTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (!this.isSearching) {
                    this.searchingDots.setText('');
                    return;
                }
                dots = (dots + 1) % 4;
                this.searchingDots.setText('.'.repeat(dots));
            },
            loop: true
        });
    }

    shutdown() {
        if (this.searchingTimer) {
            this.searchingTimer.remove();
        }
        matchmaking.stopListening();
        if (this.isSearching) {
            matchmaking.leaveQueue();
        }
    }
}
