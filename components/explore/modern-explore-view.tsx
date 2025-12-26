"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Atom, Telescope } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SocialArticleCard } from "@/components/articles/social-article-card";
import { CommunityInviteBanner } from "@/components/explore/community-invite-banner";

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
}

export function ModernExploreView({
    initialArticles,
    categories,
    currentQuery,
    currentCategory
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
            <div className="container max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-8 md:py-16">

                {/* Header Section */}
                <div className="mb-4 md:mb-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground uppercase">Fizikhub Topluluk Blogu</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[0.9]">
                        BLOG<span className="text-emerald-500">.</span>
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-lg max-w-xl leading-relaxed">
                        Topluluğumuzun kaleminden çıkan bilimsel blogları inceleyin.
                    </p>
                </div>

                {/* Community Invite Banner */}
                <div className="mb-6">
                    <CommunityInviteBanner />
                </div>

                {/* Categories Area */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-foreground/5 py-4 -mx-2 sm:-mx-4 px-2 sm:px-4 mb-8 md:static md:bg-transparent md:border-none md:p-0 md:mb-12 md:mx-0">

                    {/* Categories - Desktop */}
                    <div className="hidden md:flex flex-wrap gap-2">
                        <Link href="/blog">
                            <Badge
                                className={cn(
                                    "h-12 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all border-2",
                                    !currentCategory
                                        ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                        : "bg-card text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
                                )}
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
                                <Badge
                                    className={cn(
                                        "h-12 px-6 rounded-xl text-sm font-bold cursor-pointer transition-all border-2",
                                        currentCategory === cat
                                            ? "bg-emerald-500 text-white border-emerald-500"
                                            : "bg-card text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>

                    {/* Categories - Mobile Horizontal Scroll */}
                    <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide flex gap-3">
                        <Link href="/blog" className="shrink-0">
                            <Badge
                                className={cn(
                                    "h-10 px-5 rounded-xl text-sm font-bold border-2 whitespace-nowrap",
                                    !currentCategory
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : "bg-card text-muted-foreground border-foreground/10"
                                )}
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="shrink-0">
                                <Badge
                                    className={cn(
                                        "h-10 px-5 rounded-xl text-sm font-bold border-2 whitespace-nowrap",
                                        currentCategory === cat
                                            ? "bg-emerald-500 text-white border-emerald-500"
                                            : "bg-card text-muted-foreground border-foreground/10"
                                    )}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Articles Feed - Using SocialArticleCard */}
                <div className="space-y-6">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="py-20 text-center bg-card rounded-3xl border-2 border-foreground/10 border-dashed">
                            <Telescope className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Henüz makale yok...</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">İlk makaleyi sen yazabilirsin!</p>
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
