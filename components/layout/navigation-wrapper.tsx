"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    if (shouldHideNav) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </>
    );
}
