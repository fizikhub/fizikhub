"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getTimeLimitStatus, updateTimeUsed, TimeLimitStatus } from "@/app/time-limit/actions";
import { TimeExpired } from "./time-expired";

interface TimeLimitContextType {
    isTimeLimited: boolean;
    remainingSeconds: number;
    isExpired: boolean;
    isLoading: boolean;
}

const TimeLimitContext = createContext<TimeLimitContextType>({
    isTimeLimited: false,
    remainingSeconds: 600,
    isExpired: false,
    isLoading: true,
});

export function useTimeLimit() {
    return useContext(TimeLimitContext);
}

const UPDATE_INTERVAL = 30; // Save to database every 30 seconds

export function TimeLimitProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<TimeLimitStatus | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState(600);
    const [isLoading, setIsLoading] = useState(true);
    const [secondsSinceLastUpdate, setSecondsSinceLastUpdate] = useState(0);

    // Fetch initial status
    useEffect(() => {
        async function fetchStatus() {
            const result = await getTimeLimitStatus();
            setStatus(result);
            if (result) {
                setRemainingSeconds(result.remainingSeconds);
            }
            setIsLoading(false);
        }
        fetchStatus();
    }, []);

    // Countdown timer and periodic save
    useEffect(() => {
        if (!status?.isTimeLimited || status.isExpired) return;

        const interval = setInterval(async () => {
            setRemainingSeconds(prev => {
                const newRemaining = Math.max(0, prev - 1);
                return newRemaining;
            });

            setSecondsSinceLastUpdate(prev => {
                const newCount = prev + 1;

                // Save to database every UPDATE_INTERVAL seconds
                if (newCount >= UPDATE_INTERVAL) {
                    updateTimeUsed(UPDATE_INTERVAL);
                    return 0;
                }

                return newCount;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [status?.isTimeLimited, status?.isExpired]);

    // Save remaining time when user leaves page
    useEffect(() => {
        if (!status?.isTimeLimited) return;

        const handleBeforeUnload = () => {
            if (secondsSinceLastUpdate > 0) {
                // Use sendBeacon for reliable save on page unload
                navigator.sendBeacon('/api/time-limit/update', JSON.stringify({
                    seconds: secondsSinceLastUpdate
                }));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [status?.isTimeLimited, secondsSinceLastUpdate]);

    // Calculate hours/minutes until midnight reset
    const getTimeUntilReset = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    };

    const isExpired = remainingSeconds <= 0 && status?.isTimeLimited;

    // Show time expired screen if expired
    if (isExpired && !isLoading) {
        const { hours, minutes } = getTimeUntilReset();
        return <TimeExpired hoursUntilReset={hours} minutesUntilReset={minutes} />;
    }

    return (
        <TimeLimitContext.Provider value={{
            isTimeLimited: status?.isTimeLimited || false,
            remainingSeconds,
            isExpired: isExpired || false,
            isLoading,
        }}>
            {children}
        </TimeLimitContext.Provider>
    );
}
