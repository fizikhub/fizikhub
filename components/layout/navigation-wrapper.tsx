"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";


import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import dynamic from "next/dynamic";

const DailyGreeting = dynamic(
    () => import("@/components/ui/daily-greeting").then(mod => mod.DailyGreeting),
    { ssr: false }
);

const GlobalAdminNotification = dynamic(
    () => import("@/components/global-admin-notification").then(mod => mod.GlobalAdminNotification),
    { ssr: false }
);

const GlobalEffects = dynamic(
    () => import("@/components/effects/global-effects").then(mod => mod.GlobalEffects),
    { ssr: false }
);

const FloatingActionButton = dynamic(
    () => import("@/components/layout/floating-action-button").then(mod => mod.FloatingActionButton),
    { ssr: false }
);

export function NavigationWrapper({ children, showOnboarding = false }: { children: React.ReactNode; showOnboarding?: boolean }) {
    const pathname = usePathname();
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    if (shouldHideNav) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            <GlobalEffects />
            <GlobalAdminNotification />
            {showOnboarding && <OnboardingTour />}
            <Navbar />
            {children}
            <Footer />
            <BottomNav />
            <DailyGreeting />
            <FloatingActionButton />
        </>
    );
}
