"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";

export function MobileMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    console.log("MobileMenu Render:", { isOpen, mounted });

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

    return (
        <>
            {/* TRIGGER BUTTON - RESIZED TO 40px FOR BETTER TOUCH TARGET */}
            <button
                onClick={() => {
                    console.log("MOBILE MENU CLICKED");
                    setIsOpen(true);
                }}
                className="
                    relative z-[60]
                    flex items-center justify-center 
                    w-10 h-10
                    bg-white text-black 
                    border border-white/20
                    rounded-md
                    active:scale-95
                    transition-all
                    cursor-pointer
                    hover:bg-zinc-200
                "
            >
                <Menu className="w-6 h-6 stroke-[2.5px]" />
            </button>

            <AnimatePresence>
                {isOpen && mounted && createPortal(
                    <div className="fixed inset-0 z-[99999] pointer-events-auto font-[family-name:var(--font-outfit)]">
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
                                w-[85vw] max-w-[400px]
                                bg-[#09090b] 
                                border-l border-zinc-800
                                flex flex-col
                                shadow-[-20px_0px_50px_rgba(0,0,0,0.7)]
                            "
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-800 bg-[#09090b]">
                                <span className="text-3xl font-black text-white italic tracking-tighter">
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
                                    <X className="w-6 h-6 stroke-[3px]" />
                                </button>
                            </div>

                            {/* SCROLLABLE AREA */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <motion.div
                                    variants={containerVariants}
                                    initial="closed"
                                    animate="open"
                                    className="space-y-4"
                                >
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div key={item.href} variants={itemVariants}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "group relative flex items-center justify-between p-4",
                                                        "bg-zinc-900/50 border border-zinc-800 rounded-2xl",
                                                        "hover:bg-[#FACC15] hover:border-[#FACC15] hover:text-black",
                                                        "transition-all duration-300",
                                                        isActive && "bg-white text-black border-white"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                            "bg-zinc-800 text-white group-hover:bg-black/10 group-hover:text-black",
                                                            isActive && "bg-black text-white"
                                                        )}>
                                                            <item.icon className="w-5 h-5 stroke-[2.5px]" />
                                                        </div>
                                                        <span className={cn(
                                                            "font-bold text-lg tracking-tight text-zinc-300 group-hover:text-black",
                                                            isActive && "text-black"
                                                        )}>
                                                            {item.label}
                                                        </span>
                                                    </div>

                                                    <ChevronRight className={cn(
                                                        "w-5 h-5 text-zinc-600 transition-all transform",
                                                        "group-hover:text-black group-hover:translate-x-1",
                                                        isActive && "text-black translate-x-1"
                                                    )} />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}

                                    {/* UTILS ROW */}
                                    <motion.div variants={itemVariants} className="pt-6 grid grid-cols-2 gap-4">
                                        <Link href="/profil" onClick={() => setIsOpen(false)} className="group flex flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors">
                                            <User className="w-6 h-6 text-zinc-400 group-hover:text-white mb-2" />
                                            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wider">Profil</span>
                                        </Link>
                                        <Link href="/ayarlar" onClick={() => setIsOpen(false)} className="group flex flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors">
                                            <Settings className="w-6 h-6 text-zinc-400 group-hover:text-white mb-2" />
                                            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wider">Ayarlar</span>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* FOOTER */}
                            <div className="p-6 border-t border-zinc-800 bg-[#09090b]">
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-2xl tracking-tighter text-white">FIZIKHUB</span>
                                    <div className="flex gap-4">
                                        <Twitter className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                        <Github className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                        <Globe className="w-5 h-5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-mono mt-2 uppercase tracking-wide">
                                    © 2026 FIZIKHUB INC. • ALL RIGHTS RESERVED
                                </p>
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
}
