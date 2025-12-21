"use client";

import { useTimeLimit } from "@/components/time-limit/time-limit-provider";
import { CountdownTimer } from "@/components/time-limit/countdown-timer";

export function ProfileTimeLimitDisplay() {
    const { isTimeLimited, remainingSeconds, isLoading } = useTimeLimit();

    if (isLoading || !isTimeLimited) return null;

    return (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-amber-400">Günlük Süre Limiti</h4>
                    <p className="text-xs text-white/50">Kalan süreniz</p>
                </div>
                <CountdownTimer remainingSeconds={remainingSeconds} />
            </div>
        </div>
    );
}
