"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
    { href: '/', label: 'Akış', icon: Home, color: 'hover:bg-[#FFC800] hover:text-black', iconBg: 'bg-[#FFC800]' },
    { href: '/kesfet', label: 'Keşfet', icon: Compass, color: 'hover:bg-[#FF90E8] hover:text-black', iconBg: 'bg-[#FF90E8]' },
    { href: '/simulasyonlar', label: 'Simülasyon', icon: Atom, color: 'hover:bg-[#23A9FA] hover:text-black', iconBg: 'bg-[#23A9FA]' },
    { href: '/siralamalar', label: 'Sıralama', icon: Trophy, color: 'hover:bg-[#FFC800] hover:text-black', iconBg: 'bg-[#FFC800]' },
    { href: '/sozluk', label: 'Sözlük', icon: Book, color: 'hover:bg-[#00F0A0] hover:text-black', iconBg: 'bg-[#00F0A0]' },
    { href: '/iletisim', label: 'İletişim', icon: Mail, color: 'hover:bg-zinc-200 hover:text-black', iconBg: 'bg-zinc-200' },
    { href: "/ozel", label: "ÖZEL İÇERİK", sub: "Premium Alan", icon: Zap, color: 'hover:bg-[#FACC15] hover:text-black', iconBg: 'bg-[#FACC15] border-black shadow-[2px_2px_0px_#000]' },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    id="mobile-menu-trigger"
                    className="no-min-size w-8 h-8 box-border p-0 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-lg group"
                >
                    <Menu className="w-4 h-4 text-black stroke-[3] group-hover:scale-110 transition-transform" />
                </button>
            </SheetTrigger>

            {/* 
               VIVID & SOFT MOBILE MENU
               - Background: #27272a (Lighter Dark)
               - Borders: 3px Black
               - Interactions: Vivid Colors
            */}
            <SheetContent
                side="right"
                className={cn(
                    "w-[85%] max-w-[350px] p-0 border-l-[3px] border-black bg-[#27272a] shadow-none flex flex-col h-full",
                    // Massive shadow for depth
                    "shadow-[-15px_0px_40px_-10px_rgba(0,0,0,0.8)]"
                )}
                showClose={false}
            >
                <div className="sr-only">
                    <SheetTitle>Navigasyon</SheetTitle>
                    <SheetDescription>Ana Menü</SheetDescription>
                </div>

                {/* 1. HEADER SECTION */}
                <div className="relative h-20 bg-[#27272a] flex items-center justify-between px-6 border-b-[3px] border-black">
                    {/* "MENÜ" Badge */}
                    <div className="bg-[#FACC15] border-2 border-black shadow-[3px_3px_0px_0px_#000] px-3 py-1 -rotate-2">
                        <span className="font-black text-lg uppercase tracking-tighter text-black">
                            MENÜ
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg active:translate-y-[2px]"
                    >
                        <X className="w-6 h-6 stroke-[3] text-black" />
                    </button>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex-1 overflow-y-auto bg-[#202023] p-4 space-y-3">
                    {menuItems.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="block"
                            >
                                <div className={cn(
                                    "flex items-center justify-between p-3 bg-[#27272a] border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl group",
                                    item.color
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 flex items-center justify-center border-2 border-black rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]",
                                            item.iconBg
                                        )}>
                                            <item.icon className="w-5 h-5 text-black stroke-[2.5px]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-lg uppercase tracking-tight text-zinc-100 group-hover:text-black transition-colors">
                                                {item.label}
                                            </span>
                                            {item.sub && (
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] group-hover:text-black/70">
                                                    {item.sub}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-black transition-all transform group-hover:translate-x-1 stroke-[3px]" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <div className="pt-4 mt-4 border-t-2 border-zinc-800">
                        <Link href="/giris" onClick={() => setOpen(false)}>
                            <button className="w-full py-4 font-black text-lg border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-xl uppercase flex items-center justify-center gap-2 group">
                                <User className="w-5 h-5 stroke-[3px]" />
                                Giriş Yap
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 3. FOOTER */}
                <div className="p-6 bg-[#27272a] border-t-[3px] border-black flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        {[Twitter, Instagram, Github].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg active:translate-y-[2px]"
                            >
                                <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
                            </a>
                        ))}
                    </div>
                    <p className="font-black text-[10px] uppercase text-zinc-500 tracking-[0.3em]">
                        FIZIKHUB © 2026
                    </p>
                </div>

            </SheetContent>
        </Sheet>
    );
}
