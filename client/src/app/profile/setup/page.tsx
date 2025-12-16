"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [bio, setBio] = useState('');
    const [college, setCollege] = useState('');
    const [skills, setSkills] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/auth/profile', {
                bio,
                college,
                skills: skills.split(',').map(s => s.trim()),
                socials: { github, linkedin }
            });
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Complete Your Profile</CardTitle>
                    <CardDescription>Tell us about your mafia background</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <Input
                                placeholder="I write code that kills..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">College / Company</label>
                            <Input
                                placeholder="Mafia University"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Skills (comma separated)</label>
                            <Input
                                placeholder="React, Node.js, C++, Python"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GitHub</label>
                                <Input
                                    placeholder="github.com/username"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">LinkedIn</label>
                                <Input
                                    placeholder="linkedin.com/in/username"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
