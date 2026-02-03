"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

// DRAWER ANIMATION VARIANTS
const drawerVariants = {
    closed: {
        x: "100%",
        opacity: 0, // Slight fade for smoother exit
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    open: {
        x: "0%",
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05 // Stagger items on open
        }
    }
} as const;

const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

// BACKDROP VARIANTS
const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
} as const;

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Lock body scroll
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
        { href: "/", label: "ANA SAYFA", icon: Home, bg: "bg-blue-500", text: "text-white", border: "border-blue-700" },
        { href: "/makale", label: "KEŞFET", icon: Zap, bg: "bg-[#FACC15]", text: "text-black", border: "border-yellow-600" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, bg: "bg-purple-500", text: "text-white", border: "border-purple-700" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, bg: "bg-green-500", text: "text-white", border: "border-green-700" },
        { href: "/blog", label: "BLOG", icon: BookOpen, bg: "bg-pink-500", text: "text-white", border: "border-pink-700" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, bg: "bg-red-500", text: "text-white", border: "border-red-700" },
        { href: "/siralamalar", label: "LİG", icon: Award, bg: "bg-orange-500", text: "text-white", border: "border-orange-700" },
    ];

    return (
        <>
            {/* TRIGGER - 30px */}
            <div
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-white border border-black rounded-sm cursor-pointer hover:bg-[#FACC15] transition-colors z-40 relative shadow-[2px_2px_0px_#000]"
            >
                <Menu className="w-4 h-4 text-black stroke-[3px]" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        />

                        {/* DRAWER CONTENT */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                                "fixed top-0 right-0 bottom-0 w-[85vw] max-w-[320px] bg-white z-[9999]",
                                "border-l-4 border-black",
                                "shadow-[-10px_0px_20px_rgba(0,0,0,0.5)]", // Deep shadow
                                "flex flex-col"
                            )}
                        >
                            {/* 1. HEADER */}
                            <div className="flex-none flex items-center justify-between p-6 border-b-4 border-black bg-white">
                                <span className="text-xl font-black italic tracking-tighter text-black select-none">
                                    FIZIK<span className="text-[#FACC15] drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">HUB</span>
                                </span>
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center w-9 h-9 border-2 border-black bg-black text-white rounded-sm shadow-[3px_3px_0px_rgba(0,0,0,0.2)] cursor-pointer active:scale-95 transition-transform"
                                >
                                    <X className="w-5 h-5 stroke-[3px]" />
                                </div>
                            </div>

                            {/* 2. MENU ITEMS (SCROLLABLE) */}
                            <div className="flex-1 overflow-y-auto p-5 bg-[#FAFAFA]">
                                <div className="space-y-3 pb-safe">
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <ViewTransitionLink
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "group relative flex items-center justify-between p-3.5 border-2 border-black rounded-lg bg-white shadow-[3px_3px_0px_#000]",
                                                    "transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]",
                                                    isActive ? `ring-2 ring-black ring-offset-2 ${item.bg} border-black` : ""
                                                )}
                                            >
                                                {/* Hover Fill Effect */}
                                                <div className={cn(
                                                    "absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                                    item.bg
                                                )} />

                                                <div className="flex items-center gap-3 relative z-10">
                                                    <div className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded border-2 border-black transition-colors",
                                                        isActive ? "bg-white text-black" : "bg-zinc-100 text-black group-hover:bg-white"
                                                    )}>
                                                        <item.icon className="w-4 h-4 stroke-[2.5px]" />
                                                    </div>
                                                    <span className={cn(
                                                        "font-black uppercase tracking-tight text-sm",
                                                        isActive ? (item.text === "text-white" ? "text-white" : "text-black") : "text-black"
                                                    )}>
                                                        {item.label}
                                                    </span>
                                                </div>

                                                <ChevronRight className={cn(
                                                    "w-5 h-5 stroke-[3px] transition-transform group-hover:translate-x-1 relative z-10",
                                                    isActive ? (item.text === "text-white" ? "text-white" : "text-black") : "text-black/30 group-hover:text-black"
                                                )} />
                                            </ViewTransitionLink>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. FOOTER */}
                            <div className="flex-none p-5 border-t-4 border-black bg-white">
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <ViewTransitionLink
                                        href="/profil"
                                        className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black rounded-lg bg-zinc-50 hover:bg-[#FACC15] shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-none transition-all group"
                                    >
                                        <User className="w-5 h-5 text-black stroke-[2.5px] group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black text-black uppercase tracking-wide">Hesabım</span>
                                    </ViewTransitionLink>
                                    <ViewTransitionLink
                                        href="/ayarlar"
                                        className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black rounded-lg bg-zinc-50 hover:bg-zinc-200 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:shadow-none transition-all group"
                                    >
                                        <Settings className="w-5 h-5 text-black stroke-[2.5px] group-hover:rotate-90 transition-transform" />
                                        <span className="text-[10px] font-black text-black uppercase tracking-wide">Ayarlar</span>
                                    </ViewTransitionLink>
                                </div>

                                <div className="flex justify-between items-center mt-2 pt-3 border-t-2 border-black/5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#FACC15] bg-black px-1.5 py-0.5">v4.1 POP</span>
                                    <div className="flex gap-3">
                                        <Twitter className="w-4 h-4 text-black hover:scale-110 transition-transform cursor-pointer" />
                                        <Github className="w-4 h-4 text-black hover:scale-110 transition-transform cursor-pointer" />
                                        <Globe className="w-4 h-4 text-black hover:scale-110 transition-transform cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
