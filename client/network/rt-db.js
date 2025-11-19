import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, onValue, onDisconnect, remove, get } from 'firebase/database';
import { firebaseConfig } from '../../firebase/firebase-config.js';

class RealtimeDatabase {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getDatabase(this.app);
        this.currentUser = null;
        this.currentRoom = null;
        this.updateInterval = null;
        this.listeners = {};
        this.otherPlayers = {};
    }

    // Initialize and authenticate anonymously
    async initialize() {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    this.currentUser = user;
                    console.log('Authenticated as:', user.uid);
                    resolve(user);
                } else {
                    signInAnonymously(this.auth)
                        .then((result) => {
                            this.currentUser = result.user;
                            console.log('Anonymous auth successful:', result.user.uid);
                            resolve(result.user);
                        })
                        .catch((error) => {
                            console.error('Auth error:', error);
                            reject(error);
                        });
                }
            });
        });
    }

    // Create a new room
    async createRoom(roomName = 'Game Room') {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        const roomId = this.generateRoomCode();
        const roomRef = ref(this.db, `rooms/${roomId}`);

        const roomData = {
            name: roomName,
            host: this.currentUser.uid,
            createdAt: Date.now(),
            state: 'waiting',
            maxPlayers: 10
        };

        await set(roomRef, roomData);
        console.log('Room created:', roomId);
        
        return roomId;
    }

    // Join an existing room
    async joinRoom(roomId) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        // Check if room exists
        const roomRef = ref(this.db, `rooms/${roomId}`);
        const snapshot = await get(roomRef);

        if (!snapshot.exists()) {
            throw new Error('Room not found');
        }

        this.currentRoom = roomId;

        // Add player to room
        const playerRef = ref(this.db, `rooms/${roomId}/players/${this.currentUser.uid}`);
        await set(playerRef, {
            uid: this.currentUser.uid,
            joinedAt: Date.now(),
            x: 640,
            y: 360,
            rotation: 0,
            health: 100,
            username: `Player_${this.currentUser.uid.substring(0, 6)}`
        });

        // Setup disconnect handler
        const disconnectRef = onDisconnect(playerRef);
        disconnectRef.remove();

        console.log('Joined room:', roomId);
        return roomId;
    }

    // Leave current room
    async leaveRoom() {
        if (!this.currentRoom || !this.currentUser) return;

        const playerRef = ref(this.db, `rooms/${this.currentRoom}/players/${this.currentUser.uid}`);
        await remove(playerRef);

        this.stopUpdating();
        this.stopListening();
        this.currentRoom = null;
        this.otherPlayers = {};

        console.log('Left room');
    }

    // Start sending player updates at 10 Hz
    startUpdating(getPlayerDataCallback) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (this.currentRoom && this.currentUser) {
                const playerData = getPlayerDataCallback();
                this.updatePlayerPosition(playerData);
            }
        }, 100); // 10 Hz = 100ms

        console.log('Started sending updates at 10 Hz');
    }

    // Stop sending updates
    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Update player position and state
    async updatePlayerPosition(playerData) {
        if (!this.currentRoom || !this.currentUser) return;

        const playerRef = ref(this.db, `rooms/${this.currentRoom}/players/${this.currentUser.uid}`);
        
        await set(playerRef, {
            uid: this.currentUser.uid,
            x: playerData.x,
            y: playerData.y,
            rotation: playerData.rotation,
            health: playerData.health || 100,
            username: playerData.username || `Player_${this.currentUser.uid.substring(0, 6)}`,
            timestamp: Date.now()
        });
    }

    // Listen for other players in the room
    listenToPlayers(onPlayerUpdate, onPlayerRemoved) {
        if (!this.currentRoom) return;

        const playersRef = ref(this.db, `rooms/${this.currentRoom}/players`);

        this.listeners.players = onValue(playersRef, (snapshot) => {
            const players = snapshot.val();
            
            if (players) {
                Object.keys(players).forEach((uid) => {
                    // Skip own player
                    if (uid === this.currentUser.uid) return;

                    const playerData = players[uid];
                    
                    // Check if player is new or updated
                    if (!this.otherPlayers[uid]) {
                        this.otherPlayers[uid] = playerData;
                        onPlayerUpdate(uid, playerData, true); // true = new player
                    } else {
                        this.otherPlayers[uid] = playerData;
                        onPlayerUpdate(uid, playerData, false); // false = update
                    }
                });

                // Check for removed players
                Object.keys(this.otherPlayers).forEach((uid) => {
                    if (!players[uid]) {
                        delete this.otherPlayers[uid];
                        onPlayerRemoved(uid);
                    }
                });
            }
        });

        console.log('Listening to players in room:', this.currentRoom);
    }

    // Stop listening to updates
    stopListening() {
        if (this.listeners.players) {
            // Firebase will automatically unsubscribe when reference is cleared
            this.listeners = {};
        }
    }

    // Get list of available rooms
    async getRooms() {
        const roomsRef = ref(this.db, 'rooms');
        const snapshot = await get(roomsRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return {};
    }

    // Generate a random 6-character room code
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Get current user ID
    getUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    }

    // Get current room ID
    getRoomId() {
        return this.currentRoom;
    }
}

// Export singleton instance
export const rtdb = new RealtimeDatabase();
