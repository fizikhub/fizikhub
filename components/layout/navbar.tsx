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
        { href: "/", label: "ANA SAYFA", icon: Home },
        { href: "/blog", label: "MAKALELER", icon: Feather },
        { href: "/forum", label: "FORUM", icon: MessageCircle },
        { href: "/sozluk", label: "SÖZLÜK", icon: Library },
        { href: "/testler", label: "TESTLER", icon: Atom },
        { href: "/siralamalar", label: "SIRALAMALAR", icon: Trophy },
    ];

    return (
        <>
            <nav className={cn(
                "w-full transition-all duration-300 border-b-2",
                isScrolled
                    ? "bg-background/95 backdrop-blur-md border-black dark:border-white shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)]"
                    : "bg-background border-transparent"
            )}>
                <div className="container flex h-20 items-center justify-between px-4 md:px-6">
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
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-2 border-black dark:border-white p-0">
                                <SheetHeader className="p-6 border-b-2 border-black dark:border-white bg-primary">
                                    <div className="flex justify-start">
                                        <Logo />
                                    </div>
                                    <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col p-6 gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-4 text-sm font-bold uppercase border-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                                pathname === link.href
                                                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                                                    : "bg-background border-black dark:border-white hover:bg-primary/10"
                                            )}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            {link.label}
                                        </Link>
                                    ))}
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 text-sm font-bold uppercase border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]"
                                        >
                                            <Shield className="h-5 w-5" />
                                            Admin Paneli
                                        </Link>
                                    )}
                                    <div className="my-4 border-t-2 border-dashed border-black/20 dark:border-white/20" />
                                    <Link
                                        href="/profil"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-4 text-sm font-bold uppercase border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                    >
                                        <User className="h-5 w-5" />
                                        Profilim
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
