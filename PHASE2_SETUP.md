# Phase 2 Quick Setup Guide

## 🚀 5-Minute Multiplayer Setup

### Step 1: Enable Realtime Database (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/project/tactical-shooter-16e81/database)
2. Click "Realtime Database" in sidebar
3. Click "Create Database"
4. Choose your location (same as Firestore)
5. Select "Start in **test mode**"
6. Click "Enable"

### Step 2: Enable Anonymous Auth (1 minute)

1. Go to "Authentication" in Firebase Console
2. Click "Sign-in method" tab
3. Click "Anonymous"
4. Toggle "Enable"
5. Click "Save"

### Step 3: Update Firebase Config (1 minute)

Your `firebase/firebase-config.js` should already have your credentials. Firebase Realtime Database uses the same config!

**Verify it looks like this:**
```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyDQ947Jspht10r-uuADiyw8q-zzwi5FZg8",
  authDomain: "tactical-shooter-16e81.firebaseapp.com",
  projectId: "tactical-shooter-16e81",
  storageBucket: "tactical-shooter-16e81.firebasestorage.app",
  messagingSenderId: "729795456206",
  appId: "1:729795456206:web:d7d9a91f1f45699184b49f",
  measurementId: "G-HZVHV87HF3"
};
```

### Step 4: Deploy (1 minute)

#### Option A: Render.com (Automatic)
```bash
# Just push to GitHub
git add .
git commit -m "Add multiplayer support"
git push
# Render auto-deploys!
```

#### Option B: Firebase Hosting
```bash
cd client
npm install
npm run build
cd ..
firebase deploy
```

### Step 5: Test! (30 seconds)

1. Open your deployed game
2. Click "MULTIPLAYER"
3. Click "CREATE ROOM"
4. Share the room code
5. Open game in another tab/device
6. Click "JOIN ROOM" and enter code
7. Both click "START GAME"
8. **You're playing together!** 🎮

## 🎯 What You Can Do Now

### Create a Room
- Click "MULTIPLAYER" → "CREATE ROOM"
- Get a 6-character code (e.g., "A3X9K2")
- Share with friends

### Join a Room
- Click "MULTIPLAYER" → "JOIN ROOM"
- Enter the 6-character code
- Click "START GAME"

### Play Together
- Move with WASD
- Aim with mouse
- See other players in real-time
- Red-tinted players are remote
- Usernames appear above players

## 🔧 Files Changed

### New Files
```
client/network/rt-db.js           - Realtime Database wrapper
client/network/interpolation.js   - Smooth movement
client/scenes/LobbyScene.js       - Room UI
database.rules.json               - Database security
```

### Updated Files
```
client/main.js                    - Added LobbyScene
client/scenes/MenuScene.js        - Added multiplayer button
client/scenes/GameScene.js        - Multiplayer support
client/package.json               - Added Firebase SDK
firebase.json                     - Added database rules
```

## 📦 Dependencies Added

```json
"firebase": "^10.7.1"
```

This adds ~500KB to your bundle (Firebase SDK).

## 🐛 Quick Troubleshooting

### "Connection failed"
- Enable Anonymous Auth in Firebase Console
- Enable Realtime Database in Firebase Console

### "Room not found"
- Check room code is correct (6 characters, uppercase)
- Room creator must stay connected

### Players not visible
- Both players must click "START GAME"
- Check browser console for errors
- Verify Firebase config is correct

### Laggy movement
- Normal with high latency
- Interpolation smooths it out
- Try adjusting interpolation speed in `interpolation.js`

## 💰 Cost

**Still $0!** Firebase free tier includes:
- Realtime Database: 1 GB storage, 10 GB/month download
- Anonymous Auth: Unlimited users
- More than enough for testing and small games

## 🎮 Testing Checklist

- [ ] Firebase Realtime Database enabled
- [ ] Anonymous Auth enabled
- [ ] Code deployed
- [ ] Can create room
- [ ] Can join room
- [ ] Can see other players
- [ ] Movement is smooth
- [ ] Usernames display
- [ ] Disconnect works (close tab, player disappears)

## 🎉 You're Done!

Your game now supports:
- ✅ Real-time multiplayer
- ✅ Up to 10 players per room
- ✅ Smooth interpolated movement
- ✅ Room-based matchmaking
- ✅ Automatic disconnect handling

**Invite friends and play together!** 🚀

---

**Setup Time**: 5 minutes
**Difficulty**: Easy
**Cost**: $0 (Free tier)
