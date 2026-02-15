"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactShareCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
    // We can pass different grid spans or h-full depending on desired layout
    className?: string;
}

export function CompactShareCard({
    title,
    description,
    href,
    icon: Icon,
    color,
    className,
}: CompactShareCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative block w-full overflow-hidden rounded-xl border-2 border-border bg-card p-4 transition-all active:scale-[0.98]",
                "hover:border-foreground hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                className
            )}
        >
            <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]",
                    color
                )}>
                    <Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <h3 className="font-heading text-lg font-black uppercase leading-none tracking-tight text-foreground">
                        {title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-muted-foreground line-clamp-1">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
