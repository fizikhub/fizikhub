"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

    if (!mounted) return null;

    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("OPENING MENU FORCE");
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

            {/* PORTAL RENDER */}
            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-[99999] flex flex-col bg-[#09090b] text-white font-[family-name:var(--font-outfit)]"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100dvh' }}
                >
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
                        <span className="text-3xl font-black italic tracking-tighter">MENÜ</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-12 h-12 flex items-center justify-center bg-[#FACC15] text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            <X className="w-8 h-8 stroke-[3px]" />
                        </button>
                    </div>

                    {/* MENU ITEMS */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 active:bg-[#FACC15] active:text-black transition-colors",
                                    pathname === item.href && "bg-white text-black border-white"
                                )}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="font-bold text-xl">{item.label}</span>
                            </Link>
                        ))}

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Link href="/profil" className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold">PROFIL</Link>
                            <Link href="/ayarlar" className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold">AYARLAR</Link>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 border-t border-zinc-800 text-center text-zinc-500 text-xs shrink-0">
                        FIZIKHUB v3.0
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
