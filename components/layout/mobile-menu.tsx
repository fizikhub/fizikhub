"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; // Ensure SheetTitle is imported for accessibility
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Atom, Zap, FlaskConical, BookOpen, User, Home, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home, color: "text-white" },
        { href: "/makale", label: "Keşfet", icon: Zap, color: "text-[#FFC800]" },
        { href: "/blog", label: "Blog", icon: BookOpen, color: "text-cyan-400" },
        { href: "/testler", label: "Testler", icon: FlaskConical, color: "text-green-400" },
        { href: "/siralamalar", label: "Sıralamalar", icon: Award, color: "text-purple-400" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center w-[36px] h-[36px] bg-[#111] border-[2px] border-white/20 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] active:scale-95 transition-transform rounded-md group">
                    <Menu className="w-5 h-5 text-white group-hover:first:text-[#FFC800] transition-colors" />
                </button>
            </SheetTrigger>

            {/* RIGHT SIDE SHEET */}
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 border-l-[3px] border-white/20 bg-[#050505] overflow-hidden">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                {/* COSMIC BACKGROUND & GRID */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1a1a2e_0%,_#000000_100%)]" />

                    {/* Retro Grid */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Glowing Orbs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* HEADER: LOGO & STATUS */}
                    <div className="p-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="scale-90 origin-left">
                                <DankLogo />
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white/50 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* SYSTEM STATUS BADGE */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-green-400 tracking-widest uppercase">
                                SYSTEM NOMINAL
                            </span>
                        </div>
                    </div>

                    {/* MENU ITEMS: CONTROL PANEL STYLE */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item, i) => (
                            <ViewTransitionLink
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl group relative overflow-hidden",
                                    "bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300",
                                    pathname === item.href ? "bg-white/10 border-white/30" : ""
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center bg-black/40 border border-white/10 group-hover:scale-110 transition-transform duration-300",
                                        item.color
                                    )}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-black uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform",
                                            pathname === item.href ? "text-[#FFC800]" : ""
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono text-white/30 group-hover:text-white/50">
                                            MODULE_0{i + 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Effect: Scanline */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                            </ViewTransitionLink>
                        ))}
                    </div>

                    {/* FOOTER: AUTH & PROFILE */}
                    <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                        <div className="mb-4">
                            <AuthButton />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest">
                            <span>FizikHub v2.0</span>
                            <span>SEQ_ID: {Math.floor(Math.random() * 9999)}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
