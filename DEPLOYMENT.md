# Deployment Instructions

## Quick Deploy Checklist

- [ ] Firebase project created
- [ ] Firebase config updated in `/firebase/firebase-config.js`
- [ ] `.firebaserc` updated with project ID
- [ ] GitHub repository created
- [ ] GitHub secrets configured
- [ ] Code pushed to main branch
- [ ] GitHub Actions completed successfully
- [ ] Game accessible at Firebase hosting URL

## Deployment Methods

### Method 1: GitHub Actions (Automated) ⭐ RECOMMENDED

**Advantages:**
- Fully automated
- No local setup needed
- Deploys on every push to main
- Free for public repos

**Steps:**
1. Configure GitHub secrets (see SETUP_GUIDE.md)
2. Push code to main branch:
```bash
git push origin main
```
3. Monitor deployment in GitHub Actions tab
4. Game deploys to: `https://YOUR_PROJECT_ID.web.app`

### Method 2: Replit Manual Deploy

**Advantages:**
- Good for testing
- No GitHub needed
- Direct control

**Steps:**
1. Open project in Replit
2. Open Shell
3. Run deployment script:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login --no-localhost

# Build client
cd client
npm install
npm run build
cd ..

# Deploy everything
firebase deploy
```

### Method 3: Local Machine (if Node.js available)

**Steps:**
```bash
# Install dependencies
cd client
npm install
cd ../functions
npm install
cd ..

# Build client
cd client
npm run build
cd ..

# Deploy
firebase login
firebase deploy
```

## Deployment Targets

### Deploy Everything
```bash
firebase deploy
```

### Deploy Hosting Only
```bash
firebase deploy --only hosting
```

### Deploy Functions Only
```bash
firebase deploy --only functions
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## Environment-Specific Deploys

### Production
```bash
firebase deploy --project production
```

### Staging (if configured)
```bash
firebase deploy --project staging
```

## Rollback

### View Previous Releases
```bash
firebase hosting:channel:list
```

### Rollback to Previous Version
1. Go to Firebase Console > Hosting
2. Click on "Release history"
3. Find previous working version
4. Click "Rollback"

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Triggers on:**
   - Push to main branch
   - Manual workflow dispatch

2. **Build steps:**
   - Checkout code
   - Setup Node.js 18
   - Install client dependencies
   - Build client (Vite)
   - Install functions dependencies
   - Deploy to Firebase

3. **Secrets required:**
   - `GITHUB_TOKEN` (automatic)
   - `FIREBASE_SERVICE_ACCOUNT` (manual setup)
   - `FIREBASE_PROJECT_ID` (manual setup)

## Monitoring Deployments

### GitHub Actions
- Go to repository > Actions tab
- View workflow runs
- Check logs for errors

### Firebase Console
- Go to Hosting section
- View deployment history
- Check usage statistics

### Firebase CLI
```bash
# View recent deployments
firebase hosting:channel:list

# View function logs
firebase functions:log
```

## Post-Deployment Verification

### 1. Check Hosting
```bash
curl https://YOUR_PROJECT_ID.web.app
```

### 2. Test Game Load
- Open browser
- Navigate to hosting URL
- Check browser console for errors
- Test game controls

### 3. Verify Functions
```bash
# Test createRoom function
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/createRoom \
  -H "Content-Type: application/json" \
  -d '{"hostId":"test123","roomName":"Test Room"}'
```

### 4. Check Firestore Rules
- Try reading/writing data
- Verify authentication works
- Test security rules

## Troubleshooting Deployments

### Build Fails
**Error:** `npm install` fails
**Solution:** Delete `node_modules` and `package-lock.json`, reinstall

**Error:** Vite build fails
**Solution:** Check for syntax errors in JS files

### Deploy Fails
**Error:** "Permission denied"
**Solution:** Re-authenticate with `firebase login`

**Error:** "Project not found"
**Solution:** Update `.firebaserc` with correct project ID

**Error:** GitHub Actions fails
**Solution:** Verify secrets are set correctly

### Runtime Errors
**Error:** Game doesn't load
**Solution:** Check Firebase config in `firebase-config.js`

**Error:** Functions timeout
**Solution:** Increase timeout in `firebase.json`

**Error:** Firestore permission denied
**Solution:** Update `firestore.rules`

## Performance Optimization

### Client Build
- Vite automatically minifies code
- Phaser is code-split in `vite.config.js`
- Assets are cached with long max-age

### Firebase Hosting
- CDN automatically enabled
- Gzip compression enabled
- HTTP/2 enabled by default

### Cloud Functions
- Use Node.js 18 (faster cold starts)
- Keep functions small and focused
- Use Firestore batch operations

## Cost Monitoring

### Stay Within Free Tier
- Monitor Firebase Console > Usage tab
- Set up budget alerts
- Optimize Firestore queries
- Cache static assets

### Free Tier Limits
- Hosting: 10GB storage, 360MB/day transfer
- Firestore: 50K reads, 20K writes, 20K deletes per day
- Functions: 2M invocations, 400K GB-seconds per month

## Backup Strategy

### Code Backup
- GitHub repository (automatic)
- Clone locally periodically

### Database Backup
```bash
# Export Firestore data
firebase firestore:export gs://YOUR_BUCKET/backups/$(date +%Y%m%d)
```

### Automated Backups
- Set up scheduled Cloud Function
- Export to Cloud Storage
- Keep 7 days of backups
