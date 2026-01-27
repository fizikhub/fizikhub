"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";


import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import dynamic from "next/dynamic";

// Lazy load Footer for better initial page load performance
const Footer = dynamic(
    () => import("@/components/layout/footer").then(mod => mod.Footer),
    { ssr: false }
);

const GlobalAdminNotification = dynamic(
    () => import("@/components/global-admin-notification"),
    { ssr: false }
);

const GlobalEffects = dynamic(
    () => import("@/components/effects/global-effects").then(mod => mod.GlobalEffects),
);

const SlimeEffects = dynamic(
    () => import("@/components/effects/slime-effects").then(mod => mod.SlimeEffects),
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
            <SlimeEffects />
            <GlobalAdminNotification />
            {showOnboarding && <OnboardingTour />}
            <Navbar />
            {children}
            <Footer />
            <BottomNav />
            <FloatingActionButton />
        </>
    );
}
