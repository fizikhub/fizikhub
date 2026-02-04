"use client";

import { Drawer } from "vaul";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, Settings, Github, Twitter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: Home, color: "bg-blue-400" },
    { href: "/makale", label: "Makaleler", icon: BookOpen, color: "bg-purple-400" },
    { href: "/siralamalar", label: "Sıralama", icon: Trophy, color: "bg-yellow-400" },
    { href: "/profil", label: "Profil", icon: User, color: "bg-green-400" },
    { href: "/ozel", label: "Özel İçerik", icon: Zap, color: "bg-red-400" },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Drawer.Root shouldScaleBackground open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button className="flex items-center justify-center w-[40px] h-[40px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-md">
                    <Menu className="w-6 h-6 text-black stroke-[3]" />
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
                <Drawer.Content className="bg-[#09090b] flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t-4 border-l-4 border-r-4 border-white shadow-[0px_-10px_40px_rgba(0,0,0,0.5)] outline-none">

                    {/* Handle Bar */}
                    <div className="mx-auto w-16 h-2 flex-shrink-0 rounded-full bg-white/20 mt-4 mb-4" />

                    {/* Header */}
                    <div className="px-6 pb-6 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black text-white italic tracking-tighter">MENÜ</h2>
                            <p className="text-sm text-zinc-400 font-mono">Navigasyon Sistemi v2.0</p>
                        </div>
                        <Drawer.Close asChild>
                            <button className="w-10 h-10 bg-red-500 border-2 border-black shadow-[2px_2px_0px_#fff] flex items-center justify-center rounded-full active:scale-95 transition-transform">
                                <X className="w-6 h-6 text-black stroke-[3]" />
                            </button>
                        </Drawer.Close>
                    </div>

                    {/* Menu Items (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <AnimatePresence>
                            {menuItems.map((item, i) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="group relative flex items-center gap-4 p-4 bg-zinc-900 border-2 border-white/10 hover:border-[#FACC15] hover:bg-[#FACC15] transition-all rounded-xl overflow-hidden shadow-sm hover:shadow-[4px_4px_0px_#fff] active:translate-y-1 active:shadow-none"
                                    >
                                        {/* Icon Box */}
                                        <div className={cn("w-12 h-12 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-transform group-hover:rotate-12", item.color)}>
                                            <item.icon className="w-6 h-6 text-black stroke-[2.5]" />
                                        </div>

                                        {/* Label */}
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-white group-hover:text-black uppercase tracking-tight">{item.label}</span>
                                            <span className="text-xs font-mono text-zinc-500 group-hover:text-black/70">Gitmek için dokun →</span>
                                        </div>

                                        {/* Arrow */}
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Footer / Socials */}
                    <div className="p-6 border-t border-white/10 bg-zinc-950/50">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <Link href="#" className="p-3 bg-zinc-800 rounded-lg border border-white/10 hover:border-white hover:bg-black transition-colors">
                                    <Github className="w-5 h-5 text-white" />
                                </Link>
                                <Link href="#" className="p-3 bg-zinc-800 rounded-lg border border-white/10 hover:border-blue-400 hover:bg-black transition-colors">
                                    <Twitter className="w-5 h-5 text-white" />
                                </Link>
                                <Link href="#" className="p-3 bg-zinc-800 rounded-lg border border-white/10 hover:border-green-400 hover:bg-black transition-colors">
                                    <Settings className="w-5 h-5 text-white" />
                                </Link>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-500">FIZIKHUB v2.0</p>
                                <p className="text-[10px] text-zinc-700 font-mono">Designed by Antigravity</p>
                            </div>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
