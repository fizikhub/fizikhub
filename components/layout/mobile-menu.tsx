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
                        "bg-[#111] border-[2px] border-black shadow-[2px_2px_0px_0px_#000]",
                        "text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    )}
                >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            {/* COMPACT YELLOW SHEET */}
            <SheetContent side="right" className="w-[80vw] sm:w-[320px] p-0 border-l-[4px] border-black bg-[#FFC800] overflow-hidden">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* 1. HEADER (Minimal) */}
                    <div className="h-16 flex items-center justify-between px-5 pt-4">
                        <div className="scale-90 origin-left">
                            {/* Logo logic: DankLogo usually has white text, might need wrapping or specific usage */}
                            <div className="bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                                <span className="font-black text-lg tracking-tighter">FIZIKHUB</span>
                            </div>
                        </div>
                        <SheetClose className="w-10 h-10 flex items-center justify-center bg-black text-white border-[2px] border-black shadow-[3px_3px_0px_0px_white] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                            <X className="w-5 h-5 stroke-[3px]" />
                        </SheetClose>
                    </div>

                    {/* 2. MENU LIST (High Contrast) */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 h-14 w-full",
                                        "border-[3px] border-black transition-all group",
                                        isActive
                                            ? "bg-black text-[#FFC800] shadow-none translate-x-[2px] translate-y-[2px]"
                                            : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn(
                                            "w-5 h-5 stroke-[2.5px]",
                                            isActive ? "text-[#FFC800]" : "text-black"
                                        )} />
                                        <span className="font-black text-base uppercase tracking-wide">
                                            {item.label}
                                        </span>
                                    </div>

                                    {isActive && <ArrowRight className="w-5 h-5" />}
                                </ViewTransitionLink>
                            );
                        })}

                        {/* SEPARATOR */}
                        <div className="h-[3px] w-full bg-black my-4 opacity-20" />

                        {/* EXTRA */}
                        <ViewTransitionLink
                            href="/ozel"
                            className="flex items-center justify-between px-4 h-12 w-full border-[3px] border-black bg-black text-white shadow-[4px_4px_0px_0px_white] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                        >
                            <span className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                                <Zap className="w-4 h-4 fill-[#FFC800] text-[#FFC800]" />
                                Özel İçerik
                            </span>
                        </ViewTransitionLink>
                    </div>

                    {/* 3. FOOTER (Integrated) */}
                    <div className="p-5 pb-8 border-t-[4px] border-black bg-white">
                        <div className="mb-5">
                            <AuthButton />
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex gap-2">
                                {[
                                    { icon: Github, href: "https://github.com/fizikhub" },
                                    { icon: Twitter, href: "#" },
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 flex items-center justify-center border-[2px] border-black bg-[#FFC800] hover:bg-black hover:text-white transition-colors"
                                    >
                                        <social.icon className="w-5 h-5 stroke-[2px]" />
                                    </a>
                                ))}
                            </div>
                            <span className="text-xs font-black rotate-[-2deg] bg-black text-white px-2 py-1">v2.4</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
