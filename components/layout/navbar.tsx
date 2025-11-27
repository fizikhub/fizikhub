"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/ui/command-palette";
import { AuthButton } from "@/components/auth/auth-button";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const supabase = createClient();

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

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Ana Sayfa
                        </Link>
                        <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                            Makaleler
                        </Link>
                        <Link href="/forum" className="text-sm font-medium transition-colors hover:text-primary">
                            Forum
                        </Link>
                        <Link href="/sozluk" className="text-sm font-medium transition-colors hover:text-primary">
                            Sözlük
                        </Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary text-red-500 font-bold">
                                Admin Paneli
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                            <Search className="h-5 w-5" />
                        </Button>
                        <NotificationBell />
                        <AuthButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-foreground"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="md:hidden border-t border-border/40 bg-background"
                        >
                            <div className="flex flex-col p-4 space-y-4">
                                <Link
                                    href="/"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Ana Sayfa
                                </Link>
                                <Link
                                    href="/blog"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Makaleler
                                </Link>
                                <Link
                                    href="/forum"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Forum
                                </Link>
                                <Link
                                    href="/sozluk"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sözlük
                                </Link>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Shield className="h-4 w-4" /> Admin Paneli
                                    </Link>
                                )}
                                <Link
                                    href="/profil"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Button variant="outline" size="sm" className="w-full gap-2">
                                        <User className="h-4 w-4" /> Profilim
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
