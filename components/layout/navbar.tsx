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
import { motion } from "framer-motion";

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

    // Reference Image Analysis:
    // Buttons are white squares with rounded corners, black borders, and DEEP yellow shadows.
    // Shadow direction: Bottom-Right.
    // Color: #FFC800 (FizikHub Yellow).
    const btnClass = "relative h-11 w-11 flex items-center justify-center bg-white border-[3px] border-black rounded-lg shadow-[4px_4px_0px_0px_#FFC800] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#FFC800] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all";

    return (
        <>
            {/* 
                V10: "ZERO POINT"
                - Clean Slate Reconstruction based on User Image.
                - Focus: Big, Tactile Buttons & Clean Brand.
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-[72px]", // A bit taller to accommodate the big buttons
                    "border-b-[3px] border-white/10", // Subtle separator
                    "bg-[#0a0a0a]", // Pitch Dark
                    scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl" : ""
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* BRAND */}
                        <Link href="/" className="flex flex-col justify-center select-none z-10 group">
                            {/* Text Logo */}
                            <div className="flex items-baseline leading-none tracking-tight">
                                <span className="text-[32px] font-black text-white font-heading tracking-tighter">
                                    Fizik
                                </span>
                                <span className="text-[32px] font-black text-[#FFC800] font-heading tracking-tighter ml-0.5 group-hover:rotate-3 transition-transform inline-block">
                                    Hub
                                </span>
                            </div>
                            {/* Subtitle */}
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.25em] ml-1 -mt-1 group-hover:text-white transition-colors">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-4">

                            {/* Search */}
                            <motion.button
                                onClick={() => setIsSearchOpen(true)}
                                className={btnClass}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Search className="w-6 h-6 text-black stroke-[3px]" />
                            </motion.button>

                            {/* Notifications */}
                            <div className="relative">
                                <motion.div className={btnClass} whileTap={{ scale: 0.9 }}>
                                    <NotificationBell className="w-full h-full flex items-center justify-center !p-0 text-black border-none shadow-none bg-transparent" />
                                </motion.div>
                            </div>

                            {/* Menu (Restored) */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <motion.button
                                        className={btnClass}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Menu className="w-6 h-6 text-black stroke-[3px]" />
                                    </motion.button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-[#0a0a0a] border-l-[3px] border-white/20 p-0 overflow-hidden z-[100]">
                                    {/* Star Pattern Background */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                                    />

                                    <div className="flex flex-col h-full text-white relative z-10">
                                        <div className="h-20 px-6 border-b-[3px] border-white/10 flex items-center justify-between bg-[#111]">
                                            <span className="text-2xl font-black uppercase text-[#FFC800] tracking-tighter">Menü</span>
                                            <SheetClose asChild>
                                                <motion.button
                                                    className="w-10 h-10 flex items-center justify-center bg-[#FFC800] border-[3px] border-black text-black rounded-lg shadow-[2px_2px_0px_0px_#fff]"
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <X className="w-6 h-6 stroke-[3px]" />
                                                </motion.button>
                                            </SheetClose>
                                        </div>

                                        <div className="p-6 flex-1 overflow-y-auto">
                                            <div className="space-y-4">
                                                {navLinks.map((link, i) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <motion.div
                                                            key={link.href}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                        >
                                                            <Link
                                                                href={link.href}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className={cn(
                                                                    "group flex items-center gap-4 p-4 border-[3px] rounded-xl transition-all font-black text-lg uppercase tracking-wide",
                                                                    isActive
                                                                        ? "bg-[#FFC800] border-black text-black shadow-[4px_4px_0px_0px_#fff]"
                                                                        : "bg-[#151515] border-white/10 text-gray-300 hover:bg-white hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_#FFC800]"
                                                                )}
                                                            >
                                                                <link.icon className="w-6 h-6 stroke-[2.5px] group-hover:scale-110 transition-transform" />
                                                                {link.label}
                                                            </Link>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-8 border-t-[3px] border-white/10" />

                                            <div className="bg-[#151515] border-[3px] border-white/10 p-6 rounded-xl">
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
            <div className="h-[72px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
