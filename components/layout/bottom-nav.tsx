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
                "w-full h-[60px]",
                "bg-[#0a0a0b]/90 backdrop-blur-2xl",
                "border-t border-white/[0.08]",
                "flex items-center justify-around",
                "px-1 pb-safe relative",
                "shadow-[0_-2px_20px_rgba(0,0,0,0.3)]"
            )}>
                <div className="flex items-center justify-around w-full max-w-md mx-auto">
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

                    <div className="relative -top-4 z-20">
                        <Link
                            
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
                                    w-[52px] h-[52px]
                                    bg-[#FACC15]
                                    border-[2.5px] border-black
                                    rounded-full
                                    shadow-[0_4px_20px_rgba(250,204,21,0.4),3px_3px_0px_0px_rgba(0,0,0,1)]
                                    group
                                    relative
                                    overflow-hidden
                                "
                            >
                                {/* Glow ring */}
                                <div className="absolute inset-[-3px] rounded-full border-2 border-[#FACC15]/30 pointer-events-none" />
                                <Plus className="w-6 h-6 text-black stroke-[3px] group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300 relative z-10" />
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
            
            id={id}
            href={href}
            onClick={handleNavItemClick}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "flex flex-col items-center justify-center min-w-[56px] h-full relative group z-10 py-1",
                isActive ? "text-white" : "text-zinc-500"
            )}
        >
            <m.div
                whileTap={{ scaleX: 1.25, scaleY: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center gap-1 relative"
            >
                <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200 relative z-10",
                    isActive && "bg-white/[0.08]",
                    !isActive && "group-active:bg-white/5"
                )}>
                    <m.div
                        initial={false}
                        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Icon
                            fill={isActive ? "currentColor" : "none"}
                            className={cn(
                                "w-[22px] h-[22px] transition-all duration-200",
                                isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"
                            )}
                        />
                    </m.div>
                </div>

                {/* Label text */}
                <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wide transition-all duration-200 leading-none",
                    isActive ? "text-white opacity-100" : "text-zinc-600 opacity-0 group-hover:opacity-70"
                )}>
                    {label.length > 6 ? label.slice(0, 6) : label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                    <m.div
                        layoutId="nav-active-dot"
                        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#FACC15]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}
            </m.div>
        </Link>
    );
}
