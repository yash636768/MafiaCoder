"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Trophy, Award, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/Button';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                    MafiaCoder
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4">
                <Link href="/dashboard">
                    <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Button>
                </Link>
                <Link href="/questions">
                    <Button variant={pathname === '/questions' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <Target className="h-5 w-5" />
                        Question Bank
                    </Button>
                </Link>
                <Link href="/contests">
                    <Button variant={pathname === '/contests' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <Trophy className="h-5 w-5" />
                        Contests
                    </Button>
                </Link>
                <Link href="/ai">
                    <Button variant={pathname === '/ai' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <MessageSquare className="h-5 w-5" />
                        AI Consigliere
                    </Button>
                </Link>
                <Link href={`/profile/${user?.username || 'me'}`}>
                    <Button variant={pathname.startsWith('/profile') ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <User className="h-5 w-5" />
                        My Profile
                    </Button>
                </Link>
                <Link href="/leaderboard">
                    <Button variant={pathname === '/leaderboard' ? 'default' : 'ghost'} className="w-full justify-start gap-2">
                        <Award className="h-5 w-5" />
                        Leaderboard
                    </Button>
                </Link>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
