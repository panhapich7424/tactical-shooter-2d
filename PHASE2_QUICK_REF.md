# Phase 2 Quick Reference

## 🚀 5-Minute Setup

```bash
# 1. Enable in Firebase Console:
#    - Realtime Database (test mode)
#    - Anonymous Authentication

# 2. Install dependencies
cd client
npm install

# 3. Build
npm run build

# 4. Deploy
# Push to GitHub (Render auto-deploys)
# OR: firebase deploy
```

## 🎮 How to Play Multiplayer

### Create Room
```
Menu → MULTIPLAYER → CREATE ROOM → Share code → START GAME
```

### Join Room
```
Menu → MULTIPLAYER → JOIN ROOM → Enter code → START GAME
```

## 📁 New Files

```
client/network/rt-db.js           - Firebase wrapper
client/network/interpolation.js   - Smooth movement
client/scenes/LobbyScene.js       - Room UI
database.rules.json               - DB security
```

## 🔧 Key Functions

### rt-db.js
```javascript
rtdb.initialize()              // Auth anonymously
rtdb.createRoom(name)          // Create room, get code
rtdb.joinRoom(roomId)          // Join by code
rtdb.startUpdating(callback)   // Send position (10 Hz)
rtdb.listenToPlayers(onUpdate) // Receive players
```

### interpolation.js
```javascript
interpolation.updatePlayer(uid, x, y, rot)  // Set target
interpolation.update(delta)                 // Interpolate
interpolation.getPlayerPosition(uid)        // Get position
```

## 🎯 Testing

### Local (Two Tabs)
```
1. Tab 1: Create room → Note code
2. Tab 2: Join room → Enter code
3. Both: START GAME
4. Move around, see each other!
```

### Online (Two Devices)
```
1. Deploy game
2. Device 1: Create room
3. Share code with Device 2
4. Device 2: Join room
5. Play together!
```

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Connection failed | Enable Realtime DB + Anonymous Auth |
| Room not found | Check code, creator must stay connected |
| Players not visible | Both click START GAME, check console |
| Laggy movement | Adjust interpolation speed (0.3 → 0.5) |

## 📊 Performance

- **Update Rate**: 10 Hz (100ms)
- **Interpolation**: 60 FPS
- **Bandwidth**: 500 bytes/s per player
- **Max Players**: 10 per room
- **Latency**: 50-200ms typical

## 💰 Cost

**Free Tier:**
- Realtime DB: 1 GB storage, 10 GB/month
- Your game: ~18 MB/hour
- **Result**: ~555 hours/month FREE

## 🎨 Customization

### Change update rate
```javascript
// rt-db.js, line 120
}, 100); // 100ms = 10 Hz, 50ms = 20 Hz
```

### Change interpolation speed
```javascript
// interpolation.js, line 32
const interpolationSpeed = 0.3; // 0-1
```

### Change max players
```javascript
// rt-db.js, line 56
maxPlayers: 10 // Change to any number
```

### Change player colors
```javascript
// GameScene.js, line 290
remotePlayer.setTint(0xff6b6b); // Red
```

## ✅ Checklist

Setup:
- [ ] Realtime Database enabled
- [ ] Anonymous Auth enabled
- [ ] Dependencies installed
- [ ] Code deployed

Testing:
- [ ] Can create room
- [ ] Can join room
- [ ] See other players
- [ ] Smooth movement
- [ ] Disconnect works

## 📚 Documentation

- **PHASE2_SETUP.md** - Detailed setup
- **MULTIPLAYER_GUIDE.md** - Player guide
- **PHASE2_MULTIPLAYER.md** - Technical docs
- **PHASE2_COMPLETE.md** - Full summary

## 🎉 You're Ready!

Phase 2 is complete. Invite friends and play together! 🚀
