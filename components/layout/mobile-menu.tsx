"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote, Twitter, Instagram, Github } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "#3B82F6" }, // Blue
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "#FFD200" }, // Yellow
        { href: "/simulasyonlar", label: "DENEYLER", icon: Atom, color: "#EF4444" }, // Red
        { href: "/notlar", label: "DERS NOTLARI", icon: StickyNote, color: "#10B981" }, // Green
        { href: "/blog", label: "FIZIK BLOG", icon: BookOpen, color: "#8B5CF6" }, // Purple
        { href: "/testler", label: "SINAVLAR", icon: FlaskConical, color: "#F97316" }, // Orange
        { href: "/siralamalar", label: "LİG", icon: Award, color: "#EC4899" }, // Pink
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9, rotate: -5 }}
                    className={cn(
                        "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11",
                        "bg-[#FFD200] border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000]",
                        "text-black transition-all"
                    )}
                >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px]" />
                </motion.button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:w-[360px] p-0 border-l-[4px] border-black bg-[#F3F4F6] overflow-hidden"
            >
                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>

                <div className="flex flex-col h-full relative">
                    {/* TOP HEADER STICKER */}
                    <div className="bg-[#3B82F6] p-6 border-b-[4px] border-black">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-col gap-1"
                        >
                            <span className="text-white font-black text-2xl tracking-tighter leading-none italic">
                                FIZIKHUB
                            </span>
                            <span className="text-black/80 font-bold text-[10px] uppercase tracking-widest bg-white/30 px-2 py-0.5 self-start">
                                Navigasyon Sistemi v2.0
                            </span>
                        </motion.div>
                    </div>

                    {/* MENU GRID - STICKER STYLE */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 h-14 w-full",
                                            "bg-white border-[2.5px] border-black",
                                            "shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
                                            "transition-all duration-200",
                                            isActive && "scale-[1.02] border-r-[8px]"
                                        )}
                                        style={{ borderRightColor: isActive ? item.color : 'black' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-8 h-8 flex items-center justify-center border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                <item.icon className="w-4 h-4 text-black stroke-[2.5px]" />
                                            </div>
                                            <span className="font-black text-sm tracking-tight text-black italic">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight className={cn("w-5 h-5 opacity-30", isActive && "opacity-100")} />
                                    </ViewTransitionLink>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* BOTTOM NAV BLOCKS */}
                    <div className="p-4 bg-white border-t-[4px] border-black space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center py-4 border-[2.5px] border-black bg-[#F3F4F6] hover:bg-[#FFD200] transition-colors shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            >
                                <User className="w-6 h-6 mb-1 stroke-[2.5px]" />
                                <span className="text-[10px] font-black uppercase">PROFIL</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center py-4 border-[2.5px] border-black bg-[#F3F4F6] hover:bg-[#FFD200] transition-colors shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                            >
                                <Settings className="w-6 h-6 mb-1 stroke-[2.5px]" />
                                <span className="text-[10px] font-black uppercase">AYARLAR</span>
                            </ViewTransitionLink>
                        </div>

                        {/* SOCIALS & AUTH */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <div className="flex gap-2">
                                {[Twitter, Instagram, Github].map((Icon, i) => (
                                    <button key={i} className="w-10 h-10 border-[2px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 max-w-[140px]">
                                <AuthButton />
                            </div>
                        </div>
                    </div>

                    {/* CLOSE BUTTON - FLOATING CIRCLE */}
                    <SheetClose className="absolute top-4 right-4 z-50">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-10 h-10 bg-black text-white border-[2px] border-white shadow-xl"
                        >
                            <X className="w-6 h-6 text-white stroke-[4px]" />
                        </motion.div>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
}
