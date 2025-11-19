// Interpolation helper for smooth multiplayer movement
export class PlayerInterpolation {
    constructor() {
        this.players = new Map();
    }

    // Add or update a player's target position
    updatePlayer(uid, x, y, rotation) {
        if (!this.players.has(uid)) {
            this.players.set(uid, {
                current: { x, y, rotation },
                target: { x, y, rotation },
                velocity: { x: 0, y: 0 }
            });
        } else {
            const player = this.players.get(uid);
            player.target = { x, y, rotation };
            
            // Calculate velocity for prediction
            player.velocity = {
                x: x - player.current.x,
                y: y - player.current.y
            };
        }
    }

    // Remove a player
    removePlayer(uid) {
        this.players.delete(uid);
    }

    // Interpolate all players towards their target positions
    update(delta) {
        const interpolationSpeed = 0.3; // Adjust for smoothness (0-1)
        
        this.players.forEach((player, uid) => {
            // Linear interpolation for position
            player.current.x += (player.target.x - player.current.x) * interpolationSpeed;
            player.current.y += (player.target.y - player.current.y) * interpolationSpeed;
            
            // Interpolate rotation (handle wrapping)
            let rotDiff = player.target.rotation - player.current.rotation;
            
            // Normalize rotation difference to [-PI, PI]
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            
            player.current.rotation += rotDiff * interpolationSpeed;
        });
    }

    // Get interpolated position for a player
    getPlayerPosition(uid) {
        const player = this.players.get(uid);
        return player ? player.current : null;
    }

    // Get all player positions
    getAllPositions() {
        const positions = {};
        this.players.forEach((player, uid) => {
            positions[uid] = player.current;
        });
        return positions;
    }

    // Clear all players
    clear() {
        this.players.clear();
    }
}
