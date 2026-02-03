"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight, Terminal } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Starfield } from "@/components/ui/starfield";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"; // Use standard Link for external/basic nav inside motion

export function MobileMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset" };
    }, [isOpen]);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // STRICT BRUTALIST DATA
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, code: "01" },
        { href: "/makale", label: "KEŞFET", icon: Zap, code: "02" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, code: "03" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, code: "04" },
        { href: "/blog", label: "BLOG", icon: BookOpen, code: "05" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, code: "06" },
        { href: "/siralamalar", label: "LİG", icon: Award, code: "07" },
    ];

    const menuVariants = {
        closed: {
            opacity: 0,
            scaleY: 0, // TV turn off effect styling
            transformOrigin: "center",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            scaleY: 1,
            transition: {
                duration: 0.4,
                ease: "anticipate"
            }
        }
    };

    const listVariants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { x: -20, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return (
        <>
            {/* TRIGGER - Hard Square Brutalist */}
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-black border border-white rounded-none cursor-pointer hover:bg-white hover:text-black transition-colors"
            >
                <Menu className="w-4 h-4 stroke-[2px]" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
                    >
                        {/* BACKGROUND: Static Deep Space */}
                        <div className="absolute inset-0 z-0 bg-[#000000] pointer-events-none opacity-50">
                            <Starfield count={200} speed={0.1} starColor="#333333" />
                        </div>

                        {/* 1. HEADER: System Bar */}
                        <div className="relative z-20 flex-none flex items-center justify-between p-0 border-b border-white bg-black">
                            <div className="flex items-center gap-2 px-4 py-4">
                                <Terminal className="w-4 h-4 text-[#FACC15]" />
                                <span className="font-mono text-sm font-bold tracking-tighter text-white select-none">
                                    FIZIKHUB<span className="text-[#FACC15] animate-pulse">_OS</span>
                                </span>
                            </div>
                            <div
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-14 h-full border-l border-white bg-black text-white hover:bg-[#FACC15] hover:text-black transition-colors cursor-pointer rounded-none self-stretch"
                            >
                                <X className="w-6 h-6 stroke-[2px]" />
                            </div>
                        </div>

                        {/* 2. MENU ITEMS: Animated Grid List */}
                        <div className="relative z-20 flex-1 overflow-y-auto bg-black/80 backdrop-blur-sm">
                            <motion.div
                                variants={listVariants}
                                className="flex flex-col"
                            >
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.div key={item.href} variants={itemVariants}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "group relative flex items-center justify-between px-6 py-5 border-b border-white/10 transition-all duration-200",
                                                    isActive
                                                        ? "bg-white text-black"
                                                        : "bg-transparent text-zinc-400 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-4 relative z-10 w-full">
                                                    {/* Code Number */}
                                                    <span className={cn(
                                                        "font-mono text-xs opacity-50",
                                                        isActive || "group-hover:text-black" ? "text-inherit" : "text-zinc-600"
                                                    )}>
                                                        {item.code}
                                                    </span>

                                                    {/* Label */}
                                                    <span className="font-mono font-bold text-xl uppercase tracking-widest flex-1">
                                                        {item.label}
                                                    </span>

                                                    {/* Icon */}
                                                    <item.icon className="w-5 h-5 stroke-[2px]" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* 3. FOOTER: Status Bar */}
                        <div className="relative z-20 flex-none border-t border-white bg-black">
                            <div className="grid grid-cols-2 divide-x divide-white border-b border-white">
                                <Link href="/profil" className="flex items-center justify-center gap-2 py-4 hover:bg-white hover:text-black text-sm text-zinc-400 font-mono uppercase transition-colors">
                                    <User className="w-4 h-4" /> [KULLANICI]
                                </Link>
                                <Link href="/ayarlar" className="flex items-center justify-center gap-2 py-4 hover:bg-white hover:text-black text-sm text-zinc-400 font-mono uppercase transition-colors">
                                    <Settings className="w-4 h-4" /> [AYARLAR]
                                </Link>
                            </div>

                            <div className="flex justify-between items-center px-6 py-3 bg-black">
                                <span className="text-[10px] font-mono text-zinc-500">SYS.VER.8.0</span>
                                <div className="flex gap-6">
                                    <Twitter className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                                    <Github className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                                    <Globe className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
