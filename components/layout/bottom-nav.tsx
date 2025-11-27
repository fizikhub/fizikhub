"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Home, BookOpen, MessageCircle, Shield, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            href: "#search", // Special case
            label: "Ara",
            icon: Search,
            onClick: () => setIsSearchOpen(true)
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
            {/* iOS 26 Style Liquid Glass Bottom Navigation - Refined */}
            <div className="fixed bottom-0 left-0 z-50 w-full px-6 pb-6 md:hidden pointer-events-none">
                <div className="relative pointer-events-auto">
                    {/* Liquid Glass Container */}
                    <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-background/60 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/10">
                        {/* Subtle gradient overlay for depth and shine */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

                        {/* Navigation Items */}
                        <div className="relative flex h-[68px] items-center justify-around px-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href || (link.href !== "/" && link.href !== "#search" && pathname.startsWith(link.href));

                                if (link.href === "#search") {
                                    return (
                                        <button
                                            key={link.href}
                                            onClick={link.onClick}
                                            className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] group"
                                        >
                                            {/* Icon with scale animation */}
                                            <div className="relative">
                                                <Icon className="h-[22px] w-[22px] text-muted-foreground/80 group-hover:text-foreground transition-all duration-300 group-hover:scale-110" />
                                            </div>
                                            <span className="text-[9px] font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300">
                                                {link.label}
                                            </span>
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] group"
                                    >
                                        {/* Active indicator - Soft Glow */}
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-2xl bg-primary/15 shadow-[0_0_15px_rgba(var(--primary),0.3)] backdrop-blur-sm scale-90 transition-all duration-500 ease-out" />
                                        )}

                                        {/* Icon with scale animation */}
                                        <div className="relative z-10">
                                            <Icon
                                                className={cn(
                                                    "h-[22px] w-[22px] transition-all duration-300",
                                                    isActive
                                                        ? "text-primary fill-current scale-110 drop-shadow-sm"
                                                        : "text-muted-foreground/80 group-hover:text-foreground group-hover:scale-110"
                                                )}
                                            />
                                        </div>

                                        <span className={cn(
                                            "text-[9px] font-medium transition-colors duration-300 relative z-10",
                                            isActive
                                                ? "text-primary font-semibold"
                                                : "text-muted-foreground/80 group-hover:text-foreground"
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
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
