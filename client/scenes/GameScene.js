import { rtdb } from '../network/rt-db.js';
import { PlayerInterpolation } from '../network/interpolation.js';
import { matchmaking } from '../network/matchmaking.js';
import { CompetitiveMap } from '../maps/CompetitiveMap.js';
import { HUD } from '../ui/hud.js';
import { BuyMenu } from '../ui/buyMenu.js';
import { RoundTimer } from '../ui/roundTimer.js';
import { WeaponSystem } from '../game/WeaponSystem.js';
import { BombSystem } from '../game/BombSystem.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.interpolation = new PlayerInterpolation();
        this.remotePlayers = {};
        
        // Game state
        this.playerHealth = 100;
        this.playerMoney = 800;
        this.currentWeapon = {
            name: 'Pistol',
            damage: 20,
            fireRate: 300,
            ammo: 12,
            reserve: 36
        };
        this.currentAmmo = 12;
        this.reserveAmmo = 36;
        this.lastShotTime = 0;
        
        // Competitive mode
        this.isCompetitive = false;
        this.matchId = null;
        this.myTeam = null;
        this.matchData = null;
        this.hasBomb = false;
        
        // Systems
        this.weaponSystem = null;
        this.bombSystem = null;
    }

    init(data) {
        this.isMultiplayer = data.multiplayer || false;
        this.roomId = data.roomId || null;
        this.isCompetitive = data.competitive || false;
        this.matchId = data.matchId || null;
    }

    async create() {
        // Load match data if competitive
        if (this.isCompetitive && this.matchId) {
            await this.loadMatchData();
        }
        
        // Create map (competitive or casual)
        if (this.isCompetitive) {
            this.competitiveMap = new CompetitiveMap(this);
            this.competitiveMap.create();
            this.walls = this.competitiveMap.getWalls();
        } else {
            this.createMap();
        }
        
        // Get spawn position based on team
        let spawnPos = { x: 640, y: 360 };
        if (this.isCompetitive && this.myTeam) {
            spawnPos = this.competitiveMap.getSpawnPoint(this.myTeam);
        }
        
        // Create player
        this.player = this.physics.add.sprite(spawnPos.x, spawnPos.y, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Set player color based on team
        if (this.myTeam === 'red') {
            this.player.setTint(0xff0000);
        } else if (this.myTeam === 'blue') {
            this.player.setTint(0x0000ff);
        }
        
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
        
        // Setup all collisions after everything is created
        this.setupCollisions();
        
        // Initialize UI components
        this.initializeUI();
        
        // Initialize multiplayer if enabled
        if (this.isMultiplayer) {
            // Set the current room/match for rtdb
            const gameRoom = this.isCompetitive ? this.matchId : this.roomId;
            if (gameRoom) {
                rtdb.setCurrentRoom(gameRoom);
            }
            this.initializeMultiplayer();
        }
        
        // Initialize weapon system
        this.weaponSystem = new WeaponSystem(this);
        
        // Initialize bomb system if competitive
        if (this.isCompetitive) {
            this.bombSystem = new BombSystem(this);
            
            // Assign bomb carrier if red team
            if (this.myTeam === 'red' && this.matchData) {
                this.assignBombCarrier();
            }
        }
    }
    
    assignBombCarrier() {
        // First red team player is bomb carrier
        const redTeam = this.matchData.teams.red;
        const userId = rtdb.getUserId();
        
        if (redTeam && redTeam[0] === userId) {
            this.hasBomb = true;
            console.log('I am the bomb carrier!');
            
            // Add bomb indicator
            this.bombIndicator = this.add.text(0, -40, '💣 BOMB', {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ff0000',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 },
                fontStyle: 'bold'
            });
            this.bombIndicator.setOrigin(0.5);
            this.bombIndicator.setDepth(1000);
        } else {
            this.hasBomb = false;
        }
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

    async loadMatchData() {
        try {
            // Wait a bit for match to be created
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.matchData = await matchmaking.getMatch(this.matchId);
            
            if (!this.matchData) {
                console.error('Match data not found, using defaults');
                this.myTeam = 'red'; // Default team
                return;
            }
            
            const userId = rtdb.getUserId();
            
            // Determine my team
            if (this.matchData.teams && this.matchData.teams.red && this.matchData.teams.red.includes(userId)) {
                this.myTeam = 'red';
            } else if (this.matchData.teams && this.matchData.teams.blue && this.matchData.teams.blue.includes(userId)) {
                this.myTeam = 'blue';
            } else {
                // Fallback to red team if not found
                this.myTeam = 'red';
                console.warn('Player not found in teams, defaulting to red');
            }
            
            console.log('Match loaded. My team:', this.myTeam);
            console.log('Match data:', this.matchData);
        } catch (error) {
            console.error('Failed to load match data:', error);
            this.myTeam = 'red'; // Default team on error
        }
    }

    initializeUI() {
        // Create HUD
        this.hud = new HUD(this);
        this.hud.create();
        this.hud.updateHealth(this.playerHealth);
        this.hud.updateMoney(this.playerMoney);
        this.hud.updateWeapon(this.currentWeapon.name);
        this.hud.updateAmmo(this.currentAmmo, this.reserveAmmo);
        
        // Show team info if competitive
        if (this.isCompetitive && this.myTeam) {
            const teamColor = this.myTeam === 'red' ? '#ff0000' : '#0000ff';
            const teamName = this.myTeam === 'red' ? 'RED TEAM' : 'BLUE TEAM';
            
            this.teamText = this.add.text(16, 140, teamName, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: teamColor,
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 },
                fontStyle: 'bold'
            });
            this.teamText.setScrollFactor(0);
            this.teamText.setDepth(1000);
        }
        
        // Create Buy Menu
        this.buyMenu = new BuyMenu(this);
        this.buyMenu.create();
        
        // Create Round Timer
        this.roundTimer = new RoundTimer(this);
        this.roundTimer.start();
        
        // Listen to events
        this.events.on('weaponPurchased', this.onWeaponPurchased, this);
        this.events.on('phaseChanged', this.onPhaseChanged, this);
        this.events.on('timerUpdate', this.onTimerUpdate, this);
        this.events.on('roundChanged', this.onRoundChanged, this);
    }

    onWeaponPurchased(weapon) {
        // Check if player has enough money
        if (this.playerMoney >= weapon.price) {
            // Deduct money
            this.playerMoney -= weapon.price;
            
            // Equip weapon
            this.currentWeapon = weapon;
            this.currentAmmo = weapon.ammo;
            this.reserveAmmo = weapon.reserve;
            
            // Update HUD
            this.hud.updateMoney(this.playerMoney);
            this.hud.updateWeapon(weapon.name);
            this.hud.updateAmmo(this.currentAmmo, this.reserveAmmo);
            
            console.log(`Purchased ${weapon.name} for $${weapon.price}`);
        }
    }

    onPhaseChanged(phase) {
        console.log('Phase changed:', phase);
        this.hud.updatePhase(phase);
        
        // Open buy menu automatically during buy phase
        if (phase === 'buy') {
            this.buyMenu.open();
        } else {
            this.buyMenu.close();
        }
    }

    onTimerUpdate(seconds) {
        this.hud.updateTimer(seconds);
    }

    onRoundChanged(roundNumber) {
        console.log('Round changed:', roundNumber);
        this.hud.updateRound(roundNumber);
    }

    update(time, delta) {
        // Check if player exists
        if (!this.player || !this.player.body) {
            return;
        }
        
        // Update interpolation for remote players
        if (this.isMultiplayer) {
            this.interpolation.update(delta / 1000);
            this.updateRemotePlayers();
        }
        
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
        
        // Update bomb indicator position
        if (this.hasBomb && this.bombIndicator) {
            this.bombIndicator.x = this.player.x;
            this.bombIndicator.y = this.player.y - 40;
        }
        
        // Update bomb system
        if (this.bombSystem) {
            this.bombSystem.update(delta);
        }
    }

    shootBullet() {
        // Get current weapon from weapon system
        const weapon = this.weaponSystem ? this.weaponSystem.getCurrentWeapon() : this.currentWeapon;
        
        // Can't shoot knife, grenade, or bomb
        if (weapon.name === 'Knife' || weapon.name === 'Grenade' || weapon.name === 'Bomb') {
            return;
        }
        
        // Check fire rate
        const now = Date.now();
        if (now - this.lastShotTime < weapon.fireRate) {
            return; // Too soon to shoot again
        }
        
        // Check ammo using weapon system
        if (this.weaponSystem && !this.weaponSystem.useAmmo()) {
            // Try to reload
            this.weaponSystem.reload();
            return; // No ammo
        }
        
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
            const velocityX = Math.cos(angle) * bulletSpeed;
            const velocityY = Math.sin(angle) * bulletSpeed;
            
            bullet.setVelocity(velocityX, velocityY);
            
            // Update last shot time
            this.lastShotTime = now;
            
            // Send bullet to other players if multiplayer
            if (this.isMultiplayer) {
                rtdb.shootBullet({
                    x: this.player.x,
                    y: this.player.y,
                    velocityX: velocityX,
                    velocityY: velocityY,
                    rotation: angle
                });
            }
            
            // Auto-destroy bullet after 2 seconds
            this.time.delayedCall(2000, () => {
                if (bullet.active) {
                    bullet.destroy();
                }
            });
        }
    }

    // Multiplayer methods
    initializeMultiplayer() {
        console.log('Initializing multiplayer...');
        
        // Use matchId for competitive, roomId for casual
        const gameRoom = this.isCompetitive ? this.matchId : this.roomId;
        
        if (!gameRoom) {
            console.error('No room/match ID provided');
            return;
        }
        
        // Start sending player updates at 10 Hz
        rtdb.startUpdating(() => {
            if (!this.player) return null;
            
            return {
                x: this.player.x,
                y: this.player.y,
                rotation: this.player.rotation,
                health: this.playerHealth,
                team: this.myTeam || 'none',
                username: `Player_${rtdb.getUserId().substring(0, 6)}`
            };
        });
        
        // Listen for other players
        rtdb.listenToPlayers(
            (uid, playerData, isNew) => {
                if (isNew) {
                    this.addRemotePlayer(uid, playerData);
                } else {
                    this.updateRemotePlayer(uid, playerData);
                }
            },
            (uid) => {
                this.removeRemotePlayer(uid);
            }
        );
        
        // Listen for bullets from other players
        rtdb.listenToBullets((bulletId, bulletData) => {
            this.spawnRemoteBullet(bulletId, bulletData);
        });
        
        // Track spawned remote bullets to avoid duplicates
        this.remoteBullets = {};
        
        // Add multiplayer UI
        const roomLabel = this.isCompetitive ? 'Match' : 'Room';
        this.multiplayerText = this.add.text(16, 84, `${roomLabel}: ${gameRoom.substring(0, 8)}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffe66d',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.multiplayerText.setScrollFactor(0);
        this.multiplayerText.setDepth(1000);
        
        this.playersCountText = this.add.text(16, 110, 'Players: 1', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#4ecdc4',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.playersCountText.setScrollFactor(0);
        this.playersCountText.setDepth(1000);
    }

    addRemotePlayer(uid, playerData) {
        console.log('Adding remote player:', uid);
        
        // Create sprite for remote player
        const remotePlayer = this.physics.add.sprite(playerData.x, playerData.y, 'player');
        
        // Set color based on team in competitive mode
        if (this.isCompetitive && this.matchData) {
            let playerTeam = null;
            if (this.matchData.teams.red.includes(uid)) {
                playerTeam = 'red';
                remotePlayer.setTint(0xff0000);
            } else if (this.matchData.teams.blue.includes(uid)) {
                playerTeam = 'blue';
                remotePlayer.setTint(0x0000ff);
            }
        } else {
            remotePlayer.setTint(0xff6b6b); // Default color for non-competitive
        }
        
        // Add username label
        const nameText = this.add.text(0, -25, playerData.username, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        });
        nameText.setOrigin(0.5);
        
        this.remotePlayers[uid] = {
            sprite: remotePlayer,
            nameText: nameText
        };
        
        // Add to interpolation
        this.interpolation.updatePlayer(uid, playerData.x, playerData.y, playerData.rotation);
        
        this.updatePlayersCount();
    }

    updateRemotePlayer(uid, playerData) {
        // Update interpolation target
        this.interpolation.updatePlayer(uid, playerData.x, playerData.y, playerData.rotation);
    }

    removeRemotePlayer(uid) {
        console.log('Removing remote player:', uid);
        
        if (this.remotePlayers[uid]) {
            this.remotePlayers[uid].sprite.destroy();
            this.remotePlayers[uid].nameText.destroy();
            delete this.remotePlayers[uid];
        }
        
        this.interpolation.removePlayer(uid);
        this.updatePlayersCount();
    }

    updateRemotePlayers() {
        // Update sprite positions from interpolated values
        Object.keys(this.remotePlayers).forEach((uid) => {
            const position = this.interpolation.getPlayerPosition(uid);
            if (position && this.remotePlayers[uid]) {
                const { sprite, nameText } = this.remotePlayers[uid];
                sprite.x = position.x;
                sprite.y = position.y;
                sprite.rotation = position.rotation;
                
                // Update name position
                nameText.x = position.x;
                nameText.y = position.y - 25;
            }
        });
    }

    updatePlayersCount() {
        if (this.playersCountText) {
            const count = Object.keys(this.remotePlayers).length + 1;
            this.playersCountText.setText(`Players: ${count}`);
        }
    }

    spawnRemoteBullet(bulletId, bulletData) {
        // Avoid spawning duplicate bullets
        if (this.remoteBullets[bulletId]) return;

        // Create bullet sprite
        const bullet = this.physics.add.sprite(bulletData.x, bulletData.y, 'bullet');
        bullet.setVelocity(bulletData.velocityX, bulletData.velocityY);
        
        // Add collision with walls
        if (this.walls) {
            this.physics.add.collider(bullet, this.walls, () => {
                bullet.destroy();
                delete this.remoteBullets[bulletId];
            });
        }
        
        // Store reference
        this.remoteBullets[bulletId] = bullet;
        
        // Auto-destroy after 2 seconds
        this.time.delayedCall(2000, () => {
            if (bullet && bullet.active) {
                bullet.destroy();
            }
            delete this.remoteBullets[bulletId];
        });
    }

    shutdown() {
        // Clean up systems
        if (this.weaponSystem) {
            this.weaponSystem.destroy();
        }
        if (this.bombSystem) {
            this.bombSystem.destroy();
        }
        
        // Clean up UI
        if (this.hud) {
            this.hud.destroy();
        }
        if (this.buyMenu) {
            this.buyMenu.destroy();
        }
        if (this.roundTimer) {
            this.roundTimer.destroy();
        }
        
        // Remove event listeners
        this.events.off('weaponPurchased');
        this.events.off('phaseChanged');
        this.events.off('timerUpdate');
        this.events.off('roundChanged');
        
        // Clean up multiplayer when leaving scene
        if (this.isMultiplayer) {
            rtdb.stopUpdating();
            rtdb.stopListening();
            
            // Clean up remote players
            Object.keys(this.remotePlayers).forEach((uid) => {
                this.removeRemotePlayer(uid);
            });
            
            // Clean up remote bullets
            Object.keys(this.remoteBullets || {}).forEach((bulletId) => {
                if (this.remoteBullets[bulletId] && this.remoteBullets[bulletId].active) {
                    this.remoteBullets[bulletId].destroy();
                }
            });
            this.remoteBullets = {};
            
            this.interpolation.clear();
        }
    }
}
