"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                    className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
                >
                    <nav className={cn(
                        "w-full h-[50px]",
                        "flex items-center justify-around px-2 pb-safe relative",
                        // "Liquid Glass 10%" - High Contrast Borders
                        "bg-white/10 dark:bg-black/10 backdrop-blur-xl",
                        "border-t-[1.5px] border-black/20 dark:border-white/20",
                        "shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]"
                    )}>

                        <NavItem
                            href="/"
                            icon={Home}
                            isActive={pathname === "/"}
                        />

                        <NavItem
                            href="/makale"
                            icon={BookOpen}
                            isActive={pathname.startsWith("/makale")}
                        />

                        {/* CENTER ACTION - NEO-BRUTALIST CIRCLE (Smaller, Rounded, Bordered) */}
                        <div className="relative -top-5">
                            <ViewTransitionLink
                                href="/paylas"
                                className="
                                    group flex items-center justify-center
                                    w-11 h-11
                                    bg-[#FACC15]
                                    rounded-full
                                    border-[2px] border-black dark:border-white
                                    shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff]
                                    active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                                    hover:scale-105
                                    transition-all duration-300 ease-out
                                "
                            >
                                <Plus className="w-6 h-6 text-black stroke-[3px]" />
                            </ViewTransitionLink>
                        </div>

                        <NavItem
                            href="/forum"
                            icon={MessageCircle}
                            isActive={pathname.startsWith("/forum")}
                        />

                        <NavItem
                            href="/profil"
                            icon={User}
                            isActive={pathname.startsWith("/profil")}
                        />
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function NavItem({ href, icon: Icon, isActive }: { href: string; icon: any; isActive: boolean }) {
    return (
        <ViewTransitionLink
            href={href}
            className="flex flex-col items-center justify-center w-12 h-[50px] relative group"
        >
            <div className="relative flex items-center justify-center">
                {/* Active Indicator "Glow" - Liquid Feel */}
                {isActive && (
                    <motion.div
                        layoutId="liquidGlow"
                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full blur-md scale-150"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <Icon className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive
                        ? "text-black dark:text-white stroke-[2.5px] scale-110 drop-shadow-sm"
                        : "text-zinc-500/80 dark:text-zinc-400/80 stroke-[2px] group-hover:text-black dark:group-hover:text-white"
                )} />
            </div>

            {/* Active Dot - Clean & High Contrast */}
            {isActive && (
                <motion.div
                    layoutId="activeDot"
                    className="absolute bottom-1 w-1 h-1 bg-black dark:bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                />
            )}
        </ViewTransitionLink>
    );
}
