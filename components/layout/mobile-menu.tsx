"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";

export function MobileMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset" };
    }, [isOpen]);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "bg-blue-400" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "bg-purple-400" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, color: "bg-green-400" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, color: "bg-orange-400" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "bg-pink-400" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, color: "bg-red-400" },
        { href: "/siralamalar", label: "LİG", icon: Award, color: "bg-yellow-400" },
    ];

    const overlayVariants: Variants = {
        closed: { opacity: 0 },
        open: { opacity: 1 }
    };

    const drawerVariants: Variants = {
        closed: { x: "100%" },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        }
    };

    const itemVariants: Variants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return (
        <>
            {/* TRIGGER BUTTON - POP STYLE */}
            <button
                onClick={() => setIsOpen(true)}
                className="
                    flex items-center justify-center 
                    w-[42px] h-[42px] 
                    bg-white text-black 
                    border-2 border-black 
                    shadow-[3px_3px_0px_#000000] 
                    active:translate-y-1 active:shadow-none 
                    transition-all
                    cursor-pointer
                "
            >
                <Menu className="w-6 h-6 stroke-[3px]" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                        />

                        {/* DRAWER */}
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={drawerVariants}
                            className="
                                fixed top-0 right-0 bottom-0 z-[100]
                                w-[85vw] max-w-[380px]
                                bg-[#FACC15] 
                                border-l-[4px] border-black
                                flex flex-col
                                shadow-[-10px_0px_30px_rgba(0,0,0,0.5)]
                            "
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between p-6 border-b-[3px] border-black bg-white">
                                <span className="text-2xl font-black italic tracking-tighter transform -skew-x-6">
                                    MENÜ
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="
                                        w-10 h-10 
                                        bg-red-500 text-white 
                                        border-2 border-black 
                                        flex items-center justify-center
                                        shadow-[3px_3px_0px_#000]
                                        active:shadow-none active:translate-x-[3px] active:translate-y-[3px]
                                        transition-all
                                    "
                                >
                                    <X className="w-6 h-6 stroke-[3px]" />
                                </button>
                            </div>

                            {/* SCROLLABLE CONTENT */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FACC15]">
                                <motion.div
                                    className="flex flex-col gap-3"
                                    initial="closed"
                                    animate="open"
                                    transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                                >
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div key={item.href} variants={itemVariants}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group relative flex items-center justify-between p-4",
                                                        "bg-white border-[3px] border-black",
                                                        "shadow-[4px_4px_0px_#000]",
                                                        "transition-all active:translate-y-1 active:shadow-none",
                                                        isActive && "bg-black text-white"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center",
                                                            item.color,
                                                            isActive && "border-white"
                                                        )}>
                                                            <item.icon className={cn("w-5 h-5 text-black stroke-[2.5px]")} />
                                                        </div>
                                                        <span className="font-bold text-lg tracking-tight uppercase">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full border border-black",
                                                        isActive ? "bg-[#FACC15]" : "bg-black"
                                                    )} />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* UTILS SECTION */}
                                <div className="mt-8 pt-6 border-t-[3px] border-black border-dashed">
                                    <h3 className="text-black font-black text-sm uppercase mb-4 opacity-60">Hesap</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/profil" className="
                                            flex flex-col items-center justify-center gap-2 p-3
                                            bg-white border-2 border-black shadow-[3px_3px_0px_#000]
                                            active:shadow-none active:translate-y-0.5 transition-all
                                        ">
                                            <User className="w-6 h-6 stroke-[2px]" />
                                            <span className="font-bold text-xs uppercase">Profil</span>
                                        </Link>
                                        <Link href="/ayarlar" className="
                                            flex flex-col items-center justify-center gap-2 p-3
                                            bg-white border-2 border-black shadow-[3px_3px_0px_#000]
                                            active:shadow-none active:translate-y-0.5 transition-all
                                        ">
                                            <Settings className="w-6 h-6 stroke-[2px]" />
                                            <span className="font-bold text-xs uppercase">Ayarlar</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="p-4 bg-black text-white border-t-[3px] border-black flex justify-between items-center">
                                <span className="font-bold text-sm tracking-wide text-[#FACC15]">FIZIKHUB v2.0</span>
                                <div className="flex gap-4">
                                    <Twitter className="w-5 h-5 hover:text-[#FACC15] transition-colors cursor-pointer" />
                                    <Github className="w-5 h-5 hover:text-[#FACC15] transition-colors cursor-pointer" />
                                    <Globe className="w-5 h-5 hover:text-[#FACC15] transition-colors cursor-pointer" />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
