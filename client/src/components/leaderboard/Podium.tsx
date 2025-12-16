"use client";

import { Trophy, Crown, Medal } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardUser {
    rank: number;
    username: string;
    mafiaRating: number;
    totalSolved: number;
    streak: number;
    avatar?: string;
}

export default function Podium({ topThree }: { topThree: LeaderboardUser[] }) {
    const first = topThree.find(u => u.rank === 1);
    const second = topThree.find(u => u.rank === 2);
    const third = topThree.find(u => u.rank === 3);

    const renderPodiumStep = (user: LeaderboardUser | undefined, position: 'first' | 'second' | 'third') => {
        if (!user) return <div className="w-1/3"></div>;

        const height = position === 'first' ? 'h-64' : position === 'second' ? 'h-48' : 'h-40';
        const color = position === 'first' ? 'bg-yellow-500' : position === 'second' ? 'bg-gray-400' : 'bg-orange-600';
        const borderColor = position === 'first' ? 'border-yellow-300' : position === 'second' ? 'border-gray-300' : 'border-orange-400';
        const glow = position === 'first' ? 'shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)]' : '';
        const delay = position === 'first' ? 'delay-300' : position === 'second' ? 'delay-150' : 'delay-0';

        return (
            <div className={`flex flex-col items-center justify-end w-full md:w-1/3 ${position === 'first' ? 'order-1 md:order-2' : position === 'second' ? 'order-2 md:order-1' : 'order-3'}`}>
                <div className={`flex flex-col items-center mb-4 transition-all duration-700 ease-out transform translate-y-0 opacity-100 ${delay}`}>

                    {/* Crown for #1 */}
                    {position === 'first' && (
                        <Crown className="h-10 w-10 text-yellow-500 mb-2 animate-bounce" />
                    )}

                    {/* Avatar Circle */}
                    <div className={`w-20 h-20 rounded-full border-4 ${borderColor} ${color} flex items-center justify-center mb-[-20px] z-10 shadow-lg`}>
                        <span className="text-2xl font-bold text-white">{user.username[0].toUpperCase()}</span>
                    </div>
                </div>

                {/* The Step */}
                <Link href={`/profile/${user.username}`} className="w-full">
                    <div className={`w-full ${height} ${color}/20 backdrop-blur-sm border-t-4 ${borderColor} rounded-t-xl flex flex-col items-center justify-start pt-8 pb-4 cursor-pointer hover:bg-opacity-30 transition-all ${glow} group`}>
                        <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{user.username}</p>
                        <div className="flex items-center gap-1 text-sm font-semibold opacity-80 mt-1">
                            <Trophy className="h-3 w-3" />
                            <span>{user.mafiaRating}</span>
                        </div>
                        <div className="mt-auto mb-2 text-2xl font-black opacity-20">
                            #{user.rank}
                        </div>
                    </div>
                </Link>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 min-h-[400px] max-w-4xl mx-auto px-4">
            {renderPodiumStep(second, 'second')}
            {renderPodiumStep(first, 'first')}
            {renderPodiumStep(third, 'third')}
        </div>
    );
}
