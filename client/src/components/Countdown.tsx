"use client";

import { useEffect, useState } from 'react';

interface CountdownProps {
    targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return <span className="text-muted-foreground">Started</span>;

    return (
        <div className="flex gap-2 text-xs font-mono">
            {timeLeft.days > 0 && (
                <div className="flex flex-col items-center bg-primary/10 rounded px-2 py-1">
                    <span className="font-bold text-primary">{timeLeft.days}</span>
                    <span className="text-[10px] text-muted-foreground">d</span>
                </div>
            )}
            <div className="flex flex-col items-center bg-primary/10 rounded px-2 py-1">
                <span className="font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground">h</span>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded px-2 py-1">
                <span className="font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground">m</span>
            </div>
            <div className="flex flex-col items-center bg-primary/10 rounded px-2 py-1">
                <span className="font-bold text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-muted-foreground">s</span>
            </div>
        </div>
    );
}
