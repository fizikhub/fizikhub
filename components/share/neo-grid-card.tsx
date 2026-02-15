"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoGridCardProps {
    title: string;
    href: string;
    icon: LucideIcon;
    color: string; // Tailwind color class for icon background or border
}

export function NeoGridCard({
    title,
    href,
    icon: Icon,
    color,
}: NeoGridCardProps) {
    return (
        <Link
            href={href}
            className="group relative block w-full aspect-square"
        >
            <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-black dark:border-white bg-card p-4 transition-all duration-200",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                "group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none",
                "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            )}>
                {/* Icon Circle */}
                <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 border-black dark:border-white shadow-sm",
                    color
                )}>
                    <Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <span className="font-heading text-sm sm:text-base font-black uppercase tracking-tight text-foreground text-center leading-tight">
                    {title}
                </span>
            </div>
        </Link>
    );
}
