"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, LogOut, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";

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

    // Vibrantly colored menu items for that "Sticker" feel
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "bg-[#FF90E8]" }, // Pop Pink
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "bg-[#00E6CC]" }, // Teal
        { href: "/simulasyonlar", label: "SİMÜLASYON", icon: Atom, color: "bg-[#FFD900]" }, // Yellow
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "bg-[#FF5C00]" }, // Orange
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "bg-[#00B8FF]" }, // Blue
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "bg-[#23A094]" }, // Dark Teal
        { href: "/siralamalar", label: "LİG", icon: Award, color: "bg-[#AE63E4]" }, // Purple
    ];

    const overlayVariants: Variants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const drawerVariants: Variants = {
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
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(true)}
                className="
                    relative z-50 pointer-events-auto
                    flex items-center justify-center 
                    w-[42px] h-[42px] 
                    bg-white text-black 
                    border-[2px] border-black 
                    shadow-[3px_3px_0px_#000000] 
                    active:translate-y-1 active:shadow-none 
                    transition-all
                    cursor-pointer
                    hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000000]
                "
            >
                <Menu className="w-6 h-6 stroke-[3px]" />
            </button>

            <AnimatePresence>
                {isOpen && mounted && createPortal(
                    <motion.div
                        key="mobile-menu-portal"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[10000] pointer-events-auto"
                    >
                        {/* BACKDROP */}
                        <motion.div
                            variants={overlayVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
                        />

                        {/* DRAWER */}
                        <motion.div
                            variants={drawerVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="
                                absolute top-0 right-0 bottom-0 z-[9999]
                                w-[85vw] max-w-[360px]
                                bg-[#FACC15] 
                                border-l-[4px] border-black
                                flex flex-col
                                shadow-[-10px_0px_40px_rgba(0,0,0,0.5)]
                            "
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between px-6 py-5 border-b-[4px] border-black bg-white">
                                <span className="text-2xl font-black italic tracking-tighter transform -skew-x-6 select-none">
                                    MENÜ
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="
                                        w-10 h-10 
                                        bg-[#FF5C00] text-white 
                                        border-[3px] border-black 
                                        flex items-center justify-center
                                        shadow-[3px_3px_0px_#000]
                                        active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
                                        hover:scale-105
                                        transition-all
                                        rounded-md
                                    "
                                >
                                    <X className="w-7 h-7 stroke-[4px]" />
                                </button>
                            </div>

                            {/* SCROLLABLE AREA */}
                            <div className="flex-1 overflow-y-auto bg-[#FACC15] p-5">
                                <motion.div
                                    variants={containerVariants}
                                    initial="closed"
                                    animate="open"
                                    className="flex flex-col gap-3"
                                >
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div key={item.href} variants={itemVariants}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group relative flex items-center justify-between p-3.5",
                                                        "bg-white border-[3px] border-black rounded-xl",
                                                        "shadow-[4px_4px_0px_#000]",
                                                        "transition-all active:translate-y-1 active:shadow-none",
                                                        isActive && "ring-4 ring-black/10 translate-x-2"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-lg border-[2.5px] border-black flex items-center justify-center shadow-sm",
                                                            item.color
                                                        )}>
                                                            <item.icon className="w-5 h-5 text-black stroke-[2.5px]" />
                                                        </div>
                                                        <span className={cn(
                                                            "font-bold text-lg tracking-tight uppercase",
                                                            isActive ? "underline decoration-4 decoration-[#FACC15] underline-offset-4" : ""
                                                        )}>
                                                            {item.label}
                                                        </span>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight className={cn(
                                                        "w-6 h-6 text-black opacity-0 -translate-x-4 transition-all duration-300",
                                                        "group-hover:opacity-100 group-hover:translate-x-0"
                                                    )} />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* UTILS SECTION */}
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-8 bg-white border-[3px] border-black rounded-xl p-4 shadow-[4px_4px_0px_#000]"
                                >
                                    <h3 className="font-black text-sm uppercase mb-3 text-zinc-400">Hızlı Erişim</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/profil" className="
                                            flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg
                                            bg-zinc-100 border-2 border-dashed border-black hover:bg-[#FACC15] hover:border-solid transition-colors
                                        ">
                                            <User className="w-5 h-5 stroke-[2.5px]" />
                                            <span className="font-bold text-xs uppercase">Profil</span>
                                        </Link>
                                        <Link href="/ayarlar" className="
                                            flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg
                                            bg-zinc-100 border-2 border-dashed border-black hover:bg-[#FACC15] hover:border-solid transition-colors
                                        ">
                                            <Settings className="w-5 h-5 stroke-[2.5px]" />
                                            <span className="font-bold text-xs uppercase">Ayarlar</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            {/* FOOTER */}
                            <div className="p-5 bg-black text-white flex justify-between items-center border-t-[4px] border-black sticky bottom-0">
                                <span className="font-black italic text-lg text-[#FACC15]">FIZIKHUB</span>
                                <div className="flex gap-4">
                                    <Twitter className="w-5 h-5 hover:text-[#FACC15] hover:scale-110 transition-all cursor-pointer" />
                                    <Github className="w-5 h-5 hover:text-[#FACC15] hover:scale-110 transition-all cursor-pointer" />
                                    <Globe className="w-5 h-5 hover:text-[#FACC15] hover:scale-110 transition-all cursor-pointer" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
}
