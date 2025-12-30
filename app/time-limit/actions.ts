"use server";

import { createClient } from "@/lib/supabase-server";

export interface TimeLimitStatus {
    isTimeLimited: boolean;
    dailyTimeUsedSeconds: number;
    remainingSeconds: number;
    isExpired: boolean;
}

const DAILY_LIMIT_SECONDS = 300; // 5 minutes

export async function getTimeLimitStatus(): Promise<TimeLimitStatus | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_time_limited, daily_time_used_seconds, time_limit_reset_date')
        .eq('id', user.id)
        .single();

    if (error || !profile) return null;

    // Not a time-limited user
    if (!profile.is_time_limited) {
        return {
            isTimeLimited: false,
            dailyTimeUsedSeconds: 0,
            remainingSeconds: DAILY_LIMIT_SECONDS,
            isExpired: false
        };
    }

    // Check if we need to reset (new day)
    const today = new Date().toISOString().split('T')[0];
    let timeUsed = profile.daily_time_used_seconds || 0;

    if (profile.time_limit_reset_date !== today) {
        // New day, reset the counter
        await supabase
            .from('profiles')
            .update({
                daily_time_used_seconds: 0,
                time_limit_reset_date: today
            })
            .eq('id', user.id);
        timeUsed = 0;
    }

    const remaining = Math.max(0, DAILY_LIMIT_SECONDS - timeUsed);

    return {
        isTimeLimited: true,
        dailyTimeUsedSeconds: timeUsed,
        remainingSeconds: remaining,
        isExpired: remaining <= 0
    };
}

export async function updateTimeUsed(additionalSeconds: number): Promise<{ success: boolean; remaining: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, remaining: 0 };

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_time_limited, daily_time_used_seconds, time_limit_reset_date')
        .eq('id', user.id)
        .single();

    if (!profile || !profile.is_time_limited) {
        return { success: true, remaining: DAILY_LIMIT_SECONDS };
    }

    // Check if we need to reset (new day)
    const today = new Date().toISOString().split('T')[0];
    let currentTime = profile.daily_time_used_seconds || 0;

    if (profile.time_limit_reset_date !== today) {
        currentTime = 0;
    }

    const newTimeUsed = currentTime + additionalSeconds;

    const { error } = await supabase
        .from('profiles')
        .update({
            daily_time_used_seconds: newTimeUsed,
            time_limit_reset_date: today
        })
        .eq('id', user.id);

    if (error) {
        console.error('Failed to update time used:', error);
        return { success: false, remaining: Math.max(0, DAILY_LIMIT_SECONDS - currentTime) };
    }

    return {
        success: true,
        remaining: Math.max(0, DAILY_LIMIT_SECONDS - newTimeUsed)
    };
}
