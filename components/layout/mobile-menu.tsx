"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Home, Zap, BookOpen, FlaskConical, Award } from "lucide-react";
import { DankLogo } from "@/components/brand/dank-logo";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { href: "/", label: "Ana Sayfa", icon: Home, bg: "bg-white", activeBg: "bg-black", activeText: "text-white" },
        { href: "/makale", label: "Keşfet", icon: Zap, bg: "bg-[#FFC800]", activeBg: "bg-[#e5b300]", activeText: "text-black" },
        { href: "/blog", label: "Blog", icon: BookOpen, bg: "bg-[#3B82F6]", activeBg: "bg-[#2563eb]", activeText: "text-white" },
        { href: "/testler", label: "Testler", icon: FlaskConical, bg: "bg-[#A855F7]", activeBg: "bg-[#9333ea]", activeText: "text-white" },
        { href: "/siralamalar", label: "Sıralamalar", icon: Award, bg: "bg-[#EC4899]", activeBg: "bg-[#db2777]", activeText: "text-white" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#FFC800] border-[3px] border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all rounded-none group hover:bg-[#ffd633]">
                    <Menu className="w-6 h-6 text-black stroke-[3px]" />
                </button>
            </SheetTrigger>

            {/* RIGHT SIDE SHEET - CLEAN NEO-BRUTALIST */}
            <SheetContent side="right" className="w-[85vw] sm:w-[380px] p-0 border-l-[4px] border-black bg-[#F0F0F0] overflow-hidden rounded-l-[0px]">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* HEADER */}
                    <div className="p-6 border-b-[4px] border-black bg-white flex items-center justify-between">
                        <div className="scale-100">
                            <DankLogo />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 flex items-center justify-center bg-[#FF4D4D] border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#ff3333]"
                        >
                            <X className="w-6 h-6 text-black stroke-[3px]" />
                        </button>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dots-pattern">
                        {/* Menu Grid */}
                        <div className="grid gap-4">
                            {menuItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <ViewTransitionLink
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-5 py-5 border-[3px] border-black shadow-[4px_4px_0px_#000] transition-all duration-200 group relative overflow-hidden",
                                            isActive ? "translate-x-[2px] translate-y-[2px] shadow-none" : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]",
                                            item.bg,
                                            isActive && "bg-black"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <item.icon className={cn(
                                                "w-6 h-6 stroke-[2.5px]",
                                                isActive ? "text-white" : "text-black"
                                            )} />
                                            <span className={cn(
                                                "text-lg font-black uppercase tracking-wide",
                                                isActive ? "text-white" : "text-black"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        <ArrowRight className={cn(
                                            "w-6 h-6 stroke-[3px] transition-transform duration-300 group-hover:translate-x-1",
                                            isActive ? "text-white" : "text-black"
                                        )} />
                                    </ViewTransitionLink>
                                );
                            })}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 border-t-[4px] border-black bg-white">
                        <div className="mb-6">
                            <AuthButton />
                        </div>

                        {/* Social / Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t-[2px] border-black/10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-neutral-400">Versiyon</span>
                                <span className="text-xs font-bold font-mono">v2.1.0</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-neutral-400">Tasarım</span>
                                <span className="text-xs font-bold">NEO-BRUTAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
