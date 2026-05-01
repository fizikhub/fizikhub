"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";




import dynamic from "next/dynamic";

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



const BottomNav = dynamic(
    () => import("@/components/layout/bottom-nav").then(mod => mod.BottomNav)
);


export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide navigation on onboarding and auth pages (login, verify) for a cleaner focus
    const shouldHideNav = pathname?.startsWith("/onboarding") || pathname?.startsWith("/auth");

    if (shouldHideNav) {
        return <div className="flex-1">{children}</div>;
    }

    return (
        <>
            <GlobalAdminNotification />
            <Navbar />
            <DesktopSidebar />
            
            <div className="md:pl-[80px] lg:pl-[260px] flex flex-col min-h-[100dvh] transition-all duration-300">
                {children}
                <Footer />
            </div>
            
            <BottomNav />
        </>
    );
}
