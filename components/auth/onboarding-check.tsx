import { createClient } from "@/lib/supabase-server";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";

export async function OnboardingCheck() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('has_seen_onboarding')
        .eq('id', user.id)
        .single();

    if (profile && !profile.has_seen_onboarding) {
        return <OnboardingTour />;
    }

    return null;
}
