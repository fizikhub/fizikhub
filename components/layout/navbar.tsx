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

    // SVG Star Pattern (High Visibility data-uri)
    const starPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='40' cy='30' r='0.5' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='80' cy='20' r='1.2' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='20' cy='80' r='0.8' fill='white' fill-opacity='0.5'/%3E%3Ccircle cx='60' cy='60' r='1' fill='white' fill-opacity='0.6'/%3E%3Ccircle cx='90' cy='90' r='0.6' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='50' r='0.5' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`;

    // Linear Grid Pattern
    const gridPattern = `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`;

    // Common Button Class (Premium Brutalist Token)
    const btnClass = "relative h-10 w-10 flex items-center justify-center border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#fff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all";

    return (
        <>
            {/* 
                V5: PREMIUM SPACE BRUTALISM
                - Hard Black Borders & White Shadows (Contrast)
                - Grid + Star Background
                - Boxed Logo
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-[72px] md:h-20",
                    "border-b-[3px] border-white/20",
                    "bg-[#050505]",
                    scrolled ? "shadow-xl" : ""
                )}
            >
                {/* BACKGROUND LAYERS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* 1. Base Grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: gridPattern, backgroundSize: '40px 40px' }} />

                    {/* 2. Star Overlay */}
                    <div className="absolute inset-0 opacity-70" style={{ backgroundImage: starPattern }} />

                    {/* 3. Subtle Gradient Wash (Top Right) */}
                    <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* BRAND: FIZIK + [HUB] */}
                        <Link href="/" className="group flex flex-col justify-center select-none z-10 pt-1">
                            <div className="flex items-center gap-1.5 leading-none">
                                {/* FIZIK */}
                                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white font-heading">
                                    Fizik
                                </span>
                                {/* HUB BOX */}
                                <div className="bg-[#FFC800] border-[3px] border-black px-2 py-0.5 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all">
                                    <span className="text-2xl md:text-3xl font-black text-black tracking-white">
                                        Hub
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.25em] mt-1.5 ml-0.5">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className={cn(btnClass, "bg-white text-black")}
                            >
                                <Search className="w-5 h-5 stroke-[3px]" />
                            </button>

                            {/* Notifications - Forced Black Text */}
                            <div className="relative">
                                {/* We override the internal button styles completely by passing our class */}
                                <NotificationBell className={cn(btnClass, "bg-white text-black !p-0 rounded-lg")} />
                            </div>

                            {/* Menu */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className={cn(btnClass, "bg-[#FFC800] text-black")}>
                                        <Menu className="w-6 h-6 stroke-[3px]" />
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-[#050505] border-l-[3px] border-white p-0 overflow-hidden z-[100]">
                                    {/* Drawer BG */}
                                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: gridPattern, backgroundSize: '40px 40px' }} />

                                    <div className="flex flex-col h-full text-white relative z-10">

                                        {/* Drawer Header */}
                                        <div className="h-20 px-6 border-b-[3px] border-white/20 flex items-center justify-between bg-[#0a0a0a]">
                                            <span className="text-2xl font-black uppercase text-[#FFC800] tracking-tighter">Menü</span>
                                            <SheetClose className={cn(btnClass, "bg-[#FFC800] text-black h-9 w-9 border-2 shadow-[3px_3px_0px_0px_#fff]")}>
                                                <X className="w-5 h-5 stroke-[3px]" />
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
                                                                "flex items-center gap-4 p-4 border-[3px] transition-all font-bold text-lg uppercase",
                                                                isActive
                                                                    ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_#fff]"
                                                                    : "bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#FFC800]"
                                                            )}
                                                        >
                                                            <link.icon className="w-6 h-6 stroke-[2.5px]" />
                                                            {link.label}
                                                        </Link>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-8 border-t-[3px] border-white/10" />

                                            <div className="bg-[#111] border-[3px] border-white/20 p-6">
                                                <span className="text-xs font-black text-[#FFC800] uppercase mb-4 block tracking-widest">Kullanıcı İşlemleri</span>
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
            <div className="h-[72px] md:h-20" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
