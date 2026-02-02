"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote, ScanLine } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence, Variants } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "ANA_MODÜL", icon: Home },
        { href: "/makale", label: "VERİ_AKISI", icon: Zap },
        { href: "/simulasyonlar", label: "SİMÜLASYON", icon: Atom },
        { href: "/notlar", label: "HAFIZA_BANKASI", icon: StickyNote },
        { href: "/blog", label: "GÜNLÜK", icon: BookOpen },
        { href: "/testler", label: "SİSTEM_TESTİ", icon: FlaskConical },
        { href: "/siralamalar", label: "SIRALAMA", icon: Award },
    ];

    // HOLOGRAPHIC REVEAL VARIANTS (Retro-Future HUD)
    const holoContainer: Variants = {
        hidden: {
            scaleY: 0,
            opacity: 0,
            filter: "brightness(0.5) blur(5px)",
            transformOrigin: "top"
        },
        visible: {
            scaleY: 1,
            opacity: 1,
            filter: ["brightness(2) blur(2px)", "brightness(1) blur(0px)"], // Flash effect
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 0.4
            }
        },
        exit: {
            scaleY: 0,
            opacity: 0,
            filter: "brightness(0.5) blur(5px)",
            transition: { duration: 0.2 }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[36px] h-[36px]",
                        "bg-black border-[2px] border-white shadow-[0px_0px_5px_rgba(255,255,255,0.3)]",
                        "text-white active:bg-white active:text-black transition-all font-mono"
                    )}
                >
                    <Menu className="w-5 h-5 stroke-[2px]" />
                </button>
            </SheetTrigger>

            {/* HUD SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] p-0 border-l-[2px] border-[#FFC800] bg-[#0a0a0a] overflow-hidden sm:max-w-none transition-none data-[state=open]:duration-0"
            >
                <SheetTitle className="sr-only">Sistem Menüsü</SheetTitle>

                {/* ANIMATED HOLOGRAPHIC WRAPPER */}
                <motion.div
                    className="flex flex-col h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(20,20,20,1))]"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={holoContainer}
                >
                    {/* TOP STATUS BAR */}
                    <div className="p-2 border-b border-gray-800 flex justify-between items-center text-[10px] font-mono text-[#FFC800] tracking-widest opacity-70">
                        <span>SYS_READY</span>
                        <span>V.3.4</span>
                    </div>

                    {/* PRIMARY ACTION */}
                    <div className="p-3 pb-0">
                        <ViewTransitionLink
                            href="/ozel"
                            className={cn(
                                "flex items-center justify-between w-full p-4 mb-2",
                                "bg-[#FFC800]/10 border-[1px] border-[#FFC800] text-[#FFC800]",
                                "hover:bg-[#FFC800] hover:text-black transition-all"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5" />
                                <span className="font-mono font-bold text-sm tracking-wider">PREMIUM_ERİŞİM</span>
                            </div>
                            <ScanLine className="w-5 h-5" />
                        </ViewTransitionLink>
                    </div>

                    {/* LIST MENU ITEMS - Monospace & Tech */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-3 h-12 w-full",
                                        "border-[1px] border-transparent font-mono",
                                        "transition-all duration-200",
                                        isActive
                                            ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]"
                                            : "hover:border-gray-600 hover:bg-gray-900 text-gray-400"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 stroke-[2px]" />
                                        <span className="font-bold text-xs tracking-widest">{item.label}</span>
                                    </div>

                                    {isActive && <div className="w-1.5 h-1.5 bg-[#3B82F6] animate-pulse" />}
                                </ViewTransitionLink>
                            );
                        })}
                    </div>

                    {/* BOTTOM STATS */}
                    <div className="p-3 border-t border-gray-800 bg-black mt-auto">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center p-2 border border-gray-800 bg-black hover:border-[#FFC800] hover:text-[#FFC800] text-gray-500 transition-colors"
                            >
                                <User className="w-5 h-5 mb-1" />
                                <span className="text-[9px] font-mono tracking-widest">KİMLİK</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center p-2 border border-gray-800 bg-black hover:border-[#FFC800] hover:text-[#FFC800] text-gray-500 transition-colors"
                            >
                                <Settings className="w-5 h-5 mb-1" />
                                <span className="text-[9px] font-mono tracking-widest">AYARLAR</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="pt-1">
                            <AuthButton />
                        </div>
                    </div>

                    {/* CLOSE BUTTON */}
                    <SheetClose className="absolute top-3 right-3 z-50">
                        <div className="flex items-center justify-center w-6 h-6 bg-transparent border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500 hover:rotate-90 transition-all">
                            <X className="w-4 h-4" />
                        </div>
                    </SheetClose>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
