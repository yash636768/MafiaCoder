"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Podium from '@/components/leaderboard/Podium';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Loader2 } from 'lucide-react';

interface LeaderboardUser {
    rank: number;
    username: string;
    mafiaRating: number;
    totalSolved: number;
    streak: number;
    avatar?: string;
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard/global');
                // Ensure users are sorted by rank
                const sorted = res.data.sort((a: LeaderboardUser, b: LeaderboardUser) => a.rank - b.rank);
                setUsers(sorted);
            } catch (err) {
                console.error(err);
                // Fallback mock data if API fails or is empty for demo/dev purposes
                if (users.length === 0) {
                    // Adding mock data so the UI doesn't look broken during development if backend is empty
                    setUsers([
                        { rank: 1, username: 'DonCorleone', mafiaRating: 2800, totalSolved: 420, streak: 55 },
                        { rank: 2, username: 'TonySoprano', mafiaRating: 2650, totalSolved: 380, streak: 42 },
                        { rank: 3, username: 'MichaelS', mafiaRating: 2500, totalSolved: 350, streak: 30 },
                        { rank: 4, username: 'TommyShelby', mafiaRating: 2400, totalSolved: 310, streak: 25 },
                        { rank: 5, username: 'VitoScarletta', mafiaRating: 2300, totalSolved: 280, streak: 15 },
                        { rank: 6, username: 'PaulieWalnuts', mafiaRating: 2100, totalSolved: 200, streak: 10 },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const topThree = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="min-h-screen bg-background text-foreground space-y-12 pb-20">
            {/* Hero Section */}
            <div className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,0,51,0.5)]">
                        THE HALL OF FAME
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Only the strongest families survive. Check your rank in the underworld hierarchy.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-16 container mx-auto px-4 md:px-6">
                    {/* The Podium */}
                    <section>
                        <Podium topThree={topThree} />
                    </section>

                    {/* The Rest of the Family */}
                    <section className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Rankings</h2>
                            <div className="h-[1px] flex-1 bg-border" />
                        </div>
                        <LeaderboardTable users={rest} />
                    </section>
                </div>
            )}
        </div>
    );
}
