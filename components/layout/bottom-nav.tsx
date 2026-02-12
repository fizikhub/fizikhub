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
            // Show on scroll up or at top
            if (currentScrollY < 50 || currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            // Hide on scroll down
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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[50] md:hidden"
                >
                    <nav className="
                        w-full
                        h-[50px]
                        bg-black/60 backdrop-blur-xl
                        border-t border-white/10
                        flex items-center justify-around
                        px-2
                        pb-safe
                        relative
                    ">
                        {/* ABSOLUTE GLOW LINE */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

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

                        {/* CENTER ACTION BUTTON - PREMIUM ORB */}
                        <div className="relative -top-5">
                            <ViewTransitionLink
                                href="/paylas"
                                className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:scale-110 active:scale-95 transition-all duration-300"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm group-hover:blur-md transition-all" />
                                <Plus className="w-6 h-6 text-black relative z-10" />
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
            className="relative flex flex-col items-center justify-center w-12 h-full"
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/5 rounded-xl m-1"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative z-10 transition-colors duration-300",
                    isActive ? "text-yellow-400" : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                <Icon className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                )} />

                {/* Active Dot Indicator */}
                {isActive && (
                    <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_5px_#FACC15]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </motion.div>
        </ViewTransitionLink>
    );
}
