"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";

import { OnboardingTour } from "@/components/onboarding/onboarding-tour";

export function NavigationWrapper({ children, showOnboarding = false }: { children: React.ReactNode; showOnboarding?: boolean }) {
    const pathname = usePathname();
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    if (shouldHideNav) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            {/* TEST MODE: her zaman göster, sonra showOnboarding && yapılacak */}
            <OnboardingTour />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </>
    );
}
