"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Home, BookOpen, Trophy, Atom, ArrowRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "MAKALE", color: "hover:bg-[#FF90E8]" }, // Pink
    { href: "/siralamalar", label: "SIRALAMA", color: "hover:bg-[#FFC900]" }, // Yellow
    { href: "/ozel", label: "LABORATUVAR", color: "hover:bg-[#23A094] hover:text-white" }, // Teal
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* 
                V90: DEFINITIVE NEO-BRUTALISM
                Style: "The Gumroad Look", Hard Edges, Pop Colors, Unapologetic.
            */}

            <header className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none font-sans">

                {/* FLOATING BRUTALIST CONTAINER */}
                <div className="pointer-events-auto mx-auto max-w-7xl">
                    <div className={cn(
                        "bg-white border-[3px] border-black rounded-xl",
                        "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]", // The signature shadow
                        "flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000]"
                    )}>

                        {/* 1. TOP MARQUEE (Optional Vibe) */}
                        <div className="bg-[#FF90E8] border-b-[3px] border-black py-1 overflow-hidden flex justify-center">
                            <div className="text-xs font-black uppercase tracking-widest flex gap-8 animate-marquee whitespace-nowrap">
                                {Array(10).fill("★ FİZİK ARTIK SIKICI DEĞİL").map((text, i) => (
                                    <span key={i}>{text}</span>
                                ))}
                            </div>
                        </div>

                        {/* 2. MAIN NAV BAR */}
                        <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

                            {/* BRAND */}
                            <div className="flex-shrink-0">
                                <ViewTransitionLink href="/" className="block transform hover:scale-105 transition-transform">
                                    <DankLogo />
                                </ViewTransitionLink>
                            </div>

                            {/* DESKTOP NAV items */}
                            <nav className="hidden md:flex items-center gap-2 h-full">
                                {NAV_ITEMS.map((item) => (
                                    <ViewTransitionLink
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "h-10 px-6 flex items-center justify-center rounded-lg border-[2px] border-transparent font-bold tracking-tight transition-all",
                                            "hover:border-black hover:shadow-[3px_3px_0px_0px_#000]",
                                            item.color,
                                            pathname === item.href && "bg-black text-white shadow-[3px_3px_0px_0px_#888]"
                                        )}
                                    >
                                        {item.label}
                                    </ViewTransitionLink>
                                ))}
                            </nav>

                            {/* RIGHT ACTIONS */}
                            <div className="flex items-center gap-3">

                                {/* SEARCH */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center border-[2px] border-black rounded-lg bg-white hover:bg-[#23A094] hover:text-white transition-colors shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:shadow-none"
                                >
                                    <Search className="w-5 h-5 stroke-[3px]" />
                                </button>

                                {/* MOBILE HAMBURGER */}
                                <div className="md:hidden">
                                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                        <SheetTrigger asChild>
                                            <button className="w-10 h-10 flex items-center justify-center bg-[#FFC900] border-[2px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all">
                                                <Menu className="w-6 h-6 stroke-[3px]" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l-[3px] border-black p-0">
                                            <div className="flex flex-col h-full">

                                                {/* SHEET HEADER */}
                                                <div className="h-20 bg-[#FFC900] border-b-[3px] border-black flex items-center justify-between px-6">
                                                    <span className="text-xl font-black uppercase">Menü</span>
                                                    <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:shadow-none">
                                                        <X className="w-6 h-6 stroke-[3px]" />
                                                    </button>
                                                </div>

                                                {/* SHEET LINKS */}
                                                <div className="flex-1 p-6 flex flex-col gap-4">
                                                    {[
                                                        { href: "/", label: "ANA SAYFA", bg: "bg-white" },
                                                        ...NAV_ITEMS.map(i => ({ href: i.href, label: i.label, bg: "bg-white" }))
                                                    ].map((item, i) => (
                                                        <ViewTransitionLink
                                                            key={i}
                                                            href={item.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className={cn(
                                                                "group flex items-center justify-between p-4 border-[3px] border-black bg-white shadow-[5px_5px_0px_0px_#000] hover:translate-x-1 hover:shadow-[7px_7px_0px_0px_#000] transition-all"
                                                            )}
                                                        >
                                                            <span className="text-lg font-black">{item.label}</span>
                                                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </div>
                                                        </ViewTransitionLink>
                                                    ))}

                                                    <div className="mt-8 p-4 bg-neutral-100 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
                                                        <AuthButton />
                                                    </div>
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
                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-32" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
