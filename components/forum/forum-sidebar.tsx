"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Flame, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ForumSidebar() {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";
    const currentFilter = searchParams.get("filter");

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isCybernetic = mounted && theme === 'cybernetic';
    const isPink = mounted && theme === 'pink';

    const MenuItem = ({ href, active, icon: Icon, label }: { href: string; active: boolean; icon: any; label: string }) => (
        <Link href={href} className="block group">
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:pl-5",
                isCybernetic && "rounded-none",
                isCybernetic && active && "bg-cyan-950/30 text-cyan-400 border-l-2 border-cyan-400",
                isPink && active && "bg-pink-50 text-pink-600"
            )}>
                <Icon className={cn("w-4.5 h-4.5", active && "stroke-[2.5px]")} />
                <span className="text-sm">{label}</span>
            </div>
        </Link>
    );

    return (
        <div className={cn(
            "space-y-6 sticky top-24",
            isCybernetic ? "cyber-card border-cyan-500/20 shadow-none p-5 !rounded-none bg-black/40" : "bg-card border border-border/50 rounded-2xl p-5 shadow-sm"
        )}>
            <div>
                <h3 className={cn(
                    "text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-4",
                    isCybernetic && "text-cyan-600"
                )}>
                    SIRALAMA
                </h3>
                <div className="space-y-1">
                    <MenuItem
                        href="/forum?sort=newest"
                        active={currentSort === "newest" && !currentFilter}
                        icon={Clock}
                        label="En Yeniler"
                    />
                    <MenuItem
                        href="/forum?sort=popular"
                        active={currentSort === "popular" && !currentFilter}
                        icon={Flame}
                        label="Popüler"
                    />
                </div>
            </div>

            <div className="h-px bg-border/50 mx-4" />

            <div>
                <h3 className={cn(
                    "text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-4",
                    isCybernetic && "text-cyan-600"
                )}>
                    DURUM
                </h3>
                <div className="space-y-1">
                    <MenuItem
                        href="/forum?filter=solved"
                        active={currentFilter === "solved"}
                        icon={CheckCircle2}
                        label="Çözülenler"
                    />
                    <MenuItem
                        href="/forum?filter=unanswered"
                        active={currentFilter === "unanswered"}
                        icon={MessageSquare}
                        label="Cevaplanmamış"
                    />
                </div>
            </div>
        </div>
    );
}
