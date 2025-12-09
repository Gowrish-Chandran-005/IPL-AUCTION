import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { PlayerRole, PlayerCategory, Player } from '../types';
import { Users, Gavel, CheckCircle2, GripVertical, RotateCcw, Eye, X } from 'lucide-react';

export const PlayerPool = () => {
  const { players, teams, startCategoryAuction, soldPlayers, unsoldPlayers, lastSoldCategory, lastSoldAt, currentPhase, lastCompletedCategory, lastCompletedAt } = useAuction();
  const defaultCategories: PlayerCategory[] = ['Marquee', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'];
  const [auctionOrder, setAuctionOrder] = useState<PlayerCategory[]>(defaultCategories);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isOrderingMode, setIsOrderingMode] = useState(false);
  const [selectedCategoryForPlayers, setSelectedCategoryForPlayers] = useState<PlayerCategory | null>(null);

  // When returning from an Auction set, auto-open the completed category's players
  React.useEffect(() => {
    if (currentPhase === 'POOL' && !selectedCategoryForPlayers && lastCompletedCategory && lastCompletedAt) {
      const justCompleted = Date.now() - lastCompletedAt < 10000; // 10s window
      if (justCompleted) {
        setSelectedCategoryForPlayers(lastCompletedCategory);
      }
    }
  }, [currentPhase, lastCompletedCategory, lastCompletedAt]);

  // Helper to flatten sold players
  const soldFlat = Object.values(soldPlayers).flat() as Player[];
  const getCounts = (category: PlayerCategory) => {
    const categoryPlayers = category === 'Marquee'
      ? players.filter(p => p.category === 'Marquee')
      : players.filter(p => p.role === category && p.category !== 'Marquee');

    const total = categoryPlayers.length;
    const sold = soldFlat.filter(p =>
      category === 'Marquee' ? p.category === 'Marquee' : (p.role === category && p.category !== 'Marquee')
    ).length;
    const unsold = unsoldPlayers.filter(p =>
      category === 'Marquee' ? p.category === 'Marquee' : (p.role === category && p.category !== 'Marquee')
    ).length;
    const remaining = Math.max(0, total - sold - unsold);
    return { total, sold, unsold, remaining };
  };

  const getPlayersByCategory = (category: PlayerCategory) => {
    return category === 'Marquee'
      ? players.filter(p => p.category === 'Marquee')
      : players.filter(p => p.role === category && p.category !== 'Marquee');
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedItem === null || draggedItem === targetIndex) return;

    const newOrder = [...auctionOrder];
    const draggedCategory = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(targetIndex, 0, draggedCategory);
    setAuctionOrder(newOrder);
    setDraggedItem(null);
  };

  const handleReset = () => {
    setAuctionOrder(defaultCategories);
    setIsOrderingMode(false);
  };

  const categoryPlayers = selectedCategoryForPlayers ? getPlayersByCategory(selectedCategoryForPlayers) : [];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 italic tracking-tight mb-2">
          AUCTION POOL
        </h1>
        <p className="text-slate-500 mb-6">
          {isOrderingMode
            ? 'Drag categories to set the auction order'
            : 'Review the player categories that will be auctioned in the following order'}
        </p>

        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={() => setIsOrderingMode(!isOrderingMode)}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${isOrderingMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {isOrderingMode ? '✓ Done Arranging' : '✎ Arrange Order'}
          </button>
          {isOrderingMode && (
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg font-bold bg-slate-500 text-white hover:bg-slate-600 transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Ordering Mode */}
      {isOrderingMode ? (
        <div className="mb-12 bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-6">Drag to Reorder Categories</h3>
          <div className="space-y-3">
            {auctionOrder.map((role, index) => (
              <div
                key={role}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 cursor-move transition-all
                  ${draggedItem === index
                    ? 'bg-blue-200 border-blue-400 opacity-60'
                    : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg'}
                `}
              >
                <div className="text-2xl font-black text-blue-600 w-10 text-center">
                  {index + 1}
                </div>
                <GripVertical size={20} className="text-blue-400" />
                <span className="text-lg font-bold text-slate-800 flex-1">{role}</span>
                <span className="text-sm text-slate-500">
                  ({getCounts(role as PlayerRole).total} players)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Display Mode - Line by Line */
        <>
          <div className="space-y-4 mb-12">
            {auctionOrder.map((role, index) => {
              const counts = getCounts(role);
              const isComplete = counts.remaining === 0;
              const categoryPlayers = getPlayersByCategory(role);
              const isRecentlySold = lastSoldCategory === role && lastSoldAt && (Date.now() - lastSoldAt) < 3500;

              return (
                <div
                  key={role}
                  className={`
                    relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-700
                    ${isComplete
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'}
                    ${isRecentlySold ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200/60 shadow-md scale-[1.01]' : ''}
                  `}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Number and Category Info */}
                    <div className="flex items-center gap-6 flex-1">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg">
                        {index + 1}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                          <Users size={24} />
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold text-slate-800">{role}</h2>
                          <p className="text-sm text-slate-500">
                            {counts.sold} Sold • {counts.unsold} Unsold • {counts.total} Total
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status and Show Players Button */}
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold text-sm whitespace-nowrap">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-sm whitespace-nowrap">
                          {counts.remaining} Left
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedCategoryForPlayers(role)}
                        className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        <Eye size={16} /> Show Players
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Start Auction Button - Fixed at Bottom */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-40">
            {(() => {
              const nextCategoryToStart = auctionOrder.find(role => {
                const counts = getCounts(role);
                return counts.remaining > 0;
              });

              if (!nextCategoryToStart) {
                return (
                  <div className="bg-slate-800 text-white px-8 py-4 rounded-full font-bold shadow-2xl">
                    All Categories Completed
                  </div>
                )
              }

              return (
                <button
                  onClick={() => startCategoryAuction(nextCategoryToStart)}
                  className="px-12 py-4 rounded-full font-black text-lg tracking-wide uppercase transition-all transform duration-200 shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 active:scale-95 hover:shadow-green-500/25 flex items-center gap-2"
                >
                  <Gavel size={24} /> Start {nextCategoryToStart} Auction
                </button>
              );
            })()}
          </div>
        </>
      )}

      {/* Players Popup on Right Side */}
      {selectedCategoryForPlayers && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l-4 border-blue-600 animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex items-center justify-between">
            <h3 className="text-2xl font-black">{selectedCategoryForPlayers} Players</h3>
            <button
              onClick={() => setSelectedCategoryForPlayers(null)}
              className="p-2 hover:bg-blue-700 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {categoryPlayers.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No players in this category</p>
              ) : (
                categoryPlayers.map((player) => {
                  // Find if this player was sold and get the sold price
                  const soldEntry = soldFlat.find(sp => sp.id === player.id) as (typeof player & { soldFor?: number, soldToTeamId?: string }) | undefined;
                  const isUnsold = unsoldPlayers.find(up => up.id === player.id);
                  const buyer = soldEntry ? teams.find(t => t.id === soldEntry.soldToTeamId) : undefined;

                  if (soldEntry && buyer) {
                    // Sold — color the box with buyer gradient and show team name centered
                    return (
                      <div
                        key={player.id}
                        className={`relative overflow-hidden p-4 rounded-lg text-white shadow-md border border-white/10 transition-all bg-gradient-to-r ${buyer.color}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{player.name}</span>
                            <span className="text-xs text-white/90">Base: ₹{player.basePrice}L</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-white">₹{soldEntry.soldFor}L</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <div className="text-2xl font-black tracking-wider drop-shadow-md">{buyer.shortName}</div>
                            <div className="text-xs font-semibold opacity-90">{buyer.name}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{player.name}</span>
                        <span className="text-xs text-slate-500">Base: ₹{player.basePrice}L</span>
                      </div>
                      <div className="text-right">
                        {isUnsold ? (
                          <span className="font-bold text-rose-600">Unsold</span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for popup */}
      {selectedCategoryForPlayers && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSelectedCategoryForPlayers(null)}
        />
      )}
    </div>
  );
};