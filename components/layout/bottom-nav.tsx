"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if at top or scrolling up
            if (currentScrollY < 10 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            // Hide if scrolling down and not at top
            else if (currentScrollY > lastScrollY && currentScrollY > 10) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const links = [
        {
            href: "/",
            label: "ANA SAYFA",
            icon: Home
        },
        {
            href: "/blog",
            label: "MAKALE",
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
            label: "PROFİL",
            icon: User
        }
    ];

    return (
        <div className={cn(
            "fixed bottom-0 left-0 w-full z-[100] md:hidden transition-all duration-300 ease-in-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-[100%] opacity-0"
        )}>
            <div className="bg-background/60 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.3)] dark:shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.5)]">
                {/* Premium top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex h-12 items-center justify-around px-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href !== "/" && link.href !== "#search" && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                prefetch={true}
                                className={cn(
                                    "relative flex flex-col items-center justify-center gap-0.5 px-1 min-w-[50px] h-full group transition-all nav-item-glow",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute top-0 w-full h-0.5 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                )}

                                <div className="relative z-10 transition-transform duration-200 group-active:scale-90">
                                    <Icon
                                        className={cn(
                                            "h-5 w-5",
                                            isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                                        )}
                                    />
                                </div>

                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-wider transition-colors duration-200",
                                    isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-70"
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Safe area padding for newer iPhones */}
                <div className="h-safe-area-bottom"></div>
            </div>
        </div>
    );
}
