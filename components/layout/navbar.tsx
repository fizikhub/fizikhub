"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, FlaskConical, Globe, BookOpen, User, ArrowRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const MARQUEE_TEXT = [
    "EVRENİN SIRLARI ÇÖZÜLÜYOR", "KUANTUM DOLANIKLIK", "YENİ MAKALE YAYINDA",
    "BİLİM İÇİN TIKLA", "KAOS TEORİSİ", "FIZIKHUB v3.1"
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
                V31: RETRO-FUTURE LAB NAVBAR
                Style: "Science Zine", Warm Paper, Thick Ink, Pastel Accents
            */}
            <header className="fixed top-0 left-0 right-0 z-50 font-sans pointer-events-none">

                {/* 1. TOP MARQUEE (Science News Ticker) */}
                <div className="h-8 bg-black text-[#FFFBF0] overflow-hidden border-b-2 border-black flex items-center relative z-50 pointer-events-auto">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap text-xs font-bold tracking-widest uppercase"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    >
                        {[...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
                            <span key={i} className="flex items-center gap-2">
                                <span className="text-[#FFC800]">★</span> {text}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* 2. MAIN NAV BAR */}
                <div className="h-16 sm:h-20 bg-[#FFFBF0] border-b-[3px] border-black flex items-center justify-between px-4 sm:px-6 pointer-events-auto relative shadow-sm">

                    {/* LEFT: BRAND */}
                    <div className="flex items-center">
                        <ViewTransitionLink href="/" className="group">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* CENTER: DESKTOP LINKS (Retro Tabs) */}
                    <nav className="hidden md:flex items-center h-full">
                        {[
                            { href: "/", label: "ANA SAYFA", color: "hover:bg-green-300" },
                            { href: "/makale", label: "MAKALE", color: "hover:bg-blue-300" },
                            { href: "/siralamalar", label: "SIRALAMA", color: "hover:bg-pink-300" },
                        ].map((item) => (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative h-full px-8 flex items-center justify-center border-x-[1.5px] border-black -ml-[1.5px] transition-colors",
                                    "text-sm font-black tracking-tight uppercase",
                                    item.color,
                                    pathname === item.href && "bg-black text-white hover:bg-black hover:text-white"
                                )}
                            >
                                {item.label}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#FFC800]"
                                    />
                                )}
                            </ViewTransitionLink>
                        ))}
                    </nav>

                    {/* RIGHT: CONTROLS */}
                    <div className="flex items-center gap-3">

                        {/* SEARCH */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center border-[2px] border-black rounded-lg bg-white hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* MOBILE MENU BTN */}
                        <div className="md:hidden">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-10 h-10 flex items-center justify-center bg-[#FFC800] border-[2px] border-black rounded-lg hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[85vw] bg-[#FFFBF0] border-l-[3px] border-black p-0 sm:max-w-md">
                                    <div className="h-full flex flex-col">
                                        {/* HEADER */}
                                        <div className="h-20 flex items-center justify-between px-6 border-b-[3px] border-black bg-[#FFDA47]">
                                            <span className="text-xl font-black italic tracking-tighter">MENÜ</span>
                                            <button onClick={() => setIsMenuOpen(false)}>
                                                <X className="w-8 h-8 stroke-[3px]" />
                                            </button>
                                        </div>

                                        {/* LINKS */}
                                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                                            {[
                                                { href: "/", label: "ANA SAYFA", bg: "bg-white" },
                                                { href: "/makale", label: "MAKALE", bg: "bg-blue-200" },
                                                { href: "/siralamalar", label: "LİG", bg: "bg-pink-200" },
                                                { href: "/ozel", label: "LABORATUVAR", bg: "bg-green-200" }
                                            ].map((link) => (
                                                <ViewTransitionLink
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={cn(
                                                        "group flex items-center justify-between p-5 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all",
                                                        link.bg
                                                    )}
                                                >
                                                    <span className="text-xl font-black tracking-tight">{link.label}</span>
                                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                </ViewTransitionLink>
                                            ))}

                                            <div className="mt-8 border-[3px] border-black rounded-xl p-4 bg-white border-dashed">
                                                <AuthButton />
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="p-4 border-t-[3px] border-black text-center bg-black text-[#FFFBF0]">
                                            <p className="text-xs font-mono">BİLİMİ Tİ YE ALIYORUZ</p>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* DESKTOP AUTH */}
                        <div className="hidden md:block">
                            <AuthButton />
                        </div>

                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-28 sm:h-32" />
            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
