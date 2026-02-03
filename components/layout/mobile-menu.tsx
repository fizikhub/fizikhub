"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award, User, Settings, Twitter, Github, Globe, Atom, StickyNote, ChevronRight, Terminal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Starfield } from "@/components/ui/starfield";

export function MobileMenu() {
    const pathname = usePathname();

    // STRICT BRUTALIST DATA
    const menuItems = [
        { href: "/", label: "ANA SAYFA", icon: Home, code: "01" },
        { href: "/makale", label: "KEŞFET", icon: Zap, code: "02" },
        { href: "/simulasyonlar", label: "SİMÜLASYONLAR", icon: Atom, code: "03" },
        { href: "/notlar", label: "NOTLARIM", icon: StickyNote, code: "04" },
        { href: "/blog", label: "BLOG", icon: BookOpen, code: "05" },
        { href: "/testler", label: "TESTLER", icon: FlaskConical, code: "06" },
        { href: "/siralamalar", label: "LİG", icon: Award, code: "07" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {/* TRIGGER - Hard Square Brutalist */}
                <div
                    className="flex items-center justify-center w-[30px] h-[30px] min-w-[30px] min-h-[30px] bg-black border border-white rounded-none cursor-pointer hover:bg-white hover:text-black transition-colors"
                >
                    <Menu className="w-4 h-4 stroke-[2px]" />
                </div>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[85vw] max-w-[320px] p-0 border-l border-white bg-black text-white gap-0 flex flex-col overflow-hidden rounded-none data-[state=open]:duration-300"
            >
                {/* BACKGROUND: Static Deep Space (No clutter) */}
                <div className="absolute inset-0 z-0 bg-[#000000] pointer-events-none opacity-50">
                    <Starfield count={200} speed={0.1} starColor="#333333" />
                </div>

                <SheetHeader className="sr-only">
                    <SheetTitle>FizikHub Terminal</SheetTitle>
                    <SheetDescription>Sistem Navigasyonu</SheetDescription>
                </SheetHeader>

                {/* 1. HEADER: System Bar */}
                <div className="relative z-20 flex-none flex items-center justify-between p-0 border-b border-white bg-black">
                    <div className="flex items-center gap-2 px-4 py-4">
                        <Terminal className="w-4 h-4 text-[#FACC15]" />
                        <span className="font-mono text-sm font-bold tracking-tighter text-white select-none">
                            FIZIKHUB<span className="text-[#FACC15] animate-pulse">_OS</span>
                        </span>
                    </div>
                    <SheetClose asChild>
                        <div className="flex items-center justify-center w-12 h-full border-l border-white bg-black text-white hover:bg-[#FACC15] hover:text-black transition-colors cursor-pointer rounded-none self-stretch">
                            <X className="w-5 h-5 stroke-[2px]" />
                        </div>
                    </SheetClose>
                </div>

                {/* 2. MENU ITEMS: Grid List */}
                <div className="relative z-20 flex-1 overflow-y-auto bg-black">
                    <div className="flex flex-col">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <SheetClose asChild key={item.href}>
                                    <ViewTransitionLink
                                        href={item.href}
                                        className={cn(
                                            "group relative flex items-center justify-between px-4 py-4 border-b border-white/20 transition-all duration-0",
                                            isActive
                                                ? "bg-white text-black"
                                                : "bg-black text-zinc-400 hover:bg-white hover:text-black"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10 w-full">
                                            {/* Code Number */}
                                            <span className={cn(
                                                "font-mono text-xs opacity-50",
                                                isActive || "group-hover:text-black" ? "text-inherit" : "text-zinc-600"
                                            )}>
                                                {item.code}
                                            </span>

                                            {/* Label */}
                                            <span className="font-mono font-bold text-sm uppercase tracking-widest flex-1">
                                                {item.label}
                                            </span>

                                            {/* Icon */}
                                            <item.icon className="w-4 h-4 stroke-[2px]" />
                                        </div>
                                    </ViewTransitionLink>
                                </SheetClose>
                            );
                        })}
                    </div>
                </div>

                {/* 3. FOOTER: Status Bar */}
                <div className="relative z-20 flex-none border-t border-white bg-black">
                    <div className="grid grid-cols-2 divide-x divide-white border-b border-white">
                        <SheetClose asChild>
                            <ViewTransitionLink href="/profil" className="flex items-center justify-center gap-2 py-3 hover:bg-white hover:text-black text-xs text-zinc-400 font-mono uppercase transition-colors">
                                <User className="w-3.5 h-3.5" /> [USR]
                            </ViewTransitionLink>
                        </SheetClose>
                        <SheetClose asChild>
                            <ViewTransitionLink href="/ayarlar" className="flex items-center justify-center gap-2 py-3 hover:bg-white hover:text-black text-xs text-zinc-400 font-mono uppercase transition-colors">
                                <Settings className="w-3.5 h-3.5" /> [CFG]
                            </ViewTransitionLink>
                        </SheetClose>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2 bg-black">
                        <span className="text-[10px] font-mono text-zinc-500">SYS.VER.8.0</span>
                        <div className="flex gap-4">
                            <Twitter className="w-3.5 h-3.5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Github className="w-3.5 h-3.5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Globe className="w-3.5 h-3.5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
