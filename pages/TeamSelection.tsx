import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { CheckCircle2, Circle } from 'lucide-react';

export const TeamSelection = () => {
  const { teams, myTeamId, selectMyTeam, startPoolAuction } = useAuction();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 italic">
          SELECT YOUR FRANCHISE
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Choose the team you want to represent. The other 9 teams will be controlled by AI opponents.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {teams.map((team) => {
          const isSelected = myTeamId === team.id;
          return (
            <div
              key={team.id}
              onClick={() => selectMyTeam(team.id)}
              className={`
                relative group cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300
                border shadow-lg hover:shadow-xl hover:-translate-y-1
                ${isSelected 
                    ? 'bg-gradient-to-b from-white to-blue-50 border-blue-500 ring-4 ring-blue-500/20' 
                    : 'bg-white border-slate-100 hover:border-blue-200'}
              `}
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${team.color} flex items-center justify-center text-5xl shadow-inner transform transition-transform group-hover:scale-110`}>
                {team.logo}
              </div>
              
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-800">{team.shortName}</h3>
                <p className="text-xs text-slate-500 font-medium truncate w-full px-2">{team.name}</p>
              </div>

              <div className="absolute top-3 right-3 transition-transform duration-300">
                {isSelected ? <CheckCircle2 size={24} className="text-blue-600" fill="currentColor" /> : <Circle size={24} className="text-slate-200" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-40">
        <button
          onClick={startPoolAuction}
          disabled={!myTeamId}
          className={`
            px-12 py-4 rounded-full font-black text-lg tracking-wide uppercase transition-all transform duration-200 shadow-2xl
            ${myTeamId 
              ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:scale-105 active:scale-95 hover:shadow-blue-500/25' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
          `}
        >
          Enter Auction Arena
        </button>
      </div>
    </div>
  );
};