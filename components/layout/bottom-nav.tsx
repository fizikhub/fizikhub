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
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
                >
                    <nav className="
                        w-full
                        h-[50px]
                        bg-white dark:bg-[#09090b]
                        border-t-2 border-zinc-200 dark:border-white/10
                        flex items-end justify-around
                        px-2
                        pb-safe
                        relative
                        shadow-2xl
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

                        {/* CENTER ACTION - CLEAN & SHARP */}
                        <div className="relative mb-2">
                            <div className="absolute inset-0 bg-black rounded-full translate-y-1 blur-sm opacity-20" />
                            <ViewTransitionLink
                                href="/paylas"
                                className="
                                    group flex items-center justify-center
                                    w-12 h-12
                                    bg-[#FACC15]
                                    rounded-xl
                                    relative z-10
                                    hover:-translate-y-1
                                    active:scale-95
                                    transition-all duration-300 ease-out
                                "
                            >
                                <Plus className="w-6 h-6 text-black stroke-[2.5px]" />
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
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) {
    return (
        <ViewTransitionLink
            href={href}
            className={cn(
                "group flex flex-col items-center justify-center w-14 h-[50px] relative transition-all duration-300",
                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
        >
            {/* Active Top Border Indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute top-0 inset-x-0 h-[3px] bg-[#FACC15]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}

            <div className="flex flex-col items-center gap-1">
                <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "stroke-[2.5px] text-black dark:text-white -translate-y-1" : "stroke-[1.5px] text-zinc-600 dark:text-zinc-400"
                )} />

                <span className={cn(
                    "text-[9px] font-bold tracking-tight uppercase transition-all duration-300",
                    isActive ? "text-black dark:text-white translate-y-0 opacity-100" : "text-zinc-500 translate-y-2 opacity-0 h-0"
                )}>
                    {label}
                </span>
            </div>
        </ViewTransitionLink>
    );
}
