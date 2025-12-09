# Quick Deploy Script

## Fastest Way to Deploy

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy Frontend
```bash
cd "C:\Users\GOWRISH CHANDRAN\OneDrive\Desktop\Project\AUCTION"
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **ipl-auction**
- Directory? **./
** (just press Enter)
- Override settings? **N**

You'll get a URL like: `https://ipl-auction-xxx.vercel.app`

### 3. Deploy Backend to Railway

**Option A: Using Railway Button (Easiest)**
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repo
4. Set root directory to `server`
5. Add PostgreSQL database
6. Add environment variables

**Option B: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to server folder
cd server

# Initialize and deploy
railway init
railway up

# Add PostgreSQL
railway add

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
railway variables set FRONTEND_URL=https://your-vercel-url.vercel.app
```

### 4. Update Frontend Environment

```bash
# In Vercel dashboard, add environment variable:
# VITE_API_URL = https://your-railway-url.up.railway.app/api

# Or via CLI:
vercel env add VITE_API_URL
# Enter: https://your-railway-url.up.railway.app/api
# Select: Production

# Redeploy
vercel --prod
```

### 5. Seed Database

```bash
cd server
railway run npm run seed
```

## Done! 🎉

Share with friends:
- Frontend: `https://ipl-auction.vercel.app`
- They can register and join your rooms!

## Alternative: Quick Test with ngrok (Temporary)

If you just want to test quickly without deploying:

```bash
# Install ngrok
# Download from: https://ngrok.com/download

# Expose backend
ngrok http 5000

# You'll get a URL like: https://abc123.ngrok.io
# Share this with friends (temporary, expires when you close ngrok)
```

Then your friends can access:
- Your computer's IP on local network
- Or the ngrok URL

**Note**: ngrok is temporary and requires your computer to stay on!
