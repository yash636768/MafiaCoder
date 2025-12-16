"use client";

import Link from 'next/link';
import { Trophy, Target, Award, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface LeaderboardUser {
    rank: number;
    username: string;
    mafiaRating: number;
    totalSolved: number;
    streak: number;
    avatar?: string;
}

export default function LeaderboardTable({ users }: { users: LeaderboardUser[] }) {
    if (users.length === 0) {
        return <div className="text-center text-muted-foreground py-10">No other gangsters found.</div>;
    }

    return (
        <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Rank</th>
                                <th className="px-6 py-4 font-semibold">Mafioso</th>
                                <th className="px-6 py-4 font-semibold text-right">Rating</th>
                                <th className="px-6 py-4 font-semibold text-right">Solved</th>
                                <th className="px-6 py-4 font-semibold text-right">Streak</th>
                                <th className="px-6 py-4 font-semibold text-right">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr
                                    key={user.rank}
                                    className="group hover:bg-secondary/30 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono font-bold text-muted-foreground group-hover:text-foreground">
                                            #{user.rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {user.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="font-bold text-yellow-500">
                                            {user.mafiaRating}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground">
                                        {user.totalSolved}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                                            🔥 {user.streak}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={`/profile/${user.username}`}>
                                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
