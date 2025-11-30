"use client";

import { TrendingUp, Sparkles, Zap, Crown, Target, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ReputationDisplayProps {
    reputation: number;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function ReputationDisplay({
    reputation,
    showLabel = true,
    size = "md",
    className
}: ReputationDisplayProps) {
    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2"
    };

    const iconSizes = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    // Determine tier and styling
    const getTierInfo = (rep: number) => {
        if (rep >= 1000) return {
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/50",
            border: "border-amber-200 dark:border-amber-800",
            icon: Crown,
            label: "Efsane"
        };
        if (rep >= 500) return {
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-950/50",
            border: "border-purple-200 dark:border-purple-800",
            icon: Sparkles,
            label: "Uzman"
        };
        if (rep >= 100) return {
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/50",
            border: "border-blue-200 dark:border-blue-800",
            icon: Zap,
            label: "Aktif"
        };
        return {
            color: "text-gray-600 dark:text-gray-400",
            bg: "bg-gray-50 dark:bg-gray-900/50",
            border: "border-gray-200 dark:border-gray-800",
            icon: Target,
            label: "Yeni"
        };
    };

    const tier = getTierInfo(reputation);
    const Icon = tier.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "inline-flex items-center gap-2 font-semibold rounded-lg border transition-colors cursor-pointer hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        sizeClasses[size],
                        tier.color,
                        tier.bg,
                        tier.border,
                        className
                    )}
                >
                    <Icon className={cn(iconSizes[size])} />

                    <div className="flex items-baseline gap-1.5">
                        <span className="font-bold">{reputation.toLocaleString('tr-TR')}</span>
                        <span className="text-[10px] opacity-80 font-medium uppercase tracking-wide">
                            Hub Puanı
                        </span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href="/puanlar-nedir">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Hub Puanlar Nedir?
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
