"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight, Rocket } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Starfield } from "@/components/ui/starfield";
import { motion, AnimatePresence } from "framer-motion";

function RealisticUFO() {
    return (
        <svg viewBox="0 0 200 100" className="w-24 h-12 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
            {/* Dome */}
            <path d="M70 45 C70 45 80 20 100 20 C120 20 130 45 130 45" fill="#88CCFF" fillOpacity="0.8" stroke="#4488FF" strokeWidth="2" />

            {/* Body */}
            <ellipse cx="100" cy="50" rx="80" ry="20" fill="#333" stroke="#888" strokeWidth="2" />
            <ellipse cx="100" cy="45" rx="50" ry="8" fill="#555" />

            {/* Lights */}
            <circle cx="40" cy="50" r="3" fill="#FACC15" className="animate-pulse" />
            <circle cx="70" cy="62" r="3" fill="#FACC15" className="animate-pulse delay-75" />
            <circle cx="100" cy="65" r="3" fill="#FACC15" className="animate-pulse delay-150" />
            <circle cx="130" cy="62" r="3" fill="#FACC15" className="animate-pulse delay-75" />
            <circle cx="160" cy="50" r="3" fill="#FACC15" className="animate-pulse" />

            {/* Beam (Optional, subtle) */}
            <path d="M85 68 L70 90 L130 90 L115 68" fill="url(#beamGradient)" opacity="0.3" />
            <defs>
                <linearGradient id="beamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4488FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4488FF" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function MobileMenu() {
    const pathname = usePathname();

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, border: "border-blue-500", text: "text-blue-400", shadow: "shadow-blue-500/50" },
        { href: "/makale", label: "KEŞFET", icon: Zap, border: "border-yellow-500", text: "text-yellow-400", shadow: "shadow-yellow-500/50" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, border: "border-purple-500", text: "text-purple-400", shadow: "shadow-purple-500/50" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, border: "border-green-500", text: "text-green-400", shadow: "shadow-green-500/50" },
        { href: "/blog", label: "BLOG", icon: BookOpen, border: "border-pink-500", text: "text-pink-400", shadow: "shadow-pink-500/50" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, border: "border-red-500", text: "text-red-400", shadow: "shadow-red-500/50" },
        { href: "/siralamalar", label: "LİG", icon: Award, border: "border-orange-500", text: "text-orange-400", shadow: "shadow-orange-500/50" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* TRIGGER - 30px (Keep simple to contrast with inner complexity) */}
                <div
                    className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-black border border-white/30 rounded-full cursor-pointer hover:bg-white hover:text-black transition-all shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                >
                    <Menu className="w-4 h-4 text-white stroke-[3px]" />
                </div>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] p-0 border-l border-white/10 bg-black text-white gap-0 flex flex-col overflow-hidden"
            >
                {/* COSMIC BACKGROUND LAYERS */}
                <div className="absolute inset-0 z-0 bg-black pointer-events-none">
                    {/* Nebula Gradients */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-900/40 rounded-full blur-[80px] animate-pulse duration-3000" />
                    <div className="absolute top-1/2 -right-20 w-60 h-60 bg-blue-900/30 rounded-full blur-[60px]" />
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-indigo-950/50 to-transparent" />

                    {/* STARS */}
                    <Starfield count={400} speed={0.8} />
                </div>

                {/* UFO ANIMATION LAYER */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ x: "120%", y: "20%", rotate: -5, scale: 0.8 }}
                        animate={{
                            x: ["120%", "-20%"],
                            y: ["20%", "30%", "15%"],
                            rotate: [-5, 5, -5]
                        }}
                        transition={{
                            duration: 8,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 5
                        }}
                        className="absolute top-20 right-0 w-32"
                    >
                        <RealisticUFO />
                    </motion.div>
                </div>

                <SheetHeader className="sr-only">
                    <SheetTitle>Kozmik Menü</SheetTitle>
                    <SheetDescription>Uzay temalı navigasyon</SheetDescription>
                </SheetHeader>

                {/* 1. HEADER (Glass) */}
                <div className="relative z-20 flex-none flex items-center justify-between p-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
                    <span className="text-xl font-black italic tracking-tighter text-white select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        COSMIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-orange-500">HUB</span>
                    </span>
                    <SheetClose asChild>
                        <div className="flex items-center justify-center w-9 h-9 border border-white/20 bg-white/5 text-white rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                            <X className="w-5 h-5 stroke-[2.5px]" />
                        </div>
                    </SheetClose>
                </div>

                {/* 2. MENU ITEMS (Glass Cards) */}
                <div className="relative z-20 flex-1 overflow-y-auto p-5 scrollbar-hide">
                    <div className="space-y-3 pb-safe">
                        {menuItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <SheetClose asChild key={item.href}>
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden",
                                            "transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                                            isActive ? `border-${item.border.split('-')[1]}-500/50 bg-${item.border.split('-')[1]}-900/20` : ""
                                        )}
                                    >
                                        {/* Neon Glow Hover */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r",
                                            item.border.replace('border-', 'from-').replace('-500', '-500 to-transparent')
                                        )} />

                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 transition-colors group-hover:scale-110",
                                                isActive ? item.text : "text-zinc-400 group-hover:text-white"
                                            )}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "font-bold uppercase tracking-wide text-sm transition-colors",
                                                isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                layoutId="active-dot"
                                                className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px]", item.text.replace('text-', 'bg-').replace('-400', '-500'))}
                                            />
                                        )}
                                    </ViewTransitionLink>
                                </SheetClose>
                            );
                        })}
                    </div>
                </div>

                {/* 3. FOOTER (Glass) */}
                <div className="relative z-20 flex-none p-5 border-t border-white/10 bg-black/20 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {/* Profile & Settings as Mini Glass Cards */}
                        <div className="col-span-2 flex gap-2">
                            <SheetClose asChild>
                                <ViewTransitionLink href="/profil" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-white transition-all uppercase tracking-wider font-bold">
                                    <User className="w-3.5 h-3.5" /> Profil
                                </ViewTransitionLink>
                            </SheetClose>
                            <SheetClose asChild>
                                <ViewTransitionLink href="/ayarlar" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-white transition-all uppercase tracking-wider font-bold">
                                    <Settings className="w-3.5 h-3.5" /> Ayarlar
                                </ViewTransitionLink>
                            </SheetClose>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">v6.0 COSMIC</span>
                        <div className="flex gap-4">
                            <Rocket className="w-4 h-4 text-zinc-500 hover:text-orange-400 hover:translate-y-[-2px] hover:rotate-12 transition-all cursor-pointer" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
