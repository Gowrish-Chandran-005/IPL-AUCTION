import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { ArrowLeft } from 'lucide-react';

export const Squads = () => {
  const { teams, soldPlayers, closeSquads } = useAuction();
  const [selectedTeam, setSelectedTeam] = useState<string>('csk');

  const team = teams.find(t => t.id === selectedTeam) || teams[0];
  const teamPlayers = soldPlayers[team.id] || [];

  return (
    <div className="py-6 animate-fade-in px-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black">Squads</h1>
        <button
          onClick={closeSquads}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 flex-grow flex flex-col overflow-hidden border border-slate-200">
        <div className="mb-5 overflow-x-auto pb-2">
          <div className="flex gap-2 items-center">
            {teams.slice().sort((a, b) => a.name.localeCompare(b.name)).map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTeam(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition whitespace-nowrap font-medium text-xs ${selectedTeam === t.id ? 'bg-indigo-100 text-indigo-700 shadow-md' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-lg bg-gradient-to-br ${t.color} text-white`}>{t.logo}</div>
                <div className="text-xs">{t.shortName}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 border rounded-lg flex flex-col flex-grow overflow-hidden relative">
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br ${team.color} text-white shadow-lg`}>{team.logo}</div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase">{team.name}</div>
              <div className="font-black text-2xl text-slate-900">{team.shortName}</div>
            </div>
          </div>

          <div className="border-t-2 pt-4 flex-grow overflow-y-auto pr-24">
            <h3 className="text-base font-bold mb-3 text-slate-900">Squad</h3>
            {teamPlayers.length === 0 ? (
              <div className="text-sm text-slate-500 italic py-6">No players yet</div>
            ) : (
              <div className="space-y-4 max-w-[75%]">
                {/* Group players by role - exclude Marquee from display */}
                {['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'].map(roleGroup => {
                  const playersInRole = teamPlayers.filter(p => p.role === roleGroup);
                  if (playersInRole.length === 0) return null;

                  return (
                    <div key={roleGroup}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{roleGroup}</h4>
                      <div className="space-y-2">
                        {playersInRole.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-2.5 bg-white rounded-md border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition text-sm">
                            <div>
                              <div className="font-semibold text-slate-900">{p.name}</div>
                              <div className="text-xs text-slate-600">{p.role} • Base: ₹{p.basePrice}L</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-semibold text-slate-500 uppercase">Sold</div>
                              <div className="font-bold text-sm text-indigo-600">₹{(p as any).soldFor ?? '—'}L</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="absolute bottom-5 right-5 text-right bg-white p-4 rounded-xl shadow-lg border-2 border-indigo-200">
            <div className="text-xs font-bold text-slate-500 uppercase">Remaining Purse</div>
            <div className="text-4xl font-black text-indigo-600">₹{team.purse}L</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squads;
