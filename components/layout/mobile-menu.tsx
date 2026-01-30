"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Zap, BookOpen, FlaskConical, Award } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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
                        "text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    )}
                >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5px]" />
                </button>
            </SheetTrigger>

            {/* TRUE NEO-BRUTALIST SIDE DRAWER */}
            <SheetContent
                side="right"
                className="w-[280px] p-0 border-l-[4px] border-black bg-white overflow-hidden"
            >
                <SheetTitle className="sr-only">Menü</SheetTitle>

                <div className="flex flex-col h-full">
                    {/* HEADER - Matches Navbar Blue */}
                    <div className="h-14 flex items-center justify-between px-4 bg-[#3B82F6] border-b-[3px] border-black">
                        <span className="font-black text-xs text-white uppercase tracking-widest">MENÜ</span>
                        <SheetClose className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                            <X className="w-4 h-4 text-black stroke-[3px]" />
                        </SheetClose>
                    </div>

                    {/* MENU ITEMS - Matches Navbar Buttons */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-100">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 h-11 w-full",
                                        "border-[2px] border-black transition-all",
                                        "font-black text-xs uppercase tracking-wide",
                                        isActive
                                            ? "bg-[#FFC800] text-black shadow-[2px_2px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                                            : "bg-white text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000]"
                                    )}
                                >
                                    <item.icon className="w-4 h-4 stroke-[2.5px]" />
                                    <span>{item.label}</span>
                                </ViewTransitionLink>
                            );
                        })}

                        {/* SPECIAL LINK */}
                        <div className="pt-2">
                            <ViewTransitionLink
                                href="/ozel"
                                className="flex items-center justify-center gap-2 px-4 h-11 w-full bg-black text-white border-[2px] border-black shadow-[3px_3px_0px_0px_#FFC800] font-black text-xs uppercase tracking-wide active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                                <Zap className="w-4 h-4 fill-[#FFC800] text-[#FFC800]" />
                                <span>Özel İçerik</span>
                            </ViewTransitionLink>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-4 border-t-[3px] border-black bg-white">
                        <AuthButton />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
