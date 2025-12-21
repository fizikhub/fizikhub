"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, Search, Shield, Home, Feather, MessageCircle, Library, Trophy, Atom, User } from "lucide-react";
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
        { href: "/blog", label: "BİLİM ARŞİVİ", description: "Biraz kültürlen.", icon: Feather },
        { href: "/forum", label: "FORUM", description: "Kavga etme, tartış.", icon: MessageCircle },
        { href: "/sozluk", label: "LÜGAT", description: "Bu ne demek şimdi?", icon: Library },
        { href: "/testler", label: "QUIZ", description: "Kendini sına.", icon: Atom },
        { href: "/siralamalar", label: "SIRALAMA", description: "Sıralamanı gör.", icon: Trophy },
    ];

    return (
        <>
            <nav className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300 border-b-2",
                isScrolled
                    ? "glass-panel shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)]"
                    : "bg-transparent border-transparent"
            )}>
                <div className="container flex h-14 md:h-20 items-center justify-between px-4 md:px-6">
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

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-none">
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationBell />

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-none border-2 border-transparent hover:border-black dark:hover:border-white">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] sm:w-[350px] border-l-2 border-black dark:border-white p-0 bg-background">
                                <SheetHeader className="relative p-6 border-b-2 border-black dark:border-white overflow-hidden bg-black min-h-[120px] flex items-end">
                                    {/* Space Background */}
                                    <div className="absolute inset-0">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/50 via-black to-black" />

                                        {/* Stars */}
                                        <div className="absolute h-[1px] w-[1px] bg-white top-1/4 left-1/4 animate-pulse opacity-70" />
                                        <div className="absolute h-[2px] w-[2px] bg-white top-1/3 left-2/3 animate-pulse opacity-90" style={{ animationDuration: '3s' }} />
                                        <div className="absolute h-[1px] w-[1px] bg-blue-300 top-2/3 left-1/3 animate-pulse opacity-80" style={{ animationDuration: '4s' }} />
                                        <div className="absolute h-[2px] w-[2px] bg-purple-300 top-1/2 left-1/2 animate-pulse opacity-60" style={{ animationDuration: '5s' }} />

                                        {/* Shooting Star */}
                                        <div className="absolute top-0 right-0 h-[100px] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent opacity-30 rotate-[45deg] animate-[spin_3s_linear_infinite]" style={{ animationDuration: '8s' }} />
                                    </div>

                                    <div className="relative z-10 w-full flex justify-start">
                                        <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                                            <Logo />
                                        </div>
                                    </div>
                                    <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col p-4 gap-2.5 overflow-y-auto h-[calc(100vh-140px)]">
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
