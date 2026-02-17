"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NeoMagazineHeroProps {
    articles: Article[];
}

export function NeoMagazineHero({ articles }: NeoMagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const featured = articles[0]; // Covers Story
    const subFeatured = articles.slice(1, 3); // Top Stories

    return (
        <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* PRIMARY FEATURE (Cover Story) */}
                <div className="lg:col-span-8 group relative perspective-1000">
                    <Link href={`/blog/${featured.slug}`} className="block h-full">
                        <article className="relative h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-300 bg-[#27272a]">

                            {/* Image Background */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={featured.cover_url || featured.image_url || "/images/placeholder-hero.jpg"}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute top-6 left-6 z-20">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FACC15] border-[3px] border-black text-black text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform">
                                    <Sparkles className="w-4 h-4" />
                                    Kapak Konusu
                                </span>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 z-20 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-white/90 text-xs font-black uppercase tracking-widest mb-1">
                                    <span className="text-[#FACC15] px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/20">
                                        {featured.category}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(featured.created_at), { addSuffix: true, locale: tr })}</span>
                                </div>

                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight uppercas drop-shadow-xl group-hover:text-[#FACC15] transition-colors duration-300">
                                    {featured.title}
                                </h2>

                                <p className="text-white/80 line-clamp-2 max-w-2xl text-base sm:text-lg font-medium leading-relaxed drop-shadow-md">
                                    {featured.excerpt || (featured.content ? featured.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..." : "")}
                                </p>

                                <div className="mt-4 flex items-center gap-4">
                                    {/* Author Avatar */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-black/50 overflow-hidden">
                                            <Image
                                                src={featured.author?.avatar_url || "/images/default-avatar.png"}
                                                alt={featured.author?.full_name || "Yazar"}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-white text-sm">{featured.author?.full_name}</span>
                                    </div>

                                    <div className="flex-1" />

                                    <span className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-black font-black uppercase text-sm tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FACC15] hover:scale-105 transition-all">
                                        Oku <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>
                </div>

                {/* SECONDARY FEATURES (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    {subFeatured.map((article, i) => (
                        <Link key={article.id} href={`/blog/${article.slug}`} className="block flex-1 group h-full">
                            <article className="relative h-full min-h-[280px] w-full rounded-3xl overflow-hidden border-[3px] border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] transition-all bg-[#27272a]">

                                {/* Image */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={article.cover_url || article.image_url || "/images/placeholder.jpg"}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={cn(
                                            "px-3 py-1 border-2 border-black text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000]",
                                            i === 0 ? "bg-[#FF0080]" : "bg-[#23A9FA]" // Pink / Blue
                                        )}>
                                            {article.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase mb-2 group-hover:text-[#FACC15] transition-colors drop-shadow-lg">
                                        {article.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {/* View Archive Mini-Link */}
                    <Link href="/makale?sort=latest" className="group">
                        <div className="w-full py-4 bg-transparent border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 font-bold uppercase text-xs hover:border-[#FACC15] hover:text-[#FACC15] hover:bg-[#FACC15]/10 transition-all">
                            Tüm Arşivi Gör <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
