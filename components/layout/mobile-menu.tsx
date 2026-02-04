"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, Settings, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DankLogo } from "@/components/brand/dank-logo";

const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: Home, color: "bg-blue-400" },
    { href: "/makale", label: "Makaleler", icon: BookOpen, color: "bg-purple-400" },
    { href: "/siralamalar", label: "Sıralama", icon: Trophy, color: "bg-yellow-400" },
    { href: "/profil", label: "Profil", icon: User, color: "bg-green-400" },
    { href: "/ozel", label: "Özel İçerik", icon: Zap, color: "bg-red-400" },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center w-[44px] h-[44px] bg-[#FACC15] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-md group">
                    <Menu className="w-6 h-6 text-black stroke-[3] group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </SheetTrigger>

            {/* RIGHT SIDE DRAWER - FULL BRUTALIST */}
            <SheetContent
                side="right"
                className="w-[85vw] sm:w-[400px] p-0 border-l-[4px] border-black bg-[#09090b] shadow-2xl"
            // Remove default close button to use custom one
            >
                {/* ACCESSIBILITY: Required Title & Description */}
                <div className="sr-only">
                    <SheetTitle>Mobil Navigasyon Menüsü</SheetTitle>
                    <SheetDescription>Site içi hızlı erişim linkleri</SheetDescription>
                </div>

                <div className="h-full flex flex-col relative overflow-hidden">

                    {/* DECORATIVE BACKGROUND NOISE */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

                    {/* HEADER: YELLOW BLOCK */}
                    <div className="bg-[#FACC15] p-6 border-b-[4px] border-black flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-black text-black italic tracking-tighter leading-none transform -skew-x-6">MENÜ</h2>
                            <span className="text-xs font-bold text-black font-mono">v.2.0 //// NAV-SYS</span>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-12 h-12 bg-[#ff5555] border-[3px] border-black shadow-[3px_3px_0px_black] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            <X className="w-8 h-8 text-black stroke-[4]" />
                        </button>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10">
                        {menuItems.map((item, i) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="block group"
                            >
                                <div className="relative bg-zinc-900 border-[3px] border-white/20 p-4 transition-all duration-200 group-hover:bg-white group-hover:border-black group-hover:shadow-[6px_6px_0px_#000] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none overflow-hidden">

                                    {/* HOVER REVEAL PATTERN */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] transition-opacity" />

                                    <div className="flex items-center gap-4 relative z-10">
                                        {/* ICON BOX */}
                                        <div className={cn(
                                            "w-12 h-12 border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_black] transition-transform group-hover:rotate-12",
                                            item.color
                                        )}>
                                            <item.icon className="w-6 h-6 text-black stroke-[3]" />
                                        </div>

                                        {/* TEXT */}
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-white group-hover:text-black uppercase tracking-tight leading-none">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* ARROW */}
                                        <div className="ml-auto transform translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                                            <span className="text-3xl font-black text-black">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 border-t-[4px] border-white/10 bg-black relative z-10">
                        <div className="flex justify-between items-end">
                            <div className="flex gap-3">
                                <Link href="#" className="w-10 h-10 bg-zinc-800 border-2 border-white/20 flex items-center justify-center hover:bg-[#FACC15] hover:border-black hover:text-black transition-all">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-zinc-800 border-2 border-white/20 flex items-center justify-center hover:bg-[#FACC15] hover:border-black hover:text-black transition-all">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-zinc-800 border-2 border-white/20 flex items-center justify-center hover:bg-[#FACC15] hover:border-black hover:text-black transition-all">
                                    <Settings className="w-5 h-5" />
                                </Link>
                            </div>

                            <div className="text-right opacity-50">
                                <DankLogo />
                            </div>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
