"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Book,
    Users,
    Flag,
    GraduationCap,
    Trophy,
    Megaphone,
    Settings,
    Download
} from "lucide-react";

const sidebarItems = [
    {
        title: "Genel Bakış",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        title: "Makaleler",
        href: "/admin/articles",
        icon: FileText
    },
    {
        title: "Forum Soruları",
        href: "/admin/questions",
        icon: MessageSquare
    },
    {
        title: "Sözlük",
        href: "/admin/dictionary",
        icon: Book
    },
    {
        title: "Testler (Quiz)",
        href: "/admin/quizzes",
        icon: GraduationCap
    },
    {
        title: "Haftanın Sorusu",
        href: "/admin/weekly-question",
        icon: Trophy
    },
    {
        title: "Kullanıcılar",
        href: "/admin/users",
        icon: Users
    },
    {
        title: "Raporlar",
        href: "/admin/reports",
        icon: Flag
    },
    {
        title: "Duyurular",
        href: "/admin/broadcast",
        icon: Megaphone
    },
    {
        title: "Video İndirici",
        href: "/admin/youtube-download",
        icon: Download
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-muted/20 min-h-[calc(100vh-4rem)] hidden md:block">
            <div className="flex flex-col gap-2 p-4">
                <div className="px-2 py-2 mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">Yönetim Paneli</h2>
                    <p className="text-sm text-muted-foreground">FizikHub Admin</p>
                </div>
                <nav className="grid gap-1">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
