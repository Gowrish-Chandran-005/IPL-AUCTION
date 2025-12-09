import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuctionContextType, AuctionState, Team, Player, PlayerRole, PlayerCategory } from '../types';
import { TEAMS, PLAYERS } from '../constants';

const TIMER_DURATION = 15;

const getNextBidAmount = (current: number) => {
  return current + (current >= 200 ? 25 : 10);
};

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const STORAGE_KEY = 'ipl_auction_sim_v2';

const INITIAL_STATE: AuctionState = {
  currentPhase: 'SELECTION',
  myTeamId: null,
  activeCategory: null,
  teams: TEAMS,
  players: PLAYERS,
  soldPlayers: {},
  unsoldPlayers: [],
  currentPlayerId: null,
  currentBid: 0,
  currentBidTeamId: null,
  bidHistory: [],
  lastSoldCategory: null,
  lastAuctionResult: null,
  lastSoldAt: null,
  lastCompletedCategory: null,
  lastCompletedAt: null,
  timeLeft: TIMER_DURATION,
};

// Helper to safely flatten sold players array
const getSoldPlayersFlat = (soldPlayers: Record<string, Player[]>): Player[] => {
  return Object.values(soldPlayers).reduce((acc, players) => acc.concat(players), [] as Player[]);
};

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuctionState>(() => {
    // Always start fresh from SELECTION phase
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!state.currentPlayerId || (state.currentPhase !== 'AUCTION' && state.currentPhase !== 'SQUADS') || state.currentPhase === 'TRANSITION') return;

    if (state.timeLeft <= 0) {
      // Time is up!
      if (state.currentBidTeamId) {
        resolveAuction('SOLD');
      } else {
        resolveAuction('UNSOLD');
      }
      return;
    }

    const timer = setInterval(() => {
      setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeLeft, state.currentPlayerId, state.currentPhase, state.currentBidTeamId]);

  // --- BOT SIMULATION LOGIC ---
  useEffect(() => {
    if (!state.currentPlayerId || (state.currentPhase !== 'AUCTION' && state.currentPhase !== 'SQUADS') || state.currentPhase === 'TRANSITION') return;

    const { currentBid, currentBidTeamId, currentPlayerId, myTeamId, teams, players } = state;
    const isMyBid = currentBidTeamId === myTeamId;
    const isNoBid = currentBidTeamId === null;
    const myTeam = teams.find(t => t.id === myTeamId);
    const currentPlayer = players.find(p => p.id === currentPlayerId);

    if (!myTeam || !currentPlayer) return;

    let timeoutId: NodeJS.Timeout;

    // Function to execute a bot bid
    const executeBotBid = () => {
      if (Math.random() < 0.5) return; // Add some randomness so they don't always bid immediately

      const opponents = teams.filter(t => t.id !== myTeamId); // Bots are everyone except me

      let potentialBidders = opponents;
      if (currentBidTeamId) {
        potentialBidders = opponents.filter(t => t.id !== currentBidTeamId);
      }

      if (potentialBidders.length === 0) return;

      const randomBot = potentialBidders[Math.floor(Math.random() * potentialBidders.length)];
      const nextBid = currentBidTeamId ? getNextBidAmount(currentBid) : currentPlayer.basePrice;

      if (randomBot.purse >= nextBid) {
        placeBid(randomBot.id, nextBid);
      }
    };

    if (isMyBid) {
      // High chance to challenge me
      const chance = currentBid > currentPlayer.basePrice * 5 ? 0.3 : 0.8;
      if (Math.random() < chance) {
        timeoutId = setTimeout(executeBotBid, Math.random() * 2000 + 1000);
      }
    } else if (isNoBid) {
      // Chance to start
      if (Math.random() < 0.6) {
        timeoutId = setTimeout(executeBotBid, 2000);
      }
    } else {
      // Bot vs Bot (lower frequency)
      if (Math.random() < 0.3) {
        timeoutId = setTimeout(executeBotBid, 2500);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [state.currentBid, state.currentBidTeamId, state.currentPlayerId, state.currentPhase]);

  // --- TRANSITION PHASE HANDLER ---
  useEffect(() => {
    if (state.currentPhase === 'TRANSITION') {
      const timer = setTimeout(() => {
        advanceToNextPlayer();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.currentPhase]);

  const advanceToNextPlayer = () => {
    setState((prev) => {
      const { soldPlayers, unsoldPlayers, activeCategory, currentPlayerId } = prev;
      // Find next player logic (moved from resolveAuction)
      const soldFlat = getSoldPlayersFlat(soldPlayers);
      const availablePlayers = prev.players.filter(p => {
        const alreadySold = soldFlat.find(sp => sp.id === p.id);
        const alreadyUnsold = unsoldPlayers.find(up => up.id === p.id);
        if (alreadySold || alreadyUnsold) return false;
        if (p.id === currentPlayerId) return false; // Should be redundant but safe

        if (activeCategory === 'Marquee') {
          return p.category === 'Marquee';
        } else {
          return p.role === activeCategory;
        }
      });

      const nextPlayer = availablePlayers.length > 0 ? availablePlayers[0] : null;

      return {
        ...prev,
        currentPlayerId: nextPlayer ? nextPlayer.id : null,
        currentBid: nextPlayer ? nextPlayer.basePrice : 0,
        currentBidTeamId: null,
        bidHistory: [],
        timeLeft: TIMER_DURATION,
        currentPhase: nextPlayer ? 'AUCTION' : 'POOL',
        activeCategory: nextPlayer ? prev.activeCategory : null,
        lastCompletedCategory: nextPlayer ? prev.lastCompletedCategory : activeCategory,
        lastCompletedAt: nextPlayer ? prev.lastCompletedAt : (activeCategory ? Date.now() : prev.lastCompletedAt),
      };
    });
  };

  // --- AUTO REDIRECT LOGIC ---
  useEffect(() => {
    if (!state.currentPlayerId && state.currentPhase === 'AUCTION') {
      const timer = setTimeout(() => {
        returnToPool();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.currentPlayerId, state.currentPhase]);

  const selectMyTeam = (teamId: string) => {
    setState((prev) => ({ ...prev, myTeamId: teamId }));
  };

  const startCategoryAuction = (category: PlayerCategory) => {
    setState((prev) => {
      // Find the first available player in this category
      const soldFlat = getSoldPlayersFlat(prev.soldPlayers);
      const availablePlayers = prev.players.filter(p => {
        // Check if player already sold or unsold
        const alreadySold = soldFlat.find(sp => sp.id === p.id);
        const alreadyUnsold = prev.unsoldPlayers.find(up => up.id === p.id);
        if (alreadySold || alreadyUnsold) return false;

        // Filter by category
        if (category === 'Marquee') {
          return p.category === 'Marquee';
        } else {
          return p.role === category;
        }
      });

      const firstPlayer = availablePlayers.length > 0 ? availablePlayers[0] : null;

      if (!firstPlayer) {
        return prev;
      }

      return {
        ...prev,
        currentPhase: 'AUCTION',
        activeCategory: category,
        currentPlayerId: firstPlayer.id,
        currentBid: firstPlayer.basePrice,
        currentBidTeamId: null,
        bidHistory: [],
        timeLeft: TIMER_DURATION,
      };
    });
  };

  const startPoolAuction = () => {
    setState(prev => ({ ...prev, currentPhase: 'POOL', activeCategory: null, currentPlayerId: null }));
  };

  const startSquads = () => {
    setState(prev => ({ ...prev, currentPhase: 'SQUADS' }));
  };

  const returnToPool = () => {
    setState(prev => ({ ...prev, currentPhase: 'POOL', activeCategory: null, currentPlayerId: null }));
  }

  const closeSquads = () => {
    setState(prev => {
      if (prev.currentPlayerId) {
        return { ...prev, currentPhase: 'AUCTION' };
      }
      return { ...prev, currentPhase: 'POOL', activeCategory: null };
    });
  }

  const placeBid = (teamId: string, amount: number) => {
    setState((prev) => {
      const team = prev.teams.find((t) => t.id === teamId);
      if (!team || team.purse < amount) return prev;

      return {
        ...prev,
        currentBid: amount,
        currentBidTeamId: teamId,
        bidHistory: [{ teamId, amount, timestamp: Date.now() }, ...prev.bidHistory],
        timeLeft: TIMER_DURATION,
      };
    });
  };

  const resolveAuction = (statusArg: 'SOLD' | 'UNSOLD') => {
    setState((prev) => {
      const { currentPlayerId, currentBidTeamId, currentBid, teams, activeCategory } = prev;
      if (!currentPlayerId) return prev;

      // Force status check based on latest state to avoid race conditions
      const status = currentBidTeamId ? 'SOLD' : 'UNSOLD';

      const player = prev.players.find(p => p.id === currentPlayerId);
      if (!player) return prev;

      let updatedTeams = teams;
      let updatedSold = { ...prev.soldPlayers };
      let updatedUnsold = [...prev.unsoldPlayers];

      if (status === 'SOLD') { // currentBidTeamId is guaranteed to exist if status is 'SOLD'
        updatedTeams = teams.map(t =>
          t.id === currentBidTeamId ? { ...t, purse: t.purse - currentBid } : t
        );
        if (!updatedSold[currentBidTeamId]) updatedSold[currentBidTeamId] = [];
        const soldRecord = { ...player, soldFor: currentBid, soldToTeamId: currentBidTeamId };
        updatedSold[currentBidTeamId].push(soldRecord);
      } else {
        updatedUnsold.push(player);
      }

      return {
        ...prev,
        teams: updatedTeams,
        soldPlayers: updatedSold,
        unsoldPlayers: updatedUnsold,
        currentPhase: 'TRANSITION', // Move to transition phase
        lastSoldCategory: activeCategory,
        lastAuctionResult: status,
        lastSoldAt: Date.now(),
        // DO NOT change currentPlayerId yet, purely update status
      };
    });
  };

  const resetAuction = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }

  return (
    <AuctionContext.Provider
      value={{
        ...state,
        selectMyTeam,
        startCategoryAuction,
        startPoolAuction,
        startSquads,
        returnToPool,
        closeSquads,
        placeBid,
        resolveAuction,
        resetAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) throw new Error('useAuction must be used within AuctionProvider');
  return context;
};