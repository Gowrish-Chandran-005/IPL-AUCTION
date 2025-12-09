# IPL Auction Backend - Complete Setup Guide

## What I've Built

✅ **Complete Backend Server** with:
- Express.js + TypeScript
- PostgreSQL database with 6 tables
- Authentication system (JWT)
- Session management API
- Player data API
- Socket.io for real-time bidding (ready)
- Database seeding script

## Quick Start Guide

### Step 1: Install PostgreSQL

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. **Remember the password** you set for the `postgres` user
4. Keep the default port: `5432`

### Step 2: Create Database

Open **Command Prompt** or **PowerShell** and run:

```bash
# Login to PostgreSQL
psql -U postgres

# You'll be prompted for the password you set during installation
# Then create the database:
CREATE DATABASE ipl_auction;

# Exit psql
\q
```

**Alternative (Using pgAdmin GUI):**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → "Create" → "Database"
3. Name: `ipl_auction`
4. Click "Save"

### Step 3: Run Database Schema

```bash
# Navigate to server directory
cd server

# Run the schema file to create tables
psql -U postgres -d ipl_auction -f src/schema.sql
```

This creates 6 tables:
- `users` - User accounts
- `auction_sessions` - Auction rooms
- `session_participants` - Users in sessions
- `players` - Player data
- `bids` - Bid history
- `player_results` - Final outcomes

### Step 4: Configure Environment

```bash
# Copy the example file
copy .env.example .env

# Edit .env file (use Notepad or VS Code)
notepad .env
```

Update these values in `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/ipl_auction
JWT_SECRET=change-this-to-any-random-long-string
NODE_ENV=development
```

Replace `YOUR_PASSWORD_HERE` with your PostgreSQL password.

### Step 5: Seed Player Data

```bash
# Still in the server directory
npm run seed
```

You should see:
```
🌱 Starting player seeding...
✅ Successfully seeded 30 players!
✅ Seeding complete
```

### Step 6: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📡 Socket.io ready for connections
✅ Connected to PostgreSQL database
```

## Testing the API

### 1. Test Health Check

Open browser and go to: http://localhost:5000/health

You should see:
```json
{"status":"ok","message":"IPL Auction Server is running"}
```

### 2. Test Registration

Using **PowerShell** or **Command Prompt**:

```powershell
# Register a new user
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

You should get back a token and user info.

### 3. Test Get Players

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/players" -Method Get
```

You should see all 30 players.

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
  ```json
  Body: { "username": "john", "email": "john@email.com", "password": "pass123" }
  ```

- `POST /api/auth/login` - Login
  ```json
  Body: { "email": "john@email.com", "password": "pass123" }
  ```

- `GET /api/auth/me` - Get current user (requires token)
  ```
  Header: Authorization: Bearer YOUR_TOKEN_HERE
  ```

### Sessions
- `GET /api/sessions` - List all sessions (requires auth)
- `POST /api/sessions` - Create new session (requires auth)
  ```json
  Body: { "name": "My Auction Room" }
  ```

- `GET /api/sessions/:id` - Get session details (requires auth)
- `POST /api/sessions/:id/join` - Join session (requires auth)
  ```json
  Body: { "teamId": "csk" }
  ```

- `POST /api/sessions/:id/start` - Start auction (host only, requires auth)
- `GET /api/sessions/:id/results` - Get results (requires auth)

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get specific player

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Main server file
│   ├── db.ts                 # Database connection
│   ├── schema.sql            # Database schema
│   ├── seed.ts               # Seed script
│   ├── playersData.ts        # Player data
│   ├── middleware/
│   │   └── auth.ts           # JWT middleware
│   └── routes/
│       ├── auth.ts           # Auth endpoints
│       ├── sessions.ts       # Session endpoints
│       └── players.ts        # Player endpoints
├── package.json
├── tsconfig.json
├── .env                      # Your config (not in git)
├── .env.example              # Template
└── README.md                 # This file
```

## Troubleshooting

### "psql is not recognized"
Add PostgreSQL to your PATH:
1. Find PostgreSQL bin folder (usually `C:\Program Files\PostgreSQL\16\bin`)
2. Add to System Environment Variables → Path

### "Connection refused" error
- Make sure PostgreSQL service is running
- Check Windows Services → Find "postgresql" → Start it

### "Database does not exist"
Run: `createdb -U postgres ipl_auction`

### "Authentication failed"
- Double-check your password in `.env`
- Make sure DATABASE_URL format is correct

## Next Steps

### Phase 3: Frontend Integration (Coming Next)
- Add login/register UI to React app
- Connect Socket.io client
- Replace localStorage with API calls
- Test multiplayer functionality

### Phase 4: Deployment
- Deploy to Railway/Render
- Deploy frontend to Vercel
- Configure production environment

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run seed     # Seed player data
```

## Need Help?

If you encounter any issues:
1. Check that PostgreSQL is running
2. Verify your `.env` file settings
3. Make sure you ran the schema.sql file
4. Check the server logs for error messages
