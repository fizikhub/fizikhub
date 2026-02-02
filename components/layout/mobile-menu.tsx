"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote, Sparkles } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home, color: "bg-blue-100" },
        { href: "/makale", label: "Keşfet", icon: Zap, color: "bg-yellow-100" },
        { href: "/simulasyonlar", label: "Simülasyonlar", icon: Atom, color: "bg-green-100" },
        { href: "/notlar", label: "Notlarım", icon: StickyNote, color: "bg-purple-100" },
        { href: "/blog", label: "Blog", icon: BookOpen, color: "bg-pink-100" },
        { href: "/testler", label: "Testler", icon: FlaskConical, color: "bg-orange-100" },
        { href: "/siralamalar", label: "Lig", icon: Award, color: "bg-red-100" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { x: 50, opacity: 0 },
        show: { x: 0, opacity: 1 }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
                        "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
                        "text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all",
                        "md:hidden"
                    )}
                >
                    <Menu className="w-5 h-5 stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            {/* FULL WIDTH / WIDE DRAWER STYLE */}
            <SheetContent
                side="right"
                className="w-[85vw] sm:w-[380px] p-0 border-l-[3px] border-black bg-[#F3F4F6] overflow-hidden"
            >
                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>

                <div className="flex flex-col h-full relative">
                    {/* Header with Pattern */}
                    <div className="h-24 bg-black relative overflow-hidden flex items-center px-6 border-b-[3px] border-black text-white shrink-0">
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                        />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black italic tracking-tighter">MENÜ</h2>
                            <p className="text-xs font-mono opacity-80">FizikHub v2.0</p>
                        </div>

                        <SheetClose className="absolute top-4 right-4 z-20">
                            <div className="flex items-center justify-center w-8 h-8 bg-white border-[2px] border-black text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                                <X className="w-5 h-5 stroke-[3px]" />
                            </div>
                        </SheetClose>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-4 bg-[url('/grid.svg')]">

                        {/* SPECIAL OFFER CARD */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ViewTransitionLink
                                href="/ozel"
                                className={cn(
                                    "group relative flex items-center justify-between w-full p-4 overflow-hidden",
                                    "bg-[#FFC800] border-[2px] border-black shadow-[4px_4px_0px_0px_#000]",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000] transition-all"
                                )}
                            >
                                {/* Background decoration */}
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-500" />

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="flex items-center justify-center w-10 h-10 bg-black text-[#FFC800] border-[2px] border-black shadow-sm">
                                        <Crown className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-black text-base uppercase tracking-tight text-black leading-none">Özel İçerik</span>
                                        <span className="text-[10px] font-bold text-black/80 mt-1">Premium Deneyim</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 stroke-[3px] text-black relative z-10 group-hover:translate-x-1 transition-transform" />
                            </ViewTransitionLink>
                        </motion.div>

                        {/* NAV ITEMS GRID/LIST */}
                        <motion.div
                            className="space-y-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div key={item.href} variants={itemVariants}>
                                        <ViewTransitionLink
                                            href={item.href}
                                            className={cn(
                                                "flex items-center px-4 h-14 w-full relative overflow-hidden",
                                                "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000]",
                                                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all",
                                                isActive && "bg-[#3B82F6] text-white"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute inset-y-0 left-0 w-1.5",
                                                isActive ? "bg-white" : "bg-transparent group-hover:bg-black"
                                            )} />

                                            <div className="flex items-center gap-4 ml-1">
                                                <item.icon className={cn(
                                                    "w-5 h-5 stroke-[2.5px]",
                                                    isActive ? "text-white" : "text-black"
                                                )} />
                                                <span className={cn(
                                                    "font-bold text-lg tracking-tight",
                                                    isActive ? "text-white" : "text-black"
                                                )}>{item.label}</span>
                                            </div>

                                            {item.label === "Lig" && (
                                                <span className="ml-auto text-[10px] font-black uppercase bg-[#FF4444] text-white px-1.5 py-0.5 border border-black -rotate-2">
                                                    YENİ
                                                </span>
                                            )}
                                        </ViewTransitionLink>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-4 bg-white border-t-[3px] border-black shrink-0 z-10">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center p-3 border-[2px] border-black bg-neutral-100 hover:bg-neutral-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                                <User className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-black uppercase">Fizikçi Kartı</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center p-3 border-[2px] border-black bg-neutral-100 hover:bg-neutral-200 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                                <Settings className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-black uppercase">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>
                        <div className="w-full">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
