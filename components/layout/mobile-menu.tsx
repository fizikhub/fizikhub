"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu, X, Home, BookOpen, Trophy, User, Zap, ChevronRight, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
    { href: "/", label: "Ana Sayfa", icon: Home },
    { href: "/makale", label: "Makaleler", icon: BookOpen },
    { href: "/siralamalar", label: "Sıralama", icon: Trophy },
    { href: "/profil", label: "Profil", icon: User },
    { href: "/ozel", label: "Özel İçerik", icon: Zap },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-zinc-800">
                    <Menu className="w-6 h-6 text-white" />
                    <span className="sr-only">Menüyü Aç</span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-[80%] max-w-[350px] p-0 bg-black border-l border-zinc-800 text-white flex flex-col h-full shadow-2xl"
            >
                <div className="sr-only">
                    <SheetTitle>Navigasyon Menüsü</SheetTitle>
                    <SheetDescription>Site içi bağlantılar</SheetDescription>
                </div>

                {/* Header Section */}
                <div className="p-6 pb-4 border-b border-zinc-900">
                    <span className="text-xl font-bold tracking-tight">Fizikhub</span>
                    <p className="text-xs text-zinc-500 mt-1">Bilim Platformu</p>
                </div>

                {/* Main Links */}
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="flex flex-col px-3 gap-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="group flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                    <span className="font-medium text-[15px]">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400" />
                            </Link>
                        ))}
                    </div>

                    <div className="px-6 py-4">
                        <Separator className="bg-zinc-900 my-4" />
                        <div className="space-y-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hesap</p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/giris"
                                    onClick={() => setOpen(false)}
                                    className="block w-full py-2.5 px-4 bg-zinc-900 rounded-lg text-center text-sm font-medium hover:bg-zinc-800 transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/kayit"
                                    onClick={() => setOpen(false)}
                                    className="block w-full py-2.5 px-4 bg-white text-black rounded-lg text-center text-sm font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-6 border-t border-zinc-900 bg-black">
                    <div className="flex justify-center gap-6">
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                    </div>
                    <p className="text-[10px] text-center text-zinc-600 mt-4">
                        © 2026 Fizikhub Inc.
                    </p>
                </div>

            </SheetContent>
        </Sheet>
    );
}
