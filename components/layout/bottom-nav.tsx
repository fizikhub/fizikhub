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
            "fixed bottom-4 left-4 right-4 z-[50] md:hidden transition-all duration-500 ease-out font-sans",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        )}>
            <nav className="
                w-full
                h-[64px]
                bg-white/90 dark:bg-black/90
                backdrop-blur-xl
                border-[2.5px] border-black dark:border-white/20
                rounded-2xl
                flex items-center justify-around
                px-2
                relative
                shadow-[0_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[0_8px_0px_0px_rgba(255,255,255,0.05)]
            ">
                <NavItem
                    href="/"
                    icon={Home}
                    label="Akış"
                    isActive={pathname === "/"}
                />

                <NavItem
                    href="/makale"
                    icon={BookOpen}
                    label="Blog"
                    isActive={pathname.startsWith("/makale")}
                />

                {/* CENTER BUTTON - INTEGRATED BRIDGE */}
                <div className="relative -top-5">
                    <div className="absolute inset-0 bg-black/20 dark:bg-white/10 blur-xl rounded-full translate-y-2 scale-75" />
                    <ViewTransitionLink
                        href="/paylas"
                        className="
                            flex items-center justify-center
                            w-14 h-14
                            bg-[#FACC15]
                            border-[3px] border-black
                            rounded-[20px]
                            shadow-[4px_4px_0px_0px_#000]
                            hover:scale-105 active:scale-95 active:shadow-none
                            active:translate-x-[2px] active:translate-y-[2px]
                            transition-all duration-200
                            relative z-10
                        "
                    >
                        <Plus className="w-8 h-8 text-black stroke-[4px]" />
                    </ViewTransitionLink>
                </div>

                <NavItem
                    href="/forum"
                    icon={MessageCircle}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                />

                <NavItem
                    href="/profil"
                    icon={User}
                    label="Profil"
                    isActive={pathname.startsWith("/profil")}
                />
            </nav>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <ViewTransitionLink
            href={href}
            className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-full relative group",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-400"
            )}
        >
            <div className="relative flex flex-col items-center justify-center w-full h-full">
                {/* SLIDING ACTIVE PILL */}
                {isActive && (
                    <motion.div
                        layoutId="activePill"
                        className="absolute inset-x-1 inset-y-2 bg-[#FACC15] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
                    />
                )}

                <motion.div
                    className="relative z-10 flex flex-col items-center"
                    animate={isActive ? { y: -2 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <Icon className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-black stroke-[3px]" : "group-hover:text-black dark:group-hover:text-white stroke-[2.5px]"
                    )} />
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter mt-1 transition-all duration-300",
                        isActive ? "text-black opacity-100 scale-100" : "opacity-0 scale-75"
                    )}>
                        {label}
                    </span>
                </motion.div>

                {/* INACTIVE LABEL HOVER (Subtle) */}
                {!isActive && (
                    <span className="absolute bottom-2 text-[7px] font-bold uppercase opacity-0 group-hover:opacity-40 transition-opacity">
                        {label}
                    </span>
                )}
            </div>
        </ViewTransitionLink>
    );
}
