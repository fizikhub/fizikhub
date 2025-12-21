"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Atom, Telescope } from "lucide-react";
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
                <div className="mb-10 md:mb-14 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs md:text-sm font-bold tracking-widest text-muted-foreground uppercase">Fizikhub Topluluk Blogu</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[0.9]">
                        KEŞFET<span className="text-emerald-500">.</span>
                    </h1>

                    <p className="text-muted-foreground text-base md:text-xl max-w-2xl leading-relaxed">
                        Topluluğumuzun kaleminden çıkan bilimsel blogları, özgün içerikleri ve derinlemesine analizleri inceleyin.
                    </p>
                </div>

                {/* Community Invite Banner */}
                <CommunityInviteBanner />

                {/* Mobile Search & Filter Area */}
                <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-foreground/5 py-4 -mx-2 sm:-mx-4 px-2 sm:px-4 mb-8 md:static md:bg-transparent md:border-none md:p-0 md:mb-12 md:mx-0">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <form action="/kesfet" method="GET" className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-card border-2 border-foreground/10 focus-within:border-emerald-500/50 focus-within:bg-card rounded-2xl flex items-center transition-all duration-300">
                                <Search className="w-5 h-5 ml-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    name="q"
                                    placeholder="Makale, yazar veya konu ara..."
                                    className="h-12 md:h-14 border-none bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-base md:text-lg"
                                    defaultValue={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                        </form>

                        {/* Categories - Desktop */}
                        <div className="hidden md:flex flex-wrap gap-2">
                            <Link href="/kesfet">
                                <Badge
                                    className={cn(
                                        "h-14 px-6 rounded-2xl text-sm font-bold cursor-pointer transition-all border-2",
                                        !currentCategory
                                            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                                            : "bg-card text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
                                    )}
                                >
                                    Tümü
                                </Badge>
                            </Link>
                            {categories.slice(0, 3).map((cat) => (
                                <Link key={cat} href={`/kesfet?category=${encodeURIComponent(cat)}`}>
                                    <Badge
                                        className={cn(
                                            "h-14 px-6 rounded-2xl text-sm font-bold cursor-pointer transition-all border-2",
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
                    </div>

                    {/* Categories - Mobile Horizontal Scroll */}
                    <div className="md:hidden mt-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide flex gap-3">
                        <Link href="/kesfet" className="shrink-0">
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
                            <Link key={cat} href={`/kesfet?category=${encodeURIComponent(cat)}`} className="shrink-0">
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
