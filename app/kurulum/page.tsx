import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { OnboardingProfileSetup } from "@/components/onboarding/onboarding-profile-setup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profilini Tamamla | Fizikhub",
    description: "Fizikhub hesabını tamamla ve bilimin eğlenceli dünyasına giriş yap.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function OnboardingSetupPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // If they already completed onboarding, redirect them to home so they can see the tour.
    if (profile?.onboarding_completed) {
        redirect("/");
    }

    return <OnboardingProfileSetup user={user} profile={profile} />;
}
