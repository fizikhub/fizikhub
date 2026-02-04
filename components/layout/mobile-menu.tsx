"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Home, BookOpen, Trophy, User, Zap, Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const menuItems = [
    { href: "/", label: "ANA SAYFA", sub: "Başlangıç Noktası" },
    { href: "/makale", label: "MAKALELER", sub: "Bilimsel İçerik" },
    { href: "/siralamalar", label: "SIRALAMA", sub: "Liderlik Tablosu" },
    { href: "/profil", label: "PROFİL", sub: "Kişisel Alan" },
    { href: "/ozel", label: "ÖZEL İÇERİK", sub: "Premium Erişim" },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative z-[60] flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all duration-300"
            >
                <Menu className="w-6 h-6 stroke-[2]" />
            </button>

            {/* BACKDROP & MENU CONTAINER */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* BACKDROP BLUR */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                        />

                        {/* MENU DRAWER */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-[#09090b] border-l border-white/10 z-[100] shadow-2xl flex flex-col"
                        >
                            {/* BACKGROUND NOISE TEXTURE */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

                            {/* HEADER */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black italic tracking-tighter text-white">MENÜ</span>
                                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest">FIZIKHUB SYSTEM</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-all group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* LINKS LIST */}
                            <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
                                {menuItems.map((item, i) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group block relative"
                                        >
                                            <div className="flex items-baseline justify-between">
                                                <span className={cn(
                                                    "text-4xl font-black tracking-tight transition-colors duration-300",
                                                    pathname === item.href ? "text-[#FACC15]" : "text-white group-hover:text-zinc-300"
                                                )}>
                                                    {item.label}
                                                </span>
                                                <ArrowUpRight className="w-6 h-6 text-zinc-600 group-hover:text-[#FACC15] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                            </div>
                                            <p className="text-sm text-zinc-500 font-medium tracking-wide mt-1 group-hover:text-zinc-400 transition-colors">
                                                {item.sub}
                                            </p>

                                            {/* Hover Line */}
                                            <div className="h-[2px] w-0 bg-[#FACC15] mt-4 group-hover:w-full transition-all duration-500 ease-out" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* FOOTER AREA */}
                            <div className="p-6 border-t border-white/10 bg-zinc-900/50">
                                <div className="flex gap-4">
                                    {['Twitter', 'Instagram', 'Discord'].map((social) => (
                                        <a key={social} href="#" className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider">{social}</a>
                                    ))}
                                </div>
                                <div className="mt-4 text-[10px] text-zinc-700 font-mono">
                                    DESIGNED BY ANTIGRAVITY // 2026
                                </div>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
