"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
            "fixed bottom-0 left-0 right-0 z-[100] md:hidden transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-full"
        )}>
            {/* 
                V28 BOTTOM NAV: FIXED & COMPACT
                - Position: Fixed Bottom (Edge to Edge)
                - Height: h-14 (56px) - Reduced from h-16
                - Style: Flat Yellow Bar with Top Border
                - Removed: Floating margins, rounded corners
            */}
            <nav className="
                w-full
                bg-[#F2C32E] 
                border-t-[3px] border-black 
                shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]
                h-14
                flex items-center justify-between
                px-4
                pb-safe
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
                                "flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                                // Active: Black Box
                                isActive
                                    ? "bg-black text-white shadow-none"
                                    : "text-black hover:bg-black/10 active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5",
                                    isActive ? "stroke-[3px]" : "stroke-[2.5px]"
                                )}
                            />
                        </ViewTransitionLink>
                    );
                })}
            </nav>
        </div>
    );
}
