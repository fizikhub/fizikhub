"use client";

import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { useState, useEffect } from "react";
import { Search, Menu, X, ArrowUpRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const NAV_LINKS = [
    { href: "/makale", label: "MAKALE" },
    { href: "/siralamalar", label: "LİDERLİK" },
    { href: "/ozel", label: "LABORATUVAR" },
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
                V40: SWISS BRUTALIST SCIENCE NAVBAR
                Style: "Museum of Science", High-End, Structural, Clean
                Colors: White, Black, Signal Yellow (#FAFF00)
            */}
            <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none font-sans">

                {/* FLOATING STRUCTURAL BEAM */}
                <div className={cn(
                    "pointer-events-auto mx-auto max-w-screen-xl relative",
                    "h-16 sm:h-20 bg-white border-[3px] border-black",
                    "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", // Bold Hard Shadow
                    "flex items-center justify-between px-6 sm:px-8",
                    "transition-transform duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
                )}>

                    {/* 1. BRAND (Left) */}
                    <div className="flex-shrink-0">
                        <ViewTransitionLink href="/" className="block">
                            <DankLogo />
                        </ViewTransitionLink>
                    </div>

                    {/* 2. NAVIGATION (Center - Desktop) */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full">
                        {NAV_LINKS.map((link) => (
                            <ViewTransitionLink
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative h-[70%] px-6 flex items-center justify-center",
                                    "text-sm font-black tracking-wide uppercase text-black transition-all",
                                    "hover:bg-black hover:text-[#FAFF00]",
                                    pathname === link.href && "bg-black text-white"
                                )}
                            >
                                {link.label}
                                {/* Active Indicator Dot */}
                                {pathname === link.href && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FAFF00] rounded-full" />
                                )}
                            </ViewTransitionLink>
                        ))}
                    </nav>

                    {/* 3. ACTIONS (Right) */}
                    <div className="flex items-center gap-4">

                        {/* SEARCH */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="group flex items-center justify-center w-10 h-10 border-[2px] border-black bg-neutral-100 hover:bg-[#FAFF00] transition-colors"
                        >
                            <Search className="w-5 h-5 stroke-[2.5px] group-hover:scale-110 transition-transform" />
                        </button>

                        {/* AUTH (Desktop) */}
                        <div className="hidden md:block">
                            <AuthButton />
                        </div>

                        {/* MOBILE HAMBURGER */}
                        <div className="md:hidden">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-12 h-10 bg-black text-white flex items-center justify-center hover:bg-[#FAFF00] hover:text-black transition-colors border-[2px] border-black">
                                        <Menu className="w-6 h-6 stroke-[2.5px]" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="top" className="h-[100dvh] w-full bg-[#FAFF00] p-0 border-none">
                                    <div className="flex flex-col h-full relative">

                                        {/* CLOSE BTN */}
                                        <button
                                            onClick={() => setIsMenuOpen(false)}
                                            className="absolute top-6 right-6 w-12 h-12 bg-black text-white flex items-center justify-center border-[2px] border-transparent hover:scale-110 transition-transform"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>

                                        {/* BRAND MOBILE */}
                                        <div className="absolute top-8 left-8">
                                            <DankLogo className="scale-125 origin-left" />
                                        </div>

                                        {/* GIANT LINKS */}
                                        <div className="flex-1 flex flex-col justify-center px-8 gap-4">
                                            {[
                                                { href: "/", label: "ANA SAYFA" },
                                                ...NAV_LINKS
                                            ].map((link, i) => (
                                                <ViewTransitionLink
                                                    key={i}
                                                    href={link.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="group flex items-center justify-between text-5xl sm:text-7xl font-black tracking-tighter text-black border-b-[3px] border-black pb-4 hover:pl-4 transition-all"
                                                >
                                                    <span>{link.label}</span>
                                                    <ArrowUpRight className="w-8 h-8 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </ViewTransitionLink>
                                            ))}

                                            <div className="mt-8">
                                                <AuthButton />
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
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
