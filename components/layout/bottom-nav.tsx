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

    // Haptic feedback helper
    const vibrate = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10); // Ultra light vibration
        }
    };

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
            "fixed bottom-0 left-0 right-0 z-[50] md:hidden transition-all duration-500 ease-out font-sans",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
            <nav className="
                w-full
                h-[60px]
                bg-white/90 dark:bg-[#09090b]/90
                backdrop-blur-3xl saturate-150
                border-t border-white/20 dark:border-white/10
                flex items-center justify-around
                px-2
                pb-safe
                relative
                shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]
            ">
                {/* Ceramic Noise Texture (Subtle) */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none z-0 mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                {/* Highlight Edge (Chiseled Look) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-10 opacity-70" />

                <NavItem
                    href="/"
                    icon={Home}
                    label="Akış"
                    isActive={pathname === "/"}
                    onInteract={vibrate}
                />

                <NavItem
                    href="/makale"
                    icon={BookOpen}
                    label="Blog"
                    isActive={pathname.startsWith("/makale")}
                    onInteract={vibrate}
                />

                <div className="relative -top-4 z-20">
                    <ViewTransitionLink
                        href="/paylas"
                        className="relative block"
                        onClick={vibrate}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut"
                            }}
                            whileTap={{ scale: 0.9, rotate: 15 }}
                            className="
                                flex items-center justify-center
                                w-12 h-12
                                bg-[#FACC15]
                                border-2 border-black dark:border-white
                                rounded-full
                                shadow-[0_4px_10px_rgba(250,204,21,0.3)]
                                dark:shadow-[0_4px_10px_rgba(250,204,21,0.1)]
                                group
                                relative
                                overflow-hidden
                            "
                        >
                            <Plus className="w-6 h-6 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />

                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent z-0 pointer-events-none"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2.5,
                                    repeatDelay: 4,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </ViewTransitionLink>
                </div>

                <NavItem
                    href="/forum"
                    icon={MessageCircle}
                    label="Forum"
                    isActive={pathname.startsWith("/forum")}
                    onInteract={vibrate}
                />

                <NavItem
                    href="/profil"
                    icon={User}
                    label="Profil"
                    isActive={pathname.startsWith("/profil")}
                    onInteract={vibrate}
                />
            </nav>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, isActive, onInteract }: { href: string; icon: any; label: string; isActive: boolean; onInteract: () => void }) {
    return (
        <ViewTransitionLink
            href={href}
            onClick={onInteract}
            className={cn(
                "flex flex-col items-center justify-center w-14 h-full relative group z-10",
                isActive ? "text-black dark:text-white" : "text-zinc-400 dark:text-zinc-500"
            )}
        >
            {/* Spotlight Effect */}
            {isActive && (
                <motion.div
                    layoutId="spotlight"
                    className="absolute top-0 w-8 h-full z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[30px] bg-gradient-to-b from-black/10 dark:from-white/10 to-transparent blur-md rounded-b-full" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-black/20 dark:bg-white/40 rounded-full blur-[2px]" />
                </motion.div>
            )}

            <motion.div
                whileTap={{ scaleX: 1.2, scaleY: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center gap-1 relative z-10"
            >
                <div className={cn(
                    "p-2 rounded-2xl transition-all duration-300 relative group-hover:bg-black/5 dark:group-hover:bg-white/5",
                )}>
                    <Icon
                        fill={isActive ? "currentColor" : "none"}
                        className={cn(
                            "w-6 h-6 transition-all duration-300",
                            isActive
                                ? "stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]"
                                : "stroke-[2px]"
                        )}
                    />
                </div>
            </motion.div>
        </ViewTransitionLink>
    );
}
