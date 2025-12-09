// Auction Room
import React, { useState, useEffect, useRef } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Gavel, History, Timer, TrendingUp, User, CheckCircle, XCircle } from 'lucide-react';
import { Player } from '../types';

const TIMER_DURATION = 15;

const getNextBidAmount = (current: number) => {
    return current + (current >= 200 ? 25 : 10);
};

export const AuctionRoom = () => {
    const {
        teams,
        myTeamId,
        currentPlayerId,
        currentBid,
        currentBidTeamId,
        placeBid,
        resolveAuction,
        activeCategory,
        bidHistory,
        players,
        soldPlayers,
        unsoldPlayers,
        returnToPool,
        lastSoldCategory,
        lastSoldAt,
        lastAuctionResult,
        currentPhase,
        timeLeft
    } = useAuction();

    const [statusMessage, setStatusMessage] = useState<string>('');
    const [showSoldFlash, setShowSoldFlash] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const prevPlayerIdRef = useRef(currentPlayerId);

    // Detect when a player is sold/unsold based on timestamp update
    useEffect(() => {
        if (lastSoldAt) {
            setShowSoldFlash(true);
            setIsTransitioning(true);
            const transitionTimer = setTimeout(() => {
                setShowSoldFlash(false);
                setIsTransitioning(false);
            }, 3000);
            return () => clearTimeout(transitionTimer);
        }
    }, [lastSoldAt]);

    // Timer logic controlled by Context now.

    // Bot logic controlled by Context now.

    // Auto-redirect handled by Context now.

    const currentPlayer = players.find(p => p.id === currentPlayerId);
    const myTeam = teams.find(t => t.id === myTeamId);
    const winningTeam = teams.find(t => t.id === currentBidTeamId);

    // If category finished
    if (!currentPlayer) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in space-y-6">
                <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 italic">SET COMPLETED</h2>
                    <p className="text-slate-500 mb-8">All players in the <span className="font-bold text-slate-800">{activeCategory}</span> category have been auctioned.</p>

                    <button
                        onClick={returnToPool}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Return to Player Pool
                    </button>
                </div>
            </div>
        );
    }

    const nextBidAmount = currentBidTeamId ? getNextBidAmount(currentBid) : currentPlayer.basePrice;
    const canAfford = myTeam && myTeam.purse >= nextBidAmount;
    const isMyBid = currentBidTeamId === myTeamId;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-7rem)] overflow-hidden animate-fade-in relative -mt-4">

            {/* LEFT SIDEBAR: Teams - Fits perfectly, distributed evenly */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
                <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex-none">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide text-[10px]">
                        TEAMS
                    </h3>
                </div>
                <div className="flex-grow flex flex-col justify-evenly p-1 overflow-hidden">
                    {teams.map(team => {
                        const isMe = team.id === myTeamId;
                        const teamPlayers = soldPlayers[team.id] || [];
                        const isWinning = currentBidTeamId === team.id;

                        return (
                            <div key={team.id} className={`rounded-lg px-2 py-1.5 border transition-all ${isWinning ? 'border-green-500 bg-green-50 shadow-md transform scale-[1.02] z-10' : 'border-slate-100 bg-white'} ${isMe ? 'ring-2 ring-indigo-500 ring-offset-1' : 'opacity-90'}`}>
                                <div className="flex items-center justify-between mb-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{team.logo}</span>
                                        <span className={`font-bold text-xs ${isMe ? 'text-indigo-700' : 'text-slate-700'}`}>{team.shortName}</span>
                                        {isMe && <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1 rounded font-bold">YOU</span>}
                                    </div>
                                    {isWinning && <Gavel size={10} className="text-green-600" />}
                                </div>
                                <div className="flex justify-between items-end text-[9px]">
                                    <span className="text-slate-500">Purse: <span className="font-bold text-slate-800">₹{team.purse}L</span></span>
                                    <span className="text-slate-500">Players: <span className="font-bold text-slate-800">{teamPlayers.length}</span></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CENTER: Player Card - Main Focus */}
            <div className={`lg:col-span-6 flex flex-col gap-4 relative h-full transition-all duration-1000 ${isTransitioning ? 'bg-emerald-500 rounded-3xl p-1' : ''}`}>

                {/* Flash Overlay - Handles both SOLD and UNSOLD */}
                {showSoldFlash && (
                    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none rounded-3xl ${lastAuctionResult === 'UNSOLD' ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-red-500' : 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-500'}`}>
                        <div className="relative w-32 h-32 mb-6 animate-bounce">
                            <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-20"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                    {lastAuctionResult === 'UNSOLD' ? (
                                        <XCircle size={60} className="text-rose-600 animate-pulse" />
                                    ) : (
                                        <CheckCircle size={60} className="text-emerald-600 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1 className={`font-black text-white mb-2 tracking-tighter drop-shadow-lg animate-bounce ${lastAuctionResult === 'UNSOLD' ? 'text-6xl' : 'text-5xl'}`}>
                            {lastAuctionResult === 'UNSOLD' ? 'UNSOLD' : 'SOLD!'}
                        </h1>
                        <p className="text-lg text-white/90 font-bold drop-shadow-md">
                            {lastAuctionResult === 'UNSOLD' ? 'Player remains unsold' : 'Player has been auctioned'}
                        </p>
                    </div>
                )}

                {/* Timer Bar */}
                <div className={`flex-none bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            <Timer size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Time Remaining</p>
                            <p className={`text-xl font-black font-mono leading-none ${timeLeft <= 5 ? 'text-red-600' : 'text-slate-800'}`}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-500">{statusMessage || (isMyBid ? "You are the highest bidder" : "Waiting for bid...")}</p>
                    </div>
                </div>

                {/* Main Card */}
                <div className={`flex-grow bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col transition-opacity duration-500 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                    <div className="flex-grow flex flex-col items-center justify-center p-4 text-center relative z-10">
                        <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl mb-4">
                            <img
                                src={currentPlayer.image}
                                alt={currentPlayer.name}
                                className="w-full h-full object-cover rounded-full border-4 border-white bg-slate-200"
                            />
                        </div>

                        <h2 className="text-4xl font-black text-slate-900 mb-1 tracking-tight leading-tight">{currentPlayer.name}</h2>
                        <div className="flex gap-2 mb-6">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold text-xs tracking-wide uppercase">{currentPlayer.role}</span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold text-xs tracking-wide uppercase">{currentPlayer.country}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full max-w-sm mb-6">
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Base Price</p>
                                <p className="text-2xl font-bold text-slate-700">₹{currentPlayer.basePrice}L</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Current Bid</p>
                                <p className="text-3xl font-black text-indigo-600">₹{currentBid}L</p>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="mb-4 h-10 flex items-center justify-center w-full">
                            {winningTeam ? (
                                <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-1.5 rounded-full animate-fade-in shadow-lg">
                                    <span className="text-xl">{winningTeam.logo}</span>
                                    <span className="font-bold text-sm">{winningTeam.shortName} leads with ₹{currentBid}L</span>
                                </div>
                            ) : (
                                <div className="text-slate-400 font-medium italic text-sm">No bids placed yet</div>
                            )}
                        </div>
                    </div>

                    {/* ACTION BAR */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex-none">
                        <button
                            onClick={() => myTeamId && placeBid(myTeamId, nextBidAmount)}
                            disabled={isMyBid || !canAfford}
                            className={`
                        w-full py-3.5 rounded-xl font-black text-xl tracking-wide uppercase shadow-lg transition-all transform
                        ${isMyBid
                                    ? 'bg-green-500 text-white cursor-default'
                                    : !canAfford
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99]'}
                    `}
                        >
                            {isMyBid
                                ? 'You are Winning'
                                : !canAfford
                                    ? 'Insufficient Funds'
                                    : `BID ₹${nextBidAmount}L`
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Stats & History */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                {/* Career Stats - Compact */}
                <div className="flex-none bg-white rounded-2xl shadow-lg border border-slate-100 p-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 mb-3 text-sm">
                        <TrendingUp size={16} />
                        Career Stats
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                            <span className="text-slate-400 text-[10px] font-bold uppercase">Matches</span>
                            <span className="font-bold text-slate-800 text-base">{currentPlayer.stats.matches}</span>
                        </div>
                        {currentPlayer.stats.runs !== undefined && (
                            <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Runs</span>
                                <span className="font-bold text-slate-800 text-base">{currentPlayer.stats.runs}</span>
                            </div>
                        )}
                        {currentPlayer.stats.wickets !== undefined && (
                            <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Wickets</span>
                                <span className="font-bold text-slate-800 text-base">{currentPlayer.stats.wickets}</span>
                            </div>
                        )}
                        {currentPlayer.stats.strikeRate && (
                            <div className="flex justify-between items-center pb-1 border-b border-slate-50">
                                <span className="text-slate-400 text-[10px] font-bold uppercase">SR</span>
                                <span className="font-bold text-slate-800 text-base">{currentPlayer.stats.strikeRate}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Feed - This is the ONLY scrollable area per request */}
                <div className="flex-grow bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex flex-col overflow-hidden">
                    <div className="flex-none flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                            <History size={16} />
                            Live Feed
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-full">REALTIME</span>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {bidHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-300 italic text-xs">
                                <History size={24} className="mb-2 opacity-20" />
                                Waiting for bids...
                            </div>
                        ) : (
                            bidHistory.map((bid, idx) => {
                                const team = teams.find(t => t.id === bid.teamId);
                                const isMe = bid.teamId === myTeamId;
                                const prevBid = idx < bidHistory.length - 1 ? bidHistory[idx + 1].amount : 0;
                                const isBidIncrease = bid.amount > prevBid;

                                if (!team) return null;
                                return (
                                    <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border relative transition-all ${isMe ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'} ${isBidIncrease && idx === 0 ? 'ring-1 ring-orange-300 shadow-sm' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{team.logo}</span>
                                            <div>
                                                <div className="font-bold text-slate-800 text-xs leading-tight">{team.shortName}</div>
                                                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Placed Bid</div>
                                            </div>
                                        </div>
                                        <span className={`font-black text-base ${isBidIncrease && idx === 0 ? 'text-orange-600' : 'text-indigo-600'}`}>₹{bid.amount}L</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};