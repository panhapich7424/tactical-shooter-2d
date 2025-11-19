import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

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
