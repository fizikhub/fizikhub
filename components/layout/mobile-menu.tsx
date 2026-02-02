"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, ChevronRight, Crown, Atom, StickyNote } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { motion, AnimatePresence, Variants } from "framer-motion";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home },
        { href: "/makale", label: "Keşfet", icon: Zap },
        { href: "/simulasyonlar", label: "Simülasyonlar", icon: Atom },
        { href: "/notlar", label: "Notlarım", icon: StickyNote },
        { href: "/blog", label: "Blog", icon: BookOpen },
        { href: "/testler", label: "Testler", icon: FlaskConical },
        { href: "/siralamalar", label: "Lig", icon: Award },
    ];

    // FLUID REVEAL VARIANTS (Living Lab)
    const fluidContainer: Variants = {
        hidden: {
            clipPath: "circle(0% at 100% 0)",
            opacity: 0
        },
        visible: {
            clipPath: "circle(150% at 100% 0)",
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 40,
                damping: 10
            }
        },
        exit: {
            clipPath: "circle(0% at 100% 0)",
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 40,
                damping: 10
            }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
                        "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
                        "text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    )}
                >
                    <Menu className="w-5 h-5 stroke-[3px]" />
                </button>
            </SheetTrigger>

            {/* COMPACT NEO-BRUTALIST SIDE DRAWER */}
            <SheetContent
                side="right"
                // Override default animation with our custom glitch container logic if possible, 
                // but standard sheet has safe-guards. We'll animate the INNER content.
                className="w-[280px] sm:w-[320px] p-0 border-l-[3px] border-black bg-white overflow-hidden sm:max-w-none transition-none data-[state=open]:duration-0"
            >
                <SheetTitle className="sr-only">Menü</SheetTitle>

                {/* ANIMATED GLITCH WRAPPER */}
                <motion.div
                    className="flex flex-col h-full bg-[#F3F4F6]"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fluidContainer}
                >
                    {/* PRIMARY ACTION - Top Banner Style */}
                    <div className="p-3 pb-0">
                        <ViewTransitionLink
                            href="/ozel"
                            className={cn(
                                "flex items-center justify-between w-full p-4 mb-2",
                                "bg-[#FFC800] border-[2px] border-black shadow-[3px_3px_0px_0px_#000]",
                                "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5 fill-black stroke-[2.5px]" />
                                <span className="font-black text-sm uppercase tracking-wide text-black">Özel İçerik</span>
                            </div>
                            <ChevronRight className="w-5 h-5 stroke-[3px]" />
                        </ViewTransitionLink>
                    </div>

                    {/* LIST MENU ITEMS - Compact & Bold */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;

                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-3 h-12 w-full",
                                        "bg-white border-[2px] border-black",
                                        "transition-all duration-200",
                                        isActive
                                            ? "border-l-[6px] border-l-[#3B82F6]"
                                            : "hover:pl-4",
                                        "shadow-none active:bg-neutral-100"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "w-5 h-5 stroke-[2.5px]",
                                            isActive ? "text-[#3B82F6] fill-current" : "text-neutral-900"
                                            // V2: Icons are bolder (stroke 2.5) and darker (neutral-900)
                                        )} />
                                        <span className={cn(
                                            "font-bold text-sm tracking-tight",
                                            isActive ? "text-black" : "text-neutral-800"
                                        )}>{item.label}</span>
                                    </div>

                                    {isActive && <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
                                </ViewTransitionLink>
                            );
                        })}
                    </div>

                    {/* BOTTOM ACTIONS */}
                    <div className="p-3 border-t-[2px] border-black bg-white mt-auto">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <ViewTransitionLink
                                href="/profil"
                                className="flex flex-col items-center justify-center p-2 border-[2px] border-black bg-white hover:bg-neutral-50 transition-colors"
                            >
                                <User className="w-5 h-5 mb-1 stroke-[2.5px]" />
                                <span className="text-[10px] font-bold uppercase">Hesabım</span>
                            </ViewTransitionLink>
                            <ViewTransitionLink
                                href="/ayarlar"
                                className="flex flex-col items-center justify-center p-2 border-[2px] border-black bg-white hover:bg-neutral-50 transition-colors"
                            >
                                <Settings className="w-5 h-5 mb-1 stroke-[2.5px]" />
                                <span className="text-[10px] font-bold uppercase">Ayarlar</span>
                            </ViewTransitionLink>
                        </div>

                        <div className="pt-1">
                            <AuthButton />
                        </div>
                    </div>

                    {/* CLOSE BUTTON - Absolute, now integrated into the glitching container */}
                    <SheetClose className="absolute top-2 right-2 z-50">
                        <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full shadow-lg active:scale-95 transition-transform hover:rotate-90">
                            <X className="w-4 h-4 text-white stroke-[3px]" />
                        </div>
                    </SheetClose>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
}
