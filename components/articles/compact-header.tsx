"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { SearchInput } from "@/components/blog/search-input";

interface CompactHeaderProps {
    articleCount?: number;
    categories?: string[];
    activeCategory?: string;
    sortParam?: string;
}

export function CompactHeader({ articleCount = 0, categories = [], activeCategory, sortParam }: CompactHeaderProps) {
    return (
        <header className="pt-6 pb-8">
            {/* Title Row */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
                        Makaleler
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {articleCount} makale yayında
                    </p>
                </div>
                <div className="w-64 hidden sm:block">
                    <SearchInput />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Pill href="/makale" active={!activeCategory && sortParam !== 'popular'}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Tümü
                </Pill>
                <Pill href="/makale?sort=popular" active={sortParam === 'popular'}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Popüler
                </Pill>
                <Pill href="/makale?sort=latest" active={sortParam === 'latest' && !activeCategory}>
                    <Clock className="w-3.5 h-3.5" />
                    Yeni
                </Pill>

                {categories.length > 0 && (
                    <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1 flex-shrink-0" />
                )}

                {categories.map(cat => (
                    <Pill key={cat} href={`/makale?category=${encodeURIComponent(cat)}`} active={activeCategory === cat}>
                        {cat}
                    </Pill>
                ))}
            </div>
        </header>
    );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${active
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
        >
            {children}
        </Link>
    );
}
