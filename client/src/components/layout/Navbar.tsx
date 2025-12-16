"use client";

import { useAuth } from '@/context/AuthContext';
import { Bell, User, Settings, LogOut, Trophy, LayoutDashboard, Target, Award, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Question Bank', href: '/questions', icon: Target },
        { name: 'Contests', href: '/contests', icon: Trophy },
        { name: 'The Consigliere', href: '/consigliere', icon: MessageSquare },
        { name: 'Leaderboard', href: '/leaderboard', icon: Award },

    ];

    return (
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                M
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent hidden md:block">
                                MafiaCoder
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <button
                                            className={`
                                                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                                                ${isActive
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {link.name}
                                        </button>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 p-1.5 hover:bg-secondary rounded-full transition-colors border border-transparent hover:border-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-card">
                                    {user?.username?.[0]?.toUpperCase() || 'M'}
                                </div>
                                <div className="text-left hidden lg:block pr-2">
                                    <p className="text-sm font-semibold leading-none">{user?.username || 'Guest'}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Lvl {user?.mafiaLevel || 1} Crook</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-border bg-secondary/30">
                                            <p className="font-semibold text-foreground">{user?.username}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <Link href={`/profile/${user?.username}`} onClick={() => setShowDropdown(false)}>
                                                <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors text-left text-sm text-muted-foreground hover:text-foreground">
                                                    <User className="h-4 w-4" />
                                                    My Profile
                                                </button>
                                            </Link>
                                            <Link href="/profile/setup" onClick={() => setShowDropdown(false)}>
                                                <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-lg transition-colors text-left text-sm text-muted-foreground hover:text-foreground">
                                                    <Settings className="h-4 w-4" />
                                                    Settings
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-border">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors text-left text-sm"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
