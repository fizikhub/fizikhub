"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, FlaskConical, Hash, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_url: string;
    category: string;
    created_at: string;
    author: {
        full_name: string;
        username: string;
        avatar_url: string;
    };
    views: number;
    likes_count: number;
}

export function V33BlogLayout({
    articles,
    categories,
    currentCategory
}: {
    articles: Article[],
    categories: string[],
    currentCategory: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.replace(`/blog?${params.toString()}`);
    }, 300);

    const handleCategory = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('category', cat);
        params.delete('page'); // Reset to page 1
        router.push(`/blog?${params.toString()}`);
    };

    const featuredArticle = articles[0];
    const standardArticles = articles.slice(1);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FFC800] selection:text-black">

            {/* 1. EDITORIAL HEADER */}
            <div className="pt-24 pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-b border-white/10 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
                            BİLİM<span className="text-[#FFC800]">.LOG</span>
                        </h1>
                        <p className="text-zinc-400 max-w-xl text-lg md:text-xl font-mono leading-relaxed">
                            Evrenin kaynak kodlarını inceliyoruz. Makaleler, deneyler ve incelemeler.
                        </p>
                    </div>

                    {/* Search Field */}
                    <div className="w-full md:w-auto relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-[#FFC800] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Arşivde ara..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full md:w-80 bg-zinc-900/50 border border-white/20 rounded-full py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FFC800] focus:bg-black transition-all font-mono text-sm"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
                                currentCategory === cat
                                    ? "bg-[#FFC800] border-[#FFC800] text-black"
                                    : "bg-transparent border-white/20 text-zinc-400 hover:border-white hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20">
                {/* 2. FEATURED ARTICLE (Hero Grid) */}
                {featuredArticle && (
                    <Link href={`/makale/${featuredArticle.slug}`} className="group block mb-16 relative">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border-[3px] border-black group-hover:border-[#FFC800] transition-colors">
                            {/* Image */}
                            <img
                                src={featuredArticle.cover_url || "/images/placeholder-science.jpg"}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6 md:p-12">
                                <div className="max-w-3xl">
                                    <span className="inline-block bg-[#FFC800] text-black text-xs font-black px-3 py-1 mb-4 uppercase tracking-widest">
                                        {featuredArticle.category}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-[#FFC800] transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-zinc-300 text-lg md:text-xl line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl font-medium">
                                        {featuredArticle.excerpt}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm font-mono text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden border border-white/20">
                                                <img src={featuredArticle.author.avatar_url} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-white">{featuredArticle.author.full_name}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(featuredArticle.created_at).toLocaleDateString("tr-TR", { month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* 3. MASONRY GRID (Rest of articles) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {standardArticles.map((article, i) => (
                        <Link key={article.id} href={`/makale/${article.slug}`} className="group flex flex-col h-full">
                            {/* Card Image */}
                            <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 group-hover:border-[#FFC800]/50 mb-4 relative bg-zinc-900">
                                <img
                                    src={article.cover_url}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase">
                                    {article.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#FFC800] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-zinc-500 text-sm line-clamp-3 mb-4 flex-1">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                    <span className="text-xs font-mono text-zinc-500">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-1 text-[#FFC800] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                        OKU <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/20 rounded-2xl">
                        <FlaskConical className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">Sonuç Bulunamadı</h3>
                        <p className="text-zinc-500">Bu kategoride veya aramada henüz içerik yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
