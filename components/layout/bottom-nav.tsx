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
            "fixed bottom-4 left-4 right-4 z-[50] md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-24 opacity-0 scale-95"
        )}>
            <nav className="
                w-full
                h-[68px]
                bg-[#FACC15]
                border-[3px] border-black
                rounded-[24px]
                shadow-[0px_8px_0px_0px_#000]
                flex items-center justify-between
                px-6
                relative
                overflow-hidden
            ">
                {/* Gloss effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                <ViewTransitionLink href="/" className={cn("flex flex-col items-center gap-1 transition-all active:scale-90 relative z-10", pathname === "/" ? "scale-110" : "opacity-70")}>
                    <Home className={cn("w-5 h-5 text-black", pathname === "/" && "fill-black stroke-[2.5px]")} />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-black">Ana</span>
                </ViewTransitionLink>

                <ViewTransitionLink href="/makale" className={cn("flex flex-col items-center gap-1 transition-all active:scale-90 relative z-10", pathname.startsWith("/makale") ? "scale-110" : "opacity-70")}>
                    <BookOpen className={cn("w-5 h-5 text-black", pathname.startsWith("/makale") && "fill-black stroke-[2.5px]")} />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-black">Keşfet</span>
                </ViewTransitionLink>

                <ViewTransitionLink
                    href="/paylas"
                    className="
                        flex items-center justify-center
                        w-12 h-12
                        bg-white
                        border-[3px] border-black
                        rounded-2xl
                        shadow-[3px_3px_0px_0px_#000]
                        active:scale-90 active:shadow-none transition-all
                        hover:scale-110
                        relative z-20
                        -mt-2
                    "
                >
                    <Plus className="w-6 h-6 text-black stroke-[3px]" />
                </ViewTransitionLink>

                <ViewTransitionLink href="/forum" className={cn("flex flex-col items-center gap-1 transition-all active:scale-90 relative z-10", pathname.startsWith("/forum") ? "scale-110" : "opacity-70")}>
                    <MessageCircle className={cn("w-5 h-5 text-black", pathname.startsWith("/forum") && "fill-black stroke-[2.5px]")} />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-black">Forum</span>
                </ViewTransitionLink>

                <ViewTransitionLink href="/profil" className={cn("flex flex-col items-center gap-1 transition-all active:scale-90 relative z-10", pathname.startsWith("/profil") ? "scale-110" : "opacity-70")}>
                    <User className={cn("w-5 h-5 text-black", pathname.startsWith("/profil") && "fill-black stroke-[2.5px]")} />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-black">Profil</span>
                </ViewTransitionLink>
            </nav>
        </div>
    );
}
