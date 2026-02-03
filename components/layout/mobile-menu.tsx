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
} as const;

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
        { href: "/", label: "ANA SAYFA", icon: Home, color: "text-blue-500", border: "group-hover:border-blue-500", bg: "group-hover:bg-blue-500/10" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "text-yellow-500", border: "group-hover:border-yellow-500", bg: "group-hover:bg-yellow-500/10" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "text-purple-500", border: "group-hover:border-purple-500", bg: "group-hover:bg-purple-500/10" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "text-green-500", border: "group-hover:border-green-500", bg: "group-hover:bg-green-500/10" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "text-pink-500", border: "group-hover:border-pink-500", bg: "group-hover:bg-pink-500/10" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "text-red-500", border: "group-hover:border-red-500", bg: "group-hover:bg-red-500/10" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "text-orange-500", border: "group-hover:border-orange-500", bg: "group-hover:bg-orange-500/10" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                    className={cn(
                        "flex items-center justify-center !w-8 !h-8 !min-w-[32px] !min-h-[32px] !p-0",
                        "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg",
                        "text-white hover:bg-white hover:text-black transition-all"
                    )}
                >
                    <Menu className="w-4 h-4 stroke-[2px]" />
                </motion.button>
            </SheetTrigger>

            {/* COMPACT NEO-BRUTALIST SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[85vw] max-w-[300px] p-0 border-l border-white/10 bg-[#09090b]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
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
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")' }} />

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-5 pb-2 z-10 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] select-none">SYSTEM_NAV</span>
                        <SheetClose asChild>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-8 h-8 border border-white/10 rounded-md text-white/60 hover:bg-white hover:text-black transition-colors"
                            >
                                <X className="w-4 h-4 stroke-[2px]" />
                            </motion.button>
                        </SheetClose>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 z-10 scrollbar-hide">

                        {/* NAV ITEMS - COLORIZED & COMPACT */}
                        <div className="space-y-2">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div key={item.href} variants={itemVariants}>
                                        <ViewTransitionLink
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center justify-between px-3 py-2.5 rounded-lg border border-transparent",
                                                "transition-all duration-200",
                                                isActive ? `bg-white/10 border-white/10` : `hover:bg-white/5 ${item.border}`
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-1.5 rounded-md bg-white/5 transition-colors",
                                                    isActive ? "text-white" : `${item.color} group-hover:text-white ${item.bg}`
                                                )}>
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-bold uppercase tracking-wide",
                                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dot"
                                                    className={cn("w-1.5 h-1.5 rounded-full shadow-[0px_0px_8px] bg-current", item.color.replace('text-', 'bg-'))}
                                                />
                                            )}
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER - UTILITY GRID */}
                    <motion.div
                        variants={itemVariants}
                        className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md z-10"
                    >
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-md border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                            >
                                <User className="w-4 h-4 text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Hesabım</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center gap-1 p-2 rounded-md border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                            >
                                <Settings className="w-4 h-4 text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="scale-90 origin-bottom">
                            <AuthButton />
                        </div>

                        {/* SOCIALS / INFO */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 text-zinc-700">
                            <span className="text-[9px] font-mono uppercase tracking-widest">v2.4.2 COLOR</span>
                            <div className="flex gap-3 text-zinc-600">
                                <Twitter className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                                <Github className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                                <Globe className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
