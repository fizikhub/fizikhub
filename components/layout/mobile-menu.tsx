"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const menuItems = [
    { href: '/', label: 'Akış', icon: Home, color: 'bg-[#FFC800]' },
    { href: '/kesfet', label: 'Keşfet', icon: Compass, color: 'bg-[#FF90E8]' },
    { href: '/simulasyonlar', label: 'Simülasyon', icon: Atom, color: 'bg-[#23A9FA]' },
    { href: '/siralamalar', label: 'Sıralama', icon: Trophy, color: 'bg-[#FFC800]' },
    { href: '/sozluk', label: 'Sözlük', icon: Book, color: 'bg-[#00F0A0]' }, // Added Dictionary
    { href: '/iletisim', label: 'İletişim', icon: Mail, color: 'bg-zinc-200' },
    { href: "/ozel", label: "ÖZEL İÇERİK", sub: "Premium Alan", icon: Zap },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="no-min-size w-8 h-8 box-border p-0 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-lg"
                >
                    <Menu className="w-4 h-4 text-black stroke-[3]" />
                </button>
            </SheetTrigger>

            {/* 
               NEO-BRUTALIST SHEET: 
               - No default Shadcn overlay animation (controlled via classes if needed, but standard is fine).
               - Custom Border & Shadow matching Article Card.
            */}
            <SheetContent
                side="right"
                className={cn(
                    "w-[85%] max-w-[350px] p-0 border-l-[3px] border-black bg-white dark:bg-[#27272a] shadow-none flex flex-col h-full",
                    // Use a massive shadow to simulate the page being 'behind'
                    "shadow-[-10px_0px_30px_-10px_rgba(0,0,0,0.5)]"
                )}
                showClose={false} // We implement custom close
            >
                <div className="sr-only">
                    <SheetTitle>Navigasyon</SheetTitle>
                    <SheetDescription>Ana Menü</SheetDescription>
                </div>

                {/* 1. HEADER SECTION */}
                <div className="relative h-24 bg-[#121212] flex items-center justify-between px-6 border-b-2 border-neo-black">
                    {/* "MENÜ" Badge */}
                    <div className="bg-[#FFC800] border-[3px] border-neo-black shadow-[4px_4px_0px_0px_#000] px-4 py-2">
                        <span className="font-black text-2xl uppercase tracking-tighter text-neo-black">
                            MENÜ
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="w-10 h-10 bg-white border-[3px] border-neo-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-md"
                    >
                        <X className="w-6 h-6 stroke-[3] text-neo-black" />
                    </button>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex-1 overflow-y-auto bg-[#1a1a1a] p-6 space-y-4">
                    {menuItems.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="block"
                            >
                                <div className="flex items-center justify-between p-4 bg-[#121212] border-[3px] border-neo-black shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border-2 border-neo-black rounded-lg">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="font-black text-xl uppercase tracking-tight text-white group-hover:text-[#FFC800] transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <div className="pt-4">
                        <Link href="/giris" onClick={() => setOpen(false)}>
                            <button className="w-full py-4 font-black text-lg border-[3px] border-neo-black bg-white text-neo-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-xl uppercase">
                                Giriş Yap
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 3. FOOTER */}
                <div className="p-8 bg-[#121212] border-t-2 border-neo-black flex flex-col items-center gap-6">
                    <div className="flex gap-4">
                        {[Twitter, Instagram, Github].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-12 h-12 flex items-center justify-center bg-white border-[3px] border-neo-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg"
                            >
                                <Icon className="w-6 h-6 text-neo-black" />
                            </a>
                        ))}
                    </div>
                    <p className="font-black text-xs uppercase text-zinc-500 tracking-[0.2em]">
                        FIZIKHUB © 2026
                    </p>
                </div>

            </SheetContent>
        </Sheet>
    );
}
