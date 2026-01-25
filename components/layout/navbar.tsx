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
                SPACE NEO-BRUTALIST NAVBAR V2
                - Refined Galaxy Background (Subtle)
                - Long 'H' Logo Style
                - Uniform Action Buttons
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-[72px] md:h-20",
                    "border-b-2 border-white/20",
                    "bg-[#0a0a0a]" // Always keep solid background for consistency, shadows added below if scrolled
                )}
            >
                {/* REFINED GALAXY BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Deep Space Base */}
                    <div className="absolute inset-0 bg-[#050505]" />

                    {/* Subtle Gradients - Toned down opacity */}
                    <div className="absolute top-[-50%] left-[20%] w-[600px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute top-[-50%] right-[20%] w-[500px] h-[500px] bg-blue-900/5 blur-[100px] rounded-full mix-blend-screen" />

                    {/* Dense Stars - Layer 1 */}
                    <div className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />
                    {/* Dense Stars - Layer 2 (Offset) */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                            backgroundSize: '15px 15px',
                            backgroundPosition: '10px 10px'
                        }}
                    />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 md:px-6 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* 1. BRAND - LONG 'H' DESIGN */}
                        <Link href="/" className="group flex flex-col justify-center select-none pt-1">
                            <div className="flex items-end leading-none">
                                {/* FIZIK */}
                                <span className="text-3xl md:text-4xl font-black tracking-tighter text-white font-heading z-10">
                                    Fizik
                                </span>
                                {/* HUB - "Long H" Style */}
                                <div className="flex items-baseline ml-1">
                                    {/* The Long H */}
                                    <span className="text-5xl md:text-6xl font-black text-[#FFC800] transform translate-y-[6px] md:translate-y-[8px] -mr-0.5">
                                        H
                                    </span>
                                    <span className="text-3xl md:text-4xl font-black text-[#FFC800]">
                                        ub
                                    </span>
                                </div>
                            </div>
                            {/* Subtitle - Aligned */}
                            <span className="text-[10px] md:text-[11px] font-bold text-gray-400/80 uppercase tracking-[0.2em] -mt-1 ml-0.5">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* 2. ACTIONS - UNIFORM NEO-BRUTALIST BUTTONS */}
                        <div className="flex items-center gap-2 md:gap-3">

                            {/* Search Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
                            >
                                <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[3px] text-black group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Notifications Button - Visible on Mobile now */}
                            <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group">
                                <div className="text-black group-hover:scale-110 transition-transform">
                                    <NotificationBell />
                                </div>
                            </div>

                            {/* Menu Button */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group">
                                        <Menu className="w-6 h-6 md:w-7 md:h-7 stroke-[3px] text-black group-hover:scale-110 transition-transform" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-[#0a0a0a] border-l-2 border-white p-0 overflow-y-auto z-[100]">
                                    {/* Mobile Menu Galaxy BG */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
                                        <div className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] bg-purple-900/20 blur-[80px] rounded-full" />
                                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                    </div>

                                    <div className="flex flex-col min-h-full relative text-white">

                                        {/* DRAWER HEADER */}
                                        <div className="h-20 px-6 border-b-2 border-white/20 flex items-center justify-between sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black uppercase tracking-tighter text-white font-heading">MENÜ</span>
                                            </div>
                                            <SheetClose className="w-10 h-10 flex items-center justify-center bg-[#FFC800] text-black border-2 border-black shadow-[3px_3px_0px_0px_white] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-md">
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
            </header>

            {/* SPACER for fixed header */}
            <div className="h-[72px] md:h-20" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
