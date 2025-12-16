"use client";

import { Trophy, ShieldAlert, Swords } from 'lucide-react';

export default function ContestHero() {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card/30 mb-10 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/50 to-background pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                        <ShieldAlert className="h-3 w-3" />
                        Warzone Active
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-foreground">
                        THE <span className="text-primary">WAR ROOM</span>
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Prove your worth in the underground. Participate in high-stakes coding battles, crush your enemies, and claim your territory on the leaderboard.
                    </p>
                </div>

                <div className="hidden md:flex items-center justify-center">
                    <div className="relative">
                        <Swords className="h-32 w-32 text-primary opacity-20 transform -rotate-12" />
                        <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
