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
                h-[50px]
                bg-white/80 dark:bg-[#121212]/80
                backdrop-blur-xl
                border-t border-black/10 dark:border-white/10
                flex items-center justify-around
                px-2
                pb-safe
                relative
                shadow-sm
            ">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                {/* Glossy Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 opacity-50" />

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

                <div className="relative -top-5 z-20">
                    <ViewTransitionLink
                        href="/paylas"
                        className="relative"
                        onClick={vibrate}
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="
                                flex items-center justify-center
                                w-12 h-12
                                bg-[#FACC15]
                                border-2 border-black dark:border-white
                                rounded-full
                                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)]
                                group
                                relative
                                overflow-hidden
                            "
                        >
                            <Plus className="w-6 h-6 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />

                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    repeatDelay: 3,
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
                "flex flex-col items-center justify-center min-w-[55px] h-full relative group z-10",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-500"
            )}
        >
            <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex flex-col items-center gap-0.5 relative"
            >
                {isActive && (
                    <motion.div
                        layoutId="nav-item-background"
                        className="
                            absolute inset-0 
                            bg-black/5 dark:bg-white/10 
                            border border-black/5 dark:border-white/5 
                            rounded-lg
                            shadow-inner dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]
                        "
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}

                <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 relative z-10",
                    !isActive && "group-hover:bg-black/5 dark:group-hover:bg-white/5"
                )}>
                    <motion.div
                        initial={false}
                        animate={isActive ? { scale: [1, 1.25, 1.05] } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Icon className={cn(
                            "w-5 h-5 transition-all duration-200",
                            isActive ? "stroke-[2.75px]" : "stroke-[2px]"
                        )} />
                    </motion.div>
                </div>
            </motion.div>
        </ViewTransitionLink>
    );
}
