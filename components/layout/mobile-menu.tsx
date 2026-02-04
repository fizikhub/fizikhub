"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight, ArrowRight } from "lucide-react";
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

    // RAW NEO-BRUTALIST DATA
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, badge: null },
        { href: "/makale", label: "KEŞFET", icon: Zap, badge: "YENİ" },
        { href: "/simulasyonlar", label: "SİMÜLASYON", icon: Atom, badge: null },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, badge: null },
        { href: "/blog", label: "BLOG", icon: BookOpen, badge: null },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, badge: null },
        { href: "/siralamalar", label: "SIRALAMA", icon: Award, badge: "LİG" },
    ];

    const menuVariants: Variants = {
        closed: { x: "100%" },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                damping: 30, // Less damping = bouncier
                stiffness: 300,
                mass: 1
            }
        }
    };

    const containerVariants: Variants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
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
            {/* TRIGGER BUTTON - RAW & PUNCHY */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="
                    relative z-[60]
                    flex items-center justify-center 
                    w-[32px] h-[32px]
                    bg-[#FACC15] 
                    border-[2px] border-black
                    rounded-none
                    shadow-[3px_3px_0px_#000000]
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                    transition-all duration-75
                    cursor-pointer
                "
            >
                <Menu className="w-5 h-5 text-black stroke-[3px]" />
            </button>

            {/* PORTAL RENDER */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[99999] pointer-events-auto font-[family-name:var(--font-outfit)]">
                            {/* BACKDROP - Dotted Pattern Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-[#FACC15]/90"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            />

                            {/* MENU DRAWER - AGGRESSIVE SIDEBAR */}
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="
                                    absolute top-0 right-0 bottom-0 
                                    w-full max-w-[380px]
                                    bg-[#09090b] 
                                    border-l-[4px] border-black
                                    flex flex-col
                                    shadow-[-10px_0px_0px_rgba(0,0,0,1)]
                                "
                            >
                                {/* HEADER - High Contrast */}
                                <div className="flex items-center justify-between px-6 py-6 border-b-[3px] border-white/20 bg-[#09090b]">
                                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase transform -skew-x-6">
                                        MENÜ
                                    </h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="
                                            w-12 h-12
                                            flex items-center justify-center
                                            bg-white text-black
                                            border-[3px] border-black
                                            shadow-[4px_4px_0px_#FACC15]
                                            hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FACC15]
                                            active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                                            transition-all duration-100
                                        "
                                    >
                                        <X className="w-8 h-8 stroke-[3px]" />
                                    </button>
                                </div>

                                {/* SCROLL AREA - Raw List */}
                                <div className="flex-1 overflow-y-auto bg-[#09090b]">
                                    <motion.div
                                        variants={containerVariants}
                                        initial="closed"
                                        animate="open"
                                        className="flex flex-col"
                                    >
                                        {menuItems.map((item, i) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <motion.div key={item.href} variants={itemVariants}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "group relative flex items-center justify-between px-6 py-5",
                                                            "border-b-2 border-zinc-800",
                                                            "hover:bg-[#FACC15] transition-colors duration-0", // Instant hover
                                                            isActive && "bg-white"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <item.icon className={cn(
                                                                "w-6 h-6 stroke-[2.5px]",
                                                                "text-zinc-500 group-hover:text-black",
                                                                isActive && "text-black"
                                                            )} />
                                                            <span className={cn(
                                                                "text-2xl font-black uppercase italic tracking-tight",
                                                                "text-white group-hover:text-black",
                                                                isActive && "text-black"
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                        </div>

                                                        {item.badge && (
                                                            <span className={cn(
                                                                "px-2 py-0.5 text-[10px] font-black border-2 border-white text-white rotate-3",
                                                                "group-hover:border-black group-hover:text-black",
                                                                isActive && "border-black text-black bg-[#FACC15]"
                                                            )}>
                                                                {item.badge}
                                                            </span>
                                                        )}

                                                        <ArrowRight className={cn(
                                                            "w-6 h-6 opacity-0 -translate-x-4",
                                                            "group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-black",
                                                            "transition-all duration-200 ease-out"
                                                        )} />
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}

                                        {/* UTILS - BLOCKY BUTTONS */}
                                        <motion.div variants={itemVariants} className="p-6 grid grid-cols-2 gap-4">
                                            <Link href="/profil" onClick={() => setIsOpen(false)}>
                                                <div className="
                                                    bg-[#1f1f22] border-2 border-zinc-700 p-4 
                                                    hover:bg-white hover:border-white hover:text-black
                                                    hover:shadow-[5px_5px_0px_#FACC15]
                                                    hover:-translate-y-1
                                                    transition-all duration-200
                                                    group
                                                ">
                                                    <User className="w-6 h-6 text-zinc-400 group-hover:text-black mb-2" />
                                                    <div className="font-black text-white group-hover:text-black uppercase">PROFİL</div>
                                                </div>
                                            </Link>
                                            <Link href="/ayarlar" onClick={() => setIsOpen(false)}>
                                                <div className="
                                                    bg-[#1f1f22] border-2 border-zinc-700 p-4 
                                                    hover:bg-white hover:border-white hover:text-black
                                                    hover:shadow-[5px_5px_0px_#FACC15]
                                                    hover:-translate-y-1
                                                    transition-all duration-200
                                                    group
                                                ">
                                                    <Settings className="w-6 h-6 text-zinc-400 group-hover:text-black mb-2" />
                                                    <div className="font-black text-white group-hover:text-black uppercase">AYARLAR</div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* FOOTER - VIBRANT BLOCK */}
                                <div className="p-6 bg-[#FACC15] border-t-[4px] border-black">
                                    <div className="flex items-center justify-between">
                                        <div className="font-black text-2xl text-black italic tracking-tighter">
                                            FIZIKHUB©2026
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black hover:bg-white hover:text-black text-white transition-colors cursor-pointer">
                                                <Twitter className="w-4 h-4" />
                                            </div>
                                            <a href="https://github.com/baranbozkurt" target="_blank" className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black hover:bg-white hover:text-black text-white transition-colors cursor-pointer">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        </div>
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
