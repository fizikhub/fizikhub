"use client";

import Link from "next/link";
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
            // Show if at top or scrolling up
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            // Hide if scrolling down and not at top
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
            "fixed bottom-6 left-4 right-4 z-[100] md:hidden transition-all duration-300 ease-in-out pointer-events-none",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
        )}>
            {/* 
                NEO-BRUTAL FLOATING ISLAND
                - Bg: Fizik Yellow (#F2C32E)
                - Border: 3px Black
                - Shadow: Hard 4px Black
            */}
            <nav className="
                pointer-events-auto
                bg-[#F2C32E] 
                border-[3px] border-black 
                rounded-xl 
                shadow-[4px_4px_0px_0px_#000]
                h-16
                flex items-center justify-between
                px-2
            ">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200",
                                // Active: Black Box with White Icon
                                isActive
                                    ? "bg-black text-white translate-x-[1px] translate-y-[1px] shadow-none"
                                    : "text-black hover:bg-black/10 active:scale-95"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 mb-0.5",
                                    isActive ? "stroke-[3px]" : "stroke-[2.5px]"
                                )}
                            />
                            {/* <span className={cn(
                                "text-[8px] font-black uppercase tracking-wider",
                                isActive ? "text-white" : "text-black"
                            )}>
                                {link.label}
                            </span> */}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
