"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Home, Zap, BookOpen, FlaskConical, Award, Github, Twitter, Instagram } from "lucide-react";
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
        { href: "/", label: "Ana Sayfa", icon: Home, color: "group-hover:text-white", hoverBg: "group-hover:bg-white/10", borderColor: "group-hover:border-white" },
        { href: "/makale", label: "Keşfet", icon: Zap, color: "group-hover:text-[#FFC800]", hoverBg: "group-hover:bg-[#FFC800]/10", borderColor: "group-hover:border-[#FFC800]" },
        { href: "/blog", label: "Blog", icon: BookOpen, color: "group-hover:text-cyan-400", hoverBg: "group-hover:bg-cyan-400/10", borderColor: "group-hover:border-cyan-400" },
        { href: "/testler", label: "Testler", icon: FlaskConical, color: "group-hover:text-purple-400", hoverBg: "group-hover:bg-purple-400/10", borderColor: "group-hover:border-purple-400" },
        { href: "/siralamalar", label: "Sıralamalar", icon: Award, color: "group-hover:text-pink-400", hoverBg: "group-hover:bg-pink-400/10", borderColor: "group-hover:border-pink-400" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#111] border-[2px] border-white/20 active:scale-95 transition-transform rounded-md group hover:border-[#FFC800]">
                    <Menu className="w-5 h-5 text-white group-hover:text-[#FFC800] transition-colors" />
                </button>
            </SheetTrigger>

            {/* DARK PREMIUM RIGHT SHEET */}
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 border-l border-white/10 bg-black overflow-hidden">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full bg-black">
                    {/* 1. HEADER */}
                    <div className="p-6 pt-8 pb-4 flex items-center justify-between">
                        {/* Logo Scale Fix */}
                        <div className="scale-90 origin-left invert brightness-0 grayscale-0 filter-none">
                            <DankLogo />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111] border border-white/10 hover:bg-white/10 hover:border-white/50 transition-all group"
                        >
                            <X className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* 2. MENU LIST */}
                    <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3">
                        {menuItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block group relative overflow-hidden",
                                        "bg-[#111] border border-white/10 rounded-xl",
                                        "transition-all duration-300",
                                        isActive ? "border-[#FFC800] bg-[#FFC800]/5" : "hover:border-white/30"
                                    )}
                                >
                                    <div className="p-5 flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center bg-black border border-white/5 transition-colors duration-300",
                                                isActive ? "text-[#FFC800] border-[#FFC800]/30" : "text-white/40",
                                                item.color,
                                                item.borderColor
                                            )}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <span className={cn(
                                                "text-lg font-bold tracking-wide uppercase transition-colors duration-300",
                                                isActive ? "text-white" : "text-white/60 group-hover:text-white"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>

                                        {/* Arrow */}
                                        <ArrowRight className={cn(
                                            "w-5 h-5 text-white/20 transition-all duration-300 -translate-x-2 opacity-0",
                                            "group-hover:translate-x-0 group-hover:opacity-100",
                                            isActive && "opacity-100 translate-x-0 text-[#FFC800]"
                                        )} />
                                    </div>

                                    {/* Hover Glow Background */}
                                    <div className={cn(
                                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none",
                                        item.hoverBg?.replace("group-hover:", "")
                                    )} />
                                </ViewTransitionLink>
                            );
                        })}
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-6 border-t border-white/10 bg-[#050505]">
                        <div className="mb-6">
                            <AuthButton />
                        </div>

                        {/* Social Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: Twitter, href: "#", bg: "hover:bg-blue-500/20 hover:text-blue-400" },
                                { icon: Github, href: "https://github.com/fizikhub", bg: "hover:bg-white/10 hover:text-white" },
                                { icon: Instagram, href: "#", bg: "hover:bg-pink-500/20 hover:text-pink-400" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        "h-12 flex items-center justify-center rounded-lg bg-[#111] border border-white/5 text-white/40 transition-all",
                                        social.bg
                                    )}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase">
                            <span>© 2026 FizikHub</span>
                            <span>v2.2.0-DARK</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
