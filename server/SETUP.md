# Quick Setup Guide - Run These Commands

## Step 1: Create .env file
Create a file named `.env` in the `server` folder with this content:

```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ipl_auction
JWT_SECRET=ipl-auction-super-secret-key-2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
```

**IMPORTANT**: Replace `YOUR_PASSWORD` with your PostgreSQL password!

## Step 2: Create Database and Tables

Open **PowerShell** and run:

```powershell
# Navigate to server folder
cd "C:\Users\GOWRISH CHANDRAN\OneDrive\Desktop\Project\AUCTION\server"

# Create database (enter your PostgreSQL password when prompted)
& "C:\Program Files\PostgreSQL\13\bin\psql.exe" -U postgres -c "CREATE DATABASE ipl_auction;"

# Create tables
& "C:\Program Files\PostgreSQL\13\bin\psql.exe" -U postgres -d ipl_auction -f "src\schema.sql"
```

## Step 3: Seed Player Data

```powershell
npm run seed
```

## Step 4: Start the Server

```powershell
npm run dev
```

You should see:
```
Server running on port 5000
Socket.io ready for connections
Connected to PostgreSQL database
```

## Test It!

Open browser: http://localhost:5000/health

You should see: `{"status":"ok","message":"IPL Auction Server is running"}`

---

## If Database Already Exists

If you get "database already exists" error, that's fine! Just skip to creating tables:

```powershell
& "C:\Program Files\PostgreSQL\13\bin\psql.exe" -U postgres -d ipl_auction -f "src\schema.sql"
```
