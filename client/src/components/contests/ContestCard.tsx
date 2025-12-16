"use client";

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Calendar, Clock, Users, ArrowRight, Video, Target, Crosshair } from 'lucide-react';
import Countdown from '@/components/Countdown';

interface Contest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: string;
    participants: any[];
}

export default function ContestCard({ contest, index }: { contest: Contest; index: number }) {
    const isLive = contest.status === 'Live';
    const isEnded = contest.status === 'Ended';

    return (
        <Card
            className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isLive
                    ? 'border-red-500/50 bg-gradient-to-br from-red-950/20 to-background shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                    : isEnded
                        ? 'border-border/50 bg-card/50 opacity-80 hover:opacity-100'
                        : 'border-border hover:border-primary/50 bg-card'
                }`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Background Accents */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${isLive ? 'from-red-600/10' : 'from-primary/5'} to-transparent rounded-bl-full pointer-events-none`} />

            <CardContent className="p-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-2xl font-bold group-hover:text-primary transition-colors ${isLive ? 'text-red-500' : ''}`}>
                                    {contest.title}
                                </h3>
                                {isLive && (
                                    <span className="px-2 py-1 text-xs font-bold bg-red-500/20 text-red-500 rounded-full animate-pulse flex items-center gap-1 border border-red-500/20">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                        LIVE COMBAT
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground line-clamp-2 max-w-2xl text-sm">{contest.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {new Date(contest.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                {Math.round((new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / 60000)} mins
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
                                <Users className="h-3.5 w-3.5 text-primary" />
                                {contest.participants.length} Soldiers
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4 min-w-[200px] border-l border-border/50 pl-6 md:items-end">
                        {contest.status === 'Upcoming' && (
                            <div className="text-center space-y-1 mb-2">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Operation Starts In</p>
                                <div className="text-primary font-mono text-lg font-bold bg-primary/5 px-4 py-1 rounded border border-primary/20">
                                    <Countdown targetDate={contest.startTime} />
                                </div>
                            </div>
                        )}

                        <div className="w-full">
                            <Link href={`/contests/${contest._id}`}>
                                <Button
                                    className={`w-full gap-2 transition-all duration-300 font-bold tracking-wide ${isLive
                                            ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'
                                            : isEnded
                                                ? 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                                                : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
                                        }`}
                                    size="lg"
                                >
                                    {isLive ? (
                                        <>
                                            <Crosshair className="h-4 w-4 animate-spin-slow" />
                                            ENTER ARENA
                                        </>
                                    ) : isEnded ? (
                                        <>
                                            View Reports
                                        </>
                                    ) : (
                                        <>
                                            REGISTER
                                            <Target className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
