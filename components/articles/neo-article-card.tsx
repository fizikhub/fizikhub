"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowUpRight } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";

interface NeoArticleCardProps {
    article: Article;
    className?: string;
}

export function NeoArticleCard({ article, className }: NeoArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`} className="block group h-full">
            <article 
                className={cn(
                    "flex flex-col h-full bg-white relative overflow-hidden",
                    // BORDER & SHAPE
                    "border-2 border-black rounded-xl",
                    // PRIMARY SHADOW (Default State)
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    // HOVER INTERACTION (Squish Effect)
                    "transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    "group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                    "group-hover:shadow-none", // Shadow disappears on press/hover
                    className
                )}
            >
                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-2 border-black bg-neutral-100 overflow-hidden">
                    <Image
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Category Label - Floating top left */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className={cn(
                            "inline-flex items-center px-3 py-1",
                            "text-xs font-black uppercase tracking-wider text-black",
                            "bg-[#FFC800] border-2 border-black rounded-md", // Yellow brand color
                            "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                            "group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all"
                        )}>
                            {article.category || "Genel"}
                        </span>
                    </div>
                </div>

                {/* 2. BODY SECTION */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-xl font-extrabold text-black leading-tight line-clamp-2 uppercase group-hover:text-[#23A9FA] transition-colors">
                        {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-600 line-clamp-3">
                        {article.summary}
                    </p>

                    {/* Footer: User & Date */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-neutral-100/50">
                        <div className="flex items-center gap-2">
                             {/* Avatar */}
                            <div className="relative w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-neutral-200">
                                <Image
                                    src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                    alt={article.profiles?.full_name || "Yazar"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Name & Date */}
                            <div className="flex flex-col leading-none gap-0.5">
                                <span className="text-[11px] font-black uppercase text-black">
                                    {article.profiles?.full_name || "Anonim"}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                    {article.created_at 
                                        ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })
                                        : "Tarih yok"}
                                </span>
                            </div>
                        </div>

                        {/* Read More Icon */}
                        <div className="
                            w-8 h-8 flex items-center justify-center 
                            rounded-md border-2 border-black 
                            bg-white text-black
                            group-hover:bg-black group-hover:text-white
                            transition-colors duration-200
                        ">
                            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
