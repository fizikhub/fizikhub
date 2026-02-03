"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Search, Zap, Menu, Compass, Trophy, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";

export function CompactDock() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Navigation Data
    const dockLinks = [
        { href: "/", icon: Home, label: "Ana" },
        { href: "/makale", icon: Compass, label: "Keşfet" },
        { href: "/ozel", icon: Zap, label: "Özel", isPrimary: true },
        { href: "/ara", icon: Search, label: "Ara" },
        { id: "menu", href: "#menu", icon: Menu, label: "Menü", isTrigger: true },
    ];

    const drawerLinks = [
        { href: "/blog", label: "Blog", icon: Compass },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    ];

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] md:hidden w-auto">
            {/* 
        NEO-CAPSULE DOCK (STEALTH LUXE)
        - Style: Matte Black, Gold Glow.
      */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-1 p-2 bg-[#050505]/90 backdrop-blur-md border border-[#FACC15]/20 rounded-full shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
            >

                {dockLinks.map((link) => {

                    // PRIMARY ACTION (Center - Floating)
                    if (link.isPrimary) {
                        return (
                            <motion.div
                                key={link.href}
                                className="mx-1"
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Link
                                    href={link.href}
                                    className="flex items-center justify-center w-12 h-12 bg-[#facc15] text-black rounded-full shadow-[0px_0px_15px_rgba(250,204,21,0.4)]"
                                >
                                    <link.icon className="w-6 h-6 stroke-[2.5px]" />
                                </Link>
                            </motion.div>
                        )
                    }

                    // MENU TRIGGER (Sheet)
                    if (link.isTrigger) {
                        return (
                            <Sheet key={link.id} open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <motion.button
                                        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <link.icon className="w-5 h-5 stroke-[2.5px]" />
                                    </motion.button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[75vh] bg-[#09090b] border-t-[2px] border-white/20 p-0 rounded-t-[32px] overflow-hidden">
                                    {/* Drawer Design */}
                                    <div className="flex flex-col h-full p-6">
                                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-8" />

                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            {drawerLinks.map((dLink) => (
                                                <Link
                                                    key={dLink.href}
                                                    href={dLink.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex flex-col items-center gap-3 p-4 bg-[#151515] border-[2px] border-white/5 rounded-2xl active:scale-95 transition-all hover:border-[#facc15]"
                                                >
                                                    <dLink.icon className="w-6 h-6 text-white" />
                                                    <span className="text-xs font-bold text-gray-400 uppercase">{dLink.label}</span>
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-auto bg-[#151515] p-5 rounded-2xl border-[2px] border-white/5">
                                            <AuthButton />
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )
                    }

                    // STANDARD NAVIGATION LINKS
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative flex items-center justify-center w-10 h-10 rounded-full transition-all",
                                isActive ? "text-[#facc15]" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <link.icon className={cn("w-5 h-5 stroke-[2.5px]")} />
                            {isActive && (
                                <motion.div
                                    layoutId="dock-dot"
                                    className="absolute -bottom-1 w-1 h-1 bg-[#facc15] rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
