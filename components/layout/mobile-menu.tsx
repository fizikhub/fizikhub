"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset" };
    }, [isOpen]);

    // Close on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // POP-BRUTALIST CONFIG
    const primaryItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "bg-[#fff]", rotate: "-rotate-1" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "bg-[#a5f3fc]", rotate: "rotate-1" },
        { href: "/simulasyonlar", label: "SIM", icon: Atom, color: "bg-[#fbcfe8]", rotate: "-rotate-2" },
        { href: "/notlar", label: "NOTLAR", icon: StickyNote, color: "bg-[#fde047]", rotate: "rotate-1" },
    ];

    const secondaryItems = [
        { href: "/blog", label: "BLOG", icon: BookOpen },
        { href: "/testler", label: "TEST", icon: FlaskConical },
        { href: "/siralamalar", label: "LİG", icon: Award },
    ];

    if (!mounted) return null;

    return (
        <>
            {/* TRIGGER - SHAPE SHIFTING BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="
                    relative z-[60]
                    flex items-center justify-center 
                    w-9 h-9
                    bg-white
                    border-[3px] border-black
                    shadow-[3px_3px_0px_black]
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                    transition-all
                    hover:-rotate-3
                "
            >
                <Menu className="w-5 h-5 text-black stroke-[3px]" />
            </button>

            {/* PORTAL */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[99999] font-[family-name:var(--font-outfit)] flex items-start justify-end p-4">

                            {/* BACKDROP - HALFTONE PATTERN */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                style={{
                                    backgroundImage: 'radial-gradient(#444 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* POP MENU CONTAINER - FLOATING GRID */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: -20, rotate: 2 }}
                                animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: -20, rotate: 2 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="
                                    relative z-50
                                    w-full max-w-[340px] mt-12
                                    bg-[#18181b]
                                    border-[3px] border-black
                                    shadow-[8px_8px_0px_black]
                                    p-4 rounded-xl
                                    overflow-hidden
                                "
                            >
                                {/* DECORATIVE NOISE TEXTURE OVERLAY */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                                {/* HEADER */}
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <div className="bg-black text-white px-3 py-1 text-xs font-black tracking-widest uppercase -rotate-2 border border-white/20">
                                        NAVIGASYON
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-8 h-8 bg-[#ef4444] border-[2px] border-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                                    >
                                        <X className="w-5 h-5 stroke-[4px]" />
                                    </button>
                                </div>

                                {/* PRIMARY GRID - BIG CARDS */}
                                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                                    {primaryItems.map((item, i) => (
                                        <Link href={item.href} key={i} onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                whileHover={{ scale: 1.02, rotate: 0 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    "h-24 flex flex-col justify-between p-3 border-[2px] border-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] rounded-lg transition-all",
                                                    item.color,
                                                    item.rotate
                                                )}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <item.icon className="w-6 h-6 text-black stroke-[2.5px]" />
                                                    <ArrowUpRight className="w-4 h-4 text-black opacity-50" />
                                                </div>
                                                <span className="font-black text-black text-sm tracking-tight">{item.label}</span>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>

                                {/* SECONDARY ITEMS - PILLS */}
                                <div className="flex flex-col gap-2 relative z-10">
                                    {secondaryItems.map((item, i) => (
                                        <Link href={item.href} key={i} onClick={() => setIsOpen(false)}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="
                                                    flex items-center justify-between p-3 
                                                    bg-[#27272a] border border-white/10 
                                                    hover:bg-[#FACC15] hover:border-black hover:text-black
                                                    text-zinc-400 transition-colors
                                                    rounded-lg group
                                                "
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-4 h-4 group-hover:stroke-[3px]" />
                                                    <span className="font-bold text-sm tracking-wider uppercase group-hover:text-black text-zinc-300">{item.label}</span>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>

                                {/* USER UTILS BOTTOM ROW */}
                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-dashed border-white/10 relative z-10">
                                    <Link href="/profil" onClick={() => setIsOpen(false)} className="bg-white/5 p-2 rounded flex flex-col items-center justify-center border border-transparent hover:border-white/20">
                                        <User className="w-4 h-4 text-zinc-400 mb-1" />
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase">PROFİL</span>
                                    </Link>
                                    <Link href="/ayarlar" onClick={() => setIsOpen(false)} className="bg-white/5 p-2 rounded flex flex-col items-center justify-center border border-transparent hover:border-white/20">
                                        <Settings className="w-4 h-4 text-zinc-400 mb-1" />
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase">AYARLAR</span>
                                    </Link>
                                </div>

                                {/* SOCIAL STRIP */}
                                <div className="mt-4 flex justify-between bg-black p-2 rounded border border-zinc-800">
                                    <a href="#" className="text-zinc-500 hover:text-[#FACC15]"><Twitter className="w-4 h-4" /></a>
                                    <a href="#" className="text-zinc-500 hover:text-[#FACC15]"><Github className="w-4 h-4" /></a>
                                    <a href="#" className="text-zinc-500 hover:text-[#FACC15]"><Globe className="w-4 h-4" /></a>
                                </div>

                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
