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
import { motion, AnimatePresence } from "framer-motion";

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

    // SVG Star Pattern (High Visibility - Subtle)
    const starPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='40' cy='30' r='0.5' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='80' cy='20' r='1.2' fill='white' fill-opacity='0.2'/%3E%3Ccircle cx='20' cy='80' r='0.8' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='1' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='90' cy='90' r='0.6' fill='white' fill-opacity='0.2'/%3E%3Ccircle cx='30' cy='50' r='0.5' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E")`;

    // V7 Common Button Class - Matched to User's "Card" aesthetic
    // White BG + Black Border + YELLOW Shadow (Matches 'Hub' and 'Card Tag')
    const btnClass = "relative h-9 w-9 flex items-center justify-center bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_0px_#FFC800]";

    return (
        <>
            {/* 
                V8: "INTERACTIVE NEUBRUTALISM"
                - Reference: V7 + "Further Development"
                - Features: Framer Motion physics for tactile feel, Logo micro-interaction
            */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    "h-14", // Strict Compact 56px
                    "border-b-2 border-white/10",
                    "bg-[#0a0a0a]", // Deep Dark Base (Matches card bg)
                    scrolled ? "shadow-md bg-[#0a0a0a]/95 backdrop-blur" : ""
                )}
            >
                {/* BACKGROUND LAYERS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* 1. Star Overlay - Subtle */}
                    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: starPattern }} />

                    {/* 2. Minimized Atmospheric Purple */}
                    <div className="absolute -top-[100px] right-0 w-[400px] h-[400px] bg-purple-900/10 blur-[100px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative container max-w-7xl mx-auto px-4 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* BRAND: Clean Neubrutalist Typography with Motion */}
                        <Link href="/" className="group flex flex-col justify-center select-none z-10 pt-0.5">
                            <motion.div
                                className="flex items-baseline leading-none tracking-tight"
                                whileHover={{ x: 2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {/* FIZIK - White, Heavy Tone */}
                                <span className="text-[26px] md:text-3xl font-black text-white font-heading">
                                    Fizik
                                </span>
                                {/* HUB - Yellow, Same Height, Clean */}
                                <motion.span
                                    className="text-[26px] md:text-3xl font-black text-[#FFC800] font-heading ml-0.5"
                                    whileHover={{ display: "inline-block", rotate: 2 }}
                                >
                                    Hub
                                </motion.span>
                            </motion.div>
                            {/* "Bilim Platformu" - Clean, Aligned */}
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-0.5 ml-0.5 opacity-90 group-hover:text-white transition-colors">
                                Bilim Platformu
                            </span>
                        </Link>

                        {/* ACTIONS - "Card Tag" Aesthetics with Physics */}
                        <div className="flex items-center gap-2.5">

                            {/* Search */}
                            <motion.button
                                onClick={() => setIsSearchOpen(true)}
                                className={btnClass}
                                whileHover={{ y: -2, x: -2, boxShadow: "5px 5px 0px 0px #FFC800" }}
                                whileTap={{ y: 2, x: 2, boxShadow: "1px 1px 0px 0px #FFC800", scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <Search className="w-[18px] h-[18px] text-black stroke-[2.5px]" />
                            </motion.button>

                            {/* Notifications */}
                            <div className="relative">
                                {/* Wrapped for motion, bypassing internal styles */}
                                <motion.div
                                    className={cn(btnClass, "flex items-center justify-center cursor-pointer")}
                                    whileHover={{ y: -2, x: -2, boxShadow: "5px 5px 0px 0px #FFC800" }}
                                    whileTap={{ y: 2, x: 2, boxShadow: "1px 1px 0px 0px #FFC800", scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {/* We pass !p-0 to reset padding, and text-black to ensure icon visibility */}
                                    <NotificationBell className="w-full h-full flex items-center justify-center !p-0 text-black bg-transparent border-none shadow-none" />
                                </motion.div>
                            </div>

                            {/* Menu - Hidden on Mobile via class 'hidden md:flex' */}
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <motion.button
                                        className={cn(btnClass, "hidden md:flex")}
                                        whileHover={{ y: -2, x: -2, boxShadow: "5px 5px 0px 0px #FFC800" }}
                                        whileTap={{ y: 2, x: 2, boxShadow: "1px 1px 0px 0px #FFC800", scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    >
                                        <Menu className="w-[20px] h-[20px] text-black stroke-[2.5px]" />
                                    </motion.button>
                                </SheetTrigger>

                                <SheetContent side="right" className="w-[85vw] sm:w-[380px] bg-[#0a0a0a] border-l-2 border-white/20 p-0 overflow-hidden z-[100]">
                                    {/* Drawer Styling */}
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: starPattern }} />

                                    <div className="flex flex-col h-full text-white relative z-10">
                                        {/* Drawer Header */}
                                        <div className="h-16 px-6 border-b-2 border-white/10 flex items-center justify-between bg-[#111]">
                                            <span className="text-xl font-black uppercase text-[#FFC800] tracking-tight">Menü</span>
                                            <SheetClose asChild>
                                                <motion.button
                                                    className="w-8 h-8 flex items-center justify-center bg-[#FFC800] border-2 border-black text-black rounded shadow-[2px_2px_0px_0px_#fff]"
                                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <X className="w-4 h-4 stroke-[3px]" />
                                                </motion.button>
                                            </SheetClose>
                                        </div>

                                        {/* Drawer Content */}
                                        <div className="p-6 flex-1 overflow-y-auto">
                                            <div className="space-y-3">
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
                                                                    "group flex items-center gap-4 p-4 border-2 rounded-lg transition-all font-bold text-sm uppercase",
                                                                    isActive
                                                                        ? "bg-[#FFC800] border-black text-black shadow-[3px_3px_0px_0px_#fff]"
                                                                        : "bg-[#151515] border-white/10 text-gray-300 hover:bg-white hover:border-black hover:text-black hover:shadow-[3px_3px_0px_0px_#FFC800]"
                                                                )}
                                                            >
                                                                <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                {link.label}
                                                            </Link>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>

                                            <div className="my-8 border-t border-white/10" />

                                            <motion.div
                                                className="bg-[#151515] border-2 border-white/10 p-5 rounded-lg"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <span className="text-[10px] font-black text-[#FFC800] uppercase mb-4 block tracking-widest">Kullanıcı</span>
                                                <div className="flex justify-center">
                                                    <AuthButton />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER */}
            <div className="h-14" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
