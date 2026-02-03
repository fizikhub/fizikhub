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
        { href: "/", label: "ANA SAYFA", icon: Home, bg: "bg-blue-500", text: "text-white", border: "border-black" },
        { href: "/makale", label: "KEŞFET", icon: Zap, bg: "bg-[#FACC15]", text: "text-black", border: "border-black" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, bg: "bg-purple-500", text: "text-white", border: "border-black" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, bg: "bg-green-500", text: "text-white", border: "border-black" },
        { href: "/blog", label: "BLOG", icon: BookOpen, bg: "bg-pink-500", text: "text-white", border: "border-black" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, bg: "bg-red-500", text: "text-white", border: "border-black" },
        { href: "/siralamalar", label: "LİG", icon: Award, bg: "bg-orange-500", text: "text-white", border: "border-black" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }}
                    className={cn(
                        "flex items-center justify-center !w-6 !h-6 !min-w-[24px] !min-h-[24px] !p-0",
                        "bg-white border border-black text-black rounded-sm",
                        "hover:bg-[#FACC15] hover:border-black transition-colors"
                    )}
                >
                    <Menu className="w-3.5 h-3.5 stroke-[2.5px]" />
                </motion.button>
            </SheetTrigger>

            {/* PREMIUM POP NEO-BRUTALIST SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[90vw] max-w-[320px] p-0 border-l-4 border-black bg-[#FAFAFA] shadow-[-10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
                <SheetTitle className="sr-only">Menü</SheetTitle>

                <motion.div
                    className="flex flex-col h-full relative"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                >
                    {/* NOISE TEXTURE */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("/noise.png")' }} />

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-6 pb-4 bg-white border-b-4 border-black z-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">NAVIGASYON</span>
                            <span className="text-2xl font-black italic tracking-tighter text-black select-none">FIZIK<span className="text-[#FACC15] drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">HUB</span></span>
                        </div>
                        <SheetClose asChild>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-8 h-8 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_#000]"
                            >
                                <X className="w-4 h-4 stroke-[3px]" />
                            </motion.button>
                        </SheetClose>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto z-10 scrollbar-hide bg-[#FAFAFA] px-5 py-5">

                        {/* NAV ITEMS - FLOATING CARDS */}
                        <div className="space-y-3">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div
                                        key={item.href}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ViewTransitionLink
                                            href={item.href}
                                            className={cn(
                                                "relative group flex items-center justify-between px-4 py-3.5 border-2 border-black rounded-lg",
                                                "transition-all duration-200",
                                                isActive
                                                    ? `${item.bg} ${item.text} shadow-[4px_4px_0px_#000]` // Active State
                                                    : "bg-white text-black hover:shadow-[4px_4px_0px_#000] shadow-[2px_2px_0px_#000]" // Default State
                                            )}
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={cn(
                                                    "w-8 h-8 flex items-center justify-center rounded-md border-2 border-black",
                                                    isActive ? "bg-white text-black" : `${item.bg} text-white`
                                                )}>
                                                    <item.icon className="w-4 h-4 stroke-[2.5px]" />
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-black uppercase tracking-tight",
                                                    isActive ? item.text : "text-black"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            <ChevronRight className={cn(
                                                "w-5 h-5 stroke-[3px] transition-transform group-hover:translate-x-1",
                                                isActive ? item.text : "text-black/20 group-hover:text-black"
                                            )} />
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER - CARD STYLE */}
                    <motion.div
                        variants={itemVariants}
                        className="p-5 border-t-4 border-black bg-white z-10"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black rounded-lg bg-zinc-50 hover:bg-[#FACC15] shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all group"
                            >
                                <User className="w-5 h-5 text-black stroke-[2px] group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-black uppercase tracking-wide">Hesabım</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black rounded-lg bg-zinc-50 hover:bg-zinc-200 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all group"
                            >
                                <Settings className="w-5 h-5 text-black stroke-[2px] group-hover:rotate-90 transition-transform" />
                                <span className="text-[10px] font-black text-black uppercase tracking-wide">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="scale-95 origin-bottom">
                            <AuthButton />
                        </div>

                        {/* SOCIALS */}
                        <div className="flex justify-between items-center mt-5 pt-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">FIZIKHUB v3.1 POP</span>
                            <div className="flex gap-4">
                                <div className="p-1.5 border-2 border-black rounded bg-white hover:bg-black hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#000]">
                                    <Twitter className="w-3 h-3" />
                                </div>
                                <div className="p-1.5 border-2 border-black rounded bg-white hover:bg-black hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#000]">
                                    <Github className="w-3 h-3" />
                                </div>
                                <div className="p-1.5 border-2 border-black rounded bg-white hover:bg-black hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#000]">
                                    <Globe className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
