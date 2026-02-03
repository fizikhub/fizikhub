"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ArrowRight } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

// FULLSCREEN MENU VARIANTS
const menuVariants = {
    closed: {
        opacity: 0,
        y: "-100%",
        transition: {
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1], // Custom bezier for "Curtain" feel
            when: "afterChildren"
        }
    },
    open: {
        opacity: 1,
        y: "0%",
        transition: {
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
} as const;

const itemVariants = {
    closed: { opacity: 0, y: 50, rotateX: 90 },
    open: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
} as const;

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "text-blue-500" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "text-yellow-500" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "text-purple-500" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "text-green-500" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "text-pink-500" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "text-red-500" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "text-orange-500" },
    ];

    return (
        <>
            {/* TRIGGER - UPSCALE (30px) */}
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-white border border-black rounded-sm cursor-pointer hover:bg-[#FACC15] transition-colors z-50 relative"
            >
                <Menu className="w-4 h-4 text-black stroke-[3px]" />
            </div>

            {/* FULLSCREEN CURTAIN OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 w-screen h-[100dvh] bg-black z-[9999] flex flex-col justify-between overflow-hidden"
                    >
                        {/* 1. HEADER */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 z-20">
                            <span className="text-xl font-black italic tracking-tighter text-white">
                                FIZIK<span className="text-[#FACC15]">HUB</span>
                            </span>
                            <motion.div
                                onClick={() => setIsOpen(false)}
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-full cursor-pointer"
                            >
                                <X className="w-6 h-6 text-black stroke-[3px]" />
                            </motion.div>
                        </div>

                        {/* 2. KINETIC NAV LIST */}
                        <div className="flex-1 flex flex-col justify-center px-6 overflow-y-auto scrollbar-hide space-y-2">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div key={item.href} variants={itemVariants} className="w-full">
                                        <ViewTransitionLink
                                            href={item.href}
                                            className="group flex items-center justify-between w-full py-2 border-b border-white/10 hover:border-white transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "text-3xl font-black uppercase tracking-tighter transition-all duration-300",
                                                    isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 scale-105 origin-left" : "text-zinc-500 group-hover:text-white"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ArrowRight className={cn(
                                                "w-6 h-6 transition-all duration-300 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                                                item.color
                                            )} />
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* 3. FOOTER */}
                        <motion.div
                            variants={itemVariants}
                            className="p-6 border-t border-white/10 bg-zinc-900"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <ViewTransitionLink href="/profil" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                                    <User className="w-5 h-5" />
                                    <span className="font-bold uppercase text-sm">Profil</span>
                                </ViewTransitionLink>
                                <ViewTransitionLink href="/ayarlar" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                                    <Settings className="w-5 h-5" />
                                    <span className="font-bold uppercase text-sm">Ayarlar</span>
                                </ViewTransitionLink>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-600 font-mono">v3.5 KINETIC</span>
                                <div className="flex gap-4">
                                    <Twitter className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
                                    <Github className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
