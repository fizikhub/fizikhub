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
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
                >
                    <nav className="
                        w-full
                        h-[50px]
                        bg-white dark:bg-[#050505]
                        border-t-[3px] border-black dark:border-white
                        flex items-center justify-around
                        px-2
                        pb-safe
                        relative
                    ">

                        <NavItem
                            href="/"
                            icon={Home}
                            label="AKIŞ"
                            isActive={pathname === "/"}
                        />

                        <NavItem
                            href="/makale"
                            icon={BookOpen}
                            label="BLOG"
                            isActive={pathname.startsWith("/makale")}
                        />

                        {/* CENTER ACTION BUTTON - RAW BRUTALIST */}
                        <div className="relative -top-6">
                            <ViewTransitionLink
                                href="/paylas"
                                className="
                                    group flex items-center justify-center
                                    w-14 h-14
                                    bg-[#FACC15]
                                    border-[3px] border-black
                                    shadow-[4px_4px_0px_#000]
                                    active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                                    transition-all duration-200
                                "
                            >
                                <Plus className="w-8 h-8 text-black stroke-[3px]" />
                            </ViewTransitionLink>
                        </div>

                        <NavItem
                            href="/forum"
                            icon={MessageCircle}
                            label="FORUM"
                            isActive={pathname.startsWith("/forum")}
                        />

                        <NavItem
                            href="/profil"
                            icon={User}
                            label="PROFIL"
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
            className="flex flex-col items-center justify-center w-14 h-full relative"
        >
            <div className="relative z-10 flex flex-col items-center">
                <Icon className={cn(
                    "w-6 h-6 transition-all duration-200",
                    isActive ? "stroke-[3px] text-black dark:text-white" : "stroke-[2px] text-zinc-500"
                )} />
                {isActive && (
                    <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-black tracking-tighter uppercase mt-0.5 text-black dark:text-white"
                    >
                        {label}
                    </motion.span>
                )}
            </div>

            {/* Brutalist Active Indicator (Solid Block) */}
            {isActive && (
                <motion.div
                    layoutId="activeTabBrutal"
                    className="absolute inset-x-0 bottom-0 top-0 bg-neutral-100 dark:bg-white/10 -z-10 border-x-2 border-black dark:border-white/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </ViewTransitionLink>
    );
}
