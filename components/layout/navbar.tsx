"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect, useRef } from "react";
import { Search, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useSpring, Variants } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";
import { MobileMenu } from "@/components/layout/mobile-menu";

// LIVING LAB: Bouncy Spring Physics for buttons
const bouncyVariant: Variants = {
    tap: { scale: 0.85, rotate: -5 },
    hover: {
        scale: 1.1,
        rotate: 5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
    }
};

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    // MAGNETIC FIELD STATE
    const [particles, setParticles] = useState<{ x: number; y: number; vx: number; vy: number; size: number }[]>([]);

    useEffect(() => {
        setMounted(true);

        // Initialize "Magnetic Particles"
        const particleCount = 20;
        const newParticles = Array.from({ length: particleCount }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: 2 + Math.random() * 4
        }));
        setParticles(newParticles);

        // Animation Loop for drifting particles
        let animationFrameId: number;
        const animate = () => {
            setParticles(prev => prev.map(p => {
                let newX = p.x + p.vx;
                let newY = p.y + p.vy;

                // Bounce off edges
                if (newX < 0 || newX > 100) p.vx *= -1;
                if (newY < 0 || newY > 100) p.vy *= -1;

                return { ...p, x: newX, y: newY };
            }));
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const navItems = [
        { href: "/", label: "Ana" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    const buttonClass = cn(
        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
        "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
        "text-black transition-colors rounded-full", // Rounded full for "Lab/Bubble" feel
    );

    return (
        <>
            {/* 
                V33: LIVING LAB NAVBAR
                - Concept: Organic, Fluid, Interactive
                - Background: Magnetic Field Particles
                - Interactive: Bouncy buttons
            */}
            <header className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 pointer-events-none">
                <div
                    ref={containerRef}
                    className={cn(
                        "pointer-events-auto h-full",
                        "flex items-center justify-between px-4 sm:px-6",
                        "bg-[#3B82F6] border-b-[3px] border-black",
                        "shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]",
                        "w-full relative overflow-hidden"
                    )}
                >
                    {/* LIVING LAB BACKGROUND: MAGNETIC PARTICLES */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                        {particles.map((p, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-black/20"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        ))}
                        {/* Connecting Lines Filter (Optional specific CSS could go here for "gooey" effect) */}
                    </div>

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0 hover:scale-105 transition-transform duration-300">
                        <ViewTransitionLink href="/">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* RIGHT: INTERACTIVE CONTROLS */}
                    <div className="relative z-10 flex items-center gap-2 sm:gap-3">

                        {/* Desktop Links - Bubble Style */}
                        <div className="hidden md:flex items-center gap-2 mr-6">
                            {navItems.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-4 py-2 text-xs font-black uppercase border-[2px] border-black transition-all bg-white text-black hover:bg-[#FFC800]",
                                        "shadow-[2px_2px_0px_0px_#000] rounded-full hover:shadow-none", // Bubble shape
                                        pathname === item.href && "bg-[#FFC800] transform scale-105 shadow-inner"
                                    )}
                                >
                                    {item.label}
                                </ViewTransitionLink>
                            ))}
                        </div>

                        {/* 1. SEARCH - BOUNCY */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            variants={bouncyVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={buttonClass}
                        >
                            <Search className="w-5 h-5 stroke-[2.5px]" />
                        </motion.button>

                        {/* 2. ZAP - BOUNCY */}
                        <motion.button
                            onClick={() => window.location.href = '/ozel'}
                            variants={bouncyVariant}
                            whileTap="tap"
                            whileHover="hover"
                            className={cn(buttonClass, "md:hidden bg-[#FFC800]")}
                        >
                            <Zap className="w-5 h-5 fill-black stroke-[2.5px]" />
                        </motion.button>

                        {/* 3. MOBILE MENU */}
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header >

            {/* Spacer */}
            <div className="h-[56px] sm:h-[64px]" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
