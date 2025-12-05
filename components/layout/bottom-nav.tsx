"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, BookOpen, MessageCircle, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/",
            label: "ANA ÜS",
            icon: Home
        },
        {
            href: "/blog",
            label: "OKU",
            icon: BookOpen
        },
        {
            href: "/kesfet",
            label: "KEŞFET",
            icon: Compass
        },
        {
            href: "/forum",
            label: "FORUM",
            icon: MessageCircle
        },
        {
            href: "/profil",
            label: "KİMLİK",
            icon: User
        }
    ];

    <div className="fixed bottom-0 left-0 z-[100] w-full md:hidden">
        <div className="bg-background border-t border-black dark:border-white shadow-[0_-4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_-4px_0_0_rgba(255,255,255,1)]">
            <div className="flex h-16 items-center justify-around px-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/" && link.href !== "#search" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 px-1 min-w-[60px] h-full group transition-all",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                            )}

                            <div className="relative z-10 transition-transform duration-200 group-active:scale-90">
                                <Icon
                                    className={cn(
                                        "h-6 w-6",
                                        isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                                    )}
                                />
                            </div>

                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-wider transition-colors duration-200",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
        {/* Safe area spacer for iPhone home indicator */}
        <div className="h-safe-area-bottom bg-background border-t-0" />
    </div>
    );
}
