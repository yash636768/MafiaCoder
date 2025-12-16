"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Github,
    Linkedin,
    Twitter,
    Globe,
    MapPin,
    Calendar,
    Code,
    Trophy,
    Flame,
    Briefcase,
    Shield,
    Star,
    Fingerprint,
    FileText,
    Download
} from 'lucide-react';

interface UserProfile {
    username: string;
    email?: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    college?: string;
    location?: string;
    socials: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    mafiaLevel: string;
    xp: number;
    streak: number;
    mafiaRating: number;
    solvedProblems: string[];
    stats: {
        totalSolved: number;
        easy: number;
        medium: number;
        hard: number;
        contests: number;
        ranking: number;
    };
    recentActivity: Array<{
        date: string;
        count: number;
    }>;
}

export default function ProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/profile/${username}`);
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchProfile();
    }, [username]);



    const getActivityColor = (count: number) => {
        if (count === 0) return 'bg-secondary/30';
        if (count <= 1) return 'bg-red-950';
        if (count <= 2) return 'bg-red-800';
        if (count <= 3) return 'bg-red-600';
        return 'bg-red-500';
    };

    const getRankBadge = (rating: number) => {
        if (rating >= 2000) return { name: 'Godfather', color: 'from-purple-500 to-indigo-600', ring: 'ring-purple-500', icon: '👑' };
        if (rating >= 1800) return { name: 'Underboss', color: 'from-orange-500 to-red-600', ring: 'ring-orange-500', icon: '👹' };
        if (rating >= 1600) return { name: 'Capo', color: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500', icon: '💎' };
        if (rating >= 1400) return { name: 'Soldier', color: 'from-green-500 to-emerald-500', ring: 'ring-green-500', icon: '🔫' };
        return { name: 'Associate', color: 'from-gray-500 to-gray-600', ring: 'ring-gray-500', icon: '🐀' };
    };

    const renderHeatmap = () => {
        if (!profile) return null;

        // Ensure data is Oldest -> Newest (already reversed in generateMockActivity)
        const data = profile.recentActivity;
        const weeks = Math.ceil(data.length / 7);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const monthLabels: { label: string, weekIndex: number }[] = [];
        let lastMonth = -1;

        for (let w = 0; w < weeks; w++) {
            const dateStr = data[w * 7]?.date;
            if (!dateStr) continue;
            const date = new Date(dateStr);
            const m = date.getMonth();
            if (m !== lastMonth) {
                monthLabels.push({ label: months[m], weekIndex: w });
                lastMonth = m;
            }
        }

        return (
            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-max">
                    {/* Month Labels */}
                    <div className="flex text-xs text-muted-foreground mb-2 relative h-4">
                        {monthLabels.map((lbl, i) => (
                            <span
                                key={i}
                                style={{ left: `${lbl.weekIndex * 14}px` }} // 12px width + 2px gap (roughly) or grid unit
                                className="absolute"
                            >
                                {lbl.label}
                            </span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {data.map((day, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-[1px] ${getActivityColor(day.count)} hover:ring-1 ring-white/50 transition-all`}
                                title={`${day.date}: ${day.count} crimes committed`}
                            />
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-secondary/30" />
                        <div className="w-3 h-3 rounded-sm bg-red-950" />
                        <div className="w-3 h-3 rounded-sm bg-red-800" />
                        <div className="w-3 h-3 rounded-sm bg-red-600" />
                        <div className="w-3 h-3 rounded-sm bg-red-500" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs">LOADING</div>
            </div>
            <p className="text-muted-foreground font-mono animate-pulse">Accessing Criminal Records...</p>
        </div>
    );

    if (!profile) return <div className="flex justify-center items-center h-screen">User not found</div>;

    const rank = getRankBadge(profile.mafiaRating);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20 pt-8">
            <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">

                {/* Dossier Header */}
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                            <FileText className="h-10 w-10 text-primary" />
                            CONFIDENTIAL FILE
                        </h1>
                        <p className="font-mono text-sm text-primary mt-2">Subject: {profile.username.toUpperCase()}</p>
                    </div>
                    <Button variant="outline" className="hidden md:flex gap-2 border-white/10 hover:bg-white/5 font-mono text-xs uppercase tracking-widest">
                        <Download className="h-4 w-4" /> Export Dossier
                    </Button>
                </div>

                {/* Main Profile Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Identity Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-[#111] border-white/10 overflow-hidden relative">
                            {/* Tape Effect */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-500/10 rotate-[-2deg] border border-yellow-500/20 backdrop-blur-sm z-10" />

                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6 pt-12">
                                <div className={`relative w-40 h-40 rounded-full p-2 ring-4 ${rank.ring} ring-offset-4 ring-offset-[#111] shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black overflow-hidden flex items-center justify-center text-6xl font-black text-white/20">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                                        ) : (
                                            profile.username[0].toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-4 py-1 rounded-full bg-background border border-border text-2xl shadow-lg">
                                        {rank.icon}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white">{profile.username}</h2>
                                    <div className={`inline-flex px-3 py-1 rounded border border-white/10 bg-white/5 text-sm font-mono tracking-wider uppercase bg-gradient-to-r ${rank.color} bg-clip-text text-transparent font-bold`}>
                                        {rank.name}
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto italic">
                                    &quot;{profile.bio || "No known aliases. Operates in the shadows."}&quot;
                                </p>

                                <div className="w-full pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-left">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Location</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <MapPin className="h-3.5 w-3.5 text-primary" />
                                            {profile.location || "Unknown"}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Affiliation</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                                            {profile.college || "Freelance"}
                                        </div>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Active Since</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                            Nov 2024
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full justify-center pt-2">
                                    {profile.socials.github && <SocialButton icon={Github} href={profile.socials.github} />}
                                    {profile.socials.linkedin && <SocialButton icon={Linkedin} href={profile.socials.linkedin} />}
                                    {profile.socials.twitter && <SocialButton icon={Twitter} href={profile.socials.twitter} />}
                                    {profile.socials.website && <SocialButton icon={Globe} href={profile.socials.website} />}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Card */}
                        <Card className="bg-[#111] border-white/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Known Skills</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {profile.skills.length > 0 ? profile.skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono hover:border-primary/50 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                )) : (
                                    <span className="text-xs text-gray-500 italic">No special skills on record.</span>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Stats & Activity */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox
                                label="Mafia Rating"
                                value={profile.mafiaRating}
                                icon={Trophy}
                                color="text-yellow-500"
                            />
                            <StatBox
                                label="Global Rank"
                                value={`#${profile.stats.ranking}`}
                                icon={Globe}
                                color="text-blue-500"
                            />
                            <StatBox
                                label="Total Hits"
                                value={profile.stats.totalSolved}
                                icon={Target} // Using Target icon separately
                                color="text-green-500"
                            />
                            <StatBox
                                label="Current Streak"
                                value={profile.streak}
                                icon={Flame}
                                color="text-orange-500"
                                suffix="Days"
                            />
                        </div>

                        {/* Activity Heatmap */}
                        <Card className="bg-[#111] border-white/10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <Fingerprint className="h-5 w-5 text-primary" />
                                        Criminal Activity Record
                                    </CardTitle>
                                    <CardDescription>Frequency of code submissions over the last year</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {renderHeatmap()}
                            </CardContent>
                        </Card>

                        {/* Recent Problems & Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Difficulty Breakdown */}
                            <Card className="bg-[#111] border-white/10 relative overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                                        <Shield className="h-4 w-4" /> PERFORMANCE METRICS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Easy Hits</span>
                                            <span className="font-mono text-green-500">{profile.stats.easy} / 200</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${(profile.stats.easy / 200) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Medium Jobs</span>
                                            <span className="font-mono text-yellow-500">{profile.stats.medium} / 200</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500" style={{ width: `${(profile.stats.medium / 200) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Hard Assassinations</span>
                                            <span className="font-mono text-red-500">{profile.stats.hard} / 100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-600" style={{ width: `${(profile.stats.hard / 100) * 100}%` }} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Medals / Badges mockup */}
                            <Card className="bg-[#111] border-white/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                                        <Star className="h-4 w-4" /> HONORS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors group cursor-pointer text-center p-2">
                                            <Award className={`h-6 w-6 ${i % 2 === 0 ? 'text-yellow-500' : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                                            <span className="text-[10px] text-gray-500 font-mono leading-none">Badge {i}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon: Icon, color, suffix }: any) {
    return (
        <Card className="bg-[#111] border-white/10 hover:border-white/20 transition-all group">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                <Icon className={`h-5 w-5 mb-1 ${color} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                <p className="text-2xl font-black text-white font-mono tracking-tighter">{value}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label} {suffix && <span className="text-gray-600">{suffix}</span>}</p>
            </CardContent>
        </Card>
    );
}

function SocialButton({ icon: Icon, href }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-primary hover:scale-110 transition-all"
        >
            <Icon className="h-4 w-4" />
        </a>
    );
}

function Award({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
    )
}

function Target({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}
