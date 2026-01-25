"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, Home, Feather, MessageCircle, Library, Trophy, Compass, X } from "lucide-react";
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

    // SVG Star Pattern (High Visibility)
    const starPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='40' cy='30' r='0.5' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='80' cy='20' r='1.2' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='20' cy='80' r='0.8' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='60' cy='60' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='90' cy='90' r='0.6' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='50' r='0.5' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`;

    return (
        <>
            {/* 
                V6: FINAL COMPACT NEO-BRUTALISM
                - Height: 56px (Mobile Fix)
                - BG: Soft Purple + Stars (No Grid)
                - Logo: Long H (No Box)
                - Buttons: Colorful Neo Shadows
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-14 md:h-16", // Strict compact height
                    "border-b-2 border-white/10",
                    "bg-[#0a0a0a]",
                    scrolled ? "shadow-md bg-[#0a0a0a]/95 backdrop-blur" : ""
                )}
            >
                {/* BACKGROUND LAYERS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* 1. Star Overlay */}
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: starPattern }} />

                    {/* 2. Soft Purple/Blue Nebulas (As requested) */}
                    <div className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] bg-purple-900/15 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-900/10 blur-[80px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* BRAND: Long H Typography (No Box) */}
                        <Link href="/" className="group flex flex-col justify-center select-none z-10 pt-1">
                            <div className="flex items-end leading-none">
                                {/* FIZIK */}
                                <span className="text-3xl md:text-4xl font-black tracking-tighter text-white font-heading z-10">
                                    Fizik
                                </span>
                                {/* HUB - "Long H" Style Restoration */}
                                <div className="flex items-baseline ml-0.5">
                                    {/* The Long H */}
                                    <span className="text-5xl md:text-6xl font-black text-[#FFC800] transform translate-y-[8px] -mr-0.5">
                                        H
                                    </span>
                                    <span className="text-3xl md:text-4xl font-black text-[#FFC800]">
                                        ub
                                    </span>
                                </div>
                            </div>
                            {/* Subtitle - Aligned under Fizik */}
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-0.5 ml-0.5 opacity-80">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* ACTIONS - Compact Colorful Neo-Brutalist Buttons */}
                        <div className="flex items-center gap-2">

                            {/* Search: Cyan Shadow */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="relative w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#23A9FA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group"
                            >
                                <Search className="w-4 h-4 text-black stroke-[3px] group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Notifications: Pink Shadow */}
                            <div className="relative">
                                <NotificationBell className="w-9 h-9 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#FF90E8] text-black !p-0 hover:bg-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all" />
                            </div>

                            {/* Menu: Yellow BG + White Shadow */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="relative w-9 h-9 flex items-center justify-center bg-[#FFC800] border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all group">
                                        <Menu className="w-5 h-5 text-black stroke-[3px] group-hover:scale-110 transition-transform" />
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-[#0a0a0a] border-l-2 border-white p-0 overflow-hidden z-[100]">
                                    {/* Drawer BG: Stars + Purple */}
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: starPattern }} />
                                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-900/20 blur-[100px]" />

                                    <div className="flex flex-col h-full text-white relative z-10">
                                        {/* Drawer Header */}
                                        <div className="h-16 px-6 border-b-2 border-white/10 flex items-center justify-between bg-[#111]/80 backdrop-blur">
                                            <span className="text-xl font-black uppercase text-[#FFC800] tracking-tight">Menü</span>
                                            <SheetClose className="w-8 h-8 flex items-center justify-center bg-[#FFC800] border-2 border-black text-black rounded shadow-[2px_2px_0px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                                <X className="w-4 h-4 stroke-[3px]" />
                                            </SheetClose>
                                        </div>

                                        {/* Drawer Content */}
                                        <div className="p-6 flex-1 overflow-y-auto">
                                            <div className="space-y-3">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "group flex items-center gap-4 p-4 border-2 rounded-xl transition-all font-bold text-sm uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[3px_3px_0px_0px_#fff]"
                                                                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white hover:border-black hover:text-black hover:shadow-[3px_3px_0px_0px_#FFC800]"
                                                            )}
                                                        >
                                                            <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-8 border-t border-white/10" />

                                            <div className="bg-[#111] border-2 border-white/10 p-5 rounded-xl">
                                                <span className="text-[10px] font-black text-[#FFC800] uppercase mb-4 block tracking-widest">Kullanıcı</span>
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
