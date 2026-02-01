"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Atom, StickyNote, Rocket, LogOut, Info } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home },
        { href: "/makale", label: "Makaleler", icon: BookOpen },
        { href: "/simulasyonlar", label: "Simülasyonlar", icon: Atom },
        { href: "/testler", label: "Sınav Merkezi", icon: FlaskConical },
        { href: "/notlar", label: "Ders Notları", icon: StickyNote },
        { href: "/siralamalar", label: "Sıralama", icon: Award },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex items-center justify-center w-10 h-10 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    )}
                >
                    <Menu className="w-5 h-5 stroke-[2.5px]" />
                </motion.button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[300px] sm:w-[340px] p-0 border-l-[4px] border-black bg-white overflow-hidden"
            >
                <SheetTitle className="sr-only">Navigasyon</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* BRAND HEADER - Sleek & High Contrast */}
                    <div className="bg-black text-white p-6 pt-10 border-b-[4px] border-black h-[140px] flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-1">
                            <Rocket className="w-6 h-6 text-[#FFD200]" />
                            <h2 className="font-black text-3xl tracking-tighter italic">FIZIKHUB</h2>
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Digital Learning Ecosystem</p>
                    </div>

                    {/* MENU LIST */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 h-14 w-full transition-all group",
                                            "border-[2.5px] border-transparent",
                                            isActive
                                                ? "bg-[#FFD200] border-black shadow-[4px_4px_0px_0px_#000]"
                                                : "hover:bg-neutral-50 hover:border-black/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon className={cn(
                                                "w-5 h-5 transition-transform group-hover:scale-110",
                                                isActive ? "stroke-[3px]" : "stroke-[2px] opacity-60"
                                            )} />
                                            <span className={cn(
                                                "font-black text-sm tracking-tight",
                                                isActive ? "text-black" : "text-neutral-700"
                                            )}>
                                                {item.label.toUpperCase()}
                                            </span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4" />}
                                    </ViewTransitionLink>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* FOOTER SECTION - Compact Utility Panel */}
                    <div className="p-4 bg-neutral-50 border-t-[4px] border-black space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex items-center gap-2 justify-center py-3 border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase">Profil</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex items-center gap-2 justify-center py-3 border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="pt-2">
                            <AuthButton />
                        </div>

                        <div className="flex justify-center pt-2">
                            <p className="text-[9px] font-bold text-neutral-400">© 2026 FIZIKHUB • v2.1.0</p>
                        </div>
                    </div>

                    {/* CUSTOM CLOSE BUTTON */}
                    <SheetClose className="absolute top-4 right-4 z-50">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 flex items-center justify-center bg-white border-[2px] border-black text-black shadow-[3px_3px_0px_0px_#000]"
                        >
                            <X className="w-6 h-6 stroke-[3px]" />
                        </motion.div>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    );
}
