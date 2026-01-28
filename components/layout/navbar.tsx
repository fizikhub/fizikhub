"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, ArrowUpRight, Globe, Zap, Box } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "MAKALE", sub: "01" },
    { href: "/siralamalar", label: "SIRALAMA", sub: "02" },
    { href: "/ozel", label: "LABORATUVAR", sub: "03" },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* 
                V110: POSTER GRID BRUTALISM (Swiss Style)
                Style: "The Grid", International Blue, Visible Lines, Structured
            */}

            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none font-sans mix-blend-mode-normal">

                {/* FULL WIDTH GRID CONTAINER */}
                <div className="pointer-events-auto w-full bg-[#FAFAFA] border-b border-black text-black">

                    {/* ROW 1: MARQUEE & INFO (The 'Header' of the Header) */}
                    <div className="flex border-b border-black divide-x divide-black h-8">
                        <div className="hidden sm:flex items-center px-4 text-[10px] font-bold uppercase tracking-widest bg-black text-white w-32 shrink-0">
                            FizikHub UI
                        </div>
                        <div className="flex-1 flex items-center overflow-hidden bg-[#0033FF] text-white">
                            <div className="animate-marquee whitespace-nowrap text-[10px] font-medium uppercase tracking-widest px-4">
                                {Array(5).fill("EVRENİN MATEMATİĞİNİ KEŞFET /// BİLİM Tİ'YE ALINIR, CİDDİYE ALINIR /// ").map((t, i) => (
                                    <span key={i}>{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center px-4 text-[10px] font-mono shrink-0 hover:bg-black hover:text-white transition-colors cursor-help">
                            {new Date().toLocaleDateString('tr-TR')}
                        </div>
                    </div>

                    {/* ROW 2: MAIN NAVIGATION GRID */}
                    <div className="flex h-16 sm:h-20 divide-x divide-black">

                        {/* CELL 1: LOGO */}
                        <div className="flex-1 sm:flex-none sm:w-64 flex items-center justify-start pl-4 sm:pl-6 bg-[#FAFAFA] hover:bg-neutral-100 transition-colors">
                            <ViewTransitionLink href="/" className="block">
                                <DankLogo />
                            </ViewTransitionLink>
                        </div>

                        {/* CELL 2: DESKTOP NAV (THE BIG BLOCK) */}
                        <nav className="hidden md:flex flex-1 divide-x divide-black">
                            {NAV_ITEMS.map((item) => (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className="group relative flex-1 flex flex-col justify-between p-3 hover:bg-[#0033FF] hover:text-white transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-mono opacity-50 group-hover:opacity-80 transition-opacity">
                                            ( {item.sub} )
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight uppercase self-center group-hover:translate-x-1 transition-transform">
                                        {item.label}
                                    </span>
                                </ViewTransitionLink>
                            ))}
                        </nav>

                        {/* CELL 3: SEARCH */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-16 sm:w-20 flex items-center justify-center hover:bg-[#0033FF] hover:text-white transition-colors"
                        >
                            <Search className="w-6 h-6 stroke-2" />
                        </button>

                        {/* CELL 4: AUTH (Desktop) */}
                        <div className="hidden md:flex items-center justify-center min-w-[140px] px-4 hover:bg-neutral-100 transition-colors">
                            <AuthButton />
                        </div>

                        {/* CELL 5: MOBILE MENU TOGGLE */}
                        <div className="md:hidden w-16 flex border-l border-black">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-full h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                                        <Menu className="w-7 h-7" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="top" className="h-full w-full p-0 border-none bg-[#FAFAFA] text-black">
                                    <div className="flex flex-col h-full divide-y divide-black border-2 border-black m-2">

                                        {/* HEADER */}
                                        <div className="h-16 flex items-center justify-between px-6 bg-black text-white">
                                            <span className="text-xl font-bold tracking-widest">DİZİN</span>
                                            <button onClick={() => setIsMenuOpen(false)}>
                                                <X className="w-8 h-8" />
                                            </button>
                                        </div>

                                        {/* LINKS */}
                                        <div className="flex-1 flex flex-col">
                                            {[
                                                { href: "/", label: "ANA SAYFA", sub: "00" },
                                                ...NAV_ITEMS
                                            ].map((item, i) => (
                                                <ViewTransitionLink
                                                    key={i}
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex-1 flex items-center justify-between px-8 border-b border-black last:border-none hover:bg-[#0033FF] hover:text-white transition-colors group"
                                                >
                                                    <span className="text-3xl sm:text-5xl font-black uppercase">{item.label}</span>
                                                    <span className="text-lg font-mono opacity-50 group-hover:opacity-100">{item.sub}</span>
                                                </ViewTransitionLink>
                                            ))}
                                        </div>

                                        {/* FOOTER */}
                                        <div className="p-8 bg-neutral-100">
                                            <AuthButton />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                    </div>

                    {/* ROW 3: DECORATIVE BOTTOM BORDER */}
                    <div className="h-1 w-full bg-black" />
                </div>
            </header>

            {/* SPACER */}
            <div className="h-24 sm:h-28" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
