"use client";

import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: Home, gradient: "from-blue-500 to-indigo-500" },
    { href: "/makale", label: "Makaleler", icon: BookOpen, gradient: "from-purple-500 to-pink-500" },
    { href: "/siralamalar", label: "Sıralama", icon: Trophy, gradient: "from-yellow-400 to-orange-500" },
    { href: "/profil", label: "Profil", icon: User, gradient: "from-green-400 to-emerald-600" },
    { href: "/ozel", label: "Özel İçerik", icon: Zap, gradient: "from-red-500 to-rose-600" },
];

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-[40px] h-[40px] rounded-full transition-all duration-300 z-50 relative",
                    isOpen
                        ? "bg-white text-black rotate-90 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        : "bg-transparent text-white border border-white/20 hover:bg-white/10"
                )}
            >
                {isOpen ? <X className="w-5 h-5 stroke-[3]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40"
                    />
                )}
            </AnimatePresence>

            {/* Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute top-full right-0 mt-4 w-[280px] origin-top-right z-50"
                    >
                        <div className="bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden">

                            {/* Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">Navigasyon</span>
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                            </div>

                            {/* Items */}
                            <div className="p-2 space-y-1">
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors relative overflow-hidden"
                                    >
                                        {/* Icon Container with Gradient */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br shadow-inner",
                                            item.gradient
                                        )}>
                                            <item.icon className="w-5 h-5 text-white stroke-[2.5]" />
                                        </div>

                                        {/* Label */}
                                        <div className="flex flex-col z-10">
                                            <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Chevron */}
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all">
                                            <span className="text-zinc-500 text-lg">›</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Footer info */}
                            <div className="px-4 py-3 bg-black/40 border-t border-white/5 text-[10px] text-zinc-600 font-mono text-center">
                                FIZIKHUB v2.0
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
