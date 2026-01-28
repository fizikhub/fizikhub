"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Terminal, Cpu, Radio, ShieldAlert } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_ITEMS = [
    { href: "/makale", label: "DATA_LOGS", sub: "MAKALE", icon: Terminal },
    { href: "/siralamalar", label: "RANKING_SYS", sub: "SIRALAMA", icon: ShieldAlert },
    { href: "/ozel", label: "LAB_TEST", sub: "LABORATUVAR", icon: Radio },
];

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* 
                V100: INDUSTRIAL BRUTALISM
                Style: "Lab Equipment", Raw Steel, Safety Orange, Technical
            */}

            <header className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none font-mono">

                {/* INDUSTRIAL CASING */}
                <div className="pointer-events-auto mx-auto max-w-7xl">
                    <div className={cn(
                        "bg-[#D4D4D4] border-[2px] border-[#404040]",
                        "shadow-[4px_4px_0px_0px_#404040]",
                        "flex flex-col relative"
                    )}>

                        {/* DECORATIVE SCREWS */}
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-black bg-[#A3A3A3] flex items-center justify-center"><div className="w-1 h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black bg-[#A3A3A3] flex items-center justify-center"><div className="w-1 h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full border border-black bg-[#A3A3A3] flex items-center justify-center"><div className="w-1 h-[1px] bg-black rotate-45" /></div>
                        <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-black bg-[#A3A3A3] flex items-center justify-center"><div className="w-1 h-[1px] bg-black rotate-45" /></div>

                        {/* WARNING STRIP */}
                        <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#FF4D00_10px,#FF4D00_20px)] border-b border-black opacity-80" />

                        {/* MAIN CONTROL PANEL */}
                        <div className="h-16 px-4 sm:px-6 flex items-center justify-between bg-[#E5E5E5]">

                            {/* BRAND */}
                            <div className="flex items-center gap-4">
                                <ViewTransitionLink href="/" className="block grayscale hover:grayscale-0 transition-all">
                                    <DankLogo />
                                </ViewTransitionLink>
                                <div className="hidden lg:block h-8 w-[1px] bg-black/20" />
                                <div className="hidden lg:flex flex-col text-[10px] text-neutral-500 leading-tight">
                                    <span>SYS.VER: 9.0</span>
                                    <span>STATUS: ONLINE</span>
                                </div>
                            </div>

                            {/* CENTER: TOGGLE SWITCHES */}
                            <nav className="hidden md:flex items-center gap-1 bg-[#D4D4D4] p-1 border-2 border-transparent shadow-inner rounded-sm">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <ViewTransitionLink
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative h-10 px-4 flex items-center gap-2 border border-transparent transition-all hover:bg-[#F5F5F5]",
                                                isActive && "bg-[#F5F5F5] border-t-white border-l-white border-b-[#888] border-r-[#888] border-2 shadow-sm"
                                            )}
                                        >
                                            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-[#FF4D00] shadow-[0_0_5px_#FF4D00]" : "bg-neutral-400")} />
                                            <div className="flex flex-col leading-none">
                                                <span className="text-xs font-bold text-black">{item.label}</span>
                                            </div>
                                        </ViewTransitionLink>
                                    )
                                })}
                            </nav>

                            {/* RIGHT: CONTROLS */}
                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="w-10 h-10 border-2 border-[#404040] bg-[#F5F5F5] flex items-center justify-center hover:bg-black hover:text-[#FF4D00] transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                <div className="hidden md:block">
                                    <AuthButton />
                                </div>

                                {/* MOBILE MENU TOGGLE */}
                                <div className="md:hidden">
                                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                        <SheetTrigger asChild>
                                            <button className="w-12 h-10 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none">
                                                <Menu className="w-6 h-6 stroke-[3px]" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-[85vw] bg-[#E5E5E5] border-r-[4px] border-[#404040] p-0 font-mono">

                                            {/* DRAWER HEADER */}
                                            <div className="h-20 bg-[#404040] text-white flex items-center justify-between px-6 border-b-[4px] border-[#FF4D00]">
                                                <span className="text-xl font-bold tracking-widest">SYSTEM_MENU</span>
                                                <button onClick={() => setIsMenuOpen(false)} className="text-[#FF4D00]">
                                                    <X className="w-8 h-8" />
                                                </button>
                                            </div>

                                            {/* LINKS */}
                                            <div className="p-6 flex flex-col gap-2">
                                                {[
                                                    { href: "/", label: "MAIN_FEED", icon: Cpu, active: true },
                                                    ...NAV_ITEMS
                                                ].map((item, i) => (
                                                    <ViewTransitionLink
                                                        key={i}
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center gap-4 p-4 bg-[#D4D4D4] border-2 border-[#888] hover:bg-white hover:border-black transition-colors"
                                                    >
                                                        <item.icon className="w-6 h-6 text-[#FF4D00]" />
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-bold text-black">{item.label}</span>
                                                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">/// ACCESS GRANTED</span>
                                                        </div>
                                                    </ViewTransitionLink>
                                                ))}

                                                <div className="mt-8 border-t-2 border-dashed border-black pt-8">
                                                    <AuthButton />
                                                </div>
                                            </div>

                                            {/* DECO */}
                                            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#FF4D00_10px,#FF4D00_20px)] opacity-50" />

                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-28" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
