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
        <div className="min-h-screen bg-[#050505] pb-20 md:pb-0 font-sans">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />

            <div className="container max-w-2xl mx-auto px-2 sm:px-4 py-8 md:py-12 relative">

                {/* Header Section - Neo Brutalist */}
                <div className="mb-10 flex flex-col items-center text-center space-y-4">
                    <Link href="/blog">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 uppercase tracking-widest text-[10px] font-bold">
                            Fizikhub Blog
                        </Badge>
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        FİKİRLERİNİ<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ÖZGÜR BIRAK.</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                        Bilim, teknoloji ve mizah üzerine düşüncelerini paylaş, topluluğa katkıda bulun.
                    </p>
                </div>

                {/* Share Input Card */}
                <ShareInputCard user={user} />

                {/* Categories Area - Neo Brutalist Badges */}
                <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 mb-8 -mx-2 px-2 sm:-mx-4 sm:px-4 md:static md:bg-transparent md:border-none md:p-0 md:mb-10 md:mx-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 md:flex-wrap md:justify-center px-1">
                        <Link href="/blog" className="shrink-0">
                            <Badge
                                className={cn(
                                    "h-9 px-4 rounded-md text-xs font-bold border-2 whitespace-nowrap transition-all uppercase tracking-wide",
                                    !currentCategory
                                        ? "bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]"
                                        : "bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white hover:bg-zinc-800"
                                )}
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <Badge
                                    className={cn(
                                        "h-9 px-4 rounded-md text-xs font-bold border-2 whitespace-nowrap transition-all uppercase tracking-wide",
                                        currentCategory === cat
                                            ? "bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white hover:bg-zinc-800"
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
