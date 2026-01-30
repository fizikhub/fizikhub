"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Home, Zap, BookOpen, FlaskConical, Award, Github, Twitter, Instagram, ExternalLink } from "lucide-react";
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
        { href: "/siralamalar", label: "Lig", icon: Award, bg: "bg-[#EC4899]", activeBg: "bg-[#db2777]", activeText: "text-white" },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
                        "bg-[#111] border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
                        "text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    )}
                >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            {/* INTEGRATED NEO-BRUTALIST SHEET */}
            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0 border-l-[3px] border-black bg-[#F8F8F8] overflow-hidden">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* 1. COMPACT HEADER */}
                    <div className="h-14 sm:h-16 border-b-[3px] border-black bg-[#3B82F6] flex items-center justify-between px-4">
                        <div className="scale-90 origin-left">
                            <DankLogo />
                        </div>
                        <SheetClose className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                            <X className="w-4 h-4 text-black stroke-[3px]" />
                        </SheetClose>
                    </div>

                    {/* 2. DENSE MENU LIST */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 h-12 w-full",
                                        "border-[2px] border-black transition-all group",
                                        isActive
                                            ? "bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]"
                                            : "bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "w-4 h-4 stroke-[2.5px]",
                                            isActive ? "text-[#FFC800]" : "text-black group-hover:text-black"
                                        )} />
                                        <span className="font-black text-sm uppercase tracking-wide">
                                            {item.label}
                                        </span>
                                    </div>

                                    {isActive && <div className="w-1.5 h-1.5 bg-[#FFC800] rounded-full animate-pulse" />}
                                </ViewTransitionLink>
                            );
                        })}

                        {/* SEPARATOR */}
                        <div className="h-px w-full bg-black/10 my-2" />

                        {/* EXTRA LINKS */}
                        <ViewTransitionLink
                            href="/ozel"
                            className="flex items-center justify-between px-4 h-10 w-full border-[2px] border-black bg-[#FFC800] text-black shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
                        >
                            <span className="font-black text-xs uppercase tracking-wide flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 fill-black" />
                                Özel İçerik
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                        </ViewTransitionLink>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-4 border-t-[3px] border-black bg-white">
                        <div className="mb-4">
                            <AuthButton />
                        </div>

                        {/* Social Mini-Grid */}
                        <div className="flex items-center justify-center gap-3 pt-2">
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
                                    className="w-8 h-8 flex items-center justify-center border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all hover:bg-neutral-100"
                                >
                                    <social.icon className="w-4 h-4 text-black stroke-[2px]" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-[10px] font-black uppercase text-neutral-400">v2.3.0 • FIZIKHUB</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
