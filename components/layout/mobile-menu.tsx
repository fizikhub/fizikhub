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
        { href: "/", label: "ANA SAYFA", icon: Home, color: "hover:bg-blue-500", text: "hover:text-white" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "hover:bg-yellow-400", text: "hover:text-black" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "hover:bg-purple-500", text: "hover:text-white" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "hover:bg-green-500", text: "hover:text-white" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "hover:bg-pink-500", text: "hover:text-white" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "hover:bg-red-500", text: "hover:text-white" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "hover:bg-orange-500", text: "hover:text-white" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                    className={cn(
                        "flex items-center justify-center !w-7 !h-7 !min-w-[28px] !min-h-[28px] !p-0",
                        "bg-white border-2 border-white/20 text-black rounded-sm",
                        "hover:bg-[#FACC15] hover:border-black transition-colors"
                    )}
                >
                    <Menu className="w-4 h-4 stroke-[2.5px]" />
                </motion.button>
            </SheetTrigger>

            {/* RAW NEO-BRUTALIST SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[85vw] max-w-[300px] p-0 border-l-4 border-black bg-white shadow-[-10px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
                <SheetTitle className="sr-only">Menü</SheetTitle>

                <motion.div
                    className="flex flex-col h-full relative"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                >
                    {/* CROSS-HATCH PATTERN OVERLAY (Subtle) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
                    />

                    {/* HEADER */}
                    <div className="flex items-center justify-between p-5 border-b-4 border-black bg-white z-10">
                        <span className="text-xl font-black italic tracking-tighter text-black select-none">FIZIK<span className="text-[#FACC15] drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">HUB</span></span>
                        <SheetClose asChild>
                            <motion.button
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center w-8 h-8 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5 stroke-[3px]" />
                            </motion.button>
                        </SheetClose>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto z-10 scrollbar-hide bg-white">

                        {/* NAV ITEMS - HARD BLOCKS */}
                        <div className="flex flex-col">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div key={item.href} variants={itemVariants} className="w-full">
                                        <ViewTransitionLink
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center justify-between px-5 py-4 border-b-2 border-black",
                                                "transition-all duration-150",
                                                isActive ? "bg-black text-white" : `bg-white text-black hover:pl-8 ${item.color} ${item.text}`
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-lg font-black uppercase tracking-tight",
                                                    isActive ? "text-white" : "text-black group-hover:text-inherit"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            <item.icon className={cn(
                                                "w-5 h-5 stroke-[2.5px]",
                                                isActive ? "text-[#FACC15]" : "text-black group-hover:text-inherit"
                                            )} />
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER - RAW UTILITY */}
                    <motion.div
                        variants={itemVariants}
                        className="p-5 border-t-4 border-black bg-[#F5F5F5] z-10"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] active:shadow-none transition-all"
                            >
                                <User className="w-5 h-5 text-black stroke-[2.5px]" />
                                <span className="text-[11px] font-black text-black uppercase tracking-tight">Hesabım</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center gap-1 p-3 border-2 border-black bg-white shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] active:shadow-none transition-all"
                            >
                                <Settings className="w-5 h-5 text-black stroke-[2.5px]" />
                                <span className="text-[11px] font-black text-black uppercase tracking-tight">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="scale-95 origin-bottom">
                            {/* Override AuthButton internally or wrap it */}
                            <AuthButton />
                        </div>

                        {/* SOCIALS / INFO */}
                        <div className="flex justify-between items-center mt-5 pt-4 border-t-2 border-black/10 text-black">
                            <span className="text-[10px] font-black font-mono uppercase bg-black text-white px-1">v3.0 RAW</span>
                            <div className="flex gap-4 text-black">
                                <Twitter className="w-4 h-4 hover:scale-110 transition-transform cursor-pointer stroke-[2.5px]" />
                                <Github className="w-4 h-4 hover:scale-110 transition-transform cursor-pointer stroke-[2.5px]" />
                                <Globe className="w-4 h-4 hover:scale-110 transition-transform cursor-pointer stroke-[2.5px]" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
