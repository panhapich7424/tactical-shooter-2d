# Deployment Guide: Render.com + Firebase

## Your Setup
- **Client Hosting**: Render.com (auto-deploys from GitHub)
- **Cloud Functions**: Firebase (manual deploy)
- **Database**: Firebase Realtime Database (manual deploy rules)

## 🚀 Complete Deployment Process

### Step 1: Push Client to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add Phases 3-5: Game loop and server authority"

# Push to GitHub
git push origin main
```

**Result**: Render.com automatically detects changes and deploys your client (~2-3 minutes)

### Step 2: Deploy Firebase Functions (One-Time Setup)

You need to do this from a computer with Node.js OR use Replit:

#### Option A: Using Replit (Recommended for you)

1. **Open your project in Replit**
2. **Open Shell terminal**
3. **Run these commands:**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase (use --no-localhost for Replit)
firebase login --no-localhost

# Follow the URL, login, paste the code back

# Deploy functions
firebase deploy --only functions

# Deploy database rules
firebase deploy --only database
```

#### Option B: Using GitHub Codespaces (Alternative)

1. Go to your GitHub repo
2. Click "Code" → "Codespaces" → "Create codespace"
3. Run the same commands as above

### Step 3: Verify Deployment

1. **Check Render.com**: 
   - Go to your Render dashboard
   - Verify build completed successfully
   - Open your game URL

2. **Check Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/tactical-shooter-16e81/functions)
   - Verify functions are deployed
   - Check "Realtime Database" → "Rules" tab

## 📋 What Gets Deployed Where

### Render.com (Automatic via GitHub)
```
✅ Client code (HTML, JS, CSS)
✅ Game scenes
✅ UI components
✅ Network code
✅ Assets
```

### Firebase (Manual Deploy)
```
⚠️ Cloud Functions (server logic)
⚠️ Database Rules (security)
```

## 🔧 One-Time Firebase Setup in Replit

### First Time Only:

```bash
# 1. Install Firebase CLI globally
npm install -g firebase-tools

# 2. Login to Firebase
firebase login --no-localhost
# Copy the URL, open in browser, login, paste code back

# 3. Initialize project (if not done)
firebase use tactical-shooter-16e81

# 4. Deploy everything
firebase deploy --only functions,database
```

### Future Updates:

```bash
# Just deploy functions and rules
firebase deploy --only functions,database
```

## 🎯 Typical Workflow

### When You Make Changes:

1. **Client Changes** (scenes, UI, network):
   ```bash
   git add .
   git commit -m "Update client"
   git push
   # Render auto-deploys ✅
   ```

2. **Server Changes** (functions, rules):
   ```bash
   # In Replit Shell:
   firebase deploy --only functions,database
   # Manual deploy ⚠️
   ```

3. **Both Client & Server**:
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Update client and server"
   git push
   
   # Then deploy functions in Replit
   firebase deploy --only functions,database
   ```

## 🐛 Troubleshooting

### "Firebase command not found" in Replit

```bash
npm install -g firebase-tools
```

### "Not logged in" error

```bash
firebase login --no-localhost
# Follow the authentication flow
```

### Functions deployment fails

```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
cd functions
rm -rf node_modules
npm install
cd ..

# Try again
firebase deploy --only functions
```

### Render build fails

**Check**:
- Build command in Render: `cd client && npm install && npm run build`
- Publish directory: `client/dist`
- All files pushed to GitHub

**Fix**:
```bash
# Test build locally in Replit
cd client
npm install
npm run build
# If successful, push to GitHub
```

## 📊 Deployment Checklist

### Initial Setup (One Time)
- [ ] GitHub repository created
- [ ] Render.com connected to GitHub
- [ ] Firebase CLI installed in Replit
- [ ] Logged into Firebase CLI
- [ ] Functions deployed
- [ ] Database rules deployed

### Every Update
- [ ] Code changes committed
- [ ] Pushed to GitHub
- [ ] Render build successful
- [ ] Functions deployed (if changed)
- [ ] Database rules deployed (if changed)
- [ ] Game tested

## 💡 Pro Tips

### 1. Test Locally First (in Replit)
```bash
cd client
npm run dev
# Test in Replit webview
```

### 2. Check Render Logs
- Go to Render dashboard
- Click your service
- View "Logs" tab
- Check for build errors

### 3. Check Firebase Logs
```bash
firebase functions:log
```

### 4. Separate Commits
```bash
# Client changes
git commit -m "Update UI"

# Server changes  
git commit -m "Update functions"
```

## 🎮 Quick Deploy Commands

### Deploy Everything:
```bash
# 1. Client (GitHub → Render)
git add .
git commit -m "Update game"
git push

# 2. Server (Replit → Firebase)
firebase deploy --only functions,database
```

### Deploy Only Functions:
```bash
firebase deploy --only functions
```

### Deploy Only Rules:
```bash
firebase deploy --only database
```

## 📱 Mobile Workflow

Since you can't install Node.js locally:

1. **Edit code** on your PC
2. **Push to GitHub** via GitHub Desktop or web interface
3. **Deploy functions** via Replit or GitHub Codespaces
4. **Render auto-deploys** the client

## ✅ Success Indicators

### Render.com
```
✅ Build: Successful
✅ Deploy: Live
✅ Status: Running
```

### Firebase Console
```
✅ Functions: 8 deployed
✅ Database Rules: Updated
✅ Status: Healthy
```

### Your Game
```
✅ Loads without errors
✅ Multiplayer works
✅ Buy menu opens (B key)
✅ Server validates actions
```

## 🚀 You're All Set!

Your deployment workflow:
1. **Code on PC** → Push to GitHub
2. **Render** → Auto-deploys client
3. **Replit** → Deploy functions manually
4. **Done!** 🎉

---

**Client**: Render.com (automatic)
**Server**: Firebase (manual via Replit)
**Cost**: ~$12/month (Firebase Blaze plan)
