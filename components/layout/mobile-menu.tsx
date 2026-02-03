"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote, Twitter, Github, Globe } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

const menuVariants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            duration: 0.2,
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.19, 1.0, 0.22, 1.0], // Expo ease
            staggerChildren: 0.07,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
};

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "text-blue-500", border: "hover:border-blue-500" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "text-yellow-500", border: "hover:border-yellow-500" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "text-purple-500", border: "hover:border-purple-500" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "text-green-500", border: "hover:border-green-500" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "text-pink-500", border: "hover:border-pink-500" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "text-red-500", border: "hover:border-red-500" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "text-orange-500", border: "hover:border-orange-500" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                        "flex items-center justify-center w-9 h-9",
                        "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg",
                        "text-white hover:bg-white hover:text-black transition-all"
                    )}
                >
                    <Menu className="w-5 h-5 stroke-[2px]" />
                </motion.button>
            </SheetTrigger>

            {/* PREMIUM NEO-DARK SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-full sm:w-[400px] p-0 border-l border-white/10 bg-[#09090b]/95 backdrop-blur-2xl overflow-hidden"
            >
                <SheetTitle className="sr-only">Menü</SheetTitle>

                <motion.div
                    className="flex flex-col h-full relative"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                >
                    {/* BACKGROUND NOISE TEXTURE */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }} />

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-6 pb-2 z-10">
                        <span className="text-xs font-mono text-zinc-500 tracking-widest">NAVIGATION_V3.0</span>
                        <SheetClose asChild>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-10 h-10 border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5 stroke-[2px]" />
                            </motion.button>
                        </SheetClose>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 z-10 scrollbar-hide">

                        {/* HERO CARD - PREMIUM ACCESS */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <ViewTransitionLink
                                href="/ozel"
                                className="group relative flex items-center justify-between w-full p-5 overflow-hidden border border-[#FACC15]/30 bg-[#FACC15]/5 hover:bg-[#FACC15]/10 transition-all rounded-xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FACC15]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col gap-1 z-10">
                                    <div className="flex items-center gap-2 text-[#FACC15]">
                                        <Crown className="w-4 h-4 fill-[#FACC15]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                                    </div>
                                    <span className="text-lg font-black text-white italic">ÖZEL İÇERİK</span>
                                </div>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FACC15] text-black group-hover:scale-110 transition-transform">
                                    <ChevronRight className="w-5 h-5 stroke-[3px]" />
                                </div>
                            </ViewTransitionLink>
                        </motion.div>

                        {/* NAV ITEMS */}
                        <div className="space-y-3">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div key={item.href} variants={itemVariants}>
                                        <ViewTransitionLink
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center justify-between p-4",
                                                "border-b border-white/5 hover:border-white/20",
                                                "transition-all duration-300",
                                                isActive ? "bg-white/5 border-l-2 border-l-[#FACC15]" : "hover:pl-6"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-2 rounded-md bg-white/5 transition-colors group-hover:bg-white/10",
                                                    isActive ? "text-[#FACC15]" : "text-zinc-400 group-hover:text-white"
                                                )}>
                                                    <item.icon className="w-5 h-5 stroke-[2px]" />
                                                </div>
                                                <span className={cn(
                                                    "text-xl font-black tracking-tight",
                                                    isActive ? "text-white" : "text-zinc-500 group-hover:text-white"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            <ChevronRight className={cn(
                                                "w-5 h-5 transition-transform group-hover:translate-x-1",
                                                isActive ? "text-[#FACC15]" : "text-zinc-700 group-hover:text-white"
                                            )} />
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER - UTILITY GRID */}
                    <motion.div
                        variants={itemVariants}
                        className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md z-10"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <User className="w-4 h-4 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-300">Hesabım</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                            >
                                <Settings className="w-4 h-4 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-300">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <AuthButton />

                        {/* SOCIALS / INFO */}
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5 text-zinc-600">
                            <span className="text-[10px] font-mono">FIZIKHUB v2.4</span>
                            <div className="flex gap-4">
                                <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                                <Github className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                                <Globe className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
