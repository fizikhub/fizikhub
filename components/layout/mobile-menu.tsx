"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { m as motion } from "framer-motion";

import { PhysicsFactModal } from "@/components/ui/physics-fact-modal";

const menuItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home, color: 'group-hover:text-[#FFC800]', iconColor: 'text-[#FFC800]' },
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
    const pathname = usePathname();

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
               - Background: #1a1a1d (Darker for premium feel)
               - Borders: Softer
               - Interactions: Vivid Colors on Text/Icons
            */}
                <SheetContent
                    side="right"
                    className={cn(
                        "w-[85%] max-w-[350px] p-0 border-l-[3px] border-black bg-[#1a1a1d] shadow-none flex flex-col h-full",
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
                    <div className="relative h-16 bg-[#1a1a1d] flex items-center justify-between px-5 border-b border-white/[0.06]">
                        {/* "MENÜ" Badge */}
                        <div className="bg-[#FACC15] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 py-0.5 -rotate-2">
                            <span className="font-black text-base uppercase tracking-tighter text-black">
                                MENÜ
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-xl active:translate-y-[2px]"
                        >
                            <X className="w-5 h-5 stroke-[3] text-black" />
                        </button>
                    </div>

                    {/* 2. BODY SECTION */}
                    <div className="flex-1 overflow-y-auto bg-[#141416] p-5 space-y-3">
                        {menuItems.map((item, i) => {
                            const isActivePage = !item.isAction && pathname === item.href;
                            
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.25 }}
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
                                                "flex items-center justify-between p-3 bg-[#1e1e21] border border-white/[0.06] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-2xl group hover:bg-[#252528]",
                                                "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
                                            )}>
                                                <div className="flex items-center gap-3.5">
                                                    <div className={cn(
                                                        "w-10 h-10 flex items-center justify-center border border-white/[0.08] rounded-xl bg-[#0f0f11]"
                                                    )}>
                                                        <item.icon className={cn("w-[18px] h-[18px] stroke-[2.5px]", item.iconColor)} />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
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
                                                "flex items-center justify-between p-3 border active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-2xl group",
                                                "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]",
                                                isActivePage 
                                                    ? "bg-[#FACC15]/10 border-[#FACC15]/30 hover:bg-[#FACC15]/15"
                                                    : "bg-[#1e1e21] border-white/[0.06] hover:bg-[#252528]"
                                            )}>
                                                <div className="flex items-center gap-3.5">
                                                    <div className={cn(
                                                        "w-10 h-10 flex items-center justify-center border rounded-xl",
                                                        isActivePage 
                                                            ? "border-[#FACC15]/30 bg-[#FACC15]/10"
                                                            : "border-white/[0.08] bg-[#0f0f11]"
                                                    )}>
                                                        <item.icon className={cn("w-[18px] h-[18px] stroke-[2.5px]", isActivePage ? "text-[#FACC15]" : item.iconColor)} />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className={cn(
                                                            "font-black text-[15px] uppercase tracking-tight transition-colors",
                                                            isActivePage ? "text-[#FACC15]" : "text-zinc-100",
                                                            !isActivePage && item.color
                                                        )}>
                                                            {item.label}
                                                        </span>
                                                        {item.sub && (
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FACC15] opacity-80 group-hover:opacity-100">
                                                                {item.sub}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isActivePage && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                                                    )}
                                                    <ChevronRight className={cn("w-5 h-5 text-zinc-600 transition-all transform group-hover:translate-x-1 stroke-[2.5px]", item.color)} />
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}

                        <div className="pt-5 mt-5 border-t border-white/[0.06]">
                            {user ? (
                                <Link prefetch={false} href="/profil" onClick={() => setOpen(false)}>
                                    <button className="w-full py-3.5 font-black text-base border-[2px] border-black bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-2xl uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Profil
                                    </button>
                                </Link>
                            ) : (
                                <Link prefetch={false} href="/login" onClick={() => setOpen(false)}>
                                    <button className="w-full py-3.5 font-black text-base border-[2px] border-black bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-2xl uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Giriş Yap
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-5 bg-[#1a1a1d] border-t border-white/[0.06] flex flex-col items-center gap-4">
                        <div className="flex gap-3">
                            {[Twitter, Instagram, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-11 h-11 flex items-center justify-center bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-xl active:translate-y-[2px]"
                                >
                                    <Icon className="w-5 h-5 text-black stroke-[2.5px]" />
                                </a>
                            ))}
                        </div>
                        <p className="font-bold text-[11px] uppercase text-zinc-600 tracking-[0.25em]">
                            FIZIKHUB © 2026
                        </p>
                    </div>

                </SheetContent>
            </Sheet>
            <PhysicsFactModal open={factOpen} onOpenChange={setFactOpen} />
        </>
    );
}
