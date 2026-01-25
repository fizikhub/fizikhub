"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Search, Compass, Zap, Menu, X, Trophy, Library, MessageCircle, Feather } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";

export function MobileNavbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Navigation Data
    const dockLinks = [
        { href: "/", icon: Home, label: "Ana" },
        { href: "/makale", icon: Feather, label: "Makale" },
        { href: "/ozel", icon: Zap, label: "Özel", isPrimary: true },
        { href: "/ara", icon: Search, label: "Ara" },
        { id: "menu", href: "#menu", icon: Menu, label: "Menü", isTrigger: true }, // Added href to fix TS Error
    ];

    const drawerLinks = [
        { href: "/blog", label: "Blog", icon: Compass },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/sozluk", label: "Lügat", icon: Library },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    ];

    // SVG Pattern for Drawer BG
    const starPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='40' cy='30' r='0.5' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='80' cy='20' r='1.2' fill='white' fill-opacity='0.2'/%3E%3Ccircle cx='20' cy='80' r='0.8' fill='white' fill-opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='1' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='90' cy='90' r='0.6' fill='white' fill-opacity='0.2'/%3E%3Ccircle cx='30' cy='50' r='0.5' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E")`;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[9999] md:hidden font-sans">
            {/* 
        V9 MOBILE DOCK: "The Command Strip"
        - Style: Neo-Brutalist Construction
        - Color: Warning Yellow (#facc15) Base
        - Shadow: Hard Black (5px)
      */}
            <div className="flex items-center justify-between px-2 py-2 bg-[#facc15] border-[3px] border-black shadow-neo rounded-xl relative">

                {dockLinks.map((link) => {

                    // PRIMARY ACTION (Center)
                    if (link.isPrimary) {
                        return (
                            <motion.div
                                key={link.href}
                                className="relative -top-8"
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link
                                    href={link.href}
                                    className="flex items-center justify-center w-16 h-16 bg-[#8b5cf6] border-[3px] border-black shadow-neo text-white rounded-xl"
                                >
                                    <link.icon className="w-8 h-8 stroke-[3px]" />
                                </Link>
                            </motion.div>
                        )
                    }

                    // MENU TRIGGER (Rightmost)
                    if (link.isTrigger) {
                        return (
                            <Sheet key={link.id} open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <motion.button
                                        className="flex flex-col items-center justify-center w-12 h-12 rounded-lg text-black hover:bg-black/10 transition-colors"
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <link.icon className="w-7 h-7 stroke-[3px]" />
                                    </motion.button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[85vh] bg-[#09090b] border-t-[3px] border-black p-0 rounded-t-3xl overflow-hidden focus:outline-none">
                                    {/* Drawer Content */}
                                    <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: starPattern }} />
                                    <div className="absolute -top-[100px] right-0 w-[300px] h-[300px] bg-purple-900/20 blur-[80px]" />

                                    <div className="relative z-10 flex flex-col h-full p-6">
                                        {/* Handle */}
                                        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-6" />

                                        <h2 className="text-2xl font-black text-[#facc15] uppercase tracking-tighter mb-6 font-heading">
                                            Fizik<span className="text-white">Hub</span> <span className="text-xs text-gray-500 tracking-widest pl-2 font-mono">MENÜ</span>
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4">
                                            {drawerLinks.map((dLink) => (
                                                <Link
                                                    key={dLink.href}
                                                    href={dLink.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex flex-col items-center justify-center p-4 bg-[#1f2937] border-[2px] border-black shadow-neo-sm rounded-xl hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all text-center"
                                                >
                                                    <dLink.icon className="w-8 h-8 text-white stroke-[2px] mb-2" />
                                                    <span className="text-sm font-bold text-[#facc15] uppercase tracking-tight">{dLink.label}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-auto border-[2px] border-white/10 p-4 rounded-xl bg-black/20">
                                            <AuthButton />
                                        </div>

                                        <SheetClose asChild>
                                            <button className="mt-6 w-full py-4 bg-white border-[3px] border-black shadow-neo-sm rounded-xl text-black font-black uppercase tracking-widest text-sm active:translate-y-1 active:shadow-none transition-all">
                                                Kapat
                                            </button>
                                        </SheetClose>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )
                    }

                    // STANDARD LINKS
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all",
                                isActive ? "bg-black text-white shadow-neo-sm border-2 border-black" : "text-black hover:bg-black/10"
                            )}
                        >
                            <link.icon className={cn("w-6 h-6 stroke-[3px]")} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
