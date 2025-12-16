"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Trophy } from 'lucide-react';
import ContestCard from '@/components/contests/ContestCard';
import ContestHero from '@/components/contests/ContestHero';

interface Contest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    status: string;
    participants: any[];
}

export default function ContestsPage() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Live' | 'Ended'>('Upcoming');

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await api.get('/contests');
                setContests(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const filteredContests = contests.filter(c => {
        if (activeTab === 'Upcoming') return c.status === 'Upcoming';
        if (activeTab === 'Live') return c.status === 'Live';
        return c.status === 'Ended';
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Hero Section */}
            <ContestHero />

            <div className="container mx-auto max-w-6xl px-4">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-border mb-8">
                    {['Live', 'Upcoming', 'Ended'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 font-bold transition-all duration-300 relative uppercase tracking-wider text-sm ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Contest Grid */}
                <div className="grid gap-6">
                    {loading ? (
                        // Skeleton Loading
                        [1, 2, 3].map((i) => (
                            <Card key={i} className="border-border/50 bg-card/50">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6 animate-pulse">
                                        <div className="space-y-4 flex-1">
                                            <div className="h-8 w-1/3 bg-muted rounded" />
                                            <div className="h-4 w-2/3 bg-muted rounded" />
                                            <div className="flex gap-4">
                                                <div className="h-4 w-20 bg-muted rounded" />
                                                <div className="h-4 w-20 bg-muted rounded" />
                                            </div>
                                        </div>
                                        <div className="h-10 w-32 bg-muted rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredContests.length === 0 ? (
                        <div className="text-center py-24 text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border flex flex-col items-center gap-4">
                            <div className="p-4 bg-secondary rounded-full">
                                <Trophy className="h-8 w-8 opacity-40" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-lg">No {activeTab.toLowerCase()} battles found</p>
                                <p className="text-sm">The streets are quiet... for now.</p>
                            </div>
                        </div>
                    ) : (
                        filteredContests.map((contest, index) => (
                            <ContestCard key={contest._id} contest={contest} index={index} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
