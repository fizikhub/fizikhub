import { createClient } from "@/lib/supabase-server";
import { DailyGreeting } from "@/components/ui/daily-greeting";

export async function GreetingWrapper() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        let userData = null;

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, full_name')
                .eq('id', user.id)
                .single();

            userData = profile;
        }

        return <DailyGreeting user={userData} />;
    } catch (error) {
        console.error("GreetingWrapper Error:", error);
        return <DailyGreeting user={null} />;
    }
}
