# Deploy Functions via Replit - Step by Step

## 🎯 Quick Guide for Your Setup

Since you can't install Node.js locally, use Replit to deploy Firebase Functions.

## 📋 One-Time Setup (5 minutes)

### Step 1: Open Replit

1. Go to [Replit.com](https://replit.com)
2. Import your GitHub repository OR upload your project files

### Step 2: Install Firebase CLI

In Replit Shell, run:
```bash
npm install -g firebase-tools
```

Wait for installation (~1 minute)

### Step 3: Login to Firebase

```bash
firebase login --no-localhost
```

**Important**: Use `--no-localhost` flag for Replit!

**What happens**:
1. You'll see a URL
2. Copy the URL
3. Open in new browser tab
4. Login with your Google account
5. Copy the authorization code
6. Paste back in Replit Shell
7. Press Enter

### Step 4: Set Firebase Project

```bash
firebase use tactical-shooter-16e81
```

You should see: `Now using project tactical-shooter-16e81`

## 🚀 Deploy Functions & Rules

### Deploy Everything:
```bash
firebase deploy --only functions,database
```

### Or Deploy Separately:

**Functions only:**
```bash
firebase deploy --only functions
```

**Database rules only:**
```bash
firebase deploy --only database
```

## ⏱️ Deployment Time

- **Functions**: ~3-4 minutes
- **Database Rules**: ~10 seconds
- **Total**: ~4 minutes

## 📊 What You'll See

### During Deployment:
```
=== Deploying to 'tactical-shooter-16e81'...

i  deploying functions
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (XX KB) for uploading
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 18 function onPlayerAction...
i  functions: creating Node.js 18 function onProjectileRequest...
i  functions: creating Node.js 18 function calculateDamage...
i  functions: creating Node.js 18 function onBombEvent...
i  functions: creating Node.js 18 function onRoundEnd...
✔  functions[onPlayerAction]: Successful create operation.
✔  functions[onProjectileRequest]: Successful create operation.
✔  functions[calculateDamage]: Successful create operation.
✔  functions[onBombEvent]: Successful create operation.
✔  functions[onRoundEnd]: Successful create operation.

✔  Deploy complete!
```

## ✅ Verify Deployment

### 1. Check Firebase Console

Go to: https://console.firebase.google.com/project/tactical-shooter-16e81/functions

You should see:
- ✅ onPlayerAction
- ✅ onProjectileRequest
- ✅ calculateDamage
- ✅ onBombEvent
- ✅ onRoundEnd
- ✅ createRoom
- ✅ joinRoom
- ✅ updateStats

### 2. Check Database Rules

Go to: https://console.firebase.google.com/project/tactical-shooter-16e81/database/rules

You should see updated rules with:
- `/rooms/{roomId}/gameState`
- `/rooms/{roomId}/serverState`
- `/rooms/{roomId}/serverEvents`

### 3. Test in Game

1. Open your game (Render.com URL)
2. Create multiplayer room
3. Press **B** to open buy menu
4. Purchase weapon
5. Shoot bullets
6. Check browser console - no errors!

## 🐛 Common Issues

### Issue: "Firebase command not found"

**Solution:**
```bash
npm install -g firebase-tools
```

### Issue: "Not authorized"

**Solution:**
```bash
firebase login --no-localhost
# Follow authentication flow again
```

### Issue: "Functions deployment failed"

**Solution:**
```bash
# Check Node.js version
node --version  # Should be 18

# Reinstall dependencies
cd functions
rm -rf node_modules
npm install
cd ..

# Try again
firebase deploy --only functions
```

### Issue: "Billing account required"

**Solution:**
- Cloud Functions require Firebase Blaze plan (pay-as-you-go)
- Go to Firebase Console → Upgrade to Blaze
- Add payment method
- Cost: ~$12/month for 10 active players

## 💰 Enable Blaze Plan

### Why You Need It:
- Cloud Functions require Blaze plan
- Free tier doesn't support Cloud Functions
- Realtime Database free tier is too small

### How to Enable:

1. Go to [Firebase Console](https://console.firebase.google.com/project/tactical-shooter-16e81/overview)
2. Click "Upgrade" button (bottom left)
3. Select "Blaze" plan
4. Add payment method (credit/debit card)
5. Set budget alert (optional but recommended)
   - Recommended: $20/month alert
6. Confirm upgrade

### Cost Estimate:
- **Cloud Functions**: ~$2/month
- **Realtime Database**: ~$10/month
- **Total**: ~$12/month for 10 active players

### Free Tier Included:
Even on Blaze plan, you get:
- 2M function invocations/month free
- 10 GB database download/month free
- You only pay for usage above free tier

## 📝 Replit Commands Cheat Sheet

```bash
# Install Firebase CLI (one time)
npm install -g firebase-tools

# Login (one time)
firebase login --no-localhost

# Set project (one time)
firebase use tactical-shooter-16e81

# Deploy functions
firebase deploy --only functions

# Deploy database rules
firebase deploy --only database

# Deploy both
firebase deploy --only functions,database

# View logs
firebase functions:log

# Check current project
firebase projects:list
```

## 🔄 Regular Workflow

### When You Update Server Code:

1. **Edit** `functions/index.js` on your PC
2. **Push** to GitHub
3. **Open** Replit
4. **Pull** latest changes (if needed)
5. **Deploy**:
   ```bash
   firebase deploy --only functions
   ```
6. **Wait** ~3 minutes
7. **Test** in game

### When You Update Client Code:

1. **Edit** client files on your PC
2. **Push** to GitHub
3. **Render** auto-deploys (no Replit needed!)
4. **Test** in game

## ✅ Success Checklist

Setup:
- [ ] Replit account created
- [ ] Project imported/uploaded
- [ ] Firebase CLI installed
- [ ] Logged into Firebase
- [ ] Project set to tactical-shooter-16e81
- [ ] Blaze plan enabled

Deployment:
- [ ] Functions deployed successfully
- [ ] Database rules deployed
- [ ] No errors in console
- [ ] Functions visible in Firebase Console

Testing:
- [ ] Game loads
- [ ] Buy menu works (B key)
- [ ] Can purchase weapons
- [ ] Shooting works
- [ ] Server validates actions

## 🎉 You're Done!

Now you can:
- ✅ Edit code on your PC
- ✅ Push to GitHub
- ✅ Client auto-deploys via Render
- ✅ Functions deploy via Replit
- ✅ No local Node.js needed!

---

**Next time you need to deploy functions:**
1. Open Replit
2. Run: `firebase deploy --only functions`
3. Wait 3 minutes
4. Done! 🚀
