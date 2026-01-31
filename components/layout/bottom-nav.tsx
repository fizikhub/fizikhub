"use client";

import { usePathname } from "next/navigation";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Home, Atom, FlaskConical, Microscope, User, Zap } from "lucide-react";
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

    const links = [
        { href: "/", label: "ANA", icon: Atom },
        { href: "/makale", label: "MAKALE", icon: Microscope },
        { href: "/testler", label: "TEST", icon: FlaskConical },
        { href: "/ozel", label: "ZAP", icon: Zap },
        { href: "/profil", label: "BEN", icon: User }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-5 left-0 right-0 z-[50] md:hidden px-4 pointer-events-none"
                >
                    {/* 
                        V32: LIQUID SCIENTIST BOTTOM BAR
                        - Floating Capsule Layout
                        - Liquid Morphing Bubble Animation
                        - Unique Scientific Icons
                    */}
                    <nav className="
                        pointer-events-auto
                        max-w-md mx-auto
                        bg-black/95
                        backdrop-blur-xl
                        h-[64px]
                        flex items-center justify-around
                        px-2
                        rounded-2xl
                        border-[2.5px] border-white/20
                        shadow-[0px_8px_24px_rgba(0,0,0,0.5),inset_0px_1px_1px_rgba(255,255,255,0.2)]
                        relative
                        overflow-hidden
                    ">
                        {/* THE LIQUID BUBBLE INDICATOR */}
                        <div className="absolute inset-0 pointer-events-none p-2 flex items-center justify-around">
                            {links.map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <div key={link.href} className="relative w-12 h-12 flex items-center justify-center">
                                        {isActive && (
                                            <motion.div
                                                layoutId="liquidBubble"
                                                className="absolute inset-0 bg-[#FFC800] rounded-xl shadow-[0_0_15px_rgba(255,200,0,0.4)]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30,
                                                    mass: 0.8
                                                }}
                                                style={{ borderRadius: "14px" }}
                                            >
                                                {/* Liquid Glow Effect */}
                                                <div className="absolute inset-0 bg-white/20 rounded-[inherit] blur-[2px]" />
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* NAV ITEMS */}
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                            return (
                                <ViewTransitionLink
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center w-12 h-12 z-10 transition-colors duration-300",
                                        isActive ? "text-black" : "text-white/50 hover:text-white"
                                    )}
                                >
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                            y: isActive ? -2 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 transition-all",
                                                isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                                            )}
                                        />
                                    </motion.div>
                                    <span className={cn(
                                        "text-[8px] font-black tracking-tighter mt-0.5",
                                        isActive ? "opacity-100" : "opacity-0"
                                    )}>
                                        {link.label}
                                    </span>
                                </ViewTransitionLink>
                            );
                        })}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
