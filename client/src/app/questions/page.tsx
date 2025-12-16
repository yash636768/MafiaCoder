"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Building2, TrendingUp, Target, Award, Search, Filter, X } from 'lucide-react';

interface Problem {
    _id: string;
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
    companies: string[];
    acceptanceRate: number;
}

const COMPANIES = [
    { name: "Google", color: "from-blue-500 to-green-500", icon: "🔍" },
    { name: "Amazon", color: "from-orange-500 to-yellow-500", icon: "📦" },
    { name: "Microsoft", color: "from-blue-600 to-cyan-500", icon: "🪟" },
    { name: "Meta", color: "from-blue-500 to-purple-500", icon: "👥" },
    { name: "Apple", color: "from-gray-600 to-gray-400", icon: "🍎" },
    { name: "Goldman Sachs", color: "from-blue-700 to-blue-900", icon: "💰" },
    { name: "Uber", color: "from-black to-gray-700", icon: "🚗" },
    { name: "Adobe", color: "from-red-600 to-pink-500", icon: "🎨" },
    { name: "Netflix", color: "from-red-600 to-red-800", icon: "🎬" },
    { name: "Walmart", color: "from-blue-500 to-yellow-400", icon: "🛒" },
    { name: "LinkedIn", color: "from-blue-600 to-blue-700", icon: "💼" },
    { name: "Airbnb", color: "from-pink-500 to-red-500", icon: "🏠" },
    { name: "Stripe", color: "from-purple-600 to-indigo-600", icon: "💳" },
    { name: "PayPal", color: "from-blue-500 to-blue-600", icon: "💵" },
    { name: "Salesforce", color: "from-cyan-500 to-blue-600", icon: "☁️" },
    { name: "Oracle", color: "from-red-600 to-red-700", icon: "🔴" },
    { name: "IBM", color: "from-blue-700 to-blue-900", icon: "🔷" },
    { name: "Cisco", color: "from-blue-500 to-teal-500", icon: "🌐" },
];

export default function QuestionsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ difficulty: '', company: '', tag: '', search: '' });
    const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                // Construct query params (excluding search for server-side filtering if API doesn't support it yet, 
                // but here we'll filter client-side for search to be instant)
                const queryParams = { ...filter };
                delete (queryParams as any).search; // Remove search from API call if handled client-side

                const query = new URLSearchParams(
                    Object.entries(queryParams).filter(([_, v]) => v !== '')
                ).toString();

                const res = await api.get(`/problems?${query}`);
                setProblems(res.data);

                // Calculate stats based on ALL problems (before client-side search filter)
                const total = res.data.length;
                const easy = res.data.filter((p: Problem) => p.difficulty === 'Easy').length;
                const medium = res.data.filter((p: Problem) => p.difficulty === 'Medium').length;
                const hard = res.data.filter((p: Problem) => p.difficulty === 'Hard').length;
                setStats({ total, easy, medium, hard });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, [filter.difficulty, filter.company, filter.tag]); // Re-fetch when these change

    // Client-side filtering for search
    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filter.search.toLowerCase()))
    );

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-muted-foreground';
        }
    };

    const selectedCompany = COMPANIES.find(c => c.name === filter.company);

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent mb-2">
                        The Hit List
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Select your target. Execute the code. Rise in the ranks.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <Filter className="h-4 w-4 mr-2" /> Filters
                    </Button>
                    <Button
                        onClick={() => api.post('/problems/seed').then(() => window.location.reload())}
                        className="bg-secondary hover:bg-secondary/80 text-foreground"
                    >
                        ↻ Reset Targets
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border bg-card/50 backdrop-blur hover:bg-card transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Targets</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur hover:bg-card transition-colors group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/10 ring-1 ring-green-500/20 group-hover:bg-green-500/20 transition-colors">
                            <TrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-500">{stats.easy}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rookie</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur hover:bg-card transition-colors group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                            <Award className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-500">{stats.medium}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hitman</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur hover:bg-card transition-colors group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 group-hover:bg-red-500/20 transition-colors">
                            <Building2 className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-500">{stats.hard}</p>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Godfather</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search Bar */}
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-2 rounded-xl shadow-sm">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by title or tag..."
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            className="w-full bg-secondary/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        />
                    </div>

                    <div className="h-8 w-px bg-border hidden md:block" />

                    {/* Difficulty Pills */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setFilter({ ...filter, difficulty: filter.difficulty === diff ? '' : diff })}
                                className={`
                                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border
                                    ${filter.difficulty === diff
                                        ? diff === 'Easy' ? 'bg-green-500/20 text-green-500 border-green-500/50' :
                                            diff === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                                                'bg-red-500/20 text-red-500 border-red-500/50'
                                        : 'bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground'
                                    }
                                `}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-border hidden md:block" />

                    {/* Clear Filters */}
                    {(filter.difficulty || filter.company || filter.search) && (
                        <button
                            onClick={() => setFilter({ difficulty: '', company: '', tag: '', search: '' })}
                            className="ml-auto text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <X className="h-3 w-3" /> Clear Filters
                        </button>
                    )}
                </div>

                {/* Company Filter (Horizontal Scroll) */}
                <div className="relative group">
                    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 no-scrollbar mask-linear-fade">
                        {COMPANIES.map((company) => (
                            <button
                                key={company.name}
                                onClick={() => setFilter({ ...filter, company: filter.company === company.name ? '' : company.name })}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 whitespace-nowrap
                                    ${filter.company === company.name
                                        ? `bg-gradient-to-r ${company.color} text-white border-transparent shadow-lg scale-105`
                                        : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/50'
                                    }
                                `}
                            >
                                <span className="text-lg">{company.icon}</span>
                                <span className={`text-sm font-medium ${filter.company === company.name ? 'text-white' : 'text-muted-foreground'}`}>
                                    {company.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Filter Banner */}
            {selectedCompany && (
                <div className={`rounded-xl p-6 bg-gradient-to-r ${selectedCompany.color} relative overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl bg-white/10 p-3 rounded-2xl backdrop-blur-md shadow-inner">
                                {selectedCompany.icon}
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Target: {selectedCompany.name}</h2>
                                <p className="text-white/80 font-medium">
                                    {filteredProblems.length} mission{filteredProblems.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setFilter({ ...filter, company: '' })}
                            className="text-white hover:bg-white/20 border border-white/20"
                        >
                            <X className="h-4 w-4 mr-2" /> Abort Filter
                        </Button>
                    </div>
                </div>
            )}

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    // Skeleton Loading
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="h-48 animate-pulse bg-secondary/50 border-border" />
                    ))
                ) : filteredProblems.map((problem, index) => (
                    <Link key={problem._id} href={`/questions/${problem.slug}`}>
                        <Card
                            className="group relative h-full hover:-translate-y-1 transition-all duration-300 border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono">
                                        AC: {problem.acceptanceRate}%
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {problem.title}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {problem.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                            #{tag}
                                        </span>
                                    ))}
                                    {problem.tags.length > 3 && (
                                        <span className="text-xs text-muted-foreground px-1">+{problem.tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {problem.companies?.slice(0, 3).map((c, i) => {
                                            const comp = COMPANIES.find(co => co.name === c);
                                            return comp ? (
                                                <div key={i} className="w-6 h-6 rounded-full bg-secondary border border-card flex items-center justify-center text-xs" title={c}>
                                                    {comp.icon}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                    <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                                        Accept Mission <Target className="h-4 w-4" />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {!loading && filteredProblems.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6 animate-bounce">
                        <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No Targets Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        We couldn't find any problems matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button
                        onClick={() => setFilter({ difficulty: '', company: '', tag: '', search: '' })}
                        variant="outline"
                    >
                        Clear All Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
