"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Menu, X, Home, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram, Atom, Compass, Book, Mail, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { m as motion } from "framer-motion";

import { PhysicsFactModal } from "@/components/ui/physics-fact-modal";

const menuItems = [
    { href: '/', label: 'Ana Sayfa', icon: Home, color: 'group-hover:text-[#EAB308]', iconColor: 'text-[#EAB308]' },
    { href: '/makale', label: 'Makaleler', icon: BookOpen, color: 'group-hover:text-[#EAB308]', iconColor: 'text-[#EAB308]' },
    { href: '/konular', label: 'Konular', icon: Compass, color: 'group-hover:text-[#23A9FA]', iconColor: 'text-[#23A9FA]' },
    { href: '/simulasyonlar', label: 'Simülasyon', icon: Atom, color: 'group-hover:text-[#23A9FA]', iconColor: 'text-[#23A9FA]' },
    { href: '/siralamalar', label: 'Sıralama', icon: Trophy, color: 'group-hover:text-[#EAB308]', iconColor: 'text-[#EAB308]' },
    { href: '/sozluk', label: 'Sözlük', icon: Book, color: 'group-hover:text-[#00F0A0]', iconColor: 'text-[#00F0A0]' },
    { href: '/iletisim', label: 'İletişim', icon: Mail, color: 'group-hover:text-zinc-200', iconColor: 'text-zinc-200' },
    { isAction: true, label: "HAP BİLGİ", sub: "Evrenin Sırları", icon: Zap, color: 'group-hover:text-[#EAB308]', iconColor: 'text-[#EAB308]' },
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
                        aria-label="Menüyü aç"
                        className="w-11 h-11 box-border p-0 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-[8px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                    >
                        <Menu className="w-5 h-5 text-black stroke-[3] group-hover:scale-110 transition-transform" />
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
                        "w-[min(88vw,380px)] p-0 border-l-[3px] border-black bg-[#27272a] shadow-none flex h-[100dvh] max-h-[100dvh] flex-col",
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
                    <div className="relative h-[60px] bg-[#27272a] flex items-center justify-between px-4 border-b-[2px] border-black/60">
                        {/* "MENÜ" Badge */}
                        <div className="bg-[#EAB308] border-2 border-black shadow-[2px_2px_0px_0px_#000] px-2.5 py-0.5 -rotate-2">
                            <span className="font-black text-base uppercase tracking-tighter text-black">
                                MENÜ
                            </span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Menüyü kapat"
                            className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-[8px] active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                        >
                            <X className="w-5 h-5 stroke-[3] text-black" />
                        </button>
                    </div>

                    {/* 2. BODY SECTION */}
                    <div className="flex-1 overflow-y-auto bg-[#202023] p-3.5 space-y-2.5">
                        {menuItems.map((item, i) => {
                            const isActive = !item.isAction && (item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href!));

                            return (
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
                                        className="block w-full text-left rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                                    >
                                        <div className={cn(
                                            "flex min-h-[56px] items-center justify-between p-2.5 bg-[#27272a] border-[1.5px] border-black/60 shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-[8px] group hover:bg-[#3f3f46]/50"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 flex items-center justify-center border-[1.5px] border-black/60 rounded-[8px] bg-[#18181b]"
                                                )}>
                                                    <item.icon className={cn("w-5 h-5 stroke-[2.5px]", item.iconColor)} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-black text-[15px] uppercase tracking-tight text-zinc-100 transition-colors", item.color)}>
                                                        {item.label}
                                                    </span>
                                                    {item.sub && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#EAB308] opacity-80 group-hover:opacity-100">
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
                                        aria-current={isActive ? "page" : undefined}
                                        className="block rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                                    >
                                        <div className={cn(
                                            "flex min-h-[56px] items-center justify-between p-2.5 bg-[#27272a] border-[1.5px] border-black/60 shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-[8px] group hover:bg-[#3f3f46]/50",
                                            isActive && "border-[#EAB308] bg-[#313136]"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 flex items-center justify-center border-[1.5px] border-black/60 rounded-[8px] bg-[#18181b]"
                                                )}>
                                                    <item.icon className={cn("w-5 h-5 stroke-[2.5px]", item.iconColor)} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("font-black text-[15px] uppercase tracking-tight text-zinc-100 transition-colors", item.color)}>
                                                        {item.label}
                                                    </span>
                                                    {item.sub && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#EAB308] opacity-80 group-hover:opacity-100">
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
                        )})}

                        <div className="pt-4 mt-4 border-t-2 border-zinc-800">
                            {user ? (
                                <Link prefetch={false} href="/profil" onClick={() => setOpen(false)}>
                                    <button className="w-full min-h-12 py-3 font-black text-base border-[2px] border-black bg-[#EAB308] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-[8px] uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Profil
                                    </button>
                                </Link>
                            ) : (
                                <Link prefetch={false} href="/login" onClick={() => setOpen(false)}>
                                    <button className="w-full min-h-12 py-3 font-black text-base border-[2px] border-black bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-y-[3px] transition-all rounded-[8px] uppercase flex items-center justify-center gap-2 group">
                                        <User className="w-5 h-5 stroke-[3px]" />
                                        Giriş Yap
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-[#27272a] border-t-[2px] border-black/60 flex flex-col items-center gap-3">
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Github].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label={i === 0 ? "Twitter" : i === 1 ? "Instagram" : "GitHub"}
                                    className="w-11 h-11 flex items-center justify-center bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-[8px] active:translate-y-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
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
