# Tactical Shooter 2D - Browser Game

A top-down 2D pixel-art tactical shooter inspired by Valorant, built with Phaser 3 and Firebase.

## 🎮 Game Features
- Top-down tactical shooter gameplay
- WASD movement controls
- Mouse aiming and shooting
- Multiplayer support via Firebase
- Agent-based character system

## 🛠️ Tech Stack
- **Frontend**: Phaser 3 (HTML5 game engine)
- **Build Tool**: Vite (runs in cloud IDE)
- **Backend**: Firebase (Auth, Firestore, Hosting, Cloud Functions)
- **Deployment**: GitHub Actions (automated)
- **Development**: Replit or any cloud IDE

## 📁 Project Structure
```
/project-root
  /client          - Game client code
    /scenes        - Phaser game scenes
    /assets        - Game assets (sprites, tiles)
  /functions       - Firebase Cloud Functions
  /firebase        - Firebase configuration
  /github          - GitHub Actions workflows
```

## 🚀 Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Start in test mode)
5. Enable Hosting
6. Get your Firebase config from Project Settings

### 2. Configure Firebase Credentials
Edit `/firebase/firebase-config.js` and paste your Firebase configuration:
```javascript
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
```

### 3. Install Firebase CLI (in cloud IDE terminal)
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 4. Deploy to Firebase
```bash
cd client
npm install
npm run build
cd ..
firebase deploy
```

## 🎯 Development Workflow

### Run Locally (in Replit or cloud IDE)
```bash
cd client
npm install
npm run dev
```

### Deploy via GitHub Actions
Push to `main` branch - automatic deployment configured

## 🎮 Game Controls
- **WASD**: Move character
- **Mouse**: Aim weapon
- **Left Click**: Shoot
- **E**: Use ability (future)

## 📦 Free Services Used
- Firebase Free Tier (Spark Plan)
- GitHub Actions (free for public repos)
- Replit (free tier)

## 🔧 Configuration Files
- `.firebaserc` - Firebase project configuration
- `firebase.json` - Firebase hosting/functions config
- `.github/workflows/deploy.yml` - Auto-deployment

## 📝 License
MIT License - Free to use and modify
