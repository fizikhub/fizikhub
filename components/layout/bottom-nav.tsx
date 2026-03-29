"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence, useScroll, useVelocity, useMotionValueEvent, useMotionValue, animate } from "framer-motion";

import { DankLogo } from "@/components/brand/dank-logo";

export function BottomNav() {
    const pathname = usePathname();
    const { scrollY, scrollYProgress } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Pure MotionValues instead of React State to avoid re-renders during scroll
    const navY = useMotionValue(0);
    const targetYRef = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        requestAnimationFrame(() => {
            const velocity = scrollVelocity.get();
            const previous = scrollY.getPrevious() || 0;
            const diff = latest - previous;
            let targetY = navY.get();
            let targetDuration = 0.4;

            // Detect if at bottom using scrollYProgress 
            // We NO LONGER update React state (isAtBottom) here to prevent DOM thrashing
            const isNearBottom = scrollYProgress.get() > 0.95;

            if (isNearBottom) {
                targetY = 0;
            } else {
                if (latest < 50) {
                    targetY = 0;
                } else if (diff > 5) {
                    targetY = 120;
                } else if (diff < -5) {
                    targetY = 0;
                }
            }

            const absVelocity = Math.abs(velocity);
            targetDuration = Math.max(0.15, Math.min(0.6, 800 / (absVelocity + 1)));

            if (targetYRef.current !== targetY) {
                targetYRef.current = targetY;
                animate(navY, targetY, {
                    duration: targetDuration,
                    ease: [0.32, 0.72, 0, 1]
                });
            }
        });
    });

    // Haptic feedback helper
    const vibrate = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10); // Ultra light vibration
        }
    };

    return (
        <m.div
            style={{ y: navY }}
            className="fixed bottom-0 left-0 right-0 z-[50] md:hidden font-sans"
        >
            <nav aria-label="Mobil navigasyon" className={cn(
                "w-full transition-all duration-500 h-[50px] bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 flex items-center justify-around px-2 pb-safe relative shadow-[0_-4px_16px_rgba(0,0,0,0.05)]"
            )}>
                <div className="flex items-center justify-around w-full">
                    <NavItem
                        id="nav-item-home"
                        href="/"
                        icon={Home}
                        label="Ana Sayfa"
                        isActive={pathname === "/"}
                        onInteract={vibrate}
                    />

                    <NavItem
                        id="nav-item-feed"
                        href="/makale"
                        icon={BookOpen}
                        label="Keşfet"
                        isActive={pathname.startsWith("/makale")}
                        onInteract={vibrate}
                    />

                    <div className="relative -top-3.5 z-20">
                        <Link
                            prefetch={false}
                            id="nav-item-share"
                            href="/paylas"
                            className="relative block"
                            onClick={vibrate}
                        >
                            <m.div
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 0.3,
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
                            </m.div>
                        </Link>
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
                </div>
            </nav>
        </m.div>
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
        <Link
            prefetch={false}
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
            <m.div
                whileTap={{ scaleX: 1.25, scaleY: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center gap-0.5 relative"
            >
                {isActive && (
                    <m.div
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
                    <m.div
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
                    </m.div>
                </div>
            </m.div>
        </Link>
    );
}
