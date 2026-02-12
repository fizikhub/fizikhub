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
                    transition={{ type: "spring", damping: 28, stiffness: 350, mass: 0.7 }}
                    className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
                >
                    <nav className={cn(
                        "w-full h-[50px] relative",
                        "flex items-center justify-around px-2 pb-safe",
                        // "Liquid Glass 20%" - Sharp High Contrast
                        "bg-white/20 dark:bg-black/20 backdrop-blur-xl",
                        "border-t-[1.5px] border-black/40 dark:border-white/30",
                        "shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
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

                        {/* CENTER ACTION - COMPACT NEO-BRUTALIST CIRCLE */}
                        <div className="relative -top-4">
                            <ViewTransitionLink
                                href="/paylas"
                                onClick={(e) => {
                                    if (pathname === "/paylas") {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                }}
                                className="
                                    group flex items-center justify-center
                                    w-10 h-10
                                    bg-[#FACC15]
                                    rounded-full
                                    border-[1.5px] border-black dark:border-white
                                    shadow-[2.5px_2.5px_0px_#000] dark:shadow-[2.5px_2.5px_0px_#fff]
                                    active:shadow-none active:translate-x-[1.5px] active:translate-y-[1.5px]
                                    hover:scale-110 active:scale-90
                                    transition-all duration-300 ease-out
                                "
                            >
                                <Plus className="w-5 h-5 text-black stroke-[3px]" />
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
            onClick={(e) => {
                if (isActive) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }}
            className="flex flex-col items-center justify-center w-12 h-10 relative group"
        >
            <div className="relative flex items-center justify-center">
                {/* Refined Liquid Glow */}
                {isActive && (
                    <motion.div
                        layoutId="liquidGlow"
                        className="absolute inset-0 bg-black/10 dark:bg-white/20 rounded-full blur-lg scale-150"
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    />
                )}

                <Icon className={cn(
                    "w-5 h-5 transition-all duration-400 cubic-bezier(0.23, 1, 0.32, 1)",
                    isActive
                        ? "text-black dark:text-white stroke-[2.5px] scale-110"
                        : "text-zinc-600/90 dark:text-zinc-400/90 stroke-[1.5px] group-hover:text-black dark:group-hover:text-white group-hover:stroke-[2px]"
                )} />
            </div>

            {/* Active Pixel Dot */}
            {isActive && (
                <motion.div
                    layoutId="activeDot"
                    className="absolute -bottom-1.5 w-1 h-1 bg-black dark:bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    transition={{ type: "spring", stiffness: 600, damping: 30 }}
                />
            )}
        </ViewTransitionLink>
    );
}
