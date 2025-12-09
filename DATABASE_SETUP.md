# 🗄️ Database Setup Guide

## Option 1: Using Railway Web Interface (If Available)

1. Railway → Postgres → Database → Data tab
2. Look for "Query" or "SQL Editor" button
3. Copy contents of `server/src/schema.sql`
4. Paste and execute

---

## Option 2: Using Railway CLI (Recommended)

### Step 1: Install Railway CLI

```powershell
npm install -g @railway/cli
```

### Step 2: Login to Railway

```powershell
railway login
```

This will open a browser to authenticate.

### Step 3: Link to Your Project

```powershell
cd "C:\Users\GOWRISH CHANDRAN\OneDrive\Desktop\Project\AUCTION\server"
railway link
```

Select your project: `IPL-AUCTION`

### Step 4: Run Schema

```powershell
railway run --service postgres psql -f src/schema.sql
```

Or connect to database and run manually:

```powershell
railway connect postgres
```

Then paste the schema SQL.

---

## Option 3: Connect from Local Machine

### Get Database URL from Railway

1. Railway → Postgres → Variables
2. Copy `DATABASE_URL`

### Run Schema Locally

```powershell
cd server
# Set environment variable
$env:DATABASE_URL="paste-your-database-url-here"

# Run schema using psql (if installed)
# Or use a tool like pgAdmin, DBeaver, or TablePlus
```

---

## 📋 What the Schema Creates:

- ✅ `users` table (for authentication)
- ✅ `auction_sessions` table (for multiplayer rooms)
- ✅ `session_participants` table (who's in which room)
- ✅ `players` table (30 cricket players)
- ✅ `bids` table (bid history)
- ✅ `player_results` table (auction results)

---

## 🚀 After Schema is Created:

1. Restart your backend service in Railway
2. Test the health endpoint
3. Try registering on your app!

---

Choose the option that works best for you!
