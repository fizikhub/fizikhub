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

    // SVG Star Pattern (Data URI) - Guaranteed visibility
    // High contrast white dots on transparent background
    const starPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='40' cy='30' r='0.5' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='80' cy='20' r='1.2' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='20' cy='80' r='0.8' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='60' cy='60' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='90' cy='90' r='0.6' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='50' r='0.5' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`;

    return (
        <>
            {/* 
                V4: HIGH CONTRAST & ROBUST NEO-BRUTALISM
                - Features: Guaranteed Star Visibility, Forced High Contrast, Uniform Button System
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-14 md:h-16", // Compact sizing
                    "border-b-2 border-white/20",
                    "bg-[#0a0a0a]", // Deep black
                    scrolled ? "shadow-lg shadow-purple-900/20" : ""
                )}
            >
                {/* 1. BACKGROUND LAYER */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* SVG Stars - Tiled */}
                    <div className="absolute inset-0 opacity-80" style={{ backgroundImage: starPattern }} />

                    {/* Gradient Blobs (Slight color) */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full mix-blend-screen" />
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 2. BRAND - High Contrast Logo */}
                        <Link href="/" className="group flex flex-col justify-center select-none z-10 pt-1">
                            <div className="flex items-baseline leading-none">
                                {/* FIZIK - Pure White */}
                                <span className="text-2xl md:text-3xl font-black tracking-tight text-white font-heading drop-shadow-md">
                                    Fizik
                                </span>
                                {/* HUB - Yellow - Long H */}
                                <div className="flex items-baseline ml-0.5">
                                    <span className="text-4xl md:text-5xl font-black text-[#FFC800] transform translate-y-[3px] drop-shadow-sm">
                                        H
                                    </span>
                                    <span className="text-2xl md:text-3xl font-black text-[#FFC800] drop-shadow-sm">
                                        ub
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] -mt-0.5 ml-0.5 drop-shadow-sm">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* 3. ACTIONS - Uniform & Styled */}
                        <div className="flex items-center gap-3">

                            {/* Search: White Box, Blue Shadow */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_#23A9FA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
                            >
                                <Search className="w-5 h-5 text-black stroke-[3px] group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Notifications: White Box, Pink Shadow - Forced Styling */}
                            {/* Passing 'text-black' is critical here to override default ghost button styles */}
                            <div className="relative">
                                <NotificationBell className="w-9 h-9 !rounded rounded-none border-2 border-black bg-white shadow-[2px_2px_0px_0px_#FF90E8] text-black hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all !p-0" />
                            </div>

                            {/* Menu: Yellow Box, White Shadow */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-9 h-9 flex items-center justify-center bg-[#FFC800] border-2 border-black rounded shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group">
                                        <Menu className="w-5 h-5 text-black stroke-[3px] group-hover:scale-110 transition-transform" />
                                    </button>
                                </SheetTrigger>

                                {/* DRAWER */}
                                <SheetContent side="right" className="w-[85vw] sm:w-[350px] bg-[#0a0a0a] border-l-2 border-white/20 p-0 overflow-hidden z-[100]">
                                    {/* Drawer Background */}
                                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: starPattern }} />

                                    <div className="flex flex-col h-full text-white relative z-10">

                                        {/* Drawer Header */}
                                        <div className="h-16 px-5 border-b-2 border-white/10 flex items-center justify-between bg-[#111]">
                                            <span className="text-xl font-black uppercase text-[#FFC800] font-heading tracking-wide">Menü</span>
                                            <SheetClose className="w-8 h-8 flex items-center justify-center bg-[#FFC800] border-2 border-black text-black rounded shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                                <X className="w-4 h-4 stroke-[3px]" />
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
                                                                    : "bg-[#111] border-white/20 text-gray-300 hover:bg-[#222] hover:border-white hover:text-white"
                                                            )}
                                                        >
                                                            <link.icon className="w-4 h-4" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-6 border-t border-white/10" />

                                            <div className="bg-[#111] border-2 border-white/10 p-4 rounded-xl">
                                                <span className="text-xs font-bold text-[#FFC800] uppercase mb-3 block tracking-widest">Hesap</span>
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
