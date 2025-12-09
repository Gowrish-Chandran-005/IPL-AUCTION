import pool from './db';

const SCHEMA_SQL = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create auction_sessions table
CREATE TABLE IF NOT EXISTS auction_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  created_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'waiting', -- waiting, active, completed
  current_category VARCHAR(50),
  current_player_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create session_participants table
CREATE TABLE IF NOT EXISTS session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES auction_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  team_id VARCHAR(50) NOT NULL, -- 'csk', 'mi', etc.
  purse_remaining INTEGER DEFAULT 10000,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, user_id),
  UNIQUE(session_id, team_id)
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL, -- Batsman, Bowler, All-Rounder, Wicket Keeper
  category VARCHAR(50), -- Marquee or NULL
  country VARCHAR(100) NOT NULL,
  base_price INTEGER NOT NULL,
  image_url TEXT,
  stats JSONB -- Store stats as JSON
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES auction_sessions(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  participant_id UUID REFERENCES session_participants(id),
  amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create player_results table
CREATE TABLE IF NOT EXISTS player_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES auction_sessions(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  status VARCHAR(20) NOT NULL, -- SOLD, UNSOLD
  sold_to_participant_id UUID REFERENCES session_participants(id),
  final_price INTEGER,
  resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_bids_session ON bids(session_id);
CREATE INDEX IF NOT EXISTS idx_bids_player ON bids(player_id);
CREATE INDEX IF NOT EXISTS idx_player_results_session ON player_results(session_id);
`;

export async function initDb() {
    try {
        console.log('🔄 Initializing database...');
        await pool.query(SCHEMA_SQL);
        console.log('✅ Database schema initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        // Don't exit process, just log error. Database might be down or transient issue.
        // The server main loop might handle it or retry.
        throw error;
    }
}
