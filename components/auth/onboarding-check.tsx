"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getOnboardingStatus } from "@/app/auth/actions";

const PremiumTour = dynamic(() => import("@/components/onboarding/premium-tour").then((mod) => mod.PremiumTour), {
    ssr: false,
});

export function OnboardingCheck() {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        // Fetch onboarding status client-side to avoid calling cookies() in layout
        // This prevents 500 errors when Instagram bots/WebView hit the page
        const checkStatus = async () => {
            try {
                const status = await getOnboardingStatus();
                if (status?.shouldShowOnboarding) {
                    setShowOnboarding(true);
                }
            } catch {
                // Silently fail — onboarding is non-critical
            }
        };

        // Defer to idle time so we don't block initial paint
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => checkStatus(), { timeout: 3000 });
        } else {
            setTimeout(checkStatus, 1500);
        }
    }, []);

    if (!showOnboarding) return null;

    return <PremiumTour />;
}
