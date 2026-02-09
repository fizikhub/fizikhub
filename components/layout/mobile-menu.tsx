"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, Zap, ChevronRight, Atom, Compass, Book, Mail, LogIn } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
    { href: '/', label: 'Akış', icon: Home },
    { href: '/kesfet', label: 'Keşfet', icon: Compass },
    { href: '/simulasyonlar', label: 'Simülasyonlar', icon: Atom },
    { href: '/siralamalar', label: 'Sıralamalar', icon: Trophy },
    { href: '/sozluk', label: 'Sözlük', icon: Book },
    { href: '/iletisim', label: 'İletişim', icon: Mail },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="w-9 h-9 flex items-center justify-center bg-background border border-border rounded-lg hover:bg-muted transition-colors">
                    <Menu className="w-5 h-5 text-foreground" />
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[280px] p-0 border-l border-border bg-background flex flex-col"
                showClose={false}
            >
                <div className="sr-only">
                    <SheetTitle>Navigasyon</SheetTitle>
                    <SheetDescription>Ana Menü</SheetDescription>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-bold text-lg text-foreground">Menü</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-3">
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Premium Section */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <Link
                            href="/ozel"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                        >
                            <Zap className="w-5 h-5" />
                            <div>
                                <span className="font-semibold block">Özel İçerik</span>
                                <span className="text-xs opacity-70">Premium alan</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <Link href="/giris" onClick={() => setOpen(false)}>
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity">
                            <LogIn className="w-4 h-4" />
                            Giriş Yap
                        </button>
                    </Link>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        FizikHub © 2026
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
