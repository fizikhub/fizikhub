"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Compass } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function ModernExploreView({
    initialArticles,
    categories,
    currentQuery,
    currentCategory
}: ModernExploreViewProps) {
    const [searchQuery, setSearchQuery] = useState(currentQuery || "");

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            <div className="container max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
                {/* Header Section */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6 mb-8"
                >
                    {/* Hero */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/10">
                                <Compass className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Keşfet</h1>
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                            Topluluk tarafından yazılan en son makaleleri keşfedin.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                        <form action="/kesfet" method="GET">
                            <Input
                                name="q"
                                placeholder="Makale ara..."
                                className="pl-12 h-12 md:h-14 text-base rounded-xl border-2 focus-visible:ring-offset-0 transition-all"
                                defaultValue={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                        </form>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                        <Link href="/kesfet">
                            <Badge
                                variant={!currentCategory ? "default" : "outline"}
                                className="cursor-pointer px-4 py-2 text-sm font-medium rounded-full hover:scale-105 transition-transform"
                            >
                                Tümü
                            </Badge>
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/kesfet?category=${encodeURIComponent(cat)}${currentQuery ? `&q=${currentQuery}` : ''}`}
                            >
                                <Badge
                                    variant={currentCategory === cat ? "default" : "outline"}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium rounded-full hover:scale-105 transition-transform"
                                >
                                    {cat}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Articles Grid */}
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
                            <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-lg text-muted-foreground font-medium">
                                Aradığınız kriterlere uygun makale bulunamadı.
                            </p>
                        </motion.div>
                    ) : (
                        initialArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                custom={index}
                            >
                                <Link href={`/blog/${article.slug}`} className="group block h-full">
                                    <div className="flex flex-col h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                            {article.image_url ? (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                    <Compass className="h-16 w-16 text-primary/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-background/90 backdrop-blur-sm shadow-sm">
                                                    {article.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1 p-5 space-y-3">
                                            <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
                                                {article.excerpt || article.content.substring(0, 150)}...
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 mt-auto border-t">
                                                <div className="flex items-center gap-2">
                                                    {article.profiles?.avatar_url ? (
                                                        <img
                                                            src={article.profiles.avatar_url}
                                                            className="w-7 h-7 rounded-full object-cover ring-2 ring-muted"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary ring-2 ring-muted">
                                                            {article.profiles?.username?.[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium truncate max-w-[120px]">
                                                        {article.profiles?.username}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
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
