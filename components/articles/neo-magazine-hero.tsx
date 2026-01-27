"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NeoMagazineHeroProps {
    articles: Article[];
}

export function NeoMagazineHero({ articles }: NeoMagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const featured = articles[0]; // The main feature
    const subFeatured = articles.slice(1, 3); // Secondary features

    return (
        <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* PRIMARY FEATURE (Large Left) */}
                <div className="lg:col-span-8 group relative">
                    <Link href={`/blog/${featured.slug}`} className="block h-full">
                        <article className="relative h-full min-h-[400px] lg:min-h-[500px] w-full rounded-xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-white dark:bg-zinc-900 group">

                            {/* Image Background */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={featured.cover_url || featured.image_url || "/images/placeholder-hero.jpg"}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                            </div>

                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-20">
                                <span className="inline-block px-3 py-1 bg-[#FFC800] border-2 border-black text-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000]">
                                    Öne Çıkan
                                </span>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-20 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                                    <span className="text-[#FFC800]">{featured.category}</span>
                                    <span>•</span>
                                    <span>{featured.author?.full_name || "FizikHub"}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(featured.created_at), { addSuffix: true, locale: tr })}</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight uppercase group-hover:text-[#FFC800] transition-colors">
                                    {featured.title}
                                </h2>

                                <p className="text-white/80 line-clamp-2 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
                                    {featured.excerpt || (featured.content ? featured.content.substring(0, 120).replace(/<[^>]*>?/gm, '') + "..." : "")}
                                </p>

                                <div className="mt-4">
                                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-black text-black font-black uppercase text-sm tracking-wide shadow-[2px_2px_0px_0px_white] hover:bg-[#FFC800] hover:border-black hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                                        Okumaya Başla <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Link>
                </div>

                {/* SECONDARY FEATURES (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {subFeatured.map((article) => (
                        <Link key={article.id} href={`/blog/${article.slug}`} className="block flex-1 group">
                            <article className="relative h-full min-h-[220px] w-full rounded-xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-white dark:bg-zinc-900">

                                {/* Image */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={article.cover_url || article.image_url || "/images/placeholder.jpg"}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-cyan-400 border border-black text-black text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_#000]">
                                            {article.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-white leading-tight uppercase mb-2 group-hover:text-cyan-300 transition-colors">
                                        {article.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {/* View All Button */}
                    <Link href="/blog?sort=latest" className="block mt-auto group">
                        <div className="w-full py-4 bg-black border-[3px] border-white/20 rounded-xl flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest hover:bg-[#FFC800] hover:text-black hover:border-black transition-all">
                            Tüm Arşivi Gör <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
