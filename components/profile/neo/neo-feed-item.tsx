"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, Eye, FileText, MessageSquare, PenTool, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoFeedItemProps {
    type: 'article' | 'question' | 'answer' | 'draft';
    title: string;
    description?: string;
    href: string;
    date: string;
    category?: string;
    stats?: {
        likes?: number;
        views?: number;
        comments?: number;
    };
    status?: string;
    onEdit?: () => void;
}

export function NeoFeedItem({
    type,
    title,
    description,
    href,
    date,
    category,
    stats,
    status,
    onEdit
}: NeoFeedItemProps) {

    // Type Config
    const config = {
        article: {
            icon: FileText,
            color: "bg-[#FFC800]", // Amber
            label: "MAKALE"
        },
        question: {
            icon: MessageSquare,
            color: "bg-[#23A9FA]", // Blue
            label: "SORU"
        },
        answer: {
            icon: MessageCircle,
            color: "bg-[#A3E635]", // Green
            label: "CEVAP"
        },
        draft: {
            icon: PenTool,
            color: "bg-zinc-200", // Gray
            label: "TASLAK"
        }
    }[type];

    const Icon = config.icon;

    return (
        <Link href={href} className="group block mb-4">
            <article className={cn(
                "relative flex bg-white dark:bg-[#27272a] overflow-hidden",
                "border-[3px] border-black rounded-lg",
                "shadow-[4px_4px_0px_#000] group-hover:shadow-[2px_2px_0px_#000]",
                "group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                "transition-all duration-200"
            )}>

                {/* 1. LEFT SYMBOL STRIP (Mobile Friendly Indicator) */}
                <div className={cn(
                    "w-3 sm:w-4 flex-shrink-0 border-r-[3px] border-black",
                    config.color
                )} />

                {/* 2. CONTENT */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col gap-2 min-w-0">

                    {/* Header: Label & Date */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-6 h-6 flex items-center justify-center rounded border border-black text-black",
                                config.color
                            )}>
                                <Icon className="w-3.5 h-3.5 stroke-[2.5px]" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                                {config.label}
                                {category && <span className="text-black ml-1">• {category}</span>}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase whitespace-nowrap">
                            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-black text-black dark:text-zinc-50 leading-tight uppercase tracking-tight truncate">
                        {title}
                    </h3>

                    {/* Compact Description (Optional) */}
                    {description && (
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Footer Stats / Actions */}
                    <div className="mt-2 flex items-center justify-between border-t border-dashed border-black/10 pt-2">

                        <div className="flex items-center gap-4 text-xs font-bold text-neutral-500">
                            {stats?.views !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                                    {stats.views}
                                </span>
                            )}
                            {stats?.likes !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <Heart className="w-3.5 h-3.5 stroke-[2.5]" />
                                    {stats.likes}
                                </span>
                            )}
                            {stats?.comments !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                    {stats.comments}
                                </span>
                            )}
                        </div>

                        {/* More Link Arrow */}
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>

                    </div>
                </div>

            </article>
        </Link>
    );
}

