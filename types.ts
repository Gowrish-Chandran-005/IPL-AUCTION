export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  purse: number; // in Lakhs
}

export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
export type PlayerCategory = PlayerRole | 'Marquee';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole; // Actual cricket role
  category?: 'Marquee'; // Optional: indicates player is a marquee player for auction purposes
  country: string;
  basePrice: number; // in Lakhs
  image: string;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
  };
  // Populated when a player is sold
  soldFor?: number;
  soldToTeamId?: string;
}

export interface BidHistoryItem {
  teamId: string;
  amount: number;
  timestamp: number;
}

export interface AuctionState {
  currentPhase: 'SELECTION' | 'POOL' | 'AUCTION' | 'SQUADS' | 'TRANSITION';
  myTeamId: string | null; // The team the user controls
  activeCategory: PlayerCategory | null; // The category currently being auctioned (e.g., 'Marquee', 'Batsman')

  teams: Team[];
  players: Player[];
  soldPlayers: Record<string, Player[]>; // teamId -> Players
  unsoldPlayers: Player[];

  // Active Auction State
  currentPlayerId: string | null;
  currentBid: number;
  currentBidTeamId: string | null;
  bidHistory: BidHistoryItem[];
  // Last sold category info to enable UI transitions
  lastSoldCategory: PlayerCategory | null;
  lastAuctionResult: 'SOLD' | 'UNSOLD' | null;
  lastSoldAt: number | null; // timestamp
  // When a whole category/set completes, record it so the Pool can show players
  lastCompletedCategory: PlayerCategory | null;
  lastCompletedAt: number | null;
  timeLeft: number;
}

export interface AuctionContextType extends AuctionState {
  selectMyTeam: (teamId: string) => void;
  startCategoryAuction: (category: PlayerCategory) => void;
  startPoolAuction: () => void;
  startSquads: () => void;
  returnToPool: () => void;
  closeSquads: () => void;
  placeBid: (teamId: string, amount: number) => void;
  resolveAuction: (status: 'SOLD' | 'UNSOLD') => void;
  resetAuction: () => void;
}