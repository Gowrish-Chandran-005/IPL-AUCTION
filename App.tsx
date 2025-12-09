import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Layout } from './components/Layout';
import { TeamSelection } from './pages/TeamSelection';
import { PlayerPool } from './pages/PlayerPool';
import { AuctionRoom } from './pages/AuctionRoom';
import { Squads } from './pages/Squads';
import { AuthPage } from './pages/AuthPage';
import { ModeSelection } from './pages/ModeSelection';
import { WaitingRoom } from './pages/WaitingRoom';

const AppContent = () => {
  const { currentPhase } = useAuction();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [gameMode, setGameMode] = useState<'solo' | 'multiplayer' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show mode selection after login
  if (!gameMode) {
    return (
      <ModeSelection
        onModeSelected={(mode, sessionIdParam) => {
          setGameMode(mode);
          if (mode === 'multiplayer' && sessionIdParam) {
            setSessionId(sessionIdParam);
            setIsHost(true); // User who creates room is host
            setInWaitingRoom(true);
          }
        }}
      />
    );
  }

  // Show waiting room for multiplayer mode
  if (gameMode === 'multiplayer' && inWaitingRoom) {
    return (
      <WaitingRoom
        sessionId={sessionId!}
        isHost={isHost}
        onStart={(teamId) => {
          // Start the auction with selected team
          setInWaitingRoom(false);
          // TODO: Initialize auction with teamId and sessionId
        }}
        onLeave={() => {
          // Leave the room and go back to mode selection
          setGameMode(null);
          setSessionId(null);
          setInWaitingRoom(false);
          setIsHost(false);
        }}
      />
    );
  }

  return (
    <Layout>
      {currentPhase === 'SELECTION' && <TeamSelection />}
      {currentPhase === 'POOL' && <PlayerPool />}
      {/* Auction runs in the background; show it unless we're in SELECTION or POOL */}
      {(currentPhase === 'AUCTION' || currentPhase === 'SQUADS' || currentPhase === 'TRANSITION') && <AuctionRoom />}
      {/* Squads overlay on top of auction */}
      {currentPhase === 'SQUADS' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-[95vw] h-[95vh] overflow-y-auto">
            <Squads />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AuctionProvider>
          <AppContent />
        </AuctionProvider>
      </SocketProvider>
    </AuthProvider>
  );
}