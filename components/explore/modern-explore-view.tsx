"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Microscope, Atom } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { LabBackground } from "./lab-background";

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
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
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
        <div className="min-h-screen bg-background pb-20 md:pb-0 relative">
            {/* Laboratory Background */}
            <LabBackground />

            <div className="container max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
                {/* Header Section */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6 mb-8"
                >
                    {/* Hero with Laboratory Theme */}
                    <div className="space-y-4 relative">
                        {/* Laboratory Bench Effect */}
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 rounded-full" />

                        <div className="flex items-center gap-4">
                            <motion.div
                                className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 backdrop-blur-sm"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(234, 88, 12, 0.2)',
                                        '0 0 30px rgba(234, 88, 12, 0.3)',
                                        '0 0 20px rgba(234, 88, 12, 0.2)',
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Microscope className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                                <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
                                    Keşif Laboratuvarı
                                </h1>
                                <p className="text-sm md:text-base text-muted-foreground mt-1">
                                    EXP-2024 // Bilimsel Araştırma ve Keşif Modülü
                                </p>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Topluluk tarafından yazılan en son bilimsel makaleleri analiz edin ve keşfedin.
                        </p>
                    </div>

                    {/* Search Bar - Control Panel Style */}
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-xl"
                            animate={{ opacity: isFocused ? 1 : 0.5 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none z-10" />
                            <form action="/kesfet" method="GET">
                                <Input
                                    name="q"
                                    placeholder="Arama protokolü başlatın..."
                                    className="pl-14 h-14 md:h-16 text-base rounded-2xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40 transition-all shadow-lg"
                                    defaultValue={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                            </form>
                            {isFocused && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Categories - Periodic Table Style */}
                    <div className="flex flex-wrap gap-2">
                        <Link href="/kesfet">
                            <Badge
                                variant={!currentCategory ? "default" : "outline"}
                                className="cursor-pointer px-5 py-2.5 text-sm font-bold rounded-lg border-2 hover:scale-105 hover:shadow-lg transition-all backdrop-blur-sm"
                                style={{
                                    borderColor: !currentCategory ? 'rgba(234, 88, 12, 0.5)' : 'rgba(234, 88, 12, 0.2)',
                                    background: !currentCategory ? 'rgba(234, 88, 12, 0.15)' : 'rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <Atom className="w-3 h-3 mr-1.5 inline" />
                                TÜMÜ
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/kesfet?category=${encodeURIComponent(cat)}${currentQuery ? `&q=${currentQuery}` : ''}`}
                            >
                                <Badge
                                    variant={currentCategory === cat ? "default" : "outline"}
                                    className="cursor-pointer px-5 py-2.5 text-sm font-bold rounded-lg border-2 hover:scale-105 hover:shadow-lg transition-all backdrop-blur-sm"
                                    style={{
                                        borderColor: currentCategory === cat ? 'rgba(234, 88, 12, 0.5)' : 'rgba(234, 88, 12, 0.2)',
                                        background: currentCategory === cat ? 'rgba(234, 88, 12, 0.15)' : 'rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Articles Grid - Laboratory Slides */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {!initialArticles || initialArticles.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className="col-span-full text-center py-20"
                        >
                            <div className="inline-flex p-6 rounded-2xl bg-primary/5 border border-primary/20 mb-4 backdrop-blur-sm">
                                <Search className="h-10 w-10 text-primary" />
                            </div>
                            <p className="text-lg text-muted-foreground font-medium">
                                Analiz sonuçları bulunamadı.
                            </p>
                            <p className="text-sm text-muted-foreground/60 mt-2">
                                Arama parametrelerini yeniden kalibre edin.
                            </p>
                        </motion.div>
                    ) : (
                        initialArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                custom={index}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/blog/${article.slug}`} className="group block h-full">
                                    <div className="flex flex-col h-full overflow-hidden rounded-2xl border-2 border-primary/10 bg-background/40 backdrop-blur-sm shadow-xl transition-all hover:shadow-2xl hover:border-primary/30 hover:bg-background/60 relative">
                                        {/* Lab Slide Corner */}
                                        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                                            <div className="absolute inset-0 border-l-2 border-b-2 border-primary rounded-bl-3xl" />
                                        </div>

                                        {/* Image - Petri Dish Style */}
                                        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/5 to-background relative">
                                            {article.image_url ? (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Microscope className="h-16 w-16 text-primary/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-background/95 backdrop-blur-md shadow-lg border border-primary/20 font-bold">
                                                    {article.category}
                                                </Badge>
                                            </div>
                                            {/* Scan Line Effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100"
                                                animate={{ y: ['-100%', '100%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-5 space-y-3">
                                            <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
                                                {article.excerpt || article.content.substring(0, 150)}...
                                            </p>

                                            {/* Footer - Data Panel */}
                                            <div className="flex items-center justify-between pt-3 mt-auto border-t border-primary/10">
                                                <div className="flex items-center gap-2">
                                                    {article.profiles?.avatar_url ? (
                                                        <img
                                                            src={article.profiles.avatar_url}
                                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-2 ring-primary/20">
                                                            {article.profiles?.username?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium truncate max-w-[120px]">
                                                        {article.profiles?.username}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                                                    {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}
