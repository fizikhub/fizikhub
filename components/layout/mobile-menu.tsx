"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote, Twitter, Instagram, Github, Rocket } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, color: "#3B82F6", size: "col-span-2 row-span-1" },
        { href: "/makale", label: "KEŞFET", icon: Zap, color: "#FFD200", size: "col-span-1 row-span-2" },
        { href: "/simulasyonlar", label: "LAB", icon: FlaskConical, color: "#EF4444", size: "col-span-1 row-span-1" },
        { href: "/testler", label: "SINAV", icon: Award, color: "#10B981", size: "col-span-1 row-span-1" },
        { href: "/notlar", label: "NOTLAR", icon: StickyNote, color: "#8B5CF6", size: "col-span-1 row-span-1" },
        { href: "/blog", label: "BLOG", icon: BookOpen, color: "#F97316", size: "col-span-2 row-span-1" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                        "flex items-center justify-center w-11 h-11",
                        "bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000]",
                        "text-black active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    )}
                >
                    <div className="flex flex-col gap-1.5 px-2">
                        <div className="w-6 h-[3px] bg-black" />
                        <div className="w-4 h-[3px] bg-black self-end" />
                        <div className="w-6 h-[3px] bg-black" />
                    </div>
                </motion.button>
            </SheetTrigger>

            <SheetContent
                side="bottom"
                className="h-[100dvh] w-full p-0 border-t-[5px] border-black bg-black overflow-hidden"
            >
                <SheetTitle className="sr-only">Navigasyon</SheetTitle>

                <div className="flex flex-col h-full bg-white">
                    {/* FULLSCREEN GRID LAYOUT */}
                    <div className="flex-1 grid grid-cols-2 grid-rows-[repeat(4,1fr)] gap-0 border-b-[4px] border-black">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                                    className={cn(
                                        "relative border-[2px] border-black flex flex-col items-center justify-center text-center p-4 group cursor-pointer overflow-hidden",
                                        item.size,
                                        isActive ? "z-10" : "z-0"
                                    )}
                                    style={{ backgroundColor: isActive ? item.color : 'white' }}
                                >
                                    <ViewTransitionLink href={item.href} className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            className={cn(
                                                "mb-2 p-3 rounded-none border-[2px] border-black shadow-[3px_3px_0px_0px_#000]",
                                                isActive ? "bg-white text-black" : "bg-black text-white"
                                            )}
                                            style={{ backgroundColor: !isActive ? item.color : 'white' }}
                                        >
                                            <item.icon className="w-8 h-8 stroke-[2.5px]" />
                                        </motion.div>
                                        <span className={cn(
                                            "font-black text-xs sm:text-sm tracking-tighter uppercase",
                                            isActive ? "text-black bg-white px-2" : "text-black"
                                        )}>
                                            {item.label}
                                        </span>
                                    </ViewTransitionLink>

                                    {/* Deco Text */}
                                    <div className="absolute top-1 right-1 opacity-10 font-black text-[30px] select-none pointer-events-none italic">
                                        {index + 1}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* FOOTER AREA */}
                    <div className="h-[180px] bg-[#FFD200] border-black flex flex-col p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-black/10" />

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col font-black italic text-2xl leading-none">
                                <span>FIZIK</span>
                                <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">HUB</span>
                            </div>
                            <ViewTransitionLink href="/ozel" className="bg-black text-white px-4 py-2 font-black text-[10px] sm:text-xs uppercase border-[2px] border-black shadow-[3px_3px_0px_0px_#3B82F6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                <Crown className="inline w-3 h-3 mr-2 fill-white" />
                                PREMİUM'A GEÇ
                            </ViewTransitionLink>
                        </div>

                        <div className="flex items-center gap-4 mt-auto">
                            <div className="flex-1">
                                <AuthButton />
                            </div>
                            <div className="flex gap-2">
                                <ViewTransitionLink href="/ayarlar" className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                    <Settings className="w-5 h-5" />
                                </ViewTransitionLink>
                                <ViewTransitionLink href="/profil" className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                    <User className="w-5 h-5" />
                                </ViewTransitionLink>
                            </div>
                        </div>
                    </div>

                    {/* CLOSE BUTTON - OVERLAY TOP */}
                    <SheetClose className="absolute top-[2px] right-[2px] z-[100]">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="bg-black text-white p-3 border-l-[3px] border-b-[3px] border-white shadow-[-4px_4px_20px_rgba(0,0,0,0.5)]"
                        >
                            <X className="w-8 h-8 stroke-[4px]" />
                        </motion.div>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
}
