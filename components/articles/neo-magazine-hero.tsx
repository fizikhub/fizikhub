"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface NeoMagazineHeroProps {
    articles: Article[];
}

export function NeoMagazineHero({ articles }: NeoMagazineHeroProps) {
    if (!articles || articles.length === 0) return null;

    const featured = articles[0]; // Covers Story
    const subFeatured = articles.slice(1, 3); // Top Stories

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    /* Mobile check or simple return for sub-featured to avoid hooks issues? 
       Actually hooks are fine, just css media queries handle layout. 
       We only apply tilt to the main card container. */

    return (
        <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* PRIMARY FEATURE (Cover Story) - 3D TILT ENABLED */}
                <div
                    className="lg:col-span-8 relative perspective-1000 group z-10"
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                >
                    <Link href={`/blog/${featured.slug}`} className="block h-full relative z-20">
                        <motion.article
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border-[2px] sm:border-[3px] border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] transition-shadow duration-300 bg-[#27272a]"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0 z-0 transform-style-3d translate-z-[-20px]">
                                <Image
                                    src={featured.cover_url || featured.image_url || "/images/placeholder-hero.jpg"}
                                    alt={featured.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                            </div>

                            {/* Floating Badge - Popping out */}
                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 transform translate-z-[40px]">
                                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FACC15] border-[2px] sm:border-[3px] border-black text-black text-xs sm:text-sm font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] -rotate-2 group-hover:rotate-0 transition-transform">
                                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Kapak Konusu
                                </span>
                            </div>

                            {/* Content Overlay - Popping out more */}
                            <div className="absolute bottom-0 left-0 w-full p-5 sm:p-10 z-20 flex flex-col gap-2 sm:gap-4 transform translate-z-[30px]">
                                <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1">
                                    <span className="text-[#FACC15] px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black/50 backdrop-blur-md rounded border border-white/20">
                                        {featured.category}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(featured.created_at), { addSuffix: true, locale: tr })}</span>
                                </div>

                                <motion.h2
                                    className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight uppercase drop-shadow-xl group-hover:text-[#FACC15] transition-colors duration-300"
                                >
                                    {featured.title}
                                </motion.h2>

                                <p className="hidden sm:block text-white/80 line-clamp-2 max-w-2xl text-base sm:text-lg font-medium leading-relaxed drop-shadow-md">
                                    {featured.excerpt || (featured.content ? featured.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..." : "")}
                                </p>

                                <div className="mt-2 sm:mt-4 flex items-center gap-4">
                                    {/* Author Avatar */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-black/50 overflow-hidden">
                                            <Image
                                                src={featured.author?.avatar_url || "/images/default-avatar.png"}
                                                alt={featured.author?.full_name || "Yazar"}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-white text-xs sm:text-sm">{featured.author?.full_name}</span>
                                    </div>

                                    <div className="flex-1" />

                                    <span className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-black font-black uppercase text-sm tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FACC15] hover:scale-105 transition-all">
                                        Oku <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    </Link>
                </div>

                {/* SECONDARY FEATURES (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6 h-full">
                    {subFeatured.map((article, i) => (
                        <Link key={article.id} href={`/blog/${article.slug}`} className="block flex-1 group h-full">
                            <article className="relative h-full min-h-[220px] sm:min-h-[280px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border-[2px] sm:border-[3px] border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000] transition-all bg-[#27272a]">

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
