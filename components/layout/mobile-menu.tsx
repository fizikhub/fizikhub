"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

    // Premium Matte Colors - Sleeker
    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home },
        { href: "/makale", label: "Keşfet", icon: Zap },
        { href: "/simulasyonlar", label: "Simülasyon", icon: Atom },
        { href: "/notlar", label: "Notlarım", icon: StickyNote },
        { href: "/blog", label: "Blog", icon: BookOpen },
        { href: "/testler", label: "Testler", icon: FlaskConical },
        { href: "/siralamalar", label: "Sıralama", icon: Award },
    ];

    const backdropVariants: Variants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const menuVariants: Variants = {
        closed: { x: "100%" },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                damping: 35,
                stiffness: 350,
                mass: 0.8
            }
        }
    };

    const containerVariants: Variants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        closed: { x: 20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    if (!mounted) return null;

    return (
        <>
            {/* TRIGGER BUTTON - RESIZED TO 30px TO MATCH NAVBAR */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="
                    relative z-[60]
                    flex items-center justify-center 
                    w-[30px] h-[30px]
                    bg-zinc-900 border border-zinc-800
                    hover:border-zinc-700 hover:bg-zinc-800
                    rounded-md
                    active:scale-95
                    transition-all
                    cursor-pointer
                "
            >
                <Menu className="w-4 h-4 text-zinc-300 stroke-[2.5px]" />
            </button>

            {/* PORTAL RENDER */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div
                            className="fixed inset-0 z-[99999] pointer-events-auto font-[family-name:var(--font-outfit)]"
                        >
                            {/* BACKDROP */}
                            <motion.div
                                variants={backdropVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />

                            {/* MENU DRAWER - SLEEK MATTE */}
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="
                                    absolute top-2 bottom-2 right-2
                                    w-[calc(100%-16px)] max-w-[320px]
                                    bg-[#0a0a0c] 
                                    border border-white/10
                                    rounded-2xl
                                    flex flex-col
                                    shadow-2xl shadow-black
                                    overflow-hidden
                                "
                            >
                                {/* HEADER - Minimalist */}
                                <div className="flex items-center justify-between px-5 py-5 border-b border-white/5 bg-white/[0.02]">
                                    <span className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#faeb15] shadow-[0px_0px_8px_#faeb15]" />
                                        FIZIKHUB
                                    </span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="
                                            w-8 h-8
                                            flex items-center justify-center
                                            bg-white/5 text-zinc-400
                                            rounded-full
                                            hover:bg-white/10 hover:text-white
                                            transition-all
                                        "
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* SCROLLABLE AREA - MODERN LIST */}
                                <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                                    <motion.div
                                        variants={containerVariants}
                                        initial="closed"
                                        animate="open"
                                        className="space-y-1"
                                    >
                                        {menuItems.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <motion.div key={item.href} variants={itemVariants}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                                                            isActive
                                                                ? "bg-[#faeb15] text-black shadow-lg shadow-[#faeb15]/20"
                                                                : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={cn(
                                                                "w-[18px] h-[18px] stroke-[2px]",
                                                                isActive ? "text-black" : "text-zinc-500 group-hover:text-zinc-300"
                                                            )} />
                                                            <span className="font-semibold text-[15px] tracking-wide">
                                                                {item.label}
                                                            </span>
                                                        </div>

                                                        {isActive && (
                                                            <ChevronRight className="w-4 h-4 text-black/50" />
                                                        )}
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}

                                        {/* DIVIDER */}
                                        <div className="h-px bg-white/5 my-4 mx-2" />

                                        {/* UTILS - COMPACT GRID */}
                                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 px-1">
                                            <Link href="/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                                                    <User className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-white uppercase">Profil</span>
                                                    <span className="text-[9px] text-zinc-500">Hesabım</span>
                                                </div>
                                            </Link>
                                            <Link href="/ayarlar" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                                                    <Settings className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-white uppercase">Ayarlar</span>
                                                    <span className="text-[9px] text-zinc-500">Tercihler</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* FOOTER - CLEAN */}
                                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                                    <div className="flex justify-center gap-6">
                                        <a href="#" className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-all">
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                        <a href="https://github.com/baranbozkurt" target="_blank" className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-all">
                                            <Github className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-all">
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-[10px] text-zinc-600 font-medium">v2.4.0 • Beta</p>
                                    </div>
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
