import { ref, set, onValue, remove, get, push } from 'firebase/database';
import { rtdb } from './rt-db.js';

export class MatchmakingManager {
    constructor() {
        this.db = rtdb.db;
        this.queueListener = null;
        this.inQueue = false;
    }

    // Join matchmaking queue
    async joinQueue() {
        const userId = rtdb.getUserId();
        if (!userId) throw new Error('Not authenticated');

        const queueRef = ref(this.db, `matchmaking/queue/${userId}`);
        
        await set(queueRef, {
            userId,
            joinedAt: Date.now(),
            status: 'searching'
        });

        this.inQueue = true;
        console.log('Joined matchmaking queue');
    }

    // Leave matchmaking queue
    async leaveQueue() {
        const userId = rtdb.getUserId();
        if (!userId) return;

        const queueRef = ref(this.db, `matchmaking/queue/${userId}`);
        await remove(queueRef);

        this.inQueue = false;
        console.log('Left matchmaking queue');
    }

    // Listen for queue updates
    listenToQueue(callback) {
        const queueRef = ref(this.db, 'matchmaking/queue');
        
        this.queueListener = onValue(queueRef, (snapshot) => {
            const queueData = snapshot.val();
            callback(queueData);
        });
    }

    // Stop listening
    stopListening() {
        if (this.queueListener) {
            this.queueListener();
            this.queueListener = null;
        }
    }

    // Create match when 10 players found
    async createMatch(queueData) {
        const players = Object.keys(queueData);
        
        if (players.length < 10) {
            throw new Error('Not enough players');
        }

        // Take first 10 players
        const matchPlayers = players.slice(0, 10);
        
        // Shuffle and assign teams
        const shuffled = this.shuffleArray([...matchPlayers]);
        const redTeam = shuffled.slice(0, 5);
        const blueTeam = shuffled.slice(5, 10);

        // Create match
        const matchRef = push(ref(this.db, 'matches'));
        const matchId = matchRef.key;

        const matchData = {
            matchId,
            status: 'starting',
            createdAt: Date.now(),
            teams: {
                red: redTeam,
                blue: blueTeam
            },
            scores: {
                red: 0,
                blue: 0
            },
            currentRound: 1,
            maxRounds: 25,
            players: {}
        };

        // Initialize player data
        matchPlayers.forEach((playerId, index) => {
            const team = index < 5 ? 'red' : 'blue';
            matchData.players[playerId] = {
                team,
                alive: true,
                health: 100,
                kills: 0,
                deaths: 0,
                ready: false
            };
        });

        await set(matchRef, matchData);

        // Remove players from queue
        for (const playerId of matchPlayers) {
            await remove(ref(this.db, `matchmaking/queue/${playerId}`));
        }

        console.log('Match created:', matchId);
        return matchId;
    }

    // Get match data
    async getMatch(matchId) {
        const matchRef = ref(this.db, `matches/${matchId}`);
        const snapshot = await get(matchRef);
        return snapshot.val();
    }

    // Listen to match updates
    listenToMatch(matchId, callback) {
        const matchRef = ref(this.db, `matches/${matchId}`);
        return onValue(matchRef, (snapshot) => {
            callback(snapshot.val());
        });
    }

    // Shuffle array (Fisher-Yates)
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export const matchmaking = new MatchmakingManager();
