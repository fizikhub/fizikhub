"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Sparkles } from "lucide-react";
import { Article } from "@/lib/api";

interface ModernArticleCardProps {
    article: Article;
    index?: number;
}

export function ModernArticleCard({ article, index = 0 }: ModernArticleCardProps) {
    // Determine card background color based on "featured" status or random rotation for fun
    const isFeatured = article.is_featured;

    return (
        <div className="h-full p-2">
            <Link href={`/blog/${article.slug}`} className="block h-full group">
                <article
                    className={`
                        relative h-full flex flex-col
                        bg-white 
                        border-[3px] border-black rounded-xl
                        shadow-[6px_6px_0px_0px_#000]
                        transition-all duration-200 ease-out
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        hover:shadow-[2px_2px_0px_0px_#000]
                    `}
                >
                    {/* Image Section */}
                    <div className="relative aspect-[16/10] w-full border-b-[3px] border-black overflow-hidden rounded-t-[9px]">
                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay Glare (Subtle Comic Style) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Floating Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                            <span className="
                                bg-[#A26FE3] text-white 
                                border-2 border-black 
                                px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider
                                shadow-[2px_2px_0px_0px_#000]
                            ">
                                {article.category}
                            </span>
                            {isFeatured && (
                                <span className="
                                    bg-[#F2C32E] text-black 
                                    border-2 border-black 
                                    px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider
                                    shadow-[2px_2px_0px_0px_#000]
                                    flex items-center gap-1
                                ">
                                    <Sparkles className="w-3 h-3 text-black" />
                                    Öne Çıkan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                        {/* Title */}
                        <h3 className="
                            font-[family-name:var(--font-outfit)] 
                            text-xl sm:text-2xl font-extrabold uppercase leading-[1.1] 
                            text-black
                            line-clamp-2
                            group-hover:text-[#A26FE3] transition-colors duration-200
                        ">
                            {article.title}
                        </h3>

                        {/* Summary */}
                        <p className="
                            flex-1
                            font-[family-name:var(--font-inter)] 
                            text-sm font-semibold text-neutral-600 
                            line-clamp-3 leading-relaxed
                        ">
                            {article.summary}
                        </p>

                        {/* Footer (Author & Read More) */}
                        <div className="mt-auto pt-4 flex items-center justify-between border-t-[3px] border-neutral-100">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                                    <Image
                                        src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                        alt={article.profiles?.full_name || "Yazar"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-black uppercase">
                                        {article.profiles?.full_name?.split(' ')[0] || "Anonim"}
                                    </span>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase">
                                        {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="
                                bg-black text-white 
                                w-8 h-8 flex items-center justify-center 
                                rounded-lg border-2 border-black
                                shadow-[2px_2px_0px_0px_#A26FE3]
                                group-hover:bg-[#A26FE3] group-hover:text-black group-hover:shadow-[2px_2px_0px_0px_#000]
                                transition-all duration-200
                            ">
                                <ArrowRight className="w-4 h-4 stroke-[3]" />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
}
