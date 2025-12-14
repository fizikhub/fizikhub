"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Atom, Cpu, Radio, Globe } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
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
        <div className="min-h-screen bg-black pb-20 md:pb-0 relative overflow-hidden">
            {/* Grid Overlay */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                    backgroundSize: '80px 80px'
                }} />
            </div>

            {/* Scan Lines */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scan" style={{
                    backgroundSize: '100% 4px',
                    animation: 'scan 8s linear infinite'
                }} />
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10">
                {/* BRUTALIST HEADER */}
                <div className="mb-12 border-b-4 border-white pb-6">
                    <div className="flex items-start justify-between mb-4">
                        {/* Corner Bracket TOP LEFT */}
                        <div className="w-12 h-12 border-t-4 border-l-4 border-primary" />

                        {/* Status Indicators */}
                        <div className="flex gap-6">
                            <div className="text-right">
                                <div className="text-xs font-mono text-primary/50 mb-1">DURUM</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 animate-pulse" />
                                    <span className="text-sm font-bold text-white">AKTİF</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono text-primary/50 mb-1">MAKALE</div>
                                <div className="text-2xl font-black text-primary">{initialArticles?.length || 0}</div>
                            </div>
                        </div>

                        {/* Corner Bracket TOP RIGHT */}
                        <div className="w-12 h-12 border-t-4 border-r-4 border-primary" />
                    </div>

                    {/* MASSIVE TITLE */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-3 uppercase">
                        KEŞFET
                    </h1>

                    <div className="h-1 w-24 bg-primary mb-4" />

                    <p className="text-base md:text-lg text-white/70 max-w-3xl font-light leading-relaxed">
                        Topluluğumuzun kaleminden çıkan bilimsel makaleleri, özgün içerikleri ve derinlemesine analizleri keşfedin.
                    </p>

                    <div className="flex items-end justify-between mt-4">
                        {/* Corner Bracket BOTTOM LEFT */}
                        <div className="w-12 h-12 border-b-4 border-l-4 border-primary" />

                        {/* Corner Bracket BOTTOM RIGHT */}
                        <div className="w-12 h-12 border-b-4 border-r-4 border-primary" />
                    </div>
                </div>

                {/* SEARCH BAR - BRUTALIST */}
                <div className="mb-10 max-w-3xl mx-auto">
                    <form action="/kesfet" method="GET" className="relative">
                        <div className="bg-black border-3 border-white flex items-center shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] transition-all">
                            <div className="pl-5 pr-3">
                                <Search className="w-5 h-5 text-primary" />
                            </div>
                            <Input
                                name="q"
                                placeholder="ARA..."
                                className="h-14 bg-transparent border-none text-base text-white placeholder:text-white/30 focus-visible:ring-0 font-bold uppercase tracking-wider"
                                defaultValue={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                            />
                            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                        </div>
                    </form>
                </div>

                {/* CATEGORIES - HORIZONTAL SCROLL */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
                        <Link href="/kesfet">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "cursor-pointer px-5 py-2.5 text-xs font-black tracking-widest uppercase border-2 transition-all whitespace-nowrap",
                                    !currentCategory
                                        ? "bg-primary text-black border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                        : "bg-black text-white border-white hover:bg-white hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                                )}
                            >
                                <Globe className="w-3 h-3 mr-2" />
                                TÜMÜ
                            </Badge>
                        </Link>
                        {categories.map((catString) => {
                            const iconMap: Record<string, any> = {
                                "Kuantum": Atom,
                                "Astrofizik": Rocket,
                                "Teknoloji": Cpu,
                                "Varsayılan": Radio
                            };
                            const Icon = Object.entries(iconMap).find(([k]) => catString.includes(k))?.[1] || Radio;

                            return (
                                <Link
                                    key={catString}
                                    href={`/kesfet?category=${encodeURIComponent(catString)}${currentQuery ? `&q=${currentQuery}` : ''}`}
                                >
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "cursor-pointer px-5 py-2.5 text-xs font-black tracking-widest uppercase border-2 transition-all whitespace-nowrap",
                                            currentCategory === catString
                                                ? "bg-primary text-black border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                                : "bg-black text-white border-white hover:bg-white hover:text-black active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
                                        )}
                                    >
                                        <Icon className="w-3 h-3 mr-2" />
                                        {catString}
                                    </Badge>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* ARTICLES GRID - BRUTALIST CARDS */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {!initialArticles || initialArticles.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 border-4 border-white/20 bg-black">
                            <Radio className="h-20 w-20 text-white/10 mb-6" />
                            <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-2">VERİ YOK</h3>
                            <p className="text-white/50 font-mono text-sm">Kriterlere uygun makale bulunamadı</p>
                        </div>
                    ) : (
                        initialArticles.map((article) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="group"
                            >
                                <Link href={`/blog/${article.slug}`} className="block">
                                    <div className="bg-black border-3 border-white overflow-hidden transition-all hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] h-full flex flex-col">
                                        {/* Category Bar */}
                                        <div className="bg-primary border-b-4 border-white px-4 py-2 flex items-center justify-between">
                                            <span className="text-xs font-black text-black uppercase tracking-widest">{article.category}</span>
                                            <div className="w-2 h-2 bg-black" />
                                        </div>

                                        {/* Image */}
                                        <div className="aspect-video w-full relative overflow-hidden border-b-4 border-white bg-zinc-900">
                                            {article.image_url ? (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Atom className="h-20 w-20 text-white/10" />
                                                </div>
                                            )}
                                            {/* Grid Overlay */}
                                            <div className="absolute inset-0 opacity-20" style={{
                                                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(168,85,247, .5) 25%, rgba(168,85,247, .5) 26%, transparent 27%, transparent 74%, rgba(168,85,247, .5) 75%, rgba(168,85,247, .5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(168,85,247, .5) 25%, rgba(168,85,247, .5) 26%, transparent 27%, transparent 74%, rgba(168,85,247, .5) 75%, rgba(168,85,247, .5) 76%, transparent 77%, transparent)',
                                                backgroundSize: '40px 40px'
                                            }} />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col gap-4 flex-1">
                                            <div>
                                                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                                                    {article.title}
                                                </h3>
                                                <div className="h-1 w-12 bg-primary mb-3" />
                                                <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                                                    {article.excerpt || article.content.substring(0, 150)}...
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-auto pt-4 border-t-2 border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                                                <span className="uppercase">{article.profiles?.username || 'UNKNOWN'}</span>
                                                <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </div>
    );
}
