"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, Search, Shield, Home, Feather, MessageCircle, Library, Trophy, Atom, User, Compass } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [supabase] = useState(() => createClient());
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const checkAdminStatus = useCallback(async (user: { email?: string, id: string }) => {
        const adminEmails = [
            'barannnbozkurttb.b@gmail.com',
            'barannnnbozkurttb.b@gmail.com'
        ];

        const userEmail = user.email?.toLowerCase().trim();
        const isEmailMatch = userEmail ? adminEmails.includes(userEmail) : false;

        if (isEmailMatch) {
            setIsAdmin(true);
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const isAdminRole = profile?.role === 'admin';
        setIsAdmin(isAdminRole || isEmailMatch);
    }, [supabase]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                checkAdminStatus(session.user);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                checkAdminStatus(session.user);
            } else {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, checkAdminStatus]);

    const navLinks = [
        { href: "/", label: "ANA SAYFA", description: "Başladığın yere dön.", icon: Home },
        { href: "/makale", label: "MAKALE", description: "Biraz kültürlen.", icon: Feather },
        { href: "/blog", label: "BLOG", description: "Keşfetmeye başla.", icon: Compass },
        { href: "/forum", label: "FORUM", description: "Kavga etme, tartış.", icon: MessageCircle },
        { href: "/sozluk", label: "LÜGAT", description: "Bu ne demek şimdi?", icon: Library },

        { href: "/siralamalar", label: "SIRALAMA", description: "Sıralamanı gör.", icon: Trophy },
    ];

    return (
        <>
            <nav className={cn(
                "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
                isScrolled
                    ? "bg-background/60 dark:bg-black/40 backdrop-blur-2xl border-b border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] supports-[backdrop-filter]:bg-background/30"
                    : "bg-transparent border-b border-transparent"
            )}>
                {/* Liquid Glass Shine Effect - Only visible when scrolled */}
                <div className={cn(
                    "absolute inset-0 pointer-events-none transition-opacity duration-500",
                    isScrolled ? "opacity-100" : "opacity-0"
                )}>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-b from-primary/5 to-transparent blur-sm" />
                </div>
                <div className="container flex h-12 md:h-16 items-center justify-between px-4 md:px-6">
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-bold uppercase tracking-wide transition-all relative group",
                                    pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"
                                )}
                            >
                                {link.label}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300",
                                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                )} />
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="text-sm font-black uppercase tracking-wide text-red-500 hover:text-red-600 transition-colors border-2 border-red-500 px-3 py-1 hover:bg-red-500 hover:text-white"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                            className="rounded-none hover:bg-primary/20 hover:text-primary transition-colors"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationBell />
                        <AuthButton />
                    </div>

                    {/* Mobile Actions - Clean & Minimal */}
                    <div className="lg:hidden flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 hover:bg-transparent text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] active:scale-95"
                        >
                            <Search className="h-5 w-5" strokeWidth={2.5} />
                        </Button>

                        <div className="w-10 h-10 flex items-center justify-center text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] active:scale-95 cursor-pointer">
                            <NotificationBell />
                        </div>

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 hover:bg-transparent text-foreground/80 hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] active:scale-95 ml-0"
                                    suppressHydrationWarning
                                >
                                    <Menu className="h-6 w-6" strokeWidth={2.5} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] sm:w-[350px] border-l border-white/10 p-0 bg-background/95 backdrop-blur-3xl shadow-2xl">
                                <SheetHeader className="relative p-6 border-b border-white/10 overflow-hidden bg-black/40 min-h-[140px] flex items-center justify-center">
                                    {/* Simplified Space Background - replaces 20+ animated DOM elements */}
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent" />

                                    {/* Static stars via CSS - no JS animations */}
                                    <div
                                        className="absolute inset-0 opacity-60"
                                        style={{
                                            backgroundImage: `radial-gradient(1px 1px at 20% 10%, white 100%, transparent),
                                                             radial-gradient(1px 1px at 80% 30%, white 100%, transparent),
                                                             radial-gradient(1.5px 1.5px at 50% 15%, rgba(200, 200, 255, 0.8) 100%, transparent),
                                                             radial-gradient(1px 1px at 10% 60%, white 100%, transparent),
                                                             radial-gradient(2px 2px at 70% 80%, rgba(255,255,255,0.6) 100%, transparent),
                                                             radial-gradient(1px 1px at 90% 50%, white 100%, transparent),
                                                             radial-gradient(1.5px 1.5px at 30% 75%, rgba(180, 180, 255, 0.7) 100%, transparent)`,
                                            backgroundSize: '100% 100%'
                                        }}
                                    />

                                    <div className="relative z-10 w-full flex justify-center items-center">
                                        <span className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_20px_rgba(255,255,255,0.4)]">
                                            FİZİKHUB
                                        </span>
                                    </div>
                                    <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col p-4 pb-32 gap-2.5 overflow-y-auto h-[calc(100vh-140px)]">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-3 border-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                                pathname === link.href
                                                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                                                    : "bg-background border-black dark:border-white hover:bg-primary/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-1.5 border-2 border-current",
                                                pathname === link.href ? "bg-white text-black dark:bg-black dark:text-white" : "bg-transparent"
                                            )}>
                                                <link.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-wide leading-none">
                                                    {link.label}
                                                </span>
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-wider mt-0.5",
                                                    pathname === link.href ? "text-white/70 dark:text-black/70" : "text-muted-foreground group-hover:text-primary"
                                                )}>
                                                    {link.description}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                                        >
                                            <div className="p-1.5 border-2 border-current bg-transparent">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-wide leading-none">
                                                    YÖNETİM
                                                </span>
                                                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-80">
                                                    GİZLİ BÖLGE
                                                </span>
                                            </div>
                                        </Link>
                                    )}
                                    <div className="my-1 border-t-2 border-dashed border-black/20 dark:border-white/20" />
                                    <Link
                                        href="/profil"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:translate-x-[1px] active:translate-y-[1px]"
                                    >
                                        <div className="p-1.5 border-2 border-current bg-transparent">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-wide leading-none">
                                                KİMLİK KARTI
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-60">
                                                PROFİLİNİ DÜZENLE
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
