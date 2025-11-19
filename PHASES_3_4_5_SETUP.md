# Phases 3-5 Quick Setup Guide

## 🚀 10-Minute Setup

### Step 1: Deploy Cloud Functions (5 minutes)

```bash
# Install dependencies
cd functions
npm install

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

**Wait for deployment** (~3-4 minutes)

### Step 2: Deploy Database Rules (1 minute)

```bash
firebase deploy --only database
```

### Step 3: Build & Deploy Client (4 minutes)

```bash
# Build client
cd client
npm install
npm run build

# Deploy
cd ..
firebase deploy --only hosting
```

Or push to GitHub for Render.com auto-deploy.

### Step 4: Test! (30 seconds)

1. Open your game
2. Create multiplayer room
3. Press **B** to open buy menu
4. Purchase a weapon
5. Start shooting!

## 📋 What You Get

### UI Components
- **HUD**: Health, money, ammo, timer, round info
- **Buy Menu**: Weapon purchase system (Press B)
- **Round Timer**: Automatic phase transitions

### Game Phases
1. **Buy Phase** (30s) - Purchase weapons
2. **Action Phase** (120s) - Combat
3. **Round End** (5s) - Show results

### Server Features
- ✅ Anti-speedhack
- ✅ Fire rate validation
- ✅ Hit detection
- ✅ Damage calculation
- ✅ Economy system

## 🎮 Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Aim |
| Left Click | Shoot |
| B | Buy Menu |
| E | Plant/Defuse Bomb (future) |

## 💰 Economy

| Event | Money |
|-------|-------|
| Start | $800 |
| Kill | +$300 |
| Win Round | +$3000 |
| Lose Round | +$1900 |
| Max | $16000 |

## 🔫 Weapons

| Weapon | Price | Damage | Fire Rate |
|--------|-------|--------|-----------|
| Pistol | $0 | 20 | 300ms |
| SMG | $1000 | 25 | 100ms |
| Rifle | $2700 | 35 | 150ms |
| Sniper | $4500 | 100 | 800ms |
| Shotgun | $1800 | 80 | 600ms |

## 🐛 Quick Troubleshooting

### Functions deployment fails
```bash
# Check Node.js version
node --version  # Must be 18+

# Clear and reinstall
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Buy menu not appearing
- Press **B** key
- Check browser console for errors
- Verify client rebuilt after adding UI files

### Server not validating
- Check Cloud Functions deployed successfully
- View logs: `firebase functions:log`
- Verify database rules deployed

## 📊 Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Database Activity
1. Go to Firebase Console
2. Realtime Database
3. View data in real-time

### Check Violations
```
/rooms/{ROOM_ID}/violations/
```

## ✅ Verification Checklist

Deployment:
- [ ] Cloud Functions deployed
- [ ] Database rules deployed
- [ ] Client rebuilt and deployed

Testing:
- [ ] Buy menu opens (B key)
- [ ] Can purchase weapons
- [ ] Money deducted
- [ ] Shooting works
- [ ] Server validates actions
- [ ] Round timer counts down
- [ ] Phases transition automatically

## 🎯 Next Steps

1. **Test with friends**
   - Create room
   - Test buy phase
   - Test combat
   - Test economy

2. **Balance gameplay**
   - Adjust weapon prices
   - Tune damage values
   - Modify phase durations

3. **Add features**
   - Bomb mechanics
   - Team assignment
   - Abilities

## 💡 Pro Tips

- **Buy Phase**: Use time to strategize
- **Economy**: Save for better weapons
- **Headshots**: Deal 2x damage
- **Fire Rate**: Don't spam, server limits it

## 📚 Documentation

- **PHASES_3_4_5_COMPLETE.md** - Full documentation
- **functions/index.js** - Server logic
- **client/ui/** - UI components

## 🎉 You're Ready!

Phases 3-5 are complete. You now have a fully functional tactical shooter with:
- ✅ Complete game loop
- ✅ Server authority
- ✅ Anti-cheat
- ✅ Economy system

**Time to play!** 🚀
