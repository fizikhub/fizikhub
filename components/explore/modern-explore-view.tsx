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
        <div className="min-h-screen bg-transparent pb-20 md:pb-0 font-sans">
            <div className="container max-w-2xl mx-auto px-2 sm:px-4 py-8 md:py-12">

                {/* Header Section - Modern Editorial, No "Shouting" */}
                <div className="mb-8 flex flex-col items-center text-center space-y-3">
                    <Link href="/blog">
                        <Badge variant="secondary" className="px-3 py-1 font-medium text-[10px] tracking-widest uppercase bg-muted/50 text-muted-foreground hover:bg-muted transition-colors rounded-full">
                            Topluluk Blogu
                        </Badge>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Fikirlerini Özgür Bırak
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                        Bilim, teknoloji ve mizah üzerine düşüncelerini paylaş, toplululuğa katkıda bulun.
                    </p>
                </div>

                {/* Share Input Card */}
                <ShareInputCard user={user} />

                {/* Categories Area - Clean & Minimal */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 py-3 mb-6 -mx-2 px-2 sm:-mx-4 sm:px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-8 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 md:flex-wrap md:justify-center px-1">
                        <Link href="/blog" className="shrink-0">
                            <Badge
                                variant={!currentCategory ? "default" : "outline"}
                                className={cn(
                                    "h-8 px-4 rounded-full text-xs font-medium border transition-all cursor-pointer",
                                    !currentCategory
                                        ? "bg-foreground text-background hover:bg-foreground/90 border-transparent shadow-sm"
                                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground hover:bg-muted/30"
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
                                        "h-8 px-4 rounded-full text-xs font-medium border transition-all cursor-pointer",
                                        currentCategory === cat
                                            ? "bg-foreground text-background hover:bg-foreground/90 border-transparent shadow-sm"
                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground hover:bg-muted/30"
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
                        <div className="py-12 text-center rounded-2xl border border-dashed border-border/50 bg-muted/10">
                            <Telescope className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium text-sm">Henüz makale yok...</p>
                            <Link href="/makale/yeni" className="text-xs text-primary hover:underline mt-1 block font-medium">
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
