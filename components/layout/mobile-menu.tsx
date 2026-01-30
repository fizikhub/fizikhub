"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
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
        { href: "/", label: "Ana Sayfa", icon: Home },
        { href: "/makale", label: "Keşfet", icon: Zap },
        { href: "/blog", label: "Blog", icon: BookOpen },
        { href: "/testler", label: "Testler", icon: FlaskConical },
        { href: "/siralamalar", label: "Lig", icon: Award },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
                        "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
                        "text-black active:translate-y-[2px] active:shadow-none transition-all"
                    )}
                >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            {/* GLASS MORPHIC SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[300px] p-0 border-l border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full relative">
                    {/* Noise Texture Overlay for that premium feel */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* 1. HEADER */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-black/5 relative z-10">
                        <span className="font-black text-xs uppercase tracking-widest text-black/50">MENÜ</span>
                        <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
                            <X className="w-5 h-5 text-black" />
                        </SheetClose>
                    </div>

                    {/* 2. GLASS LIST */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 relative z-10">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 h-12 w-full rounded-lg transition-all group",
                                        isActive
                                            ? "bg-black text-white shadow-lg"
                                            : "text-black hover:bg-white hover:shadow-md"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "w-4 h-4 stroke-[2.5px]",
                                            isActive ? "text-[#FFC800]" : "text-black/60 group-hover:text-black"
                                        )} />
                                        <span className="font-bold text-sm tracking-wide">
                                            {item.label}
                                        </span>
                                    </div>

                                    {isActive && <div className="w-1.5 h-1.5 bg-[#FFC800] rounded-full" />}
                                </ViewTransitionLink>
                            );
                        })}

                        {/* SEPARATOR */}
                        <div className="h-px w-full bg-black/5 my-4" />

                        {/* EXTRA */}
                        <ViewTransitionLink
                            href="/ozel"
                            className="flex items-center justify-between px-4 h-12 w-full rounded-lg bg-[#FFC800] text-black shadow-md hover:shadow-lg transition-all"
                        >
                            <span className="font-black text-xs uppercase tracking-wide flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-black" />
                                Özel İçerik
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </ViewTransitionLink>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-6 border-t border-black/5 relative z-10">
                        <div className="mb-6">
                            <AuthButton />
                        </div>

                        <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                            <div className="flex gap-4">
                                {[
                                    { icon: Github, href: "https://github.com/fizikhub" },
                                    { icon: Twitter, href: "#" },
                                    { icon: Instagram, href: "#" },
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:scale-110 transition-transform"
                                    >
                                        <social.icon className="w-4 h-4 text-black" />
                                    </a>
                                ))}
                            </div>
                            <span className="text-[10px] font-mono uppercase">v2.5</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
