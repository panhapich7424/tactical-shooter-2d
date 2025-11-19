import { ref, set, onValue, get } from 'firebase/database';
import { rtdb } from './rt-db.js';

// Game State Manager - Handles game state synchronization
export class GameStateManager {
    constructor(roomId) {
        this.roomId = roomId;
        this.db = rtdb.db;
        this.listeners = {};
        this.localState = {
            phase: 'buy',
            roundNumber: 1,
            timeRemaining: 30,
            teamAScore: 0,
            teamBScore: 0,
            bombPlanted: false,
            bombDefused: false
        };
    }

    // Initialize game state
    async initializeGameState() {
        const gameStateRef = ref(this.db, `rooms/${this.roomId}/gameState`);
        
        const initialState = {
            phase: 'buy',
            roundNumber: 1,
            timeRemaining: 30,
            teamAScore: 0,
            teamBScore: 0,
            bombPlanted: false,
            bombDefused: false,
            bombSite: null,
            bombTimer: 0,
            startedAt: Date.now()
        };

        await set(gameStateRef, initialState);
        return initialState;
    }

    // Listen to game state changes
    listenToGameState(callback) {
        const gameStateRef = ref(this.db, `rooms/${this.roomId}/gameState`);
        
        this.listeners.gameState = onValue(gameStateRef, (snapshot) => {
            const state = snapshot.val();
            if (state) {
                this.localState = state;
                callback(state);
            }
        });
    }

    // Update game state (host only)
    async updateGameState(updates) {
        const gameStateRef = ref(this.db, `rooms/${this.roomId}/gameState`);
        const currentState = await this.getGameState();
        
        const newState = {
            ...currentState,
            ...updates,
            updatedAt: Date.now()
        };

        await set(gameStateRef, newState);
    }

    // Get current game state
    async getGameState() {
        const gameStateRef = ref(this.db, `rooms/${this.roomId}/gameState`);
        const snapshot = await get(gameStateRef);
        return snapshot.val() || this.localState;
    }

    // Update player loadout
    async updatePlayerLoadout(playerId, loadout) {
        const loadoutRef = ref(this.db, `rooms/${this.roomId}/players/${playerId}/loadout`);
        await set(loadoutRef, {
            weapon: loadout.weapon,
            ammo: loadout.ammo,
            reserve: loadout.reserve,
            updatedAt: Date.now()
        });
    }

    // Update player money
    async updatePlayerMoney(playerId, money) {
        const moneyRef = ref(this.db, `rooms/${this.roomId}/players/${playerId}/money`);
        await set(moneyRef, money);
    }

    // Plant bomb
    async plantBomb(position) {
        await this.updateGameState({
            bombPlanted: true,
            bombSite: position,
            bombTimer: 45,
            bombPlantedAt: Date.now()
        });
    }

    // Defuse bomb
    async defuseBomb() {
        await this.updateGameState({
            bombDefused: true,
            bombDefusedAt: Date.now()
        });
    }

    // Update scores
    async updateScores(teamAScore, teamBScore) {
        await this.updateGameState({
            teamAScore,
            teamBScore
        });
    }

    // End round
    async endRound(winningTeam) {
        const currentState = await this.getGameState();
        
        const newScores = {
            teamAScore: currentState.teamAScore + (winningTeam === 'A' ? 1 : 0),
            teamBScore: currentState.teamBScore + (winningTeam === 'B' ? 1 : 0)
        };

        await this.updateGameState({
            phase: 'roundEnd',
            winningTeam,
            ...newScores
        });
    }

    // Start new round
    async startNewRound() {
        const currentState = await this.getGameState();
        
        await this.updateGameState({
            phase: 'buy',
            roundNumber: currentState.roundNumber + 1,
            timeRemaining: 30,
            bombPlanted: false,
            bombDefused: false,
            bombSite: null,
            bombTimer: 0
        });
    }

    // Stop listening
    stopListening() {
        Object.values(this.listeners).forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.listeners = {};
    }

    destroy() {
        this.stopListening();
    }
}
