# Quick Start Guide

Get your game running in 15 minutes!

## 🚀 Fastest Path to Deployment

### Step 1: Firebase Setup (5 minutes)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" → Name it → Create
3. Enable these services:
   - **Authentication**: Email/Password
   - **Firestore**: Test mode
   - **Hosting**: Get started
4. Get config: Project Settings → Your apps → Web → Copy config

### Step 2: Update Config (2 minutes)
1. Open `firebase/firebase-config.js`
2. Paste your Firebase config
3. Open `.firebaserc`
4. Replace `YOUR_PROJECT_ID` with your actual project ID

### Step 3: GitHub Setup (3 minutes)
1. Create new GitHub repo (public)
2. Push code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 4: GitHub Secrets (3 minutes)
1. Go to repo Settings → Secrets → Actions
2. Add `FIREBASE_SERVICE_ACCOUNT`:
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy entire JSON content
3. Add `FIREBASE_PROJECT_ID`: Your project ID

### Step 5: Deploy (2 minutes)
1. Push to main branch (if not already done)
2. Go to Actions tab
3. Watch deployment complete
4. Visit: `https://YOUR_PROJECT_ID.web.app`

## 🎮 Play Your Game!

Controls:
- **WASD**: Move
- **Mouse**: Aim
- **Left Click**: Shoot

## 🔧 Development in Replit

### Option A: Import from GitHub
1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repo URL
5. Click "Import"

### Option B: Upload Files
1. Create new Repl (Node.js)
2. Upload all project files
3. Replit will auto-detect configuration

### Run Development Server
```bash
cd client
npm install
npm run dev
```

Game opens in Replit webview!

## 📝 What You Get

### Working Features
✅ Top-down movement (WASD)
✅ Mouse aiming
✅ Shooting mechanics
✅ Collision detection
✅ Procedural map generation
✅ Responsive UI
✅ Auto-deployment pipeline

### Ready for Phase 2
- Multiplayer sync (Firestore ready)
- Authentication (Firebase Auth ready)
- Cloud Functions (deployed)
- Database rules (configured)

## 🆘 Quick Troubleshooting

### Game Won't Load
```javascript
// Check browser console (F12)
// Common fix: Update firebase-config.js with correct values
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
- Check GitHub secrets are set
- Verify Firebase project ID matches
- Ensure Firebase Hosting is enabled

## 📚 Next Steps

1. **Test the game**: Play and verify controls work
2. **Read SETUP_GUIDE.md**: Detailed explanations
3. **Customize**: Edit scenes, add features
4. **Add assets**: Replace placeholder graphics
5. **Go multiplayer**: Implement Phase 2 features

## 💡 Pro Tips

- **Development**: Use Replit for instant preview
- **Deployment**: Push to GitHub for auto-deploy
- **Testing**: Use Firebase emulators for local testing
- **Assets**: Start with placeholders, add art later
- **Performance**: Monitor Firebase Console usage

## 🎯 Success Checklist

- [ ] Firebase project created
- [ ] Config files updated
- [ ] GitHub repo created
- [ ] Secrets configured
- [ ] Code pushed
- [ ] Deployment successful
- [ ] Game loads in browser
- [ ] Controls work
- [ ] No console errors

## 🔗 Important URLs

- **Firebase Console**: https://console.firebase.google.com/
- **GitHub Repo**: https://github.com/YOUR_USERNAME/YOUR_REPO
- **Live Game**: https://YOUR_PROJECT_ID.web.app
- **Replit**: https://replit.com

## 🎊 You're Done!

Your game is now:
- ✅ Running in the browser
- ✅ Hosted on Firebase (free)
- ✅ Auto-deploying from GitHub
- ✅ Ready for multiplayer features

Time to build something awesome! 🚀
