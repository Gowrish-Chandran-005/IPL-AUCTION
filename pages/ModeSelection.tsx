import React, { useState } from 'react';
import { Users, User, Plus, LogIn as LoginIcon, Copy, Check } from 'lucide-react';
import { sessionsAPI } from '../api/sessions';
import { useAuth } from '../context/AuthContext';

interface ModeSelectionProps {
    onModeSelected: (mode: 'solo' | 'multiplayer', sessionId?: string) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelected }) => {
    const [selectedMode, setSelectedMode] = useState<'solo' | 'multiplayer' | null>(null);
    const [showRoomOptions, setShowRoomOptions] = useState(false);
    const [roomAction, setRoomAction] = useState<'create' | 'join' | null>(null);
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdRoomId, setCreatedRoomId] = useState('');
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();

    const handleModeClick = (mode: 'solo' | 'multiplayer') => {
        setSelectedMode(mode);
        if (mode === 'multiplayer') {
            setShowRoomOptions(true);
        } else {
            // Solo mode - start immediately
            onModeSelected('solo');
        }
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            setError('Please enter a room name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const session = await sessionsAPI.create(roomName);
            setCreatedRoomId(session.id);
            setRoomCode(session.id.substring(0, 8).toUpperCase()); // Short code for sharing
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!roomCode.trim()) {
            setError('Please enter a room code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Find session by code (you'll need to add this endpoint)
            // For now, using the full ID
            onModeSelected('multiplayer', roomCode.toLowerCase());
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const startMultiplayerSession = () => {
        if (createdRoomId) {
            onModeSelected('multiplayer', createdRoomId);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">IPL Auction</h1>
                    <p className="text-slate-500">Welcome, {user?.username}!</p>
                </div>

                {!showRoomOptions && !createdRoomId && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                            Choose Your Mode
                        </h2>

                        {/* Solo Mode */}
                        <button
                            onClick={() => handleModeClick('solo')}
                            className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <User size={32} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Solo Mode</h3>
                                    <p className="text-slate-500 text-sm">
                                        Play against AI bots. Perfect for practice!
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Multiplayer Mode */}
                        <button
                            onClick={() => handleModeClick('multiplayer')}
                            className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users size={32} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Multiplayer Mode</h3>
                                    <p className="text-slate-500 text-sm">
                                        Create or join a room to play with friends!
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                )}

                {/* Multiplayer Room Options */}
                {showRoomOptions && !createdRoomId && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setShowRoomOptions(false)}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-4"
                        >
                            ← Back to mode selection
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                            Multiplayer Options
                        </h2>

                        {!roomAction && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setRoomAction('create')}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <Plus size={24} className="text-green-600" />
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-slate-900">Create New Room</h3>
                                            <p className="text-slate-500 text-sm">Start a new auction and invite friends</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setRoomAction('join')}
                                    className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <LoginIcon size={24} className="text-blue-600" />
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-slate-900">Join Existing Room</h3>
                                            <p className="text-slate-500 text-sm">Enter a room code to join</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Create Room Form */}
                        {roomAction === 'create' && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setRoomAction(null)}
                                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                                >
                                    ← Back
                                </button>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Room Name
                                    </label>
                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={(e) => setRoomName(e.target.value)}
                                        placeholder="e.g., Friends IPL 2024"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleCreateRoom}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Room'}
                                </button>
                            </div>
                        )}

                        {/* Join Room Form */}
                        {roomAction === 'join' && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setRoomAction(null)}
                                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                                >
                                    ← Back
                                </button>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Room Code
                                    </label>
                                    <input
                                        type="text"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        placeholder="Enter 8-character code"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
                                        maxLength={8}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleJoinRoom}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Joining...' : 'Join Room'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Room Created - Show Code */}
                {createdRoomId && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Created!</h2>
                            <p className="text-slate-500">Share this code with your friends</p>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
                            <p className="text-sm font-bold text-slate-700 mb-2 text-center">ROOM CODE</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white px-6 py-4 rounded-xl border-2 border-indigo-300">
                                    <p className="text-3xl font-black text-center text-indigo-600 tracking-widest font-mono">
                                        {roomCode}
                                    </p>
                                </div>
                                <button
                                    onClick={copyRoomCode}
                                    className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all"
                                    title="Copy code"
                                >
                                    {copied ? <Check size={24} /> : <Copy size={24} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <p className="text-sm text-blue-800">
                                <strong>How to share:</strong> Send this code to your friends. They can enter it in "Join Room" to join your auction!
                            </p>
                        </div>

                        <button
                            onClick={startMultiplayerSession}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all text-lg"
                        >
                            Start Auction →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
