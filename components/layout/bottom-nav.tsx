"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
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
        // Central Button Placeholder
        { href: "/paylas", label: "OLUŞTUR", icon: Plus, isAction: true },
        { href: "/forum", label: "FORUM", icon: MessageCircle },
        { href: "/profil", label: "PROFİL", icon: User }
    ];

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[30] md:hidden transition-transform duration-300 ease-in-out",
            isVisible ? "translate-y-0" : "translate-y-16" // Adjusted translate to hide fully including floating button
        )}>
            <nav className="
                w-full
                bg-[#F2C32E]
                h-[52px]
                flex items-center justify-between
                px-6
                pb-safe
                relative
                border-t-2 border-black
                shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]
            ">
                {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                    // Central Floating Action Button
                    if (link.isAction) {
                        return (
                            <div key={link.href} className="relative -top-6">
                                <ViewTransitionLink
                                    href={link.href}
                                    className="
                                        flex items-center justify-center 
                                        w-16 h-16 
                                        rounded-full 
                                        bg-white 
                                        border-2 border-black 
                                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                        transform transition-transform active:scale-95
                                    "
                                >
                                    <Icon className="w-8 h-8 text-black stroke-[3px]" />
                                </ViewTransitionLink>
                            </div>
                        );
                    }

                    return (
                        <ViewTransitionLink
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 relative z-10",
                                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 text-black transition-all duration-300",
                                    isActive ? "stroke-[3px] fill-black/10" : "stroke-[2.5px]"
                                )}
                            />
                            {isActive && (
                                <div className="w-1 h-1 bg-black rounded-full mt-1" />
                            )}
                        </ViewTransitionLink>
                    );
                })}
            </nav>
        </div>
    );
}
