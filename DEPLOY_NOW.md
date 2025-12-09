# 🚀 Deploy Your IPL Auction App - EASY METHOD

## Part 1: Deploy Frontend (5 minutes)

### Step 1: Push to GitHub

```bash
# Open PowerShell in your project folder
cd "C:\Users\GOWRISH CHANDRAN\OneDrive\Desktop\Project\AUCTION"

# Initialize git (if not done)
git init
git add .
git commit -m "IPL Auction App"

# Create repo on GitHub:
# 1. Go to https://github.com/new
# 2. Name: ipl-auction
# 3. Click "Create repository"

# Then run these commands (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/ipl-auction.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com/signup
2. **Click**: "Continue with GitHub"
3. **Authorize** Vercel
4. **Click**: "Add New..." → "Project"
5. **Import** your `ipl-auction` repository
6. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: **./** (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. **Environment Variables** → Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
   (We'll get this URL in Part 2, for now use: `http://localhost:5000/api`)
8. **Click "Deploy"**
9. **Wait 2-3 minutes**
10. **Copy your URL**: `https://ipl-auction-xxx.vercel.app`

✅ **Frontend is LIVE!**

---

## Part 2: Deploy Backend (10 minutes)

### Step 1: Sign up for Railway

1. **Go to**: https://railway.app/
2. **Click**: "Login with GitHub"
3. **Authorize** Railway

### Step 2: Create New Project

1. **Click**: "New Project"
2. **Select**: "Deploy from GitHub repo"
3. **Choose**: your `ipl-auction` repository
4. **Click** on the service that was created

### Step 3: Configure Backend

1. **Go to**: "Settings" tab
2. **Root Directory**: Set to `server`
3. **Click**: "Redeploy"

### Step 4: Add PostgreSQL Database

1. **Click**: "New" → "Database" → "Add PostgreSQL"
2. Railway automatically creates `DATABASE_URL` variable
3. Your backend will connect automatically!

### Step 5: Add Environment Variables

1. **Click** on your backend service
2. **Go to**: "Variables" tab
3. **Add these**:
   ```
   NODE_ENV = production
   JWT_SECRET = ipl-auction-secret-key-change-this-12345
   FRONTEND_URL = https://ipl-auction-xxx.vercel.app
   ```
   (Use your Vercel URL from Part 1)

### Step 6: Generate Public URL

1. **Go to**: "Settings" → "Networking"
2. **Click**: "Generate Domain"
3. **Copy the URL**: `https://ipl-auction-production.up.railway.app`

✅ **Backend is LIVE!**

### Step 7: Seed Database

1. **Go to**: Railway → PostgreSQL service → "Data" tab
2. **Click**: "Query"
3. **Copy** contents of `server/src/schema.sql`
4. **Paste** and **Execute**
5. **Then** run seed:
   - Option A: Install Railway CLI and run `railway run npm run seed`
   - Option B: Manually insert player data via SQL

---

## Part 3: Connect Frontend to Backend

1. **Go back to Vercel**
2. **Your Project** → "Settings" → "Environment Variables"
3. **Edit** `VITE_API_URL`:
   ```
   VITE_API_URL = https://ipl-auction-production.up.railway.app/api
   ```
4. **Go to**: "Deployments" tab
5. **Click**: "Redeploy" on latest deployment

✅ **Everything is CONNECTED!**

---

## Part 4: Update Backend CORS

1. **Go to Railway** → Backend service → "Variables"
2. **Update** `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL = https://ipl-auction-xxx.vercel.app
   ```
3. Backend will auto-redeploy

---

## 🎉 YOU'RE LIVE!

**Share this with friends:**
```
🏏 IPL Auction App
🌐 https://ipl-auction-xxx.vercel.app

1. Register an account
2. Create or join a room
3. Start bidding!
```

---

## 🧪 Test It

1. Open your Vercel URL
2. Register an account
3. Create a multiplayer room
4. Share room code with friend
5. Friend opens same URL, joins room
6. Both bid in real-time!

---

## 💰 Cost

- Vercel: **FREE** (unlimited)
- Railway: **FREE** ($5 credit/month, enough for this app)
- Total: **$0/month** ✅

---

## 🐛 Common Issues

### "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel matches Railway URL
- Check `FRONTEND_URL` in Railway matches Vercel URL

### "Players not loading"
- Run the database seed script
- Check Railway logs for errors

### "CORS error"
- Make sure `FRONTEND_URL` in Railway is correct
- Should NOT have trailing slash

---

Need help? Let me know which step you're stuck on!
