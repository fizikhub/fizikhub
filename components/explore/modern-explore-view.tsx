"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Atom, Rocket, Cpu, Radio, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Article {
    id: number;
    title: string;
    excerpt: string | null;
    content: string;
    slug: string;
    category: string;
    image_url: string | null;
    created_at: string;
    profiles: {
        username: string | null;
        full_name: string | null;
        avatar_url: string | null;
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

    return (
        <div className="min-h-screen bg-[#09090b] pb-20 md:pb-0 font-sans">
            <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">

                {/* Header Section */}
                <div className="mb-10 md:mb-14 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs md:text-sm font-bold tracking-widest text-zinc-400 uppercase">Fizikhub Explorer</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.9]">
                        KEŞFET<span className="text-primary">.</span>
                    </h1>

                    <p className="text-zinc-400 text-base md:text-xl max-w-2xl leading-relaxed">
                        Topluluğumuzun kaleminden çıkan bilimsel makaleleri, özgün içerikleri ve derinlemesine analizleri inceleyin.
                    </p>
                </div>

                {/* Mobile Search & Filter Area */}
                <div className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 py-4 -mx-4 px-4 mb-8 md:static md:bg-transparent md:border-none md:p-0 md:mb-12 md:mx-0">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <form action="/kesfet" method="GET" className="flex-1 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-zinc-900/50 border-2 border-zinc-800 focus-within:border-primary/50 focus-within:bg-zinc-900 rounded-2xl flex items-center transition-all duration-300">
                                <Search className="w-5 h-5 ml-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    name="q"
                                    placeholder="Makale, yazar veya konu ara..."
                                    className="h-12 md:h-14 border-none bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base md:text-lg"
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
                                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                            : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
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
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
                                        )}
                                    >
                                        {cat}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories - Mobile Horizontal Scroll */}
                    <div className="md:hidden mt-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide flex gap-3">
                        <Link href="/kesfet" className="shrink-0">
                            <Badge
                                className={cn(
                                    "h-10 px-5 rounded-xl text-sm font-bold border-2 whitespace-nowrap",
                                    !currentCategory
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
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
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-zinc-900 text-zinc-400 border-zinc-800"
                                    )}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-zinc-900/30 rounded-3xl border-2 border-zinc-800 border-dashed">
                            <Atom className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium">Buralar biraz sessiz...</p>
                        </div>
                    ) : (
                        initialArticles.map((article, idx) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/blog/${article.slug}`} className="group block h-full">
                                    <div className="bg-zinc-900/40 border-2 border-zinc-800/60 rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                                        {/* Image Area */}
                                        <div className="aspect-[16/9] relative overflow-hidden bg-zinc-950 border-b-2 border-zinc-800/60">
                                            {article.image_url ? (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Atom className="w-16 h-16 text-zinc-800" />
                                                </div>
                                            )}

                                            {/* Floating Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wide">
                                                <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                                <span>•</span>
                                                <span className="text-primary">{article.profiles?.username}</span>
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                                {article.excerpt || article.content.substring(0, 150)}...
                                            </p>

                                            <div className="flex items-center text-sm font-bold text-white group/btn">
                                                Devamını Oku
                                                <ChevronRight className="w-4 h-4 ml-1 text-primary transition-transform group-hover/btn:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
