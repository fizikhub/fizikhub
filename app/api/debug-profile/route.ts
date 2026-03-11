import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // 1. Get first user
        const { data: users, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
            
        if (fetchError || !users || users.length === 0) {
            return NextResponse.json({ error: fetchError || "No users" }, { status: 500 });
        }
        
        const userId = users[0].id;
        
        // 2. Try update
        const { error: updateError, data } = await supabase
            .from('profiles')
            .update({ 
                bio: "Test 123",
                full_name: "Test Name",
                website: "https://test.com",
                social_links: { twitter: "test" },
                cover_offset_y: 50,
                onboarding_completed: true
            })
            .eq('id', userId)
            .select();
            
        if (updateError) {
            return NextResponse.json({ updateError });
        }
        
        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        return NextResponse.json({ caughtError: e.message || String(e) });
    }
}
