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
            console.log("GreetingWrapper: User found:", user.id);
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('username, full_name')
                .eq('id', user.id)
                .single();

            if (error) console.error("GreetingWrapper: Profile fetch error:", error);
            userData = profile;
        } else {
            console.log("GreetingWrapper: No user session found.");
        }

        console.log("GreetingWrapper: Passing user data to client:", userData);
        return <DailyGreeting user={userData} />;
    } catch (error) {
        console.error("GreetingWrapper Error:", error);
        return <DailyGreeting user={null} />;
    }
}
