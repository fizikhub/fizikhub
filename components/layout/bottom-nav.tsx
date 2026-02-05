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

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-[50] md:hidden transition-transform duration-300 ease-in-out font-sans",
            isVisible ? "translate-y-0" : "translate-y-20"
        )}>
            <nav className="
                w-full
                h-[42px]
                bg-[#FACC15]
                border-t border-black/10
                flex items-center justify-between
                px-6
                pb-safe
                relative
                backdrop-blur-sm
            ">
                <ViewTransitionLink href="/" className={cn("flex flex-col items-center gap-1 transition-transform active:scale-90", pathname === "/" ? "opacity-100" : "opacity-60")}>
                    <Home className={cn("w-5 h-5 text-black", pathname === "/" && "fill-black stroke-[2px]")} />
                </ViewTransitionLink>

                <ViewTransitionLink href="/makale" className={cn("flex flex-col items-center gap-1 transition-transform active:scale-90", pathname.startsWith("/makale") ? "opacity-100" : "opacity-60")}>
                    <BookOpen className={cn("w-5 h-5 text-black", pathname.startsWith("/makale") && "fill-black stroke-[2px]")} />
                </ViewTransitionLink>

                <ViewTransitionLink
                    href="/paylas"
                    className="
                        flex items-center justify-center
                        w-11 h-11
                        bg-white
                        border border-black/20
                        rounded-full
                        shadow-sm
                        active:scale-95 transition-all
                        hover:scale-105
                        mb-6
                        relative z-10
                    "
                >
                    <Plus className="w-5 h-5 text-black stroke-[2.5px]" />
                </ViewTransitionLink>

                <ViewTransitionLink href="/forum" className={cn("flex flex-col items-center gap-1 transition-transform active:scale-90", pathname.startsWith("/forum") ? "opacity-100" : "opacity-60")}>
                    <MessageCircle className={cn("w-5 h-5 text-black", pathname.startsWith("/forum") && "fill-black stroke-[2px]")} />
                </ViewTransitionLink>

                <ViewTransitionLink href="/profil" className={cn("flex flex-col items-center gap-1 transition-transform active:scale-90", pathname.startsWith("/profil") ? "opacity-100" : "opacity-60")}>
                    <User className={cn("w-5 h-5 text-black", pathname.startsWith("/profil") && "fill-black stroke-[2px]")} />
                </ViewTransitionLink>
            </nav>
        </div>
    );
}
