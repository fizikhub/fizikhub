"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useVelocity, useMotionValueEvent, useSpring, useTransform } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Smoothly track the visibility state
    const [isVisible, setIsVisible] = useState(true);

    // Physics-based transition settings
    const [dynamicDuration, setDynamicDuration] = useState(0.4);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const velocity = scrollVelocity.get();
        const previous = scrollY.getPrevious() || 0;
        const diff = latest - previous;

        // Determine visibility based on direction and minimum threshold
        if (latest < 50) {
            setIsVisible(true);
        } else if (diff > 5) { // Significant scroll down
            setIsVisible(false);
        } else if (diff < -5) { // Significant scroll up
            setIsVisible(true);
        }

        // Adjust duration based on velocity (faster scroll = shorter duration)
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
                ease: [0.32, 0.72, 0, 1] // Custom refined ease for snappier motion
            }}
            className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans pb-safe"
        >
            <nav aria-label="Mobil navigasyon" className="
                w-full
                h-[65px]
                bg-[#27272a]/90
                backdrop-blur-xl
                border-t-[3px] border-black
                flex items-center justify-around
                px-4
                relative
                shadow-[0_-5px_20px_rgba(0,0,0,0.3)]
            ">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                <NavItem
                    id="nav-item-home"
                    href="/"
                    icon={Home}
                    label="Akış"
                    isActive={pathname === "/"}
                    onInteract={vibrate}
                    activeColor="bg-[#FACC15]" // Yellow
                />

                <NavItem
                    id="nav-item-feed"
                    href="/makale"
                    icon={BookOpen}
                    label="Blog"
                    isActive={pathname.startsWith("/makale")}
                    onInteract={vibrate}
                    activeColor="bg-[#FF0080]" // Pink
                />

                <div className="relative -top-6 z-20">
                    <ViewTransitionLink
                        id="nav-item-share"
                        href="/paylas"
                        className="relative block"
                        onClick={vibrate}
                    >
                        <motion.div
                            whileTap={{ scale: 0.9, rotate: 15 }}
                            className="
                                flex items-center justify-center
                                w-14 h-14
                                bg-[#4169E1]
                                border-[3px] border-black
                                rounded-2xl
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                active:shadow-none active:translate-y-[4px]
                                group
                                relative
                                overflow-hidden
                                rotate-3 hover:rotate-0 transition-transform
                            "
                        >
                            <Plus className="w-7 h-7 text-white stroke-[3px] group-hover:rotate-90 transition-transform duration-300 relative z-10" />
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
                    activeColor="bg-[#23A9FA]" // Blue
                />

                <NavItem
                    id="nav-item-profile"
                    href="/profil"
                    icon={User}
                    label="Profil"
                    isActive={pathname.startsWith("/profil")}
                    onInteract={vibrate}
                    activeColor="bg-[#16A34A]" // Green
                />
            </nav>
        </motion.div>
    );
}

function NavItem({ id, href, icon: Icon, label, isActive, onInteract, activeColor }: { id?: string; href: string; icon: any; label: string; isActive: boolean; onInteract: () => void, activeColor: string }) {
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
                isActive ? "text-black" : "text-zinc-500"
            )}
        >
            <div className="relative p-2">
                {isActive && (
                    <motion.div
                        layoutId="nav-item-pill"
                        className={cn(
                            "absolute inset-0 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                            activeColor
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />
                )}

                <Icon
                    className={cn(
                        "w-6 h-6 transition-all duration-200 relative z-10",
                        isActive ? "stroke-[2.5px] text-black fill-black/10" : "stroke-[2px] text-zinc-400 group-hover:text-white"
                    )}
                />
            </div>
            {/* Label hidden on mobile for cleaner look, or can be small */}
        </ViewTransitionLink>
    );
}
