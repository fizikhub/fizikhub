import { PremiumTour } from "@/components/onboarding/premium-tour";
import { getOnboardingStatus } from "@/app/auth/actions";

export async function OnboardingCheck() {
    const status = await getOnboardingStatus();

    // Güvenlik kontrolü: Eğer status veya shouldShowOnboarding yoksa gösterme
    if (!status || !status.shouldShowOnboarding) return null;

    return <PremiumTour />;
}
