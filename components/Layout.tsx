
import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Trophy, RotateCcw, Users, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resetAuction, myTeamId, teams, startSquads, activeCategory, players, soldPlayers, unsoldPlayers } = useAuction();
  const myTeam = teams.find(t => t.id === myTeamId);
  const [showPlayersModal, setShowPlayersModal] = useState(false);

  // Helper to find player status
  const getPlayerStatus = (playerId: string) => {
    // Check sold
    for (const teamId in soldPlayers) {
      const found = soldPlayers[teamId].find(p => p.id === playerId);
      if (found) return { status: 'SOLD', soldFor: found.soldFor, teamId: teamId };
    }
    // Check unsold
    if (unsoldPlayers.find(p => p.id === playerId)) return { status: 'UNSOLD' };
    return { status: 'PENDING' };
  };

  const currentCategoryPlayers = players.filter(p => {
    if (!activeCategory) return false;
    if (activeCategory === 'Marquee') return p.category === 'Marquee';
    return p.role === activeCategory && p.category !== 'Marquee';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 text-slate-800 flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-indigo-100 shadow-sm">
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
              <Trophy size={20} className="text-yellow-400" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-800 italic tracking-tighter">
              IPL AUCTION
            </span>
          </div>

          <div className="flex items-center gap-4">
            {activeCategory && (
              <button
                onClick={() => setShowPlayersModal(true)}
                className="px-3 py-2 rounded-md bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 transition flex items-center gap-2 shadow-sm"
              >
                <Users size={18} />
                <span>Players</span>
              </button>
            )}

            <button
              onClick={() => startSquads()}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            >
              Squads
            </button>
            {myTeam && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Team</span>
                <span className="text-lg">{myTeam.logo}</span>
                <span className="font-bold text-slate-800">{myTeam.shortName}</span>
                <span className="ml-2 text-indigo-600 font-bold border-l border-slate-200 pl-2">₹{myTeam.purse}L</span>
              </div>
            )}
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset the entire auction?")) resetAuction();
              }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Reset Auction"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-2 max-w-[95vw]">
        {children}
      </main>

      <footer className="bg-white/50 border-t border-slate-100 py-6 mt-auto">
        <div className="max-w-[95vw] mx-auto px-4 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} IPL Auction Simulator.
        </div>
      </footer>

      {/* Players List Modal */}
      {showPlayersModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{activeCategory} PLAYERS</h2>
                <p className="text-sm text-slate-500 font-medium">Full list of players in this category</p>
              </div>
              <button onClick={() => setShowPlayersModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="p-4 border-b">Player</th>
                    <th className="p-4 border-b">Base Price</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b text-right">Sold To / Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentCategoryPlayers.map(player => {
                    const info = getPlayerStatus(player.id);
                    const buyingTeam = info.teamId ? teams.find(t => t.id === info.teamId) : null;

                    return (
                      <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{player.name}</div>
                          <div className="text-xs text-slate-400 font-semibold">{player.country}</div>
                        </td>
                        <td className="p-4 font-mono text-slate-600 font-semibold">
                          ₹{player.basePrice}L
                        </td>
                        <td className="p-4">
                          {info.status === 'SOLD' && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">SOLD</span>
                          )}
                          {info.status === 'UNSOLD' && (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">UNSOLD</span>
                          )}
                          {info.status === 'PENDING' && (
                            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">PENDING</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {info.status === 'SOLD' && buyingTeam ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-sm">{buyingTeam.logo}</span>
                              <span className="font-bold text-slate-800">{buyingTeam.shortName}</span>
                              <span className="font-mono font-black text-indigo-600">₹{info.soldFor}L</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {currentCategoryPlayers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                        No players found in this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPlayersModal(false)}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};