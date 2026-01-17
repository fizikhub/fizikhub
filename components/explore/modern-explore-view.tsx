"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Telescope } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { ShareInputCard } from "@/components/blog/share-input-card";

interface Article {
    id: number;
    title: string;
    excerpt: string | null;
    summary?: string | null;
    content: string;
    slug: string;
    category: string;
    cover_url: string | null;
    image_url?: string | null;
    created_at: string;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
        is_writer?: boolean;
    } | null;
}

interface ModernExploreViewProps {
    initialArticles: Article[];
    categories: string[];
    currentQuery?: string;
    currentCategory?: string;
    user?: any;
}

export function ModernExploreView({
    initialArticles,
    categories,
    currentQuery,
    currentCategory,
    user
}: ModernExploreViewProps) {

    const transformedArticles = initialArticles.map(article => ({
        ...article,
        image_url: article.cover_url || article.image_url,
        summary: article.excerpt || article.summary,
        author: article.profiles ? {
            username: article.profiles.username,
            full_name: article.profiles.full_name,
            avatar_url: article.profiles.avatar_url,
            is_writer: article.profiles.is_writer
        } : null
    }));

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-0">
            <div className="container max-w-2xl mx-auto px-4 py-8 md:py-12">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-foreground mb-2">
                        Topluluk Blogu
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                        Bilim, teknoloji ve mizah üzerine düşüncelerini paylaş.
                    </p>
                </div>

                {/* Share Card */}
                <ShareInputCard user={user} />

                {/* Categories */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 py-3 mb-6 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 md:flex-wrap md:justify-center">
                        <Link href="/blog" className="shrink-0">
                            <Badge
                                variant={!currentCategory ? "default" : "outline"}
                                className={cn(
                                    "h-8 px-4 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                                    !currentCategory
                                        ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                                )}
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <Badge
                                    variant={currentCategory === cat ? "default" : "outline"}
                                    className={cn(
                                        "h-8 px-4 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                                        currentCategory === cat
                                            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card">
                            <Telescope className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-sm text-emerald-500 hover:underline mt-2 inline-block font-semibold">
                                İlk makaleyi sen yaz!
                            </Link>
                        </div>
                    ) : (
                        transformedArticles.map((article, idx) => (
                            <SocialArticleCard
                                key={article.id}
                                article={article as any}
                                index={idx}
                                variant="community"
                                initialLikes={0}
                                initialComments={0}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
