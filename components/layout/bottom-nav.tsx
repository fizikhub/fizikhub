"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, BookOpen, MessageCircle, Shield, Search, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();


    const links = [
        {
            href: "/",
            label: "Ana Sayfa",
            icon: Home
        },
        {
            href: "/blog",
            label: "Makaleler",
            icon: BookOpen
        },
        {
            href: "/kesfet",
            label: "Keşfet",
            icon: Compass
        },
        {
            href: "/forum",
            label: "Forum",
            icon: MessageCircle
        },
        {
            href: "/profil",
            label: "Profil",
            icon: User
        }
    ];

    return (
        <>
            {/* iOS 26 Style Liquid Glass Bottom Navigation - Refined & Optimized */}
            <div className="fixed bottom-0 left-0 z-[100] w-full px-6 pb-6 md:hidden pointer-events-none">
                <div className="relative pointer-events-auto">
                    {/* Liquid Glass Container - Optimized blur and shadows for performance */}
                    <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-background/80 backdrop-blur-md backdrop-saturate-150 shadow-xl shadow-black/5 will-change-transform">
                        {/* Subtle gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

                        {/* Navigation Items */}
                        <div className="relative flex h-[68px] items-center justify-around px-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href || (link.href !== "/" && link.href !== "#search" && pathname.startsWith(link.href));

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        prefetch={true} // Ensure fast transitions
                                        className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] min-h-[60px] group touch-manipulation"
                                    >
                                        {/* Active indicator - Simplified for performance */}
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-2xl bg-primary/10 shadow-[0_0_10px_rgba(var(--primary),0.2)] scale-90 transition-transform duration-300 ease-out" />
                                        )}

                                        {/* Icon */}
                                        <div className="relative z-10">
                                            <Icon
                                                className={cn(
                                                    "h-[22px] w-[22px] transition-transform duration-200",
                                                    isActive
                                                        ? cn(
                                                            "text-primary fill-current scale-110",
                                                            link.href === "/kesfet" && "fill-none"
                                                        )
                                                        : "text-muted-foreground/80 group-active:scale-95"
                                                )}
                                            />
                                        </div>

                                        <span className={cn(
                                            "text-[9px] font-medium transition-colors duration-200 relative z-10",
                                            isActive
                                                ? "text-primary font-semibold"
                                                : "text-muted-foreground/80"
                                        )}>
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
