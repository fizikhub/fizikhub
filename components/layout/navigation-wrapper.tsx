"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load components for better initial page load performance
const Footer = dynamic(
    () => import("@/components/layout/footer").then(mod => mod.Footer)
);

const GlobalAdminNotification = dynamic(
    () => import("@/components/global-admin-notification").then(mod => mod.default),
    { ssr: false }
);

const DesktopSidebar = dynamic(
    () => import("@/components/layout/desktop-sidebar").then(mod => mod.DesktopSidebar)
);



export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showDesktopSidebar, setShowDesktopSidebar] = useState(false);
    const [loadDeferredChrome, setLoadDeferredChrome] = useState(false);
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)");
        const update = () => setShowDesktopSidebar(media.matches);

        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        const enable = () => setLoadDeferredChrome(true);

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(enable, { timeout: 5000 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = setTimeout(enable, 3000);
        return () => clearTimeout(timeoutId);
    }, []);

    if (shouldHideNav) {
        return <div className="flex-1">{children}</div>;
    }

    return (
        <>
            {loadDeferredChrome && <GlobalAdminNotification />}
            <Navbar />
            {showDesktopSidebar && <DesktopSidebar />}
            
            <div className="md:pl-[80px] lg:pl-[260px] flex flex-col min-h-[100dvh] transition-all duration-300">
                {children}
                <Footer />
            </div>
            
            <BottomNav />
        </>
    );
}
