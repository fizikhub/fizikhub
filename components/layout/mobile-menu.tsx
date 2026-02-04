"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { AuroraTextBackground } from "@/components/ui/aurora-text-background";

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

    // Premium Neo-Brutalist Colors
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "bg-white" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "bg-[#FACC15]" },
        { href: "/simulasyonlar", label: "SİMÜLASYON", icon: Atom, color: "bg-white" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "bg-[#FACC15]" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "bg-white" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "bg-[#FACC15]" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "bg-white" },
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
                damping: 30,
                stiffness: 300,
                mass: 0.8
            }
        }
    };

    const containerVariants: Variants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        closed: { x: 50, opacity: 0 },
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
                    bg-white text-black 
                    border border-white/20
                    rounded-md
                    active:scale-95
                    transition-all
                    cursor-pointer
                    hover:bg-zinc-200
                "
            >
                <Menu className="w-4 h-4 stroke-[2.5px]" />
            </button>

            {/* PORTAL RENDER WITH ANIMATIONS RESTORED */}
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
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            {/* MENU DRAWER */}
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="
                                    absolute top-0 right-0 bottom-0 
                                    w-[85vw] max-w-[360px]
                                    bg-[#09090b] 
                                    border-l border-zinc-800
                                    flex flex-col
                                    shadow-[-20px_0px_50px_rgba(0,0,0,0.7)]
                                "
                            >
                                {/* HEADER WITH AURORA EFFECT */}
                                <div className="border-b border-zinc-800 shrink-0 relative">
                                    <AuroraTextBackground className="py-6 px-6">
                                        <div className="flex items-center justify-between w-full relative z-20">
                                            <span className="text-3xl font-black text-white italic tracking-tighter mix-blend-difference">
                                                MENÜ
                                            </span>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="
                                                    w-10 h-10 
                                                    flex items-center justify-center
                                                    bg-white text-black 
                                                    rounded-full
                                                    hover:bg-[#FACC15]
                                                    hover:scale-110
                                                    transition-all
                                                    active:scale-90
                                                "
                                            >
                                                <X className="w-5 h-5 stroke-[3px]" />
                                            </button>
                                        </div>
                                    </AuroraTextBackground>
                                </div>

                                {/* SCROLLABLE AREA - COMPACT MODE */}
                                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                                    <motion.div
                                        variants={containerVariants}
                                        initial="closed"
                                        animate="open"
                                        className="space-y-2.5"
                                    >
                                        {menuItems.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <motion.div key={item.href} variants={itemVariants}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "group relative flex items-center justify-between p-3",
                                                            "bg-zinc-900/50 border border-zinc-800 rounded-xl",
                                                            "hover:bg-[#FACC15] hover:border-[#FACC15] hover:text-black",
                                                            "transition-all duration-300",
                                                            isActive && "bg-white text-black border-white"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                                                                "bg-zinc-800 text-white group-hover:bg-black/10 group-hover:text-black",
                                                                isActive && "bg-black text-white"
                                                            )}>
                                                                <item.icon className="w-4 h-4 stroke-[2.5px]" />
                                                            </div>
                                                            <span className={cn(
                                                                "font-bold text-base tracking-tight text-zinc-300 group-hover:text-black",
                                                                isActive && "text-black"
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                        </div>

                                                        <ChevronRight className={cn(
                                                            "w-4 h-4 text-zinc-600 transition-all transform",
                                                            "group-hover:text-black group-hover:translate-x-1",
                                                            isActive && "text-black translate-x-1"
                                                        )} />
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}

                                        {/* UTILS ROW - COMPACT */}
                                        <motion.div variants={itemVariants} className="pt-4 grid grid-cols-2 gap-3">
                                            <Link href="/profil" onClick={() => setIsOpen(false)} className="group flex flex-col items-center justify-center p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors">
                                                <User className="w-5 h-5 text-zinc-400 group-hover:text-white mb-1.5" />
                                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wider">Profil</span>
                                            </Link>
                                            <Link href="/ayarlar" onClick={() => setIsOpen(false)} className="group flex flex-col items-center justify-center p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors">
                                                <Settings className="w-5 h-5 text-zinc-400 group-hover:text-white mb-1.5" />
                                                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wider">Ayarlar</span>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* FOOTER */}
                                <div className="p-4 border-t border-zinc-800 bg-[#09090b] shrink-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-xl tracking-tighter text-white">FIZIKHUB</span>
                                        <div className="flex gap-3">
                                            <Twitter className="w-4 h-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                            <Github className="w-4 h-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                            <Globe className="w-4 h-4 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-600 font-mono mt-1.5 uppercase tracking-wide">
                                        © 2026 FIZIKHUB INC. • ALL RIGHTS RESERVED
                                    </p>
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
