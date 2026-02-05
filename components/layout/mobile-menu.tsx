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
                    className="!w-[34px] !h-[34px] !min-w-0 !min-h-0 box-border p-0 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-lg"
                >
                    <Menu className="w-4 h-4 text-black stroke-[3.5]" />
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

                {/* 1. HEADER SECTION (Mimics Article Image Area) */}
                <div className="relative h-24 bg-zinc-100 dark:bg-zinc-800 border-b-[3px] border-black flex items-end p-4 overflow-hidden">
                    {/* Noise */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

                    {/* "Category Tag" Style Title */}
                    <div className="relative z-10 transform -rotate-1">
                        <span className="inline-block bg-[#FFC800] border-[2px] border-black text-black px-3 py-1 font-black text-lg uppercase shadow-[2px_2px_0px_0px_#000] tracking-tighter">
                            MENÜ
                        </span>
                    </div>

                    {/* Custom Close Button */}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 w-8 h-8 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-20 rounded-md"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                {/* 2. BODY SECTION (Mimics Content Area) */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-[#27272a] p-4">
                    {/* Motion Wrapper for staggered effect */}
                    <div className="flex flex-col gap-3">
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (i * 0.05), duration: 0.3, type: "spring", stiffness: 300, damping: 24 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="group block relative"
                                >
                                    <div className={cn(
                                        "flex items-center justify-between p-3 border-[2px] border-black bg-white dark:bg-[#18181b] rounded-lg transition-all duration-200",
                                        // Interaction State
                                        "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px_#000]"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 border-[2px] border-black rounded-md text-black dark:text-white group-hover:bg-[#FFC800] group-hover:text-black transition-colors duration-300">
                                                <item.icon className="w-4 h-4 stroke-[2.5]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-base uppercase tracking-tight leading-none text-black dark:text-white">
                                                    {item.label}
                                                </span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                                                    {item.sub}
                                                </span>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-4 h-4 stroke-[3] text-zinc-300 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* SEPARATOR */}
                    <div className="h-px w-full border-t-[2px] border-dashed border-black/10 my-4"></div>

                    {/* ACCOUNT BUTTONS */}
                    <div className="space-y-2">
                        <Link href="/giris" onClick={() => setOpen(false)}>
                            <button className="w-full py-2.5 font-bold border-[2px] border-black bg-black text-white hover:bg-zinc-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] dark:border-white dark:shadow-none rounded-lg uppercase tracking-wide text-xs">
                                Giriş Yap
                            </button>
                        </Link>
                    </div>
                </div>

                {/* 3. FOOTER (Mimics Author/Actions) */}
                <div className="p-4 border-t-[3px] border-black bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex justify-center gap-3">
                        {[Twitter, Instagram, Github].map((Icon, i) => (
                            <a key={i} href="#" className="w-9 h-9 flex items-center justify-center border-[2px] border-black bg-white hover:bg-[#FFC800] transition-colors shadow-[2px_2px_0px_0px_#000] rounded-md">
                                <Icon className="w-4 h-4 stroke-[2.5]" />
                            </a>
                        ))}
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">FIZIKHUB © 2026</p>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    );
}
