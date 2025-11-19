# Quick Reference Card

## 🚀 Essential Commands

### Development
```bash
# Start dev server
cd client
npm install
npm run dev
# Opens at localhost:3000
```

### Build
```bash
# Build for production
cd client
npm run build
# Output: client/dist/
```

### Deploy
```bash
# Auto-deploy (recommended)
git push origin main

# Manual deploy
bash deploy.sh

# Firebase CLI deploy
firebase deploy
```

## 📝 Files to Update

### Before First Deploy
1. `firebase/firebase-config.js` - Add your Firebase credentials
2. `.firebaserc` - Add your Firebase project ID

### GitHub Secrets (Settings → Secrets → Actions)
1. `FIREBASE_SERVICE_ACCOUNT` - Service account JSON
2. `FIREBASE_PROJECT_ID` - Your project ID

## 🎮 Game Controls

| Key | Action |
|-----|--------|
| W | Move Up |
| A | Move Left |
| S | Move Down |
| D | Move Right |
| Mouse | Aim |
| Left Click | Shoot |

## 🔗 Important URLs

```
Firebase Console:
https://console.firebase.google.com/

Your Live Game:
https://YOUR_PROJECT_ID.web.app

GitHub Actions:
https://github.com/YOUR_USERNAME/YOUR_REPO/actions

Replit:
https://replit.com
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `client/scenes/GameScene.js` | Main gameplay logic |
| `client/scenes/MenuScene.js` | Menu interface |
| `client/scenes/BootScene.js` | Asset loading |
| `functions/index.js` | Server functions |
| `firebase.json` | Firebase config |
| `firestore.rules` | Database security |

## 🐛 Quick Troubleshooting

### Game Won't Load
```javascript
// Check browser console (F12)
// Verify firebase-config.js has real values
// Clear cache and reload
```

### Build Fails
```bash
# Delete and reinstall
rm -rf client/node_modules
cd client
npm install
npm run build
```

### Deploy Fails
```bash
# Check GitHub secrets are set
# Verify Firebase project ID
# Re-authenticate Firebase CLI
firebase login
```

## 📊 Project Stats

- **Files**: 25+
- **Lines of Code**: ~1,500
- **Setup Time**: 15 minutes
- **Cost**: $0 (100% free)

## 🎯 Phase 1 Checklist

- [ ] Firebase project created
- [ ] Config files updated
- [ ] GitHub repo created
- [ ] Secrets configured
- [ ] Code pushed
- [ ] Game deployed
- [ ] Game loads in browser
- [ ] Controls work

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| `QUICKSTART.md` | 15-min setup |
| `SETUP_GUIDE.md` | Detailed steps |
| `DEPLOYMENT.md` | Deploy info |
| `PROJECT_STRUCTURE.md` | Architecture |
| `CHECKLIST.md` | Verification |

## 🔧 Configuration Values

```javascript
// Game Settings (client/main.js)
width: 1280
height: 720
physics: 'arcade'

// Player Settings (client/scenes/GameScene.js)
playerSpeed: 200
bulletSpeed: 600

// Map Settings
mapWidth: 40 tiles
mapHeight: 30 tiles
tileSize: 32 pixels
```

## 💰 Free Tier Limits

| Service | Limit |
|---------|-------|
| Firebase Hosting | 10GB storage, 360MB/day |
| Firestore | 50K reads, 20K writes/day |
| Cloud Functions | 2M invocations/month |
| GitHub Actions | Unlimited (public repos) |

## 🎨 Customization Points

### Easy Changes
- Player speed: `GameScene.js` line 18
- Bullet speed: `GameScene.js` line 134
- Map size: `GameScene.js` line 52-53
- Colors: `BootScene.js` lines 40-60

### Add Assets
1. Place files in `client/assets/`
2. Update `BootScene.js` loadAssets()
3. Rebuild and deploy

## 🚀 Next Steps

1. ✅ Complete Phase 1 setup
2. 🔄 Test game thoroughly
3. 🎨 Add custom assets
4. 🌐 Implement multiplayer (Phase 2)
5. 🎮 Add more features

## 📞 Get Help

- Check `CHECKLIST.md` troubleshooting
- Review browser console (F12)
- Check GitHub Actions logs
- Review Firebase Console

## ⚡ Pro Tips

- Use Replit for instant development
- Push to GitHub for auto-deploy
- Monitor Firebase Console for usage
- Start with placeholders, add art later
- Test in multiple browsers

---

**Keep this file handy for quick reference!** 📌
