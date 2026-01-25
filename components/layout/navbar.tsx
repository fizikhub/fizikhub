"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { SiteLogo } from "@/components/icons/site-logo";
import { Menu, Search, Home, Feather, MessageCircle, Library, Trophy, Compass, X, ChevronRight, LogOut, User } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Anasayfa", icon: Home },
        { href: "/makale", label: "Makale", icon: Feather },
        { href: "/blog", label: "Blog", icon: Compass },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/sozluk", label: "Lügat", icon: Library },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    ];

    // Deterministic "Random" Stars for Natural Look
    // Using box-shadow to create stars is efficient and allows "random" positioning in CSS
    const starShadowsSmall = "10vw 10vh #fff, 20vw 50vh #fff, 30vw 30vh #fff, 40vw 80vh #fff, 50vw 10vh #fff, 60vw 60vh #fff, 70vw 20vh #fff, 80vw 90vh #fff, 90vw 40vh #fff, 15vw 85vh #fff, 85vw 15vh #fff";
    const starShadowsMedium = "5vw 90vh #fff, 25vw 20vh #fff, 45vw 60vh #fff, 65vw 10vh #fff, 85vw 50vh #fff, 10vw 40vh #fff, 35vw 70vh #fff, 75vw 80vh #fff, 95vw 25vh #fff";

    return (
        <>
            {/* 
                V3: COMPACT NEO-BRUTALIST NAVBAR
                - Height: 56px (Mobile), 64px (Desktop)
                - Buttons: Vibrant, Small, Tactile
                - BG: Natural Stars
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-14 md:h-16", // Compact Height
                    "border-b-2 border-black/20 dark:border-white/10",
                    "bg-[#0a0a0a]", // Deep dark base
                    scrolled ? "shadow-md" : ""
                )}
            >
                {/* NATURAL STARS BACKGROUND (CSS-only) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                    {/* Small Stars */}
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full" style={{ boxShadow: starShadowsSmall }} />
                    {/* Medium Stars */}
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-50" style={{ boxShadow: starShadowsMedium }} />

                    {/* Very Subtle Nebula Tint (Optional) */}
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-purple-900/10 blur-3xl mix-blend-screen" />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - Refined Compact Logo */}
                        <Link href="/" className="group flex flex-col justify-center select-none z-10">
                            <div className="flex items-baseline leading-none">
                                {/* FIZIK */}
                                <span className="text-xl md:text-2xl font-black tracking-tight text-white font-heading">
                                    Fizik
                                </span>
                                {/* HUB - Long H Setup */}
                                <div className="flex items-baseline ml-0.5">
                                    <span className="text-3xl md:text-4xl font-black text-[#FFC800] transform translate-y-[3px]">
                                        H
                                    </span>
                                    <span className="text-xl md:text-2xl font-black text-[#FFC800]">
                                        ub
                                    </span>
                                </div>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest -mt-0.5 ml-0.5">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* 2. ACTIONS - Vibrant Neo-Brutalist Buttons */}
                        <div className="flex items-center gap-2">

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#23A9FA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                                <Search className="w-4 h-4 text-black stroke-[3px]" />
                            </button>

                            {/* Notifications */}
                            <div className="w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#FF90E8] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
                                <NotificationBell />
                            </div>

                            {/* Menu Trigger */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-9 h-9 flex items-center justify-center bg-[#FFC800] border-2 border-black rounded shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                        <Menu className="w-5 h-5 text-black stroke-[3px]" />
                                    </button>
                                </SheetTrigger>

                                {/* MOBILE DRAWER */}
                                <SheetContent side="right" className="w-[85vw] sm:w-[350px] bg-[#111] border-l-2 border-white/20 p-0 overflow-hidden z-[100]">
                                    <div className="flex flex-col h-full text-white">

                                        {/* Drawer Header */}
                                        <div className="h-14 px-5 border-b-2 border-white/10 flex items-center justify-between bg-[#151515]">
                                            <span className="text-lg font-black uppercase text-[#FFC800]">Menü</span>
                                            <SheetClose className="w-8 h-8 flex items-center justify-center bg-zinc-800 border-2 border-black/50 text-white rounded shadow-[2px_2px_0px_0px_#000]">
                                                <X className="w-4 h-4" />
                                            </SheetClose>
                                        </div>

                                        {/* Drawer Content */}
                                        <div className="p-5 flex-1 overflow-y-auto">
                                            <div className="grid gap-3">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all font-bold text-sm uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[3px_3px_0px_0px_#fff]"
                                                                    : "bg-[#1a1a1a] border-white/10 text-gray-300 hover:bg-[#222] hover:border-white/30"
                                                            )}
                                                        >
                                                            <link.icon className="w-4 h-4" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-6 border-t border-white/10" />

                                            <div className="bg-[#1a1a1a] border-2 border-white/10 p-4 rounded-xl">
                                                <span className="text-xs font-bold text-gray-500 uppercase mb-3 block">Hesap</span>
                                                <div className="flex justify-center">
                                                    <AuthButton />
                                                </div>
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
            <div className="h-14 md:h-16" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
