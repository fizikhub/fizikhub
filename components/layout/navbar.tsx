"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, Zap } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const physicsTicker = [
    "E = mc²", "F = ma", "ΔS ≥ 0", "iℏ∂ψ/∂t = Ĥψ", "G = 6.67×10⁻¹¹",
    "∇⋅E = ρ/ε₀", "pV = nRT", "λ = h/p", "S = k ln Ω", "c = 299,792,458 m/s"
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Add scroll listener for glass effect intensity
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { href: "/", label: "Ana Sayfa" },
        { href: "/makale", label: "Keşfet" },
        { href: "/siralamalar", label: "Lig" },
    ];

    return (
        <>
            {/* 
                V24: PROFESSIONAL SCIENCE UI
                - Vibe: Modern, Clean, High-Tech, Trusted.
                - Colors: Dark Slate, Electric Blue Accent, White Text.
                - Removed: Thick borders, hard shadows, cartoon vibes.
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    scrolled
                        ? "h-14 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10" // Scrolled: Compact & Glass
                        : "h-16 bg-[#09090b] border-b border-white/5" // Top: Spacious & Solid
                )}
            >
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative overflow-hidden">

                    {/* SUBTLE PHYSICS TEXTURE (Background) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                        <div className="whitespace-nowrap text-xs font-mono font-medium text-white header-ticker-mask">
                            {[...physicsTicker, ...physicsTicker].map((eq, i) => (
                                <span key={i} className="mx-8">{eq}</span>
                            ))}
                        </div>
                    </div>

                    {/* LEFT: BRAND */}
                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/">
                            <DankLogo />
                        </Link>
                    </div>

                    {/* CENTER: DESKTOP NAV (Modern Tabs) */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full",
                                        isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* RIGHT: CONTROLS (Clean) */}
                    <div className="relative z-10 flex items-center gap-3">

                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Special (Mobile Zap) */}
                        <Link href="/ozel" className="md:hidden">
                            <button className="p-2 text-yellow-500 hover:text-yellow-400 transition-colors hover:bg-yellow-500/10 rounded-full">
                                <Zap className="w-5 h-5 fill-current" />
                            </button>
                        </Link>

                        {/* Menu Trigger */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-full md:hidden">
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#09090b] border-l border-white/10 w-[300px]">
                                <div className="flex flex-col gap-6 mt-8">
                                    <div className="pb-6 border-b border-white/10">
                                        <DankLogo />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors border border-transparent",
                                                    pathname === item.href
                                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/blog"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            Blog
                                        </Link>
                                        <Link
                                            href="/profil"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            Profil
                                        </Link>
                                    </div>
                                    <div className="mt-auto">
                                        <AuthButton />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Desktop Auth */}
                        <div className="hidden md:block">
                            <AuthButton />
                        </div>
                    </div>
                </div>

                {/* Tech Line at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
            </header>

            <div className="h-16" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
