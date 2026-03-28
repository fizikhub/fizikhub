"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_url?: string;
    category: string;
    created_at: string;
    author?: {
        username?: string;
        full_name?: string;
    };
}

interface RelatedArticlesProps {
    articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
                <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group block"
                >
                    <div className="rounded-xl sm:rounded-[12px] border-2 sm:border-[3px] border-black dark:border-zinc-700 bg-card overflow-hidden shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] sm:dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] group-hover:shadow-[4px_4px_0px_0px_#000] sm:group-hover:shadow-[6px_6px_0px_0px_#000] dark:group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] sm:dark:group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 transition-all duration-200">
                        {/* Cover */}
                        {article.cover_url && (
                            <div className="relative h-32 sm:h-40 bg-muted border-b-2 sm:border-b-[3px] border-black dark:border-zinc-700 overflow-hidden">
                                <Image
                                    src={article.cover_url}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                            <div>
                                <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FFC800] text-black border-2 border-black rounded-[4px] sm:rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[1px_1px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000]">
                                    {article.category}
                                </span>
                            </div>
                            <h4 className="font-black text-base sm:text-xl leading-tight line-clamp-2 group-hover:text-[#FFC800] transition-colors tracking-tight">
                                {article.title}
                            </h4>
                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 sm:mt-0">
                                {format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
