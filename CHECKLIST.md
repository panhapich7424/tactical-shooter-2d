# Complete Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Deployment Checklist

### Firebase Configuration
- [ ] Firebase project created
- [ ] Project name recorded: `_______________`
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created (test mode)
- [ ] Firebase Hosting enabled
- [ ] Firebase config copied from console
- [ ] `firebase/firebase-config.js` updated with real values
- [ ] `.firebaserc` updated with project ID

### GitHub Configuration
- [ ] GitHub account created/logged in
- [ ] New repository created (public)
- [ ] Repository name: `_______________`
- [ ] Local git initialized
- [ ] Remote origin added
- [ ] Initial commit made
- [ ] Code pushed to main branch

### GitHub Secrets
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret added
  - [ ] Downloaded service account JSON from Firebase
  - [ ] Copied entire JSON content to secret
- [ ] `FIREBASE_PROJECT_ID` secret added
  - [ ] Matches Firebase project ID exactly

### Code Verification
- [ ] All files present (see structure below)
- [ ] No syntax errors in JavaScript files
- [ ] Firebase config has no placeholder values
- [ ] `.gitignore` includes node_modules and dist

## 🚀 Deployment Checklist

### GitHub Actions
- [ ] Workflow file exists: `.github/workflows/deploy.yml`
- [ ] Push to main branch triggered workflow
- [ ] Workflow status: ✅ Success / ❌ Failed
- [ ] Build step completed successfully
- [ ] Deploy step completed successfully
- [ ] No errors in Actions logs

### Firebase Hosting
- [ ] Deployment visible in Firebase Console
- [ ] Hosting URL accessible: `https://_____.web.app`
- [ ] Game loads without errors
- [ ] No 404 errors for assets

## 🎮 Game Testing Checklist

### Basic Functionality
- [ ] Game loads in browser
- [ ] Menu screen displays correctly
- [ ] "PLAY" button works
- [ ] Game scene loads
- [ ] Player sprite visible
- [ ] Map/tiles render correctly

### Controls
- [ ] W key moves player up
- [ ] A key moves player left
- [ ] S key moves player down
- [ ] D key moves player right
- [ ] Diagonal movement works smoothly
- [ ] Player rotates toward mouse cursor
- [ ] Left click shoots bullet
- [ ] Bullets travel in correct direction
- [ ] Bullets collide with walls

### UI Elements
- [ ] Health display visible
- [ ] Ammo counter visible
- [ ] UI stays on screen (doesn't scroll)
- [ ] Text is readable

### Performance
- [ ] Game runs at 60 FPS
- [ ] No lag or stuttering
- [ ] Smooth movement
- [ ] Responsive controls

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive (optional)

## 🔧 Development Environment Checklist

### Replit Setup (if using)
- [ ] Project imported to Replit
- [ ] `.replit` file recognized
- [ ] Run button starts dev server
- [ ] Webview shows game
- [ ] Hot reload works on file changes

### Local Development (if using)
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed
- [ ] Logged into Firebase CLI
- [ ] `npm install` completed in client/
- [ ] `npm install` completed in functions/
- [ ] `npm run dev` starts dev server
- [ ] Game accessible at localhost:3000

## 📁 File Structure Verification

### Root Directory
- [ ] README.md
- [ ] SETUP_GUIDE.md
- [ ] DEPLOYMENT.md
- [ ] QUICKSTART.md
- [ ] PROJECT_STRUCTURE.md
- [ ] CHECKLIST.md (this file)
- [ ] .gitignore
- [ ] .firebaserc
- [ ] firebase.json
- [ ] firestore.rules
- [ ] firestore.indexes.json
- [ ] .replit
- [ ] deploy.sh

### Client Directory
- [ ] client/index.html
- [ ] client/main.js
- [ ] client/package.json
- [ ] client/vite.config.js
- [ ] client/scenes/BootScene.js
- [ ] client/scenes/MenuScene.js
- [ ] client/scenes/GameScene.js
- [ ] client/assets/.gitkeep
- [ ] client/assets/README.md

### Functions Directory
- [ ] functions/index.js
- [ ] functions/package.json

### Firebase Directory
- [ ] firebase/firebase-config.js

### GitHub Directory
- [ ] .github/workflows/deploy.yml

## 🔍 Troubleshooting Checklist

### If Game Won't Load
- [ ] Check browser console (F12) for errors
- [ ] Verify Firebase config is correct
- [ ] Check network tab for failed requests
- [ ] Clear browser cache and reload
- [ ] Try incognito/private browsing mode

### If Build Fails
- [ ] Check Node.js version (should be 18+)
- [ ] Delete node_modules and reinstall
- [ ] Check for syntax errors in JS files
- [ ] Verify all imports are correct
- [ ] Check Vite config is valid

### If Deploy Fails
- [ ] Verify GitHub secrets are set correctly
- [ ] Check Firebase project ID matches
- [ ] Ensure Firebase Hosting is enabled
- [ ] Check GitHub Actions logs for errors
- [ ] Verify service account JSON is valid

### If Functions Fail
- [ ] Check functions/package.json is valid
- [ ] Verify Node.js version is 18
- [ ] Check function syntax (ES modules)
- [ ] Review Firebase Functions logs
- [ ] Ensure Firestore is enabled

## 📊 Post-Deployment Verification

### Firebase Console Checks
- [ ] Hosting shows recent deployment
- [ ] Firestore database exists
- [ ] Authentication is enabled
- [ ] Functions are deployed (if applicable)
- [ ] Usage is within free tier limits

### GitHub Checks
- [ ] Latest commit shows green checkmark
- [ ] Actions tab shows successful workflow
- [ ] No failed deployments
- [ ] Repository is public (for free Actions)

### Live Site Checks
- [ ] HTTPS enabled (automatic)
- [ ] No mixed content warnings
- [ ] Fast load time (<3 seconds)
- [ ] No console errors
- [ ] All assets load correctly

## 🎯 Phase 1 Completion Criteria

### Must Have (MVP)
- [x] Project structure created
- [x] Phaser 3 game engine integrated
- [x] Vite build system configured
- [x] Firebase hosting setup
- [x] GitHub Actions deployment
- [x] WASD movement working
- [x] Mouse aiming working
- [x] Shooting mechanics working
- [x] Top-down tilemap rendering
- [x] Collision detection working
- [x] Basic UI elements

### Documentation
- [x] README.md with overview
- [x] SETUP_GUIDE.md with detailed steps
- [x] DEPLOYMENT.md with deploy instructions
- [x] QUICKSTART.md for fast setup
- [x] PROJECT_STRUCTURE.md with architecture
- [x] CHECKLIST.md (this file)
- [x] Asset documentation

### Configuration Files
- [x] Firebase config template
- [x] Firestore rules
- [x] GitHub Actions workflow
- [x] Replit configuration
- [x] Git ignore file
- [x] Deployment script

## 🚀 Ready for Phase 2?

Before moving to multiplayer features, ensure:
- [ ] All Phase 1 items checked above
- [ ] Game is live and accessible
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Code is committed to GitHub
- [ ] Documentation is complete

## 📝 Notes Section

Use this space to track your specific configuration:

**Firebase Project ID:** `_______________`

**GitHub Repository:** `_______________`

**Live URL:** `https://_______________`

**Deployment Date:** `_______________`

**Issues Encountered:**
- 
- 
- 

**Solutions Applied:**
- 
- 
- 

## ✅ Final Sign-Off

- [ ] All critical items checked
- [ ] Game is playable
- [ ] Deployment is automated
- [ ] Documentation is clear
- [ ] Ready to proceed to Phase 2

**Completed by:** `_______________`

**Date:** `_______________`

---

🎉 **Congratulations!** Phase 1 is complete when all items are checked!
