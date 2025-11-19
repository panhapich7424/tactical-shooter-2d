# Quick Deploy Reference

## 🚀 Deploy Client (Automatic)

```bash
git add .
git commit -m "Your message"
git push origin main
```

✅ Render.com auto-deploys in 2-3 minutes

## 🔧 Deploy Server (Manual via Replit)

```bash
firebase deploy --only functions,database
```

✅ Functions deploy in 3-4 minutes

## 📋 Complete Commands

### First Time Setup (Replit)
```bash
npm install -g firebase-tools
firebase login --no-localhost
firebase use tactical-shooter-16e81
```

### Deploy Functions Only
```bash
firebase deploy --only functions
```

### Deploy Rules Only
```bash
firebase deploy --only database
```

### Deploy Both
```bash
firebase deploy --only functions,database
```

### View Logs
```bash
firebase functions:log
```

## ✅ Quick Checklist

Client Update:
- [ ] Code edited
- [ ] Committed to git
- [ ] Pushed to GitHub
- [ ] Render deployed (check dashboard)

Server Update:
- [ ] Code edited
- [ ] Committed to git
- [ ] Pushed to GitHub
- [ ] Opened Replit
- [ ] Ran `firebase deploy --only functions`
- [ ] Verified in Firebase Console

## 🔗 Quick Links

- **Game**: https://tactical-shooter-2d.onrender.com
- **Render Dashboard**: https://dashboard.render.com
- **Firebase Console**: https://console.firebase.google.com/project/tactical-shooter-16e81
- **Replit**: https://replit.com
- **GitHub Repo**: https://github.com/YOUR_USERNAME/tactical-shooter-2d

## 💡 Pro Tips

- Client changes: Just push to GitHub ✅
- Server changes: Push + deploy via Replit ⚠️
- Test locally in Replit before deploying
- Check logs if something breaks
- Render deploys automatically, no action needed

## 🐛 Quick Fixes

### Render build fails
```bash
# Test in Replit
cd client
npm install
npm run build
```

### Functions fail
```bash
# In Replit
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

### Game not working
1. Check browser console (F12)
2. Check Firebase Console → Functions
3. Check Render logs
4. Redeploy everything

---

**Remember**: Client = GitHub → Render (auto) | Server = Replit → Firebase (manual)
