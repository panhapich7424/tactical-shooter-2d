# Project Structure Documentation

## Overview
Tactical Shooter 2D is a browser-based multiplayer game built with Phaser 3, Firebase, and deployed via GitHub Actions. Everything runs in the cloud - no local Node.js installation required.

## Directory Structure

```
project-root/
├── client/                      # Frontend game client
│   ├── scenes/                  # Phaser game scenes
│   │   ├── BootScene.js        # Asset loading & initialization
│   │   ├── MenuScene.js        # Main menu UI
│   │   └── GameScene.js        # Core gameplay logic
│   ├── assets/                  # Game assets (sprites, audio)
│   │   └── README.md           # Asset documentation
│   ├── index.html              # Entry HTML file
│   ├── main.js                 # Phaser game configuration
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite bundler configuration
│
├── functions/                   # Firebase Cloud Functions
│   ├── index.js                # Server-side game logic
│   └── package.json            # Functions dependencies
│
├── firebase/                    # Firebase configuration
│   └── firebase-config.js      # Firebase credentials (user fills)
│
├── .github/                     # GitHub Actions
│   └── workflows/
│       └── deploy.yml          # Auto-deployment workflow
│
├── .firebaserc                 # Firebase project mapping
├── firebase.json               # Firebase services config
├── firestore.rules             # Database security rules
├── firestore.indexes.json      # Database indexes
├── .gitignore                  # Git ignore patterns
├── .replit                     # Replit configuration
├── deploy.sh                   # Manual deployment script
│
├── README.md                   # Project overview
├── SETUP_GUIDE.md             # Step-by-step setup
├── DEPLOYMENT.md              # Deployment instructions
└── PROJECT_STRUCTURE.md       # This file
```

## File Descriptions

### Client Files

#### `client/index.html`
- Entry point HTML file
- Minimal styling for game container
- Loads main.js as ES module

#### `client/main.js`
- Phaser game configuration
- Scene registration
- Physics setup (Arcade Physics)
- Canvas size: 1280x720

#### `client/scenes/BootScene.js`
- First scene to load
- Creates loading progress bar
- Generates placeholder graphics (player, bullet, tiles, walls)
- Transitions to MenuScene when complete

#### `client/scenes/MenuScene.js`
- Main menu interface
- Title and subtitle display
- Play button with hover effects
- Controls information display
- Transitions to GameScene on play

#### `client/scenes/GameScene.js`
- Core gameplay implementation
- **Features:**
  - WASD movement (200 speed)
  - Mouse aiming (player rotation)
  - Left-click shooting
  - Bullet physics (600 speed)
  - Procedural map generation (40x30 tiles)
  - Wall collisions
  - Camera follow player
  - UI (health, ammo display)

#### `client/vite.config.js`
- Vite bundler configuration
- Output directory: `dist/`
- Code splitting (Phaser separate chunk)
- Dev server on port 3000

#### `client/package.json`
- Dependencies: Phaser 3.70.0
- Dev dependencies: Vite 5.0.0
- Scripts: dev, build, preview

### Firebase Files

#### `firebase/firebase-config.js`
- Firebase project credentials
- User must fill in their values
- Exported for use in client code

#### `.firebaserc`
- Maps Firebase project ID
- User must update with their project

#### `firebase.json`
- **Hosting:** Serves `client/dist/`, SPA rewrites
- **Functions:** Node.js 18 runtime
- **Firestore:** Rules and indexes configuration

#### `firestore.rules`
- Security rules for database
- **Collections:**
  - `users`: User profiles (auth required)
  - `rooms`: Game rooms (auth required)
  - `gameState`: Real-time player positions
  - `leaderboard`: Public read, auth write

#### `firestore.indexes.json`
- Composite indexes for queries
- Leaderboard sorting (kills DESC, timestamp DESC)
- Room filtering (status ASC, createdAt DESC)

### Functions Files

#### `functions/index.js`
- Cloud Functions for server logic
- **Functions:**
  - `createRoom`: Create new game room
  - `joinRoom`: Join existing room
  - `updateStats`: Update player statistics
  - `cleanupRoom`: Delete room data (trigger)
  - `initializePlayer`: Setup new player (trigger)

#### `functions/package.json`
- Dependencies: firebase-admin, firebase-functions
- Node.js 18 engine requirement

### GitHub Actions

#### `.github/workflows/deploy.yml`
- Automated CI/CD pipeline
- **Triggers:** Push to main, manual dispatch
- **Steps:**
  1. Checkout code
  2. Setup Node.js 18
  3. Install client dependencies
  4. Build client (Vite)
  5. Install functions dependencies
  6. Deploy to Firebase
- **Secrets required:**
  - `FIREBASE_SERVICE_ACCOUNT`
  - `FIREBASE_PROJECT_ID`

### Configuration Files

#### `.gitignore`
- Ignores: node_modules, dist, .firebase, .env, IDE files

#### `.replit`
- Replit IDE configuration
- Run command: `cd client && npm run dev`
- Deployment: Static site from `client/dist`

#### `deploy.sh`
- Bash script for manual deployment
- Checks Firebase CLI installation
- Builds client
- Installs dependencies
- Deploys to Firebase

## Data Flow

### Client → Firebase
1. User opens game in browser
2. Client loads from Firebase Hosting
3. Game connects to Firestore for real-time data
4. User actions trigger Cloud Functions

### Game Loop
1. **BootScene**: Load assets → MenuScene
2. **MenuScene**: Show menu → GameScene (on play)
3. **GameScene**: 
   - Update loop (60 FPS)
   - Handle input (WASD, mouse)
   - Update physics
   - Render frame

### Multiplayer Flow (Future)
1. Player authenticates (Firebase Auth)
2. Create/join room (Cloud Function)
3. Sync player position (Firestore real-time)
4. Handle game events (Cloud Functions)
5. Update leaderboard (Firestore)

## Technology Stack

### Frontend
- **Phaser 3**: HTML5 game engine
- **Vite**: Fast build tool and dev server
- **Vanilla JS**: ES6 modules

### Backend
- **Firebase Hosting**: Static file hosting (CDN)
- **Cloud Firestore**: NoSQL real-time database
- **Cloud Functions**: Serverless backend logic
- **Firebase Auth**: User authentication (future)

### DevOps
- **GitHub**: Version control
- **GitHub Actions**: CI/CD automation
- **Replit**: Cloud IDE for development

## Game Architecture

### Scene Management
```
BootScene (loading)
    ↓
MenuScene (UI)
    ↓
GameScene (gameplay)
```

### Physics System
- **Engine**: Arcade Physics (simple, fast)
- **Gravity**: Disabled (top-down view)
- **Collisions**: Player ↔ Walls, Bullets ↔ Walls

### Input System
- **Keyboard**: WASD movement
- **Mouse**: Aiming (rotation), Shooting (click)

### Rendering
- **Canvas**: 1280x720 pixels
- **Camera**: Follows player, zoom 1x
- **Layers**: Tiles → Walls → Player → Bullets → UI

## Scalability Considerations

### Free Tier Limits
- **Hosting**: 10GB storage, 360MB/day transfer
- **Firestore**: 50K reads, 20K writes, 20K deletes/day
- **Functions**: 2M invocations/month

### Optimization Strategies
1. **Client-side prediction**: Reduce server calls
2. **Batch operations**: Group Firestore writes
3. **Asset optimization**: Small sprites, compressed audio
4. **Code splitting**: Lazy load scenes
5. **Caching**: Long cache headers for static assets

## Development Workflow

### Local Development (Replit)
```bash
cd client
npm install
npm run dev
# Game runs at localhost:3000
```

### Testing
1. Test in browser (Chrome DevTools)
2. Check console for errors
3. Test on mobile (responsive)

### Deployment
```bash
git add .
git commit -m "Update"
git push origin main
# GitHub Actions auto-deploys
```

## Future Enhancements

### Phase 2 (Multiplayer)
- Firebase Authentication
- Real-time player sync
- Room-based matchmaking
- Chat system

### Phase 3 (Gameplay)
- Multiple agents with abilities
- Different weapons
- Power-ups and items
- Multiple maps

### Phase 4 (Polish)
- Animations and effects
- Sound effects and music
- Leaderboards and stats
- Mobile controls

## Security Considerations

### Firestore Rules
- All operations require authentication
- Users can only modify their own data
- Leaderboard is read-only for non-owners

### Cloud Functions
- Validate all inputs
- Rate limiting (future)
- Anti-cheat measures (future)

### Client Security
- No sensitive data in client code
- Firebase config is public (safe)
- Game logic validated server-side

## Performance Metrics

### Target Performance
- **FPS**: 60 (stable)
- **Load time**: <3 seconds
- **Input latency**: <50ms
- **Network latency**: <100ms (multiplayer)

### Monitoring
- Firebase Console: Usage statistics
- Browser DevTools: Performance profiling
- Lighthouse: Web vitals scoring

## Troubleshooting

### Common Issues
1. **Game doesn't load**: Check Firebase config
2. **Build fails**: Check Node.js version (18+)
3. **Deploy fails**: Verify GitHub secrets
4. **Firestore errors**: Check security rules

### Debug Tools
- Browser console (F12)
- Phaser debug mode (set `debug: true`)
- Firebase emulators (local testing)
- GitHub Actions logs

## Resources

### Documentation
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Docs](https://vitejs.dev/)

### Community
- [Phaser Discord](https://discord.gg/phaser)
- [Firebase Community](https://firebase.google.com/community)

### Learning
- [Phaser 3 Examples](https://phaser.io/examples)
- [Firebase Codelabs](https://firebase.google.com/codelabs)
