# Complete Setup Guide

## Prerequisites
- GitHub account (free)
- Firebase account (free)
- Replit account (free) OR any cloud IDE

## Step-by-Step Setup

### 1. Firebase Project Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `tactical-shooter-2d`
4. Disable Google Analytics (optional for free tier)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

#### Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location closest to you
5. Click "Enable"

#### Enable Hosting
1. Go to "Hosting"
2. Click "Get started"
3. Follow the wizard (we'll deploy via GitHub Actions)

#### Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon `</>`
4. Register app name: `tactical-shooter-web`
5. Copy the `firebaseConfig` object
6. Paste into `/firebase/firebase-config.js`

### 2. GitHub Repository Setup

#### Create Repository
1. Go to [GitHub](https://github.com)
2. Create new repository: `tactical-shooter-2d`
3. Make it public (required for free GitHub Actions)
4. Don't initialize with README (we have one)

#### Push Code
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tactical-shooter-2d.git
git push -u origin main
```

#### Setup GitHub Secrets
1. In your GitHub repo, go to Settings > Secrets and variables > Actions
2. Add these secrets:

**FIREBASE_SERVICE_ACCOUNT**
- In Firebase Console, go to Project Settings > Service Accounts
- Click "Generate new private key"
- Download JSON file
- Copy entire JSON content and paste as secret value

**FIREBASE_PROJECT_ID**
- Your Firebase project ID (e.g., `tactical-shooter-2d`)

### 3. Update Configuration Files

#### Update `.firebaserc`
```json
{
  "projects": {
    "default": "YOUR_ACTUAL_PROJECT_ID"
  }
}
```

#### Update `firebase/firebase-config.js`
Replace placeholder values with your actual Firebase config.

### 4. Deploy

#### Option A: Deploy via GitHub Actions (Recommended)
1. Push to main branch
2. GitHub Actions will automatically build and deploy
3. Check Actions tab for deployment status
4. Your game will be live at: `https://YOUR_PROJECT_ID.web.app`

#### Option B: Manual Deploy from Replit
1. Open project in Replit
2. Open Shell terminal
3. Run:
```bash
npm install -g firebase-tools
firebase login --no-localhost
# Follow the authentication flow
cd client
npm install
npm run build
cd ..
firebase deploy
```

### 5. Test Your Game

1. Visit: `https://YOUR_PROJECT_ID.web.app`
2. You should see the menu screen
3. Click "PLAY" to start the game
4. Test controls:
   - WASD to move
   - Mouse to aim
   - Left click to shoot

## Troubleshooting

### Build Fails
- Check that all dependencies are installed
- Verify Node.js version is 18+
- Check Firebase config is correct

### Deployment Fails
- Verify GitHub secrets are set correctly
- Check Firebase project ID matches
- Ensure Firebase Hosting is enabled

### Game Doesn't Load
- Check browser console for errors
- Verify Firebase config in `firebase-config.js`
- Clear browser cache and reload

## Development Workflow

### Local Development (Replit)
```bash
cd client
npm install
npm run dev
```
Game runs at `http://localhost:3000`

### Deploy Changes
```bash
git add .
git commit -m "Your changes"
git push
```
GitHub Actions will auto-deploy.

## Free Tier Limits

### Firebase (Spark Plan)
- 10GB hosting storage
- 360MB/day hosting transfer
- 50K reads/day Firestore
- 20K writes/day Firestore
- 20K deletes/day Firestore

### GitHub Actions
- 2,000 minutes/month (public repos unlimited)
- Unlimited for public repositories

### Replit (Free Tier)
- 500MB RAM
- 500MB storage
- Always-on requires paid plan (use for development only)

## Next Steps

After basic setup works:
1. Add multiplayer functionality
2. Implement Firebase Authentication
3. Add real-time game state sync
4. Create multiple agents/characters
5. Add abilities and power-ups
6. Implement matchmaking
7. Add leaderboards
