"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Trophy, Target, Zap, TrendingUp, Calendar, ArrowUpRight, Code2, Brain, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchDashboardData();
        }
    }, [authLoading, user, router]);

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div>Failed to load dashboard.</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="text-foreground font-semibold">{user?.username}</span>. Your empire is growing.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/questions">
                        <Button className="bg-primary hover:bg-red-600 shadow-lg shadow-primary/20">
                            <Code2 className="mr-2 h-4 w-4" /> Solve Problems
                        </Button>
                    </Link>
                    <Link href="/contests">
                        <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                            <Trophy className="mr-2 h-4 w-4" /> Join Contest
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Mafia Level"
                    value={data.stats.mafiaLevel}
                    subtext={`XP: ${data.stats.xp}`}
                    icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                    trend="+15% XP" // TODO: Real calculation
                    trendUp={true}
                />
                <StatsCard
                    title="Total Solved"
                    value={data.stats.totalSolved}
                    subtext="Problems Crushed"
                    icon={<Target className="h-5 w-5 text-primary" />}
                    trend="+12 this week"
                    trendUp={true}
                />
                <StatsCard
                    title="Current Streak"
                    value={`${data.stats.streak} Days`}
                    subtext="Keep the fire burning"
                    icon={<Zap className="h-5 w-5 text-orange-500" />}
                    trend="Best: 14 Days"
                    trendUp={true}
                />
                <StatsCard
                    title="Mafia Rating"
                    value={data.stats.mafiaRating}
                    subtext={`Global Rank: #${data.stats.globalRank}`}
                    icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                    trend="Top 15%"
                    trendUp={true}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Activity Chart */}
                <Card className="col-span-4 border-border bg-card/50 backdrop-blur shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Activity Overview
                        </CardTitle>
                        <CardDescription>Your coding frequency over the last week</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data.activity}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--secondary)' }}
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Bar
                                    dataKey="solved"
                                    fill="var(--primary)"
                                    radius={[4, 4, 0, 0]}
                                    className="fill-primary"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Rating Growth Chart */}
                <Card className="col-span-3 border-border bg-card/50 backdrop-blur shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Rating Growth
                        </CardTitle>
                        <CardDescription>Your ascent to power</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={data.ratingGrowth}>
                                <defs>
                                    <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="rating" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRating)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Weak Topics */}
                <Card className="col-span-1 border-border bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base">Weak Spots</CardTitle>
                        <CardDescription>Areas needing reinforcement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.weakSpots.length > 0 ? (
                                data.weakSpots.map((spot: any, i: number) => (
                                    <TopicProgress key={i} topic={spot.topic} percentage={spot.percentage} color={spot.color} />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Keep solving to identify weak spots!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Suggested Problems */}
                <Card className="col-span-1 border-border bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            Recommended Problems
                        </CardTitle>
                        <CardDescription>Curated hits for you</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recommended && data.recommended.length > 0 ? (
                                data.recommended.map((prob: any, i: number) => (
                                    <Link href={`/questions/${prob.slug}`} key={i}>
                                        <SuggestedProblem title={prob.title} difficulty={prob.difficulty} />
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No recommendations yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Contests */}
                <Card className="col-span-1 border-border bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            Upcoming Wars
                        </CardTitle>
                        <CardDescription>Prepare for battle</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.upcomingContests && data.upcomingContests.length > 0 ? (
                                data.upcomingContests.map((contest: any, i: number) => (
                                    <ContestItem
                                        key={i}
                                        name={contest.title}
                                        time={new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', weekday: 'short' })}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No upcoming wars.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, subtext, icon, trend, trendUp }: any) {
    return (
        <Card className="border-border bg-card/50 backdrop-blur hover:bg-card transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{subtext}</span>
                    <span className={`ml-auto flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                        {trend} <ArrowUpRight className="h-3 w-3 ml-0.5" />
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

function TopicProgress({ topic, percentage, color }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="font-medium">{topic}</span>
                <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function SuggestedProblem({ title, difficulty }: any) {
    const color = difficulty === 'Easy' ? 'text-green-500 bg-green-500/10' :
        difficulty === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' :
            'text-red-500 bg-red-500/10';

    return (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors group">
            <span className="text-sm font-medium group-hover:text-primary transition-colors">{title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
                {difficulty}
            </span>
        </div>
    );
}

function ContestItem({ name, time, highlight }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{name}</span>
            <span className={`text-xs font-monoLine ${highlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                {time}
            </span>
        </div>
    );
}
