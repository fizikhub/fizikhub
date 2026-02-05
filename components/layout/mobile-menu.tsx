"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const menuItems = [
    { href: '/', label: 'Akış', sub: 'Ana Sayfa', icon: Home, color: 'bg-[#FFC800]' },
    { href: '/makale', label: 'Keşfet', sub: 'Makaleler ve Bloglar', icon: Compass, color: 'bg-[#FF90E8]' },
    { href: '/simulasyonlar', label: 'Laboratuvar', sub: 'İnteraktif Deneyler', icon: Atom, color: 'bg-[#23A9FA]' },
    { href: '/siralamalar', label: 'Liderlik', sub: 'Lig ve Sıralamalar', icon: Trophy, color: 'bg-[#FFC800]' },
    { href: '/sozluk', label: 'Sözlük', sub: 'Terimler Rehberi', icon: Book, color: 'bg-[#00F0A0]' },
    { href: '/iletisim', label: 'Destek', sub: 'Bize Ulaşın', icon: Mail, color: 'bg-zinc-200' },
    { href: "/ozel", label: "Premium", sub: "Özel İçerik Alanı", icon: Zap },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="w-[30px] h-[30px] flex items-center justify-center bg-white border border-black/20 rounded-sm hover:border-white transition-colors"
                >
                    <Menu className="w-4 h-4 text-black stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className={cn(
                    "w-[85%] max-w-[320px] p-0 border-l-[3px] border-black bg-[#fafafa] dark:bg-[#121214] shadow-none flex flex-col h-full",
                    "shadow-[-10px_0px_50px_-10px_rgba(0,0,0,0.3)]"
                )}
                showClose={false}
            >
                <div className="sr-only">
                    <SheetTitle>Navigasyon</SheetTitle>
                    <SheetDescription>Ana Menü</SheetDescription>
                </div>

                {/* 1. HEADER SECTION (Premium Soft-Brutalist) */}
                <div className="relative h-32 bg-[#FACC15] border-b-[3px] border-black flex items-end p-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

                    {/* Animated Geometric Decoration */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 border-[10px] border-black/10 rounded-full animate-pulse" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-[4px] border-black/5 rotate-45" />

                    <div className="relative z-10">
                        <span className="inline-block bg-white border-[2px] border-black text-black px-4 py-1.5 font-black text-xl uppercase shadow-[4px_4px_0px_0px_#000] tracking-tighter -rotate-1">
                            KEŞFET
                        </span>
                        <p className="text-[10px] font-black uppercase text-black/60 mt-2 tracking-widest pl-1">Fizikhub Navigasyon</p>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-6 right-6 w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all z-20 rounded-xl"
                    >
                        <X className="w-5 h-5 stroke-[3px]" />
                    </button>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex-1 overflow-y-auto p-4 pt-8">
                    <div className="flex flex-col gap-4">
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="group block relative"
                                >
                                    <div className={cn(
                                        "flex items-center justify-between p-4 border-[2.5px] border-black bg-white dark:bg-zinc-900 rounded-2xl transition-all duration-300",
                                        "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                                        pathname === item.href ? "bg-zinc-50 border-[#FACC15] shadow-[4px_4px_0px_0px_#FACC15]" : "shadow-[4px_4px_0px_0px_#000]"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-11 h-11 flex items-center justify-center border-2 border-black rounded-xl text-black transition-transform group-hover:scale-110",
                                                item.color || "bg-white"
                                            )}>
                                                <item.icon className="w-5 h-5 stroke-[2.5px]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-base uppercase tracking-tight leading-none text-black dark:text-white">
                                                    {item.label}
                                                </span>
                                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mt-1">
                                                    {item.sub}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 stroke-[3px] text-zinc-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
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
