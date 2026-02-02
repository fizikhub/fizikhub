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
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[30] md:hidden transition-all duration-300 ease-in-out w-[90%] max-w-[320px]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-[100px] opacity-0"
        )}>
            {/* 
                V32 PREMIUM FLOATING DOCK
                - Style: Neo-Brutalist Floating Capsule
                - Color: White Base, Black Borders
            */}
            <nav className="
                w-full
                bg-white
                h-[56px]
                flex items-center justify-between
                px-5
                rounded-2xl
                border-2 border-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                relative
                overflow-hidden
            ">
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
                                    ? "text-black -translate-y-1"
                                    : "text-neutral-400 hover:text-black active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive ? "stroke-[2.5px] fill-black" : "stroke-[2px]"
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
