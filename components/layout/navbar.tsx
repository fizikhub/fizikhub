"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Home, Zap, Menu, Compass } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Navigation Items based on Screenshot
    // Home, Explore (Compass), Special (Lightning), Search, Menu
    const navItems = [
        { id: "home", icon: Home, href: "/" },
        { id: "explore", icon: Compass, href: "/makale" },
        { id: "special", icon: Zap, href: "/ozel", isPrimary: true }, // The Yellow/Black Lightning
        { id: "search", icon: Search, action: () => setIsSearchOpen(true) },
        { id: "menu", icon: Menu, action: () => setIsMenuOpen(true) },
    ];

    return (
        <>
            {/* 
                V14: TOP CAPSULE (The "Simple" Request)
                - Position: Fixed Top, Centered.
                - Style: Black Pill, Rounded Full.
                - Content: Icons only, precise ordering.
            */}
            <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={cn(
                        "pointer-events-auto",
                        "flex items-center gap-1 p-2",
                        "bg-[#121212] border-[3px] border-black", // Dark Container
                        "rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]", // Subtle shadow
                        "w-full max-w-[380px] sm:max-w-[420px]" // Responsive width container
                    )}
                >
                    {navItems.map((item) => {
                        const isActive = item.href ? pathname === item.href : false;

                        // 1. PRIMARY BUTTON (Middle Lightning)
                        if (item.isPrimary) {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href || "#"}
                                    className="mx-2"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center justify-center w-12 h-12 bg-[#FFC800] border-[2px] border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <item.icon className="w-6 h-6 text-black fill-black stroke-[2.5px]" />
                                    </motion.div>
                                </Link>
                            );
                        }

                        // 2. ACTION BUTTONS (Menu, Search)
                        if (item.action) {
                            if (item.id === 'menu') {
                                return (
                                    <Sheet key={item.id} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                        <SheetTrigger asChild>
                                            <button className="relative flex items-center justify-center w-12 h-12 rounded-full text-zinc-400 hover:text-white transition-colors">
                                                <item.icon className="w-6 h-6" />
                                            </button>
                                        </SheetTrigger>
                                        <SheetContent side="top" className="w-full h-auto min-h-[50vh] bg-[#0a0a0a] border-b-[3px] border-white/10 rounded-b-[32px] p-6 pt-24 text-white">
                                            <div className="flex flex-col gap-4">
                                                <Link href="/profil" onClick={() => setIsMenuOpen(false)} className="bg-[#151515] p-4 rounded-xl border border-white/5 font-bold text-center">Profilim</Link>
                                                <Link href="/ayarlar" onClick={() => setIsMenuOpen(false)} className="bg-[#151515] p-4 rounded-xl border border-white/5 font-bold text-center">Ayarlar</Link>
                                                <div className="h-px bg-white/10 my-2" />
                                                <AuthButton />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                )
                            }
                            return (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className="relative flex items-center justify-center w-12 h-12 rounded-full text-zinc-400 hover:text-white transition-colors"
                                >
                                    <item.icon className="w-6 h-6" />
                                </button>
                            );
                        }

                        // 3. REGULAR LINKS (Home, Explore)
                        return (
                            <Link
                                key={item.id}
                                href={item.href || "#"}
                                className={cn(
                                    "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                                    isActive ? "text-[#FFC800]" : "text-zinc-400 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                {isActive && (
                                    <motion.div
                                        layoutId="capsule-dot"
                                        className="absolute bottom-1 w-1.5 h-1.5 bg-[#FFC800] rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </motion.div>
            </header>

            {/* SPACER (No Spacer needed for floating, but maybe a bit of padding for content) */}
            <div className="h-[20px]" />

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
