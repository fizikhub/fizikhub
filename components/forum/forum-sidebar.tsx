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
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border-2 border-transparent",
                active
                    ? "bg-primary text-primary-foreground border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px] font-bold"
                    : "text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-background hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]",
                isCybernetic && "rounded-none border-transparent hover:border-cyan-500 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] hover:bg-cyan-950/30 hover:translate-x-0 hover:translate-y-0",
                isCybernetic && active && "bg-cyan-950/30 text-cyan-400 border-cyan-400 border-l-4 shadow-none translate-x-0 translate-y-0",
                isPink && active && "bg-pink-500 text-white border-pink-700 shadow-[4px_4px_0px_0px_rgba(199,21,133,0.4)]"
            )}>
                <Icon className={cn("w-4.5 h-4.5", active && "stroke-[3px]")} />
                <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
            </div>
        </Link>
    );

    return (
        <div className={cn(
            "space-y-6 sticky top-24",
            isCybernetic ? "cyber-card border-cyan-500/20 shadow-none p-5 !rounded-none bg-black/40" : "bg-card border-2 border-border rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
        )}>
            <div>
                <h3 className={cn(
                    "text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-2",
                    isCybernetic && "text-cyan-600"
                )}>
                    SIRALAMA
                </h3>
                <div className="space-y-2">
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

            <div className="h-0.5 bg-border/50 mx-2" />

            <div>
                <h3 className={cn(
                    "text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-2",
                    isCybernetic && "text-cyan-600"
                )}>
                    DURUM
                </h3>
                <div className="space-y-2">
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
