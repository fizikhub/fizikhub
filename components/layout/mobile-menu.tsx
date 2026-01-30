"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthButton } from "@/components/auth/auth-button";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Home, Zap, BookOpen, FlaskConical, Award } from "lucide-react";
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

            {/* TOP STACK: Receipt Style Dropdown */}
            <SheetContent side="top" className="w-full h-auto max-h-[70vh] p-0 border-b-[3px] border-black bg-white overflow-hidden">
                <div className="flex flex-col">
                    {/* Header with Close */}
                    <div className="flex items-center justify-between px-4 h-14 border-b-[2px] border-black/10 bg-neutral-50/50">
                        <span className="font-black text-xs uppercase tracking-widest text-neutral-400">MENÜ</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-[#FFC800] hover:text-black transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Grid Layout for Items */}
                    <div className="grid grid-cols-2 p-2 gap-2 bg-[#F0F0F0]">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <ViewTransitionLink
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 h-20 rounded-sm border-[2px] transition-all",
                                        isActive
                                            ? "bg-[#FFC800] border-black shadow-[2px_2px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                                            : "bg-white border-transparent hover:border-black/10 shadow-sm"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5",
                                        isActive ? "text-black fill-white/20" : "text-neutral-500"
                                    )} />
                                    <span className={cn(
                                        "font-black text-xs uppercase tracking-tight",
                                        isActive ? "text-black" : "text-neutral-600"
                                    )}>
                                        {item.label}
                                    </span>
                                </ViewTransitionLink>
                            );
                        })}

                        {/* Auth Button takes remaining space or full row */}
                        <div className="col-span-1 flex items-center justify-center h-20 bg-white border-[2px] border-transparent rounded-sm">
                            <div className="scale-75 origin-center w-full flex justify-center">
                                <AuthButton />
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
