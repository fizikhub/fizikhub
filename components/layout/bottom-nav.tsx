"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useVelocity, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

export function BottomNav() {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Smoothly track the visibility state
    const [isVisible, setIsVisible] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(false);

    // Physics-based transition settings
    const [dynamicDuration, setDynamicDuration] = useState(0.4);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const velocity = scrollVelocity.get();
        const previous = scrollY.getPrevious() || 0;
        const diff = latest - previous;

        // Detect if at bottom
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;
        if (latest + windowHeight >= bodyHeight - 150) {
            setIsAtBottom(true);
            setIsVisible(true); // Always show at bottom
        } else {
            setIsAtBottom(false);
            // Normal visibility logic
            if (latest < 50) {
                setIsVisible(true);
            } else if (diff > 5) { // Significant scroll down
                setIsVisible(false);
            } else if (diff < -5) { // Significant scroll up
                setIsVisible(true);
            }
        }

        const absVelocity = Math.abs(velocity);
        const newDuration = Math.max(0.15, Math.min(0.6, 800 / (absVelocity + 1)));
        setDynamicDuration(newDuration);
    });

    // Haptic feedback helper
    const vibrate = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10); // Ultra light vibration
        }
    };

    return (
        <motion.div
            initial={false}
            animate={{
                y: isVisible ? 0 : 120,
            }}
            transition={{
                duration: dynamicDuration,
                ease: [0.32, 0.72, 0, 1]
            }}
            className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full transition-all duration-500",
                isAtBottom ? "h-[70px] bg-black/60" : "h-[50px] bg-white/80 dark:bg-[#121212]/80",
                "backdrop-blur-xl border-t border-black/10 dark:border-white/10 flex items-center justify-around px-2 pb-safe relative shadow-[0_-4px_16px_rgba(0,0,0,0.05)]"
            )}>
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                <AnimatePresence mode="wait">
                    {!isAtBottom ? (
                        <motion.div
                            key="nav-icons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-around w-full"
                        >
                            <NavItem
                                id="nav-item-home"
                                href="/"
                                icon={Home}
                                label="Akış"
                                isActive={pathname === "/"}
                                onInteract={vibrate}
                            />

                            <NavItem
                                id="nav-item-feed"
                                href="/makale"
                                icon={BookOpen}
                                label="Blog"
                                isActive={pathname.startsWith("/makale")}
                                onInteract={vibrate}
                            />

                            <div className="relative -top-3.5 z-20">
                                <ViewTransitionLink
                                    id="nav-item-share"
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
                                            w-11 h-11
                                            bg-[#FACC15]
                                            border-2 border-black dark:border-white
                                            rounded-full
                                            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                            dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]
                                            group
                                            relative
                                            overflow-hidden
                                        "
                                    >
                                        <Plus className="w-5 h-5 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />

                                        {/* Shimmer Effect */}
                                        <motion.div
                                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none"
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
                                id="nav-item-forum"
                                href="/forum"
                                icon={MessageCircle}
                                label="Forum"
                                isActive={pathname.startsWith("/forum")}
                                onInteract={vibrate}
                            />

                            <NavItem
                                id="nav-item-profile"
                                href="/profil"
                                icon={User}
                                label="Profil"
                                isActive={pathname.startsWith("/profil")}
                                onInteract={vibrate}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copyright-info"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center gap-1 py-1"
                        >
                            <div className="scale-[0.45] origin-center -my-3">
                                <DankLogo />
                            </div>
                            <span
                                className="font-black text-[10px] tracking-[0.2em] uppercase text-center"
                                style={{
                                    background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)',
                                    backgroundSize: '200% 100%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 5px rgba(249,115,22,0.3))',
                                    animation: 'shimmer-nav 3s ease-in-out infinite',
                                }}
                            >
                                İzinsiz kopyalayanı kara deliğe atarız.
                            </span>
                            <style>{`
                                @keyframes shimmer-nav {
                                    0%, 100% { background-position: 0% 50%; }
                                    50% { background-position: 100% 50%; }
                                }
                            `}</style>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.div>
    );
}

function NavItem({ id, href, icon: Icon, label, isActive, onInteract }: { id?: string; href: string; icon: any; label: string; isActive: boolean; onInteract: () => void }) {
    const handleNavItemClick = (e: React.MouseEvent) => {
        onInteract();
        if (isActive) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <ViewTransitionLink
            id={id}
            href={href}
            onClick={handleNavItemClick}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[55px] h-full relative group z-10",
                isActive ? "text-black dark:text-white" : "text-zinc-500 dark:text-zinc-500"
            )}
        >
            <motion.div
                whileTap={{ scaleX: 1.25, scaleY: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
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
                        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Icon
                            fill={isActive ? "currentColor" : "none"}
                            className={cn(
                                "w-5 h-5 transition-all duration-200",
                                isActive ? "stroke-[2.75px]" : "stroke-[2px]"
                            )}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </ViewTransitionLink>
    );
}
