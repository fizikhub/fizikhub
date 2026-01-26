"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap, Star } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

// PHYSICS CONSTANTS & EQUATIONS TICKER
const physicsTicker = [
    "E = mc²", "⚡ F = ma", "☢️ ΔS ≥ 0", "iℏ∂ψ/∂t = Ĥψ", "🌌 G = 6.67×10⁻¹¹",
    "🧲 ∇⋅E = ρ/ε₀", "🌡️ pV = nRT", "💡 λ = h/p", "🎲 S = k ln Ω", "🚀 c = 299,792,458 m/s"
];

const navItems = [
    { href: "/", label: "Ana Sayfa", emoji: "🏠", color: "bg-[#FF4433]" }, // Red
    { href: "/makale", label: "Keşfet", emoji: "🔭", color: "bg-[#3B82F6]" }, // Blue
    { href: "/siralamalar", label: "Lig", emoji: "🏆", color: "bg-[#27C93F]" }, // Green
    { href: "/ozel", label: "Özel", emoji: "⚡", color: "bg-[#9333EA]" }, // Purple
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    return (
        <>
            {/* 
                V26: THE QUANTUM COMIC BOOK
                - Pop Art / Neo-Brutalist / Science Wrapper
                - Yellow Base (#FFDE00)
                - Halftone Texture
                - Sticker UI
            */}
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">

                {/* 1. SCROLLING PHYSICS TICKER (Top Bar) */}
                <div className="bg-black text-[#FFDE00] h-6 overflow-hidden flex items-center border-b-[2px] border-black pointer-events-auto relative z-50">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap text-[10px] font-black font-mono uppercase tracking-widest select-none"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {[...physicsTicker, ...physicsTicker, ...physicsTicker, ...physicsTicker].map((eq, i) => (
                            <span key={i} className="inline-flex items-center gap-2">
                                <span className="opacity-50">///</span>
                                <span>{eq}</span>
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* 2. MAIN NAVBAR BODY */}
                <div className="pointer-events-auto relative bg-[#FFDE00] border-b-[4px] border-black shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 overflow-hidden">

                    {/* Background: Halftone Pattern */}
                    <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0"
                        style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }}
                    />

                    {/* Left: LOGO BADGE (Sticker Style) */}
                    <Link href="/" className="relative z-10 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#3B82F6] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all relative overflow-hidden"
                            style={{ transform: "rotate(-1deg)" }} // Jaunty angle
                        >
                            {/* Gloss Effect */}
                            <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20 rounded-t-full pointer-events-none" />

                            {/* The Logo itself (Yellow to pop on Blue) */}
                            <div className="scale-75 sm:scale-90 origin-center -mt-1 sm:mt-0">
                                <DankLogo />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Center: DESKTOP NAVIGATION (Stickers) */}
                    <nav className="hidden md:flex items-center gap-3 relative z-10">
                        {navItems.filter(i => i.href !== "/ozel").map((item, idx) => {
                            const isActive = pathname === item.href;
                            const rotation = idx % 2 === 0 ? "rotate-1" : "-rotate-1"; // Alternating tilt

                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg border-[3px] border-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[3px_3px_0px_0px_#000]",
                                            isActive
                                                ? "bg-white text-black translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_0px_#000]"
                                                : `${item.color} text-white hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#000] hover:z-20`
                                        )}
                                        style={{ transform: isActive ? "rotate(0deg)" : undefined }}
                                        whileHover={{ rotate: idx % 2 === 0 ? 2 : -2 }}
                                    >
                                        <span className="text-sm drop-shadow-md">{item.emoji}</span>
                                        <span style={{ textShadow: "1px 1px 0px black" }}>{item.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: ACTION CONTROLS (Chunky Buttons) */}
                    <div className="flex items-center gap-3 relative z-10">

                        {/* Search */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            whileHover={{ scale: 1.1, rotate: 3 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center group"
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px] group-hover:stroke-[#3B82F6] transition-colors" />
                        </motion.button>

                        {/* Mobile Zap (Special) */}
                        <Link href="/ozel" className="md:hidden">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -3 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#9333EA] text-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center"
                            >
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-black stroke-[2px]" />
                            </motion.button>
                        </Link>

                        {/* Menu Toggle */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4433] text-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center relative overflow-hidden"
                                >
                                    {/* Stripes */}
                                    <div className="absolute inset-0 opacity-20"
                                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 6px)' }}
                                    />
                                    <Menu className="w-6 h-6 stroke-[3px] relative z-10" />
                                </motion.button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[400px] border-l-[4px] border-black bg-[#FFDE00] p-0 z-[60]">
                                <div className="h-full flex flex-col relative overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-[0.1]"
                                        style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '12px 12px' }}
                                    />

                                    {/* Header */}
                                    <div className="p-6 border-b-[4px] border-black bg-white flex items-center justify-between relative z-10">
                                        <span className="font-black text-2xl uppercase italic tracking-tighter">
                                            MENÜ <span className="text-[#3B82F6]">v26</span>
                                        </span>
                                        <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black" />
                                    </div>

                                    {/* Links */}
                                    <div className="flex-1 p-6 space-y-4 overflow-y-auto relative z-10">
                                        {navItems.map((item, i) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <motion.div
                                                    initial={{ x: -50, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={cn(
                                                        "w-full h-16 flex items-center px-4 mb-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000]",
                                                        item.color,
                                                        "text-white"
                                                    )}
                                                    whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="text-3xl mr-4 drop-shadow-md">{item.emoji}</span>
                                                    <span className="font-black text-xl tracking-wider drop-shadow-[2px_2px_0px_#000]">{item.label}</span>
                                                </motion.div>
                                            </Link>
                                        ))}

                                        <div className="mt-8 p-6 bg-white rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                                <Star className="w-12 h-12 text-black fill-black" />
                                            </div>
                                            <p className="font-bold text-black text-center mb-4 text-sm">HESABINA GİRİŞ YAP</p>
                                            <div className="flex justify-center">
                                                <AuthButton />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-4 bg-black text-[#FFDE00] text-center font-mono text-[10px] border-t-[4px] border-black relative z-10">
                                        FIZIKHUB SYSTEM /// EST. 2026
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Spacer for Fixed Header (24px Ticker + 80px Navbar = ~104px) */}
            <div className="h-[88px] sm:h-[104px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
