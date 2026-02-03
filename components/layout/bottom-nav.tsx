"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Feather, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const links = [
        { href: "/", label: "ANA SAYFA", icon: Home },
        { href: "/makale", label: "MAKALE", icon: BookOpen },
        { href: "/blog", label: "BLOG", icon: Feather },
        { href: "/forum", label: "FORUM", icon: MessageCircle },
        { href: "/profil", label: "PROFİL", icon: User }
    ];

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[30] md:hidden transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            {/* 
                V31 BOTTOM NAV: RETURN TO CLASSIC + TWEAKS
                - Icons: Classic set (Home, BookOpen, Feather, MessageCircle, User)
                - Style: Border-t black, slightly transparent
            */}
            <nav className="
                w-full
                bg-[#F2C32E]/90
                backdrop-blur-md
                h-[52px]
                flex items-center justify-between
                px-6
                pb-safe
                relative
                overflow-hidden
                border-t border-black
                shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]
            ">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-multiply"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                    return (
                        <ViewTransitionLink
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className={cn(
                                "flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative z-10 group",
                                isActive
                                    ? "text-black scale-110"
                                    : "text-black/60 hover:text-black active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive ? "stroke-[2.5px] fill-black/10" : "stroke-[2px]"
                                )}
                            />
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-black md:hidden"
                                />
                            )}
                        </ViewTransitionLink>
                    );
                })}
            </nav>
        </div>
    );
}
