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
                    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
                        {/* Cover */}
                        {article.cover_url && (
                            <div className="relative h-32 bg-muted">
                                <Image
                                    src={article.cover_url}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4 space-y-2">
                            <span className="text-[10px] font-medium uppercase text-muted-foreground">
                                {article.category}
                            </span>
                            <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
