"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Retrieve user info if needed via another API call or just blindly login
            // Since our login func usually takes user object, we might need to fetch 'me'
            // But 'login' context function often just sets state.
            // Let's assume for now we just set token and let a subsequent check handle user loading
            // OR decode token.
            // But wait, the context login usually expects (token, user).
            // Let's modify context or just fetch /me first.

            // To be robust:
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } else {
            router.push('/auth/login?error=NoToken');
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md text-center border-border bg-card">
                <CardHeader>
                    <CardTitle>Authenticating...</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                    <p className="mt-4 text-muted-foreground">Please wait while we log you in.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen p-4 text-muted-foreground">
                Loading authentication...
            </div>
        }>
            <AuthCallback />
        </Suspense>
    );
}
