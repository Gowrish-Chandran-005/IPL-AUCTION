# IPL Auction - Deployment Guide

## 🚀 Deploy Your App (So Friends Can Play!)

### Prerequisites
1. GitHub account
2. Railway account (free): https://railway.app/
3. Vercel account (free): https://vercel.com/

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
cd "C:\Users\GOWRISH CHANDRAN\OneDrive\Desktop\Project\AUCTION"
git init
git add .
git commit -m "IPL Auction App - Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ipl-auction.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Sign up for Railway
1. Go to https://railway.app/
2. Click "Login with GitHub"
3. Authorize Railway

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `ipl-auction` repository
4. Railway will detect the Node.js app

### 2.3 Configure Backend
1. Click on your service
2. Go to "Settings" → "Root Directory"
3. Set to: `server`
4. Click "Variables" tab
5. Add these environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-12345
   FRONTEND_URL=https://your-app.vercel.app
   ```

### 2.4 Add PostgreSQL Database
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway automatically creates `DATABASE_URL`
3. Your backend will connect automatically!

### 2.5 Get Backend URL
1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL!** You'll need it for frontend

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign up for Vercel
1. Go to https://vercel.com/
2. Click "Sign Up" → "Continue with GitHub"

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will detect it's a Vite app

### 3.3 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.4 Add Environment Variable
1. Click "Environment Variables"
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-backend.up.railway.app/api
   ```
   (Use the Railway URL from Step 2.5)

### 3.5 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://ipl-auction.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to Railway
2. Update `FRONTEND_URL` variable to your Vercel URL:
   ```
   FRONTEND_URL=https://ipl-auction.vercel.app
   ```
3. Backend will redeploy automatically

---

## Step 5: Seed Database

### Option A: Using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed command
railway run npm run seed
```

### Option B: Manual SQL
1. Go to Railway → PostgreSQL → "Data" tab
2. Click "Query"
3. Copy contents of `server/src/schema.sql`
4. Run the query
5. Then run seed script locally pointing to Railway DB

---

## 🎉 You're Live!

**Share this with friends:**
```
🏏 IPL Auction App
🌐 https://ipl-auction.vercel.app

1. Register an account
2. Create or join a room
3. Start bidding!
```

---

## 🧪 Test Multiplayer

1. **You**: Open `https://ipl-auction.vercel.app`
2. **Friend**: Open same URL on their phone/computer
3. **You**: Create room → Get code (e.g., "A3F7B2C1")
4. **Friend**: Join room → Enter code
5. **Both**: Select different teams
6. **You** (host): Click "Start Auction"
7. **Both**: Bid in real-time! 🎉

---

## 💰 Cost

- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (unlimited)
- **Total**: $0/month ✅

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel
- Check `FRONTEND_URL` in Railway
- Make sure both URLs match

### "Database connection failed"
- Railway auto-creates `DATABASE_URL`
- Check it exists in Railway variables

### "Players not loading"
- Run the seed script
- Check Railway logs for errors

---

## 📱 Mobile Access

Your friends can access from:
- ✅ Phone browsers (Chrome, Safari)
- ✅ Tablets
- ✅ Desktop computers
- ✅ Anywhere with internet!

---

Need help? Let me know which step you're on!
