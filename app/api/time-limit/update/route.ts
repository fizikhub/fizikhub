import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const additionalSeconds = body.seconds || 0;

        if (additionalSeconds <= 0) {
            return NextResponse.json({ success: true });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Not authenticated" });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_time_limited, daily_time_used_seconds, time_limit_reset_date')
            .eq('id', user.id)
            .single();

        if (!profile?.is_time_limited) {
            return NextResponse.json({ success: true });
        }

        const today = new Date().toISOString().split('T')[0];
        let currentTime = profile.daily_time_used_seconds || 0;

        if (profile.time_limit_reset_date !== today) {
            currentTime = 0;
        }

        await supabase
            .from('profiles')
            .update({
                daily_time_used_seconds: currentTime + additionalSeconds,
                time_limit_reset_date: today
            })
            .eq('id', user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Time limit update error:', error);
        return NextResponse.json({ success: false });
    }
}
