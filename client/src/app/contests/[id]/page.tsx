"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar, Clock, Trophy, AlertTriangle, CheckCircle, Users } from 'lucide-react';

interface Contest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    registrationDeadline: string;
    status: string;
    rules: string[];
    prizes: string[];
    participants: { user: string }[];
}

export default function ContestDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const res = await api.get(`/contests`); // Ideally get single contest
                const found = res.data.find((c: any) => c._id === id);
                if (found) {
                    setContest(found);
                    // Check if user is registered (mock check for now, ideally check against user ID)
                    const token = localStorage.getItem('token');
                    if (token) {
                        try {
                            const userRes = await api.get('/auth/me');
                            setUser(userRes.data);
                            const registered = found.participants.some((p: any) => p.user === userRes.data._id);
                            setIsRegistered(registered);
                        } catch (e) {
                            console.error("Auth check failed", e);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchContest();
    }, [id]);

    const handleRegister = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        setRegistering(true);
        try {
            await api.post(`/contests/${id}/register`);
            setIsRegistered(true);
            // Refresh contest data
            const res = await api.get('/contests');
            const found = res.data.find((c: any) => c._id === id);
            if (found) setContest(found);
        } catch (err: any) {
            alert(err.response?.data?.msg || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading mission details...</div>;
    if (!contest) return <div className="text-center py-12">Mission not found.</div>;

    const isRegistrationOpen = new Date() < new Date(contest.registrationDeadline || contest.startTime);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-8 md:p-12 text-center space-y-6 shadow-2xl shadow-primary/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm">
                    <Trophy className="h-4 w-4" />
                    {contest.status === 'Live' ? 'Active Operation' : 'Upcoming Operation'}
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    {contest.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{contest.description}</p>

                <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base py-4">
                    <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-lg border border-border/50 backdrop-blur-sm">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="text-left">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Start Time</p>
                            <p className="font-medium">{new Date(contest.startTime).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-lg border border-border/50 backdrop-blur-sm">
                        <Clock className="h-5 w-5 text-primary" />
                        <div className="text-left">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Duration</p>
                            <p className="font-medium">
                                {Math.round((new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / 60000)} mins
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-lg border border-border/50 backdrop-blur-sm">
                        <Users className="h-5 w-5 text-primary" />
                        <div className="text-left">
                            <p className="text-muted-foreground text-xs uppercase tracking-wider">Participants</p>
                            <p className="font-medium">{contest.participants.length}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    {isRegistered ? (
                        <div className="space-y-4 animate-in zoom-in duration-300">
                            <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-lg bg-green-500/10 py-2 px-4 rounded-full inline-flex">
                                <CheckCircle className="h-6 w-6" />
                                You are registered
                            </div>
                            {contest.status === 'Live' ? (
                                <div>
                                    <Button size="lg" className="w-full md:w-auto min-w-[200px] text-lg animate-pulse shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:shadow-[0_0_30px_rgba(var(--primary),0.8)] transition-all">
                                        Enter Arena
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Prepare yourself. The operation begins soon.</p>
                            )}
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full md:w-auto min-w-[200px] text-lg h-12 shadow-lg hover:scale-105 transition-all duration-300"
                            onClick={handleRegister}
                            disabled={!isRegistrationOpen || registering}
                        >
                            {registering ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Registering...
                                </span>
                            ) : isRegistrationOpen ? (
                                'Register Now'
                            ) : (
                                'Registration Closed'
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Rules & Guidelines */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-primary" />
                                Mission Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                {contest.rules && contest.rules.length > 0 ? contest.rules.map((rule, i) => (
                                    <li key={i} className="flex gap-3 text-muted-foreground">
                                        <span className="font-bold text-primary/50">{i + 1}.</span>
                                        {rule}
                                    </li>
                                )) : (
                                    <li className="text-muted-foreground">Standard Code Mafia rules apply. No cheating.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Prizes */}
                    {contest.prizes && contest.prizes.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Rewards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {contest.prizes.map((prize, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                                            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">
                                                {i + 1}
                                            </div>
                                            <span className="font-medium">{prize}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Registration Ends</p>
                                <p className="font-medium">
                                    {contest.registrationDeadline ? new Date(contest.registrationDeadline).toLocaleString() : 'When contest starts'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Contest Starts</p>
                                <p className="font-medium">{new Date(contest.startTime).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Contest Ends</p>
                                <p className="font-medium">{new Date(contest.endTime).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
