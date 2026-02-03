"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Starfield } from "@/components/ui/starfield";
import { motion, AnimatePresence } from "framer-motion";

function RealisticUFO() {
    return (
        <svg viewBox="0 0 200 100" className="w-28 h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {/* Upper Dome (Technological) */}
            <path d="M70 45 C70 45 80 25 100 25 C120 25 130 45 130 45" fill="#A1A1AA" stroke="#E4E4E7" strokeWidth="1" />
            <path d="M85 35 L90 30" stroke="#52525B" strokeWidth="1" />
            <path d="M115 35 L110 30" stroke="#52525B" strokeWidth="1" />

            {/* Main Disc Body (Dark Metallic) */}
            <ellipse cx="100" cy="50" rx="90" ry="22" fill="#18181B" stroke="#3F3F46" strokeWidth="2" />
            <ellipse cx="100" cy="50" rx="40" ry="5" fill="#27272A" stroke="#52525B" strokeWidth="1" />

            {/* Engine Core (Underside) */}
            <ellipse cx="100" cy="55" rx="30" ry="8" fill="#09090B" />

            {/* Navigation Lights (Pulsing) */}
            <circle cx="25" cy="50" r="2" fill="#FACC15" className="animate-pulse" />
            <circle cx="175" cy="50" r="2" fill="#EF4444" className="animate-pulse delay-75" />

            {/* Ring Lights (Rotating Effect simulated by delays) */}
            <circle cx="60" cy="62" r="2.5" fill="#3B82F6" className="animate-pulse" />
            <circle cx="80" cy="68" r="2.5" fill="#3B82F6" className="animate-pulse delay-75" />
            <circle cx="100" cy="70" r="2.5" fill="#3B82F6" className="animate-pulse delay-150" />
            <circle cx="120" cy="68" r="2.5" fill="#3B82F6" className="animate-pulse delay-75" />
            <circle cx="140" cy="62" r="2.5" fill="#3B82F6" className="animate-pulse" />
        </svg>
    );
}

export function MobileMenu() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, border: "border-blue-500", text: "text-blue-400", shadow: "shadow-blue-500", shadowActive: "shadow-[4px_4px_0px_#3b82f6]" },
        { href: "/makale", label: "KEŞFET", icon: Zap, border: "border-yellow-500", text: "text-yellow-400", shadow: "shadow-yellow-500", shadowActive: "shadow-[4px_4px_0px_#eab308]" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, border: "border-purple-500", text: "text-purple-400", shadow: "shadow-purple-500", shadowActive: "shadow-[4px_4px_0px_#a855f7]" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, border: "border-green-500", text: "text-green-400", shadow: "shadow-green-500", shadowActive: "shadow-[4px_4px_0px_#22c55e]" },
        { href: "/blog", label: "BLOG", icon: BookOpen, border: "border-pink-500", text: "text-pink-400", shadow: "shadow-pink-500", shadowActive: "shadow-[4px_4px_0px_#ec4899]" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, border: "border-red-500", text: "text-red-400", shadow: "shadow-red-500", shadowActive: "shadow-[4px_4px_0px_#ef4444]" },
        { href: "/siralamalar", label: "LİG", icon: Award, border: "border-orange-500", text: "text-orange-400", shadow: "shadow-orange-500", shadowActive: "shadow-[4px_4px_0px_#f97316]" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* TRIGGER - 30px */}
                <div
                    className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-black border border-white/40 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                >
                    <Menu className="w-4 h-4 text-white stroke-[3px]" />
                </div>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] p-0 border-l-2 border-white/20 bg-[#050505] text-white gap-0 flex flex-col overflow-hidden"
            >
                {/* COSMIC BACKGROUND LAYERS */}
                <div className="absolute inset-0 z-0 bg-[#050505] pointer-events-none">
                    {/* Subtle Nebula Gradients - Reduced Intensity/Blur for sharper look */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-900/20 rounded-full blur-[80px]" />

                    {/* STARS */}
                    <Starfield count={500} speed={0.4} />
                </div>

                {/* UFO ANIMATION LAYER */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ x: "120%", y: "15%", rotate: -2, scale: 0.9 }}
                        animate={{
                            x: ["120%", "-40%"],
                            y: ["15%", "25%", "10%"],
                            rotate: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 12, // Slower, more majestic pass
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 8
                        }}
                        className="absolute top-20 right-0 w-40"
                    >
                        <RealisticUFO />
                    </motion.div>
                </div>

                <SheetHeader className="sr-only">
                    <SheetTitle>Kozmik Menü</SheetTitle>
                    <SheetDescription>Uzay temalı navigasyon</SheetDescription>
                </SheetHeader>

                {/* 1. HEADER (Solid Neo-Brutalist) */}
                <div className="relative z-20 flex-none flex items-center justify-between p-6 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-sm">
                    <span className="text-xl font-black italic tracking-tighter text-white select-none">
                        COSMIC<span className="text-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">HUB</span>
                    </span>
                    <SheetClose asChild>
                        <div className="flex items-center justify-center w-9 h-9 border border-white/30 bg-black text-white rounded-full hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all cursor-pointer">
                            <X className="w-5 h-5 stroke-[2.5px]" />
                        </div>
                    </SheetClose>
                </div>

                {/* 2. MENU ITEMS (Hard Cosmic Pop) */}
                <div className="relative z-20 flex-1 overflow-y-auto p-5 scrollbar-hide">
                    <div className="space-y-3 pb-safe">
                        {menuItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <SheetClose asChild key={item.href}>
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between p-3.5 rounded-lg border-2 bg-[#09090b] overflow-hidden",
                                            "transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5",
                                            isActive
                                                ? `${item.border} ${item.shadowActive}`
                                                : "border-zinc-800 hover:border-white/50 hover:shadow-[4px_4px_0px_#ffffff]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            {/* Icon Box */}
                                            <div className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded border-2 transition-colors",
                                                isActive
                                                    ? `${item.border} ${item.text} bg-black`
                                                    : "border-zinc-700 bg-black text-zinc-400 group-hover:border-white group-hover:text-white"
                                            )}>
                                                <item.icon className="w-4 h-4 stroke-[2.5px]" />
                                            </div>

                                            {/* Label */}
                                            <span className={cn(
                                                "font-black uppercase tracking-tight text-sm",
                                                isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        <ChevronRight className={cn(
                                            "w-5 h-5 stroke-[3px] transition-transform group-hover:translate-x-1 relative z-10",
                                            isActive ? `text-white` : "text-zinc-600 group-hover:text-white"
                                        )} />
                                    </ViewTransitionLink>
                                </SheetClose>
                            );
                        })}
                    </div>
                </div>

                {/* 3. FOOTER */}
                <div className="relative z-20 flex-none p-5 border-t border-white/10 bg-[#09090b]/90 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="col-span-2 flex gap-2">
                            <SheetClose asChild>
                                <ViewTransitionLink href="/profil" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-2 border-zinc-800 bg-black hover:border-white hover:bg-zinc-900 hover:shadow-[3px_3px_0px_#fff] text-xs text-zinc-400 hover:text-white transition-all uppercase tracking-wider font-bold">
                                    <User className="w-3.5 h-3.5" /> Profil
                                </ViewTransitionLink>
                            </SheetClose>
                            <SheetClose asChild>
                                <ViewTransitionLink href="/ayarlar" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-2 border-zinc-800 bg-black hover:border-white hover:bg-zinc-900 hover:shadow-[3px_3px_0px_#fff] text-xs text-zinc-400 hover:text-white transition-all uppercase tracking-wider font-bold">
                                    <Settings className="w-3.5 h-3.5" /> Ayarlar
                                </ViewTransitionLink>
                            </SheetClose>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">v6.1 HARD COSMIC</span>
                        <div className="flex gap-4">
                            <Twitter className="w-4 h-4 text-zinc-600 hover:text-blue-400 transition-colors cursor-pointer" />
                            <Github className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Globe className="w-4 h-4 text-zinc-600 hover:text-green-400 transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
