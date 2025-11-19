import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onValueWritten } from 'firebase-functions/v2/database';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

initializeApp();
const db = getFirestore();
const rtdb = getDatabase();

// Create a new game room
export const createRoom = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { hostId, roomName, maxPlayers = 10 } = req.body;

    if (!hostId || !roomName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const roomData = {
      hostId,
      roomName,
      maxPlayers,
      players: [hostId],
      status: 'waiting',
      createdAt: new Date().toISOString(),
      map: 'default'
    };

    const roomRef = await db.collection('rooms').add(roomData);

    res.status(200).json({
      success: true,
      roomId: roomRef.id,
      room: roomData
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join a game room
export const joinRoom = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { roomId, playerId } = req.body;

    if (!roomId || !playerId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const roomRef = db.collection('rooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const roomData = roomDoc.data();

    if (roomData.players.length >= roomData.maxPlayers) {
      res.status(400).json({ error: 'Room is full' });
      return;
    }

    if (roomData.players.includes(playerId)) {
      res.status(400).json({ error: 'Already in room' });
      return;
    }

    await roomRef.update({
      players: [...roomData.players, playerId]
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player stats
export const updateStats = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { userId, kills, deaths, wins } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const statsRef = db.collection('leaderboard').doc(userId);
    const statsDoc = await statsRef.get();

    if (statsDoc.exists) {
      const currentStats = statsDoc.data();
      await statsRef.update({
        kills: (currentStats.kills || 0) + (kills || 0),
        deaths: (currentStats.deaths || 0) + (deaths || 0),
        wins: (currentStats.wins || 0) + (wins || 0),
        timestamp: new Date().toISOString()
      });
    } else {
      await statsRef.set({
        userId,
        kills: kills || 0,
        deaths: deaths || 0,
        wins: wins || 0,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clean up empty rooms (triggered when player leaves)
export const cleanupRoom = onDocumentDeleted('rooms/{roomId}', async (event) => {
  const roomId = event.params.roomId;
  
  try {
    // Delete all player states for this room
    const playerStates = await db.collection('gameState').doc(roomId).collection('players').get();
    const batch = db.batch();
    
    playerStates.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleaned up room ${roomId}`);
  } catch (error) {
    console.error('Error cleaning up room:', error);
  }
});

// Initialize player profile on first login
export const initializePlayer = onDocumentCreated('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const userData = event.data.data();
  
  try {
    // Create initial leaderboard entry
    await db.collection('leaderboard').doc(userId).set({
      userId,
      username: userData.username || 'Player',
      kills: 0,
      deaths: 0,
      wins: 0,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Initialized player profile for ${userId}`);
  } catch (error) {
    console.error('Error initializing player:', error);
  }
});

// ============================================
// PHASE 4 & 5: SERVER-AUTHORITATIVE LOGIC
// ============================================

// Validate player movement (anti-speedhack)
export const onPlayerAction = onValueWritten('rooms/{roomId}/players/{playerId}', async (event) => {
  const roomId = event.params.roomId;
  const playerId = event.params.playerId;
  const before = event.data.before.val();
  const after = event.data.after.val();

  if (!before || !after) return;

  try {
    // Calculate distance moved
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate time elapsed
    const timeDiff = (after.timestamp - before.timestamp) / 1000; // seconds
    
    // Max speed: 200 pixels/second
    const maxSpeed = 200;
    const maxDistance = maxSpeed * timeDiff * 1.5; // 1.5x tolerance
    
    // Check for speedhack
    if (distance > maxDistance && timeDiff > 0) {
      console.warn(`Speedhack detected: ${playerId} moved ${distance}px in ${timeDiff}s`);
      
      // Revert to previous position
      await rtdb.ref(`rooms/${roomId}/players/${playerId}`).update({
        x: before.x,
        y: before.y,
        flagged: true
      });
      
      // Log violation
      await rtdb.ref(`rooms/${roomId}/violations/${playerId}`).push({
        type: 'speedhack',
        distance,
        timeDiff,
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('Error validating player action:', error);
  }
});

// Handle projectile requests (server-authoritative)
export const onProjectileRequest = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { roomId, playerId, x, y, velocityX, velocityY, weaponType } = req.body;

    if (!roomId || !playerId || x === undefined || y === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Validate weapon fire rate
    const lastShotRef = rtdb.ref(`rooms/${roomId}/players/${playerId}/lastShot`);
    const lastShotSnap = await lastShotRef.get();
    const lastShot = lastShotSnap.val() || 0;
    const now = Date.now();
    
    // Weapon fire rates (ms)
    const fireRates = {
      pistol: 300,
      smg: 100,
      rifle: 150,
      sniper: 800,
      shotgun: 600
    };
    
    const minFireRate = fireRates[weaponType] || 300;
    
    if (now - lastShot < minFireRate) {
      res.status(429).json({ error: 'Fire rate exceeded' });
      return;
    }

    // Update last shot time
    await lastShotRef.set(now);

    // Validate bullet speed
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const maxSpeed = 600;
    
    if (speed > maxSpeed * 1.1) {
      res.status(400).json({ error: 'Invalid bullet speed' });
      return;
    }

    // Create server-authoritative bullet
    const bulletId = `${playerId}_${now}`;
    await rtdb.ref(`rooms/${roomId}/serverState/projectiles/${bulletId}`).set({
      shooterId: playerId,
      x,
      y,
      velocityX,
      velocityY,
      weaponType,
      damage: getWeaponDamage(weaponType),
      createdAt: now,
      active: true
    });

    res.status(200).json({ success: true, bulletId });
  } catch (error) {
    console.error('Error handling projectile request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calculate damage (server-authoritative hit detection)
export const calculateDamage = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { roomId, bulletId, targetId, hitPosition } = req.body;

    if (!roomId || !bulletId || !targetId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Get bullet data
    const bulletRef = rtdb.ref(`rooms/${roomId}/serverState/projectiles/${bulletId}`);
    const bulletSnap = await bulletRef.get();
    const bullet = bulletSnap.val();

    if (!bullet || !bullet.active) {
      res.status(404).json({ error: 'Bullet not found or inactive' });
      return;
    }

    // Get target player data
    const targetRef = rtdb.ref(`rooms/${roomId}/players/${targetId}`);
    const targetSnap = await targetRef.get();
    const target = targetSnap.val();

    if (!target) {
      res.status(404).json({ error: 'Target not found' });
      return;
    }

    // Calculate distance for validation
    const dx = hitPosition.x - bullet.x;
    const dy = hitPosition.y - bullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Validate hit (bullet must be close to target)
    const maxHitDistance = 50; // pixels
    if (distance > maxHitDistance) {
      res.status(400).json({ error: 'Invalid hit distance' });
      return;
    }

    // Calculate damage (headshot multiplier, distance falloff, etc.)
    let damage = bullet.damage;
    
    // Headshot detection (simplified - top 25% of sprite)
    if (hitPosition.y < target.y - 8) {
      damage *= 2; // Headshot multiplier
    }

    // Apply damage
    const newHealth = Math.max(0, (target.health || 100) - damage);
    await targetRef.update({ health: newHealth });

    // Deactivate bullet
    await bulletRef.update({ active: false });

    // Check for kill
    if (newHealth <= 0) {
      await handlePlayerDeath(roomId, targetId, bullet.shooterId);
    }

    // Create damage event
    await rtdb.ref(`rooms/${roomId}/serverEvents/damage`).push({
      shooterId: bullet.shooterId,
      targetId,
      damage,
      newHealth,
      headshot: damage > bullet.damage,
      timestamp: Date.now()
    });

    res.status(200).json({ 
      success: true, 
      damage, 
      newHealth,
      killed: newHealth <= 0
    });
  } catch (error) {
    console.error('Error calculating damage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle bomb events
export const onBombEvent = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { roomId, playerId, action, position } = req.body;

    if (!roomId || !playerId || !action) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const gameStateRef = rtdb.ref(`rooms/${roomId}/gameState`);
    const gameStateSnap = await gameStateRef.get();
    const gameState = gameStateSnap.val();

    if (!gameState) {
      res.status(404).json({ error: 'Game state not found' });
      return;
    }

    if (action === 'plant') {
      // Validate bomb not already planted
      if (gameState.bombPlanted) {
        res.status(400).json({ error: 'Bomb already planted' });
        return;
      }

      // Plant bomb
      await gameStateRef.update({
        bombPlanted: true,
        bombSite: position,
        bombTimer: 45,
        bombPlantedBy: playerId,
        bombPlantedAt: Date.now()
      });

      // Start bomb timer
      startBombTimer(roomId);

      res.status(200).json({ success: true, message: 'Bomb planted' });
    } else if (action === 'defuse') {
      // Validate bomb is planted
      if (!gameState.bombPlanted) {
        res.status(400).json({ error: 'No bomb to defuse' });
        return;
      }

      // Defuse bomb
      await gameStateRef.update({
        bombDefused: true,
        bombDefusedBy: playerId,
        bombDefusedAt: Date.now()
      });

      // End round - defenders win
      await endRound(roomId, 'defenders');

      res.status(200).json({ success: true, message: 'Bomb defused' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error handling bomb event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle round end
export const onRoundEnd = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { roomId, winningTeam } = req.body;

    if (!roomId || !winningTeam) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    await endRound(roomId, winningTeam);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error ending round:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function getWeaponDamage(weaponType) {
  const damages = {
    pistol: 20,
    smg: 25,
    rifle: 35,
    sniper: 100,
    shotgun: 80
  };
  return damages[weaponType] || 20;
}

async function handlePlayerDeath(roomId, victimId, killerId) {
  // Update kill feed
  await rtdb.ref(`rooms/${roomId}/serverEvents/kills`).push({
    killerId,
    victimId,
    timestamp: Date.now()
  });

  // Award money to killer
  const killerRef = rtdb.ref(`rooms/${roomId}/players/${killerId}/money`);
  const killerSnap = await killerRef.get();
  const currentMoney = killerSnap.val() || 800;
  await killerRef.set(currentMoney + 300); // $300 per kill

  // Respawn victim (or mark as dead for round)
  await rtdb.ref(`rooms/${roomId}/players/${victimId}`).update({
    health: 0,
    alive: false,
    deathTime: Date.now()
  });
}

async function endRound(roomId, winningTeam) {
  const gameStateRef = rtdb.ref(`rooms/${roomId}/gameState`);
  const gameStateSnap = await gameStateRef.get();
  const gameState = gameStateSnap.val();

  // Update scores
  const newScores = {
    teamAScore: gameState.teamAScore + (winningTeam === 'attackers' ? 1 : 0),
    teamBScore: gameState.teamBScore + (winningTeam === 'defenders' ? 1 : 0)
  };

  // Award money
  const players = await rtdb.ref(`rooms/${roomId}/players`).get();
  players.forEach(async (playerSnap) => {
    const playerId = playerSnap.key;
    const player = playerSnap.val();
    const playerTeam = player.team || 'A';
    
    // Win bonus: $3000, Loss bonus: $1900
    const bonus = (playerTeam === winningTeam) ? 3000 : 1900;
    const currentMoney = player.money || 800;
    const newMoney = Math.min(16000, currentMoney + bonus); // Max $16000
    
    await rtdb.ref(`rooms/${roomId}/players/${playerId}/money`).set(newMoney);
  });

  // Update game state
  await gameStateRef.update({
    phase: 'roundEnd',
    winningTeam,
    ...newScores,
    roundEndedAt: Date.now()
  });

  // Start new round after 5 seconds
  setTimeout(async () => {
    await gameStateRef.update({
      phase: 'buy',
      roundNumber: gameState.roundNumber + 1,
      timeRemaining: 30,
      bombPlanted: false,
      bombDefused: false,
      bombTimer: 0
    });

    // Reset players
    const playersSnap = await rtdb.ref(`rooms/${roomId}/players`).get();
    playersSnap.forEach(async (playerSnap) => {
      await rtdb.ref(`rooms/${roomId}/players/${playerSnap.key}`).update({
        health: 100,
        alive: true
      });
    });
  }, 5000);
}

function startBombTimer(roomId) {
  const bombInterval = setInterval(async () => {
    const gameStateRef = rtdb.ref(`rooms/${roomId}/gameState`);
    const gameStateSnap = await gameStateRef.get();
    const gameState = gameStateSnap.val();

    if (!gameState || !gameState.bombPlanted || gameState.bombDefused) {
      clearInterval(bombInterval);
      return;
    }

    const newTimer = gameState.bombTimer - 1;

    if (newTimer <= 0) {
      // Bomb exploded - attackers win
      await endRound(roomId, 'attackers');
      clearInterval(bombInterval);
    } else {
      await gameStateRef.update({ bombTimer: newTimer });
    }
  }, 1000);
}
