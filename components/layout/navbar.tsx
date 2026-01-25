"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // BUTTON STYLES (Based on User Screenshot)
    // White Box + Double Border + YELLOW Shadow
    const actionBtnClass = cn(
        "relative flex items-center justify-center w-11 h-11",
        "bg-white border-[3px] border-black rounded-xl",
        "shadow-[4px_4px_0px_0px_#FFC800]", // YELLOW SHADOW for Buttons
        "active:translate-y-1 active:shadow-none transition-all"
    );

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
                    "h-[80px] flex items-center", // Height 80px for standard touch target standard
                    "bg-[#050505] border-b-[3px] border-white/10", // Pitch Black
                    scrolled && "bg-[#050505]/95 backdrop-blur-md shadow-2xl"
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

                    {/* ==============================
                        1. BRAND (Left)
                       ============================== */}
                    <Link href="/" className="group relative z-10 flex items-center gap-3">

                        {/* MOBILE SYMBOL (The "F" Box) */}
                        {/* Matches Screenshot: Yellow bg, Black Border, White Shadow */}
                        <div className="md:hidden">
                            <motion.div
                                className="flex items-center justify-center w-11 h-11 bg-[#FFC800] border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#ffffff]"
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="font-black text-3xl text-black font-heading leading-none mt-0.5">F</span>
                            </motion.div>
                        </div>

                        {/* DESKTOP BRAND (Full Text) */}
                        <div className="hidden md:flex flex-col justify-center">
                            <div className="flex items-baseline leading-none">
                                <span className="text-3xl font-black text-white font-heading tracking-tighter">Fizik</span>
                                <span className="text-3xl font-black text-[#FFC800] font-heading tracking-tighter ml-0.5">Hub</span>
                            </div>
                        </div>
                    </Link>

                    {/* ==============================
                        2. ACTIONS (Right)
                       ============================== */}
                    <div className="flex items-center gap-4">

                        {/* SEARCH BUTTON */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            className={actionBtnClass}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Search className="w-6 h-6 text-black stroke-[3px]" />
                        </motion.button>

                        {/* NOTIFICATION BUTTON */}
                        <div className={actionBtnClass}>
                            <NotificationBell className="w-full h-full flex items-center justify-center text-black" />
                        </div>

                        {/* NO MENU BUTTON - Delegated to Bottom Dock */}
                    </div>

                </div>
            </header>

            {/* SPACER for Fixed Header */}
            <div className="h-[80px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
