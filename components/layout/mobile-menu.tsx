"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { m as motion } from "framer-motion";

import { PhysicsFactModal } from "@/components/ui/physics-fact-modal";

const menuItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home, color: 'group-hover:text-[#FFC800]', iconColor: 'text-[#FFC800]' },
    { href: '/konular', label: 'Konular', icon: Compass, color: 'group-hover:text-[#23A9FA]', iconColor: 'text-[#23A9FA]' },
    { href: '/simulasyonlar', label: 'Simülasyon', icon: Atom, color: 'group-hover:text-[#23A9FA]', iconColor: 'text-[#23A9FA]' },
    { href: '/siralamalar', label: 'Sıralama', icon: Trophy, color: 'group-hover:text-[#FFC800]', iconColor: 'text-[#FFC800]' },
    { href: '/sozluk', label: 'Sözlük', icon: Book, color: 'group-hover:text-[#00F0A0]', iconColor: 'text-[#00F0A0]' },
    { href: '/iletisim', label: 'İletişim', icon: Mail, color: 'group-hover:text-zinc-200', iconColor: 'text-zinc-200' },
    { isAction: true, label: "HAP BİLGİ", sub: "Evrenin Sırları", icon: Zap, color: 'group-hover:text-[#FACC15]', iconColor: 'text-[#FACC15]' },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [factOpen, setFactOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    return (
        <>
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
               REFINED MOBILE MENU (VIVID & MATURE)
               - Background: #27272a (Lighter Dark)
               - Borders: 3px Black
               - Interactions: Vivid Colors on Text/Icons (No Childish Backgrounds)
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
                    <div className="relative h-16 bg-[#27272a] flex items-center justify-between px-5 border-b-[2px] border-black/60">
                        {/* "MENÜ" Badge */}
                        <div className="bg-[#FACC15] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 py-0.5 -rotate-2">
                            <span className="font-black text-base uppercase tracking-tighter text-black">
                                MENÜ
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg active:translate-y-[2px]"
                        >
                            <X className="w-5 h-5 stroke-[3] text-black" />
                        </button>
                    </div>

                    {/* 2. BODY SECTION */}
                    <div className="flex-1 overflow-y-auto bg-[#202023] p-4 space-y-2.5">
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                {item.isAction ? (
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            setTimeout(() => setFactOpen(true), 300);
                                        }}
                                        className="block w-full text-left"
                                    >
                                        <div className={cn(
                                            "flex items-center justify-between p-2.5 bg-[#27272a] border-[1.5px] border-black/60 shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl group hover:bg-[#3f3f46]/50"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 flex items-center justify-center border-[1.5px] border-black/60 rounded-lg bg-[#18181b]"
                                                )}>
                                                    <item.icon className={cn("w-4 h-4 stroke-[2.5px]", item.iconColor)} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-black text-[15px] uppercase tracking-tight text-zinc-100 transition-colors", item.color)}>
                                                        {item.label}
                                                    </span>
                                                    {item.sub && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] opacity-80 group-hover:opacity-100">
                                                            {item.sub}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className={cn("w-5 h-5 text-zinc-600 transition-all transform group-hover:translate-x-1 stroke-[2.5px]", item.color)} />
                                        </div>
                                    </button>
                                ) : (
                                    <Link prefetch={false} href={item.href!}
                                        onClick={() => setOpen(false)}
                                        className="block"
                                    >
                                        <div className={cn(
                                            "flex items-center justify-between p-2.5 bg-[#27272a] border-[1.5px] border-black/60 shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-xl group hover:bg-[#3f3f46]/50"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 flex items-center justify-center border-[1.5px] border-black/60 rounded-lg bg-[#18181b]"
                                                )}>
                                                    <item.icon className={cn("w-4 h-4 stroke-[2.5px]", item.iconColor)} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-black text-[15px] uppercase tracking-tight text-zinc-100 transition-colors", item.color)}>
                                                        {item.label}
                                                    </span>
                                                    {item.sub && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] opacity-80 group-hover:opacity-100">
                                                            {item.sub}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className={cn("w-5 h-5 text-zinc-600 transition-all transform group-hover:translate-x-1 stroke-[2.5px]", item.color)} />
                                        </div>
                                    </Link>
                                )}
                            </motion.div>
                        ))}

                        <div className="pt-4 mt-4 border-t-2 border-zinc-800">
                            {user ? (
                                <Link prefetch={false} href="/profil" onClick={() => setOpen(false)}>
                                    <button className="w-full py-3 font-black text-base border-[2px] border-black bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-xl uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Profil
                                    </button>
                                </Link>
                            ) : (
                                <Link prefetch={false} href="/login" onClick={() => setOpen(false)}>
                                    <button className="w-full py-3 font-black text-base border-[2px] border-black bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-xl uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Giriş Yap
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-5 bg-[#27272a] border-t-[2px] border-black/60 flex flex-col items-center gap-3">
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
            <PhysicsFactModal open={factOpen} onOpenChange={setFactOpen} />
        </>
    );
}
