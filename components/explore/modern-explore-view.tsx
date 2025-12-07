"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Rocket, Atom, Cpu, Radio, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { SpaceBackground } from "./space-background";
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1
    }
};

const hudVariants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)"
    }
};

export function ModernExploreView({
    initialArticles,
    categories,
    currentQuery,
    currentCategory
}: ModernExploreViewProps) {
    const [searchQuery, setSearchQuery] = useState(currentQuery || "");
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="min-h-screen bg-black pb-20 md:pb-0 relative overflow-x-hidden font-sans selection:bg-cyan-500/30">
            {/* Space Station Viewport Background */}
            <SpaceBackground />

            <div className="container max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-20">
                {/* HUD Header Section */}
                <motion.div
                    variants={hudVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="space-y-8 mb-12"
                >
                    {/* Command Center Title Area */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 relative">
                        {/* Decorative HUD Lines */}
                        <div className="absolute bottom-0 left-0 w-20 h-[2px] bg-cyan-500" />
                        <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-cyan-500" />

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                                    <Rocket className="relative h-8 w-8 text-cyan-400 animate-pulse" />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 mt-1 uppercase">
                                    KEŞFET
                                </h1>
                            </div>
                            Topluluğumuzun kaleminden çıkan bilimsel makaleleri, özgün içerikleri ve derinlemesine analizleri keşfedin. Bilgi paylaştıkça çoğalır.
                        </div>

                        {/* Stats / Status Hologram */}
                        <div className="hidden md:flex gap-8">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-cyan-500/50 font-mono uppercase tracking-widest">Bağlantı</span>
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                    <span className="font-bold">STABIL</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-cyan-500/50 font-mono uppercase tracking-widest">Konum</span>
                                <span className="font-bold text-white">YÖRÜNGE</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Console (Search) */}
                    <div className="relative max-w-3xl mx-auto">
                        <div className={cn(
                            "absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur transition-opacity duration-500",
                            isFocused ? "opacity-60" : "opacity-20"
                        )} />
                        <div className="relative bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-1 flex items-center shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                            <div className="pl-4 pr-3 text-cyan-500/50">
                                <Search className="w-6 h-6" />
                            </div>
                            <form action="/kesfet" method="GET" className="flex-1">
                                <Input
                                    name="q"
                                    placeholder="EVRENDE ARA..."
                                    className="h-14 bg-transparent border-none text-lg text-white placeholder:text-cyan-900/50 focus-visible:ring-0 font-medium tracking-wide"
                                    defaultValue={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    autoComplete="off"
                                />
                                {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                            </form>
                            <div className="pr-4 hidden md:block">
                                <span className="text-[10px] font-mono text-cyan-500/30 border border-cyan-500/20 px-2 py-1 rounded">
                                    CMD + K
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* System Modules (Categories) */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/kesfet">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "cursor-pointer px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm border transition-all duration-300",
                                    !currentCategory
                                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                        : "bg-black/50 border-white/10 text-white/50 hover:border-cyan-500/50 hover:text-cyan-300"
                                )}
                            >
                                <Globe className="w-3 h-3 mr-2 animate-spin-slow" />
                                TÜM VERİLER
                            </Badge>
                        </Link>
                        {categories.map((catString) => {
                            // Map text icons for fun
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
                                            "cursor-pointer px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm border transition-all duration-300",
                                            currentCategory === catString
                                                ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                                : "bg-black/50 border-white/10 text-white/50 hover:border-cyan-500/50 hover:text-cyan-300"
                                        )}
                                    >
                                        <Icon className="w-3 h-3 mr-2" />
                                        {catString}
                                    </Badge>
                                </Link>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Data Logs Grid (Zero-G Cards) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {!initialArticles || initialArticles.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                            className="col-span-full flex flex-col items-center justify-center py-32 border border-white/5 rounded-lg bg-white/5 backdrop-blur-sm"
                        >
                            <Radio className="h-16 w-16 text-cyan-500/20 mb-6 animate-pulse" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Sinyal Yok</h3>
                            <p className="text-cyan-500/50 font-mono mt-2">Kriterlere uygun veri bulunamadı.</p>
                        </motion.div>
                    ) : (
                        initialArticles.map((article, index) => {
                            // Calculate random float animation parameters for Zero-G effect
                            const randomDuration = 3 + Math.random() * 2;
                            const randomDelay = Math.random() * 2;

                            return (
                                <motion.div
                                    key={article.id}
                                    variants={itemVariants}
                                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                    className="h-full"
                                >
                                    <motion.div
                                        className="h-full group relative"
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: randomDuration,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: randomDelay
                                        }}
                                    >
                                        <Link href={`/blog/${article.slug}`} className="block h-full">
                                            {/* Holographic Card Container */}
                                            <div className="h-full bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden relative transition-all duration-500 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] clip-path-polygon">

                                                {/* Corner Accents */}
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                                                {/* Image Window */}
                                                <div className="aspect-video w-full relative overflow-hidden border-b border-white/5">
                                                    <div className="absolute inset-0 bg-cyan-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                                                    {article.image_url ? (
                                                        <img
                                                            src={article.image_url}
                                                            alt={article.title}
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                                            <Atom className="h-16 w-16 text-cyan-900/40" />
                                                        </div>
                                                    )}

                                                    <div className="absolute bottom-3 left-3 z-20">
                                                        <Badge className="bg-black/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm font-mono text-[10px] tracking-widest uppercase">
                                                            {article.category}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Data Readout (Content) */}
                                                <div className="p-6 flex flex-col gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors uppercase tracking-wide">
                                                            {article.title}
                                                        </h3>
                                                        <div className="h-[1px] w-10 bg-cyan-900 my-3 group-hover:w-full group-hover:bg-cyan-500/50 transition-all duration-700" />
                                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
                                                            {article.excerpt || article.content.substring(0, 150)}...
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between text-xs font-mono text-cyan-500/60 pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 group-hover:animate-ping" />
                                                            <span>AUTHOR: {article.profiles?.username?.toUpperCase() || 'UNKNOWN'}</span>
                                                        </div>
                                                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </div>
        </div>
    );
}
