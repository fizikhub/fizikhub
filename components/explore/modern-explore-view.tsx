"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Telescope } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";
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
    const [searchQuery, setSearchQuery] = useState(currentQuery || "");

    // Transform articles to match SocialArticleCard's expected format
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
        <div className="min-h-screen bg-background pb-20 md:pb-0 font-sans">
            <div className="container max-w-2xl mx-auto px-2 sm:px-4 py-6 md:py-10">

                {/* Header Section - More Compact */}
                <div className="mb-6 flex flex-col items-center text-center space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                        Blog<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Topluluğun kaleminden bilimsel içerikler.
                    </p>
                </div>

                {/* Share Input Card */}
                <ShareInputCard user={user} />

                {/* Categories Area - Compact */}
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-white/5 py-2 mb-6 -mx-2 px-2 sm:-mx-4 sm:px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 md:flex-wrap md:justify-center">
                        <Link href="/blog" className="shrink-0">
                            <Badge
                                className={cn(
                                    "h-8 px-4 rounded-lg text-xs font-bold border whitespace-nowrap transition-all",
                                    !currentCategory
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : "bg-card text-muted-foreground border-white/5 hover:border-white/10 hover:bg-zinc-900"
                                )}
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <Badge
                                    className={cn(
                                        "h-8 px-4 rounded-lg text-xs font-bold border whitespace-nowrap transition-all",
                                        currentCategory === cat
                                            ? "bg-emerald-500 text-white border-emerald-500"
                                            : "bg-card text-muted-foreground border-white/5 hover:border-white/10 hover:bg-zinc-900"
                                    )}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Articles Feed */}
                <div className="space-y-6">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-12 text-center bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                            <Telescope className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium text-sm">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-xs text-emerald-500 hover:text-emerald-400 mt-1 block">
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
