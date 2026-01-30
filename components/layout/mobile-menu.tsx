"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, Github, Twitter, LogOut } from "lucide-react";
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
        { href: "/siralamalar", label: "Sıralama", icon: Award },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className={cn(
                        "flex items-center justify-center w-[32px] h-[32px] sm:w-10 sm:h-10",
                        "bg-[#111] border-[1px] border-white/20 rounded-md",
                        "text-white active:scale-95 transition-all"
                    )}
                >
                    <Menu className="w-5 h-5" />
                </button>
            </SheetTrigger>

            {/* MICRO DRAWER: Fixed 240px, Dark Theme */}
            <SheetContent side="right" className="w-[240px] !max-w-[240px] p-0 border-l border-white/10 bg-[#0A0A0A] overflow-hidden">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* 1. COMPACT HEADER */}
                    <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
                        <span className="font-bold text-sm text-white tracking-widest uppercase">MENÜ</span>
                        <SheetClose className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <X className="w-4 h-4 text-neutral-400" />
                        </SheetClose>
                    </div>

                    {/* 2. MICRO MENU LIST */}
                    <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 h-10 w-full rounded-md transition-all text-sm group",
                                        isActive
                                            ? "bg-white/10 text-[#FFC800] font-bold"
                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-4 h-4",
                                        isActive ? "text-[#FFC800]" : "text-neutral-500 group-hover:text-white"
                                    )} />
                                    <span>{item.label}</span>
                                </ViewTransitionLink>
                            );
                        })}

                        <div className="h-px bg-white/10 my-3 mx-2" />

                        <ViewTransitionLink
                            href="/ozel"
                            className="flex items-center gap-3 px-3 h-10 w-full rounded-md text-sm text-[#FFC800] hover:bg-[#FFC800]/10 transition-all font-medium"
                        >
                            <Zap className="w-4 h-4 fill-[#FFC800]" />
                            <span>Özel İçerik</span>
                        </ViewTransitionLink>
                    </div>

                    {/* 3. FOOTER */}
                    <div className="p-4 border-t border-white/10 space-y-4">
                        <div className="flex justify-center gap-4">
                            {[
                                { icon: Github, href: "https://github.com/fizikhub" },
                                { icon: Twitter, href: "#" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-neutral-500 hover:text-white transition-colors"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        <div className="scale-90 origin-bottom">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
