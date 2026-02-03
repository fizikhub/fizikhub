"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Starfield } from "@/components/ui/starfield";
import { motion } from "framer-motion";

function RealisticUFO() {
    return (
        <svg viewBox="0 0 200 100" className="w-28 h-14 opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {/* Upper Dome (Technological) */}
            <path d="M70 45 C70 45 80 25 100 25 C120 25 130 45 130 45" fill="#52525B" stroke="#71717A" strokeWidth="0.5" />

            {/* Main Disc Body (Dark Metallic) */}
            <ellipse cx="100" cy="50" rx="90" ry="22" fill="#09090B" stroke="#27272A" strokeWidth="1" />
            <ellipse cx="100" cy="50" rx="40" ry="5" fill="#18181B" stroke="#3F3F46" strokeWidth="0.5" />

            {/* Navigation Lights (Subtle & Serious) */}
            <circle cx="25" cy="50" r="1.5" fill="#FFFFFF" className="animate-pulse" />
            <circle cx="175" cy="50" r="1.5" fill="#FFFFFF" className="animate-pulse delay-75" />

            {/* Engine Glow (Blue Ion) */}
            <ellipse cx="100" cy="55" rx="20" ry="6" fill="#3B82F6" className="opacity-40 animate-pulse" />
        </svg>
    );
}

export function MobileMenu() {
    const pathname = usePathname();

    // COLOR PALETTE: Sophisticated, slightly desaturated for "Pro" feel
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "text-blue-400", glow: "shadow-blue-500/20", border: "border-blue-500/50" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "text-yellow-400", glow: "shadow-yellow-500/20", border: "border-yellow-500/50" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "text-purple-400", glow: "shadow-purple-500/20", border: "border-purple-500/50" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "text-green-400", glow: "shadow-green-500/20", border: "border-green-500/50" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "text-pink-400", glow: "shadow-pink-500/20", border: "border-pink-500/50" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "text-red-400", glow: "shadow-red-500/20", border: "border-red-500/50" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "text-orange-400", glow: "shadow-orange-500/20", border: "border-orange-500/50" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* TRIGGER - Minimalist & Classy */}
                <div
                    className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-black border border-white/20 rounded-full cursor-pointer hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
                >
                    <Menu className="w-4 h-4 text-white group-hover:text-black stroke-[1.5px]" />
                </div>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] p-0 border-l border-white/10 bg-[#020202] text-white gap-0 flex flex-col overflow-hidden shadow-2xl shadow-black"
            >
                {/* BACKGROUND: Pure Deep Space */}
                <div className="absolute inset-0 z-0 bg-[#020202] pointer-events-none">
                    {/* Very subtle gradients, almost invisible, just for depth */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-950/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-950/10 rounded-full blur-[100px]" />

                    {/* STARS: High count, slow speed for realism */}
                    <Starfield count={600} speed={0.2} starColor="#888888" />
                </div>

                {/* UFO: High Altitude Flyby (Background Ambience) */}
                <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ x: "120%", y: "10%", scale: 0.6, opacity: 0.7 }}
                        animate={{
                            x: ["120%", "-50%"],
                            y: ["10%", "15%"],
                        }}
                        transition={{
                            duration: 20, // Very slow, majestic
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 10
                        }}
                        className="absolute top-10 right-0 w-40"
                    >
                        <RealisticUFO />
                    </motion.div>
                </div>

                <SheetHeader className="sr-only">
                    <SheetTitle>FizikHub Menü</SheetTitle>
                    <SheetDescription>Site navigasyonu</SheetDescription>
                </SheetHeader>

                {/* 1. HEADER: Professional Branding */}
                <div className="relative z-20 flex-none flex items-center justify-between p-6 border-b border-white/5 bg-[#020202]/80 backdrop-blur-md">
                    <span className="text-lg font-bold tracking-tight text-white select-none">
                        FIZIK<span className="text-[#FACC15]">HUB</span>
                    </span>
                    <SheetClose asChild>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer">
                            <X className="w-4 h-4 stroke-[1.5px]" />
                        </div>
                    </SheetClose>
                </div>

                {/* 2. MENU ITEMS: Matte Premium Style */}
                <div className="relative z-20 flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="space-y-2 pb-safe">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <SheetClose asChild key={item.href}>
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between px-4 py-3.5 rounded-lg border transition-all duration-300",
                                            isActive
                                                ? `bg-white/5 border-white/10 ${item.glow}` // Active: Subtle highlight + colored glow
                                                : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5" // Default: Clean
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            {/* Icon: Minimalist */}
                                            <div className={cn(
                                                "transition-colors duration-300",
                                                isActive ? item.color : "text-zinc-500 group-hover:text-zinc-300"
                                            )}>
                                                <item.icon className="w-4 h-4 stroke-[2px]" />
                                            </div>

                                            {/* Label: Clean Sans */}
                                            <span className={cn(
                                                "text-sm font-medium tracking-wide transition-colors duration-300",
                                                isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                            isActive ? `bg-current ${item.color} shadow-[0_0_8px_currentColor]` : "bg-transparent group-hover:bg-zinc-700"
                                        )} />
                                    </ViewTransitionLink>
                                </SheetClose>
                            );
                        })}
                    </div>
                </div>

                {/* 3. FOOTER: Utilities */}
                <div className="relative z-20 flex-none p-6 border-t border-white/5 bg-[#020202]/80 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <SheetClose asChild>
                            <ViewTransitionLink href="/profil" className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-xs text-zinc-400 hover:text-white transition-all font-medium">
                                <User className="w-3.5 h-3.5" /> Profil
                            </ViewTransitionLink>
                        </SheetClose>
                        <SheetClose asChild>
                            <ViewTransitionLink href="/ayarlar" className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-xs text-zinc-400 hover:text-white transition-all font-medium">
                                <Settings className="w-3.5 h-3.5" /> Ayarlar
                            </ViewTransitionLink>
                        </SheetClose>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-[10px] text-zinc-600 font-medium tracking-wider">v7.0 PRO</span>
                        <div className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
                            <Twitter className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                            <Github className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                            <Globe className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
