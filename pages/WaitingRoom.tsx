import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Crown, User, Play, LogOut } from 'lucide-react';
import { sessionsAPI } from '../api/sessions';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { TEAMS } from '../constants';

interface WaitingRoomProps {
    sessionId: string;
    isHost: boolean;
    onStart: (teamId: string) => void;
    onLeave: () => void;
}

interface Participant {
    id: string;
    username: string;
    teamId: string;
    joinedAt: string;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ sessionId, isHost, onStart, onLeave }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [sessionName, setSessionName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { socket } = useSocket();

    useEffect(() => {
        loadSessionDetails();

        // Socket.io listeners for real-time updates
        if (socket) {
            socket.emit('join-session', sessionId);

            socket.on('player-joined', (data: Participant) => {
                setParticipants(prev => {
                    // Remove if already exists (team change)
                    const filtered = prev.filter(p => p.id !== data.id);
                    return [...filtered, data];
                });
            });

            socket.on('player-left', (userId: string) => {
                setParticipants(prev => prev.filter(p => p.id !== userId));
            });

            socket.on('auction-started', () => {
                if (selectedTeam) {
                    onStart(selectedTeam);
                }
            });
        }

        return () => {
            if (socket) {
                socket.emit('leave-session', sessionId);
            }
        };
    }, [sessionId, socket]);

    const loadSessionDetails = async () => {
        try {
            const data = await sessionsAPI.getDetails(sessionId);
            setSessionName(data.session.name);
            setRoomCode(sessionId.substring(0, 8).toUpperCase());
            setParticipants(data.participants || []);
        } catch (error) {
            console.error('Failed to load session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTeamSelect = async (teamId: string) => {
        try {
            await sessionsAPI.join(sessionId, teamId);
            setSelectedTeam(teamId);

            // Add/update current user in participants list
            setParticipants(prev => {
                const filtered = prev.filter(p => p.id !== user?.id);
                return [...filtered, {
                    id: user!.id,
                    username: user!.username,
                    teamId: teamId,
                    joinedAt: new Date().toISOString()
                }];
            });

            // Notify others via Socket.io
            if (socket) {
                socket.emit('player-joined', {
                    sessionId,
                    id: user?.id,
                    username: user?.username,
                    teamId,
                    joinedAt: new Date().toISOString()
                });
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to select team');
        }
    };

    const handleStartAuction = async () => {
        if (!selectedTeam) {
            alert('Please select a team first!');
            return;
        }

        try {
            await sessionsAPI.start(sessionId);

            if (socket) {
                socket.emit('start-auction', sessionId);
            }

            onStart(selectedTeam);
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to start auction');
        }
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const takenTeams = participants.map(p => p.teamId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading room...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">{sessionName}</h1>
                            <p className="text-slate-500">Waiting for players to join...</p>
                        </div>
                        <button
                            onClick={onLeave}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            Leave Room
                        </button>
                    </div>

                    {/* Room Code */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border-2 border-indigo-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-700 mb-1">ROOM CODE</p>
                                <p className="text-2xl font-black text-indigo-600 tracking-widest font-mono">
                                    {roomCode}
                                </p>
                            </div>
                            <button
                                onClick={copyRoomCode}
                                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all"
                                title="Copy code"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Players List */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={24} className="text-indigo-600" />
                            <h2 className="text-xl font-bold text-slate-900">
                                Players ({participants.length}/10)
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {participants.map((participant) => {
                                const team = TEAMS.find(t => t.id === participant.teamId);
                                return (
                                    <div
                                        key={participant.id}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {participant.username[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-900">{participant.username}</p>
                                                {isHost && participant.id === user?.id && (
                                                    <Crown size={16} className="text-yellow-500" />
                                                )}
                                            </div>
                                            {team && (
                                                <p className="text-sm text-slate-500">
                                                    {team.logo} {team.shortName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {participants.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                    <User size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No players yet</p>
                                </div>
                            )}
                        </div>

                        {/* Bots Info */}
                        {participants.length > 0 && participants.length < 10 && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-800">
                                    <strong>🤖 {10 - participants.length} bots</strong> will fill the remaining slots
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Team Selection */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {selectedTeam ? 'Your Team (click to change)' : 'Select Your Team'}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            {TEAMS.map((team) => {
                                const isTakenByOther = takenTeams.includes(team.id) && selectedTeam !== team.id;
                                const isSelected = selectedTeam === team.id;

                                return (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team.id)}
                                        disabled={isTakenByOther}
                                        className={`p-4 rounded-2xl border-2 transition-all ${isSelected
                                                ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
                                                : isTakenByOther
                                                    ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                                                    : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">{team.logo}</div>
                                            <p className="font-bold text-slate-900 text-sm">{team.shortName}</p>
                                            {isTakenByOther && (
                                                <p className="text-xs text-red-600 mt-1">Taken</p>
                                            )}
                                            {isSelected && (
                                                <p className="text-xs text-green-600 mt-1">✓ Your Team</p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Start Button (Host Only) */}
                        {isHost && (
                            <div className="border-t border-slate-200 pt-6">
                                <button
                                    onClick={handleStartAuction}
                                    disabled={!selectedTeam || participants.length === 0}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                                >
                                    <Play size={24} />
                                    Start Auction
                                </button>
                                {!selectedTeam && (
                                    <p className="text-center text-sm text-red-600 mt-2">
                                        Please select your team first
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Waiting Message (Non-Host) */}
                        {!isHost && (
                            <div className="border-t border-slate-200 pt-6">
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                                    <p className="text-yellow-800 font-semibold">
                                        ⏳ Waiting for host to start the auction...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
