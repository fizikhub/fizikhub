"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, Search, Shield, Home, Feather, MessageCircle, Library, Crown, Atom, User } from "lucide-react";
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
    const supabase = createClient();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
    }, [supabase]);

    const checkAdminStatus = async (user: any) => {
        const adminEmails = [
            'barannnbozkurttb.b@gmail.com',
            'barannnnbozkurttb.b@gmail.com'
        ];

        const userEmail = user.email?.toLowerCase().trim();
        const isEmailMatch = adminEmails.includes(userEmail);

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
    };

    const navLinks = [
        { href: "/", label: "Ana Sayfa", icon: Home },
        { href: "/blog", label: "Makaleler", icon: Feather },
        { href: "/forum", label: "Forum", icon: MessageCircle },
        { href: "/sozluk", label: "Sözlük", icon: Library },
        { href: "/testler", label: "Testler", icon: Atom },
        { href: "/siralamalar", label: "Sıralamalar", icon: Crown },
    ];

    return (
        <>
            <nav className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm"
                    : "bg-transparent border-transparent"
            )}>
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-all px-4 py-2 rounded-full hover:bg-primary/10 hover:text-primary",
                                    pathname === link.href ? "text-primary bg-primary/10 font-semibold" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="text-sm font-medium transition-all px-4 py-2 rounded-full hover:bg-red-500/10 hover:text-red-500 text-red-500 font-bold"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-full">
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationBell />
                        <AuthButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-full">
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationBell />

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="mb-6 text-left">
                                    <Logo />
                                    <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                                pathname === link.href
                                                    ? "bg-primary/10 text-primary"
                                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
                                            className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                        >
                                            <Shield className="h-5 w-5" />
                                            Admin Paneli
                                        </Link>
                                    )}
                                    <div className="my-4 border-t" />
                                    <Link
                                        href="/profil"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
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
