"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";


import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { DailyGreeting } from "@/components/ui/daily-greeting";

export function NavigationWrapper({ children, showOnboarding = false }: { children: React.ReactNode; showOnboarding?: boolean }) {
    const pathname = usePathname();
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    if (shouldHideNav) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            {showOnboarding && <OnboardingTour />}
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <BottomNav />
            <DailyGreeting />
        </>
    );
}
