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

    return (
        <>
            {/* 
                SPACE NEO-BRUTALIST NAVBAR
                - Background: Galaxy/Space Theme (CSS Gradients)
                - Style: Hard Borders, High Contrast
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-[72px] md:h-20", // Slightly taller for the stacked logo, but kept compact
                    "border-b-2 border-white/20", // Subtle border for space theme
                    scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md shadow-[0_4px_0_0_rgba(147,51,234,0.5)]" : "bg-[#0a0a0a]"
                )}
            >
                {/* GALAXY BACKGROUND EFFECTS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Deep Space Base */}
                    <div className="absolute inset-0 bg-[#050505]" />
                    
                    {/* Purple/Blue Galaxy Gradients */}
                    <div className="absolute top-[-50%] left-[10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
                    <div className="absolute top-[-50%] right-[10%] w-[400px] h-[400px] bg-blue-900/10 blur-[80px] rounded-full mix-blend-screen" />
                    
                    {/* Stars (CSS Pattern) */}
                    <div className="absolute inset-0 opacity-30" 
                        style={{
                            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} 
                    />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 md:px-6 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - CUSTOM LAYOUT */}
                        <Link href="/" className="group flex flex-col justify-center select-none">
                            {/* Main Row: FIZIK + HUB */}
                            <div className="flex items-end gap-1 leading-none">
                                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white font-heading transform translate-y-1">
                                    Fizik
                                </span>
                                {/* HUB BOX - Amber with Hard Border */}
                                <div className="relative bg-[#FFC800] border-2 border-black px-1.5 pt-0.5 pb-1 ml-0.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                                    <span className="text-xl md:text-2xl font-black text-black tracking-tight block transform scale-y-110">
                                        Hub
                                    </span>
                                </div>
                            </div>
                            {/* Subtitle Row - "Bilim Platformu" */}
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 ml-0.5 group-hover:text-[#FFC800] transition-colors">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* 2. ACTIONS - NEO-BRUTALIST BUTTONS */}
                        <div className="flex items-center gap-3">
                            
                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden md:flex w-10 h-10 items-center justify-center bg-white border-2 border-black text-black hover:bg-[#FFC800] transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-md"
                            >
                                <Search className="w-5 h-5 stroke-[3px]" />
                            </button>
                             {/* Mobile Search Button (Simpler) */}
                             <button
                                onClick={() => setIsSearchOpen(true)}
                                className="md:hidden w-9 h-9 flex items-center justify-center bg-white border-2 border-black text-black active:bg-[#FFC800] rounded-md"
                            >
                                <Search className="w-5 h-5 stroke-[3px]" />
                            </button>

                            {/* Notifications */}
                            <div className="hidden sm:flex w-10 h-10 items-center justify-center bg-white border-2 border-black text-black hover:bg-[#FFC800] transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none rounded-md">
                                <NotificationBell />
                            </div>

                            {/* MOBILE MENU TRIGGER */}
                            <div className="block"> {/* Removed lg:hidden to show on desktop if needed, or stick to normal nav. For this 'Space' design, a drawer is cleaner even on desktop, but let's stick to mobile-only for now unless specified. Actually, let's keep drawer for mobile. */}
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <button className="h-10 px-3 flex items-center gap-2 bg-white border-2 border-black text-black hover:bg-[#FFC800] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-md">
                                            <Menu className="w-6 h-6 stroke-[3px]" />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-[#0a0a0a] border-l-2 border-white p-0 overflow-y-auto z-[100]">
                                        {/* GALAXY BG IN DRAWER TOO */}
                                         <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
                                            <div className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] bg-purple-900/30 blur-[80px] rounded-full" />
                                        </div>

                                        <div className="flex flex-col min-h-full relative text-white">

                                            {/* DRAWER HEADER */}
                                            <div className="h-20 px-6 border-b-2 border-white/20 flex items-center justify-between sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md">
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-black uppercase tracking-tighter text-white">MENÜ</span>
                                                    <span className="text-[10px] text-gray-400">FIZIKHUB NAVİGASYON</span>
                                                </div>
                                                <SheetClose className="w-9 h-9 flex items-center justify-center bg-[#FFC800] text-black border-2 border-black hover:bg-white hover:scale-105 transition-all shadow-[2px_2px_0px_0px_white]">
                                                    <X className="w-6 h-6 stroke-[3px]" />
                                                </SheetClose>
                                            </div>

                                            {/* DRAWER LINKS */}
                                            <div className="p-6 space-y-3 flex-1">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "group flex items-center justify-between p-4 border-2 rounded-xl transition-all font-bold text-base uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_white]"
                                                                    : "bg-transparent border-white/30 text-white hover:bg-white hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_#FFC800]"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn("p-2 rounded-lg border-2 border-transparent group-hover:border-black group-hover:bg-[#FFC800] transition-colors", isActive ? "bg-black text-[#FFC800]" : "bg-white/10")}>
                                                                    <link.icon className="w-5 h-5" />
                                                                </div>
                                                                {link.label}
                                                            </div>
                                                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                        </Link>
                                                    )
                                                })}

                                                <div className="my-6 border-t-2 border-white/20" />

                                                {/* Mobile Auth */}
                                                <div className="flex flex-col gap-3">
                                                    <div className="p-5 bg-zinc-900/50 border-2 border-white/20 rounded-xl relative overflow-hidden">
                                                        <div className="relative z-10">
                                                            <span className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">HESAP</span>
                                                            <div className="flex justify-center">
                                                                <AuthButton />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FOOTER DECOR */}
                                            <div className="p-4 bg-black/50 text-white text-center border-t-2 border-white/20">
                                                <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#FFC800]">
                                                    Bilimi Ti'ye Alıyoruz
                                                </p>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER for fixed header */}
            <div className="h-[72px] md:h-20" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
