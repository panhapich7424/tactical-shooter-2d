# Complete Multiplayer Guide

## 🎮 How to Play Multiplayer

### Creating a Game

1. **Launch the game** (your deployed URL)
2. **Click "MULTIPLAYER"** from main menu
3. **Click "CREATE ROOM"**
4. **Share the room code** with friends (e.g., "A3X9K2")
5. **Wait for players to join**
6. **Click "START GAME"** when ready

### Joining a Game

1. **Get room code** from friend
2. **Click "MULTIPLAYER"** from main menu
3. **Click "JOIN ROOM"**
4. **Enter the 6-character code**
5. **Click "START GAME"**

### In-Game

- **Your player**: Cyan colored square
- **Other players**: Red tinted squares
- **Usernames**: Displayed above each player
- **Controls**: Same as single player (WASD + mouse)

## 🔧 Technical Details

### Network Architecture

```
Player 1 Browser                    Player 2 Browser
       ↓                                   ↓
   Anonymous Auth                    Anonymous Auth
       ↓                                   ↓
       └─────→ Firebase Realtime DB ←─────┘
                      ↓
              /rooms/{ROOM_ID}/
                   players/
                     {UID_1}/
                     {UID_2}/
```

### Data Flow

1. **Player moves** (WASD input)
2. **Position updated locally** (instant)
3. **Position sent to Firebase** (every 100ms)
4. **Firebase broadcasts** to other players
5. **Other players receive update**
6. **Interpolation smooths movement** (60 FPS)
7. **Remote player sprite updated**

### Update Frequency

- **Position Updates**: 10 Hz (every 100ms)
- **Interpolation**: 60 Hz (every frame)
- **Network Latency**: Typically 50-200ms
- **Visual Smoothness**: Excellent (thanks to interpolation)

## 📊 Performance

### Bandwidth Usage

Per player:
- Position: 8 bytes (x, y as floats)
- Rotation: 4 bytes (float)
- Metadata: ~30 bytes (uid, timestamp, etc.)
- **Total**: ~50 bytes per update
- **Rate**: 10 updates/second
- **Bandwidth**: 500 bytes/second = 0.5 KB/s

For 10 players:
- **Total bandwidth**: 5 KB/second
- **Per hour**: 18 MB
- **Very efficient!**

### Firebase Limits (Free Tier)

- **Realtime Database**: 1 GB storage, 10 GB/month download
- **Simultaneous connections**: 100
- **Your game**: ~10 players = 5 KB/s = 18 MB/hour
- **Free tier allows**: ~555 hours of gameplay per month
- **More than enough!**

## 🎯 Features

### Current (Phase 2)

✅ Real-time player synchronization
✅ Room-based matchmaking
✅ Anonymous authentication
✅ Smooth interpolation
✅ Automatic disconnect handling
✅ Username display
✅ Up to 10 players per room
✅ 6-character room codes

### Not Yet Implemented

❌ Synchronized shooting
❌ Health synchronization
❌ Server-authoritative gameplay
❌ Anti-cheat protection
❌ Chat system
❌ Leaderboards
❌ Matchmaking queue

## 🔒 Security

### Current Implementation

**Client-Authoritative**:
- Players report their own positions
- No server validation
- Trust-based system

**Pros**:
- Simple to implement
- Low latency
- Good for friendly games

**Cons**:
- Players can cheat (modify position)
- No validation
- Not suitable for competitive play

### Future: Server-Authoritative

**Phase 3+ will add**:
- Cloud Functions validate moves
- Server calculates hit detection
- Anti-cheat measures
- Input validation

## 🐛 Common Issues

### "Connection failed"

**Cause**: Firebase services not enabled

**Fix**:
1. Enable Realtime Database in Firebase Console
2. Enable Anonymous Auth
3. Redeploy

### "Room not found"

**Cause**: Room doesn't exist or expired

**Fix**:
- Verify room code is correct
- Room creator must stay connected
- Create a new room

### Players not appearing

**Cause**: Not in same room or network error

**Fix**:
1. Verify both players in same room
2. Check browser console for errors
3. Refresh page and rejoin

### Laggy movement

**Cause**: High network latency or slow interpolation

**Fix**:
- Increase interpolation speed in `interpolation.js`
- Check internet connection
- Try different server region

### Player stuck/teleporting

**Cause**: Packet loss or connection issues

**Fix**:
- Check internet stability
- Refresh page
- Rejoin room

## 💡 Tips & Tricks

### For Best Experience

1. **Stable internet**: WiFi or wired connection
2. **Low latency**: Players in same region
3. **Modern browser**: Chrome, Firefox, Edge
4. **Close other tabs**: Reduce CPU usage

### Room Management

- **Room codes expire**: When creator leaves
- **Max 10 players**: Per room limit
- **Create new rooms**: For each game session
- **Share codes carefully**: Anyone with code can join

### Testing Locally

1. Open two browser windows
2. Create room in window 1
3. Join room in window 2
4. Test on same machine!

## 📱 Mobile Support

### Current Status

- ✅ Game loads on mobile
- ✅ Touch controls work (tap to move)
- ⚠️ Not optimized for mobile
- ❌ No virtual joystick yet

### Future Mobile Features

- Virtual joystick for movement
- Touch-based aiming
- Responsive UI
- Mobile-optimized controls

## 🎨 Customization

### Change Player Colors

In `GameScene.js`, line ~290:
```javascript
remotePlayer.setTint(0xff6b6b); // Change color here
```

### Adjust Update Rate

In `rt-db.js`, line ~120:
```javascript
}, 100); // Change to 50 for 20 Hz, 200 for 5 Hz
```

### Modify Interpolation Speed

In `interpolation.js`, line ~32:
```javascript
const interpolationSpeed = 0.3; // 0 = no interpolation, 1 = instant
```

### Change Max Players

In `rt-db.js`, line ~56:
```javascript
maxPlayers: 10 // Change to any number
```

## 📈 Scaling

### Current Capacity

- **Players per room**: 10
- **Simultaneous rooms**: Unlimited
- **Total players**: Limited by Firebase free tier (100 connections)

### Upgrading

If you exceed free tier:
- **Blaze Plan**: Pay as you go
- **Cost**: $1 per GB download
- **Your game**: ~18 MB/hour = $0.018/hour
- **Very affordable!**

## 🎓 Learning Resources

### Understanding the Code

1. **rt-db.js**: Firebase Realtime Database wrapper
   - Authentication
   - Room management
   - Position updates

2. **interpolation.js**: Smooth movement
   - Linear interpolation
   - Rotation handling
   - Position prediction

3. **LobbyScene.js**: Room UI
   - Create/join rooms
   - Display room codes
   - Start game

4. **GameScene.js**: Multiplayer gameplay
   - Remote player rendering
   - Position synchronization
   - Disconnect handling

### Firebase Documentation

- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [Anonymous Auth](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [Security Rules](https://firebase.google.com/docs/database/security)

## 🚀 Next Steps

### Immediate

1. Test with friends
2. Gather feedback
3. Fix any bugs
4. Optimize performance

### Phase 3 Ideas

1. **Combat System**
   - Synchronized shooting
   - Health bars
   - Respawn system

2. **Server Authority**
   - Validate moves
   - Prevent cheating
   - Hit detection

3. **Social Features**
   - Chat system
   - Friend lists
   - Parties

4. **Game Modes**
   - Team deathmatch
   - Capture the flag
   - Battle royale

## ✅ Multiplayer Checklist

Setup:
- [ ] Realtime Database enabled
- [ ] Anonymous Auth enabled
- [ ] Code deployed
- [ ] Firebase config correct

Testing:
- [ ] Can create room
- [ ] Can join room
- [ ] Can see other players
- [ ] Movement is smooth
- [ ] Usernames display
- [ ] Disconnect works

Ready to Play:
- [ ] Share room code with friends
- [ ] Start game together
- [ ] Have fun! 🎮

---

**Multiplayer Status**: ✅ FULLY FUNCTIONAL
**Players Supported**: Up to 10 per room
**Cost**: $0 (Free tier)
**Latency**: 50-200ms typical
**Update Rate**: 10 Hz
**Smoothness**: Excellent (interpolated)

**Ready to play with friends!** 🚀
