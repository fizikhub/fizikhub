"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, ArrowUpRight, Clock, Eye, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Article {
    id: number;
    title: string;
    slug: string;
    summary?: string;
    content?: string;
    image_url?: string;
    category?: string;
    created_at?: string;
    views?: number;
    author?: { full_name?: string; avatar_url?: string };
    profiles?: { full_name?: string; avatar_url?: string };
}

interface MagazineCardProps {
    article: Article;
    variant?: "hero" | "feature" | "standard" | "compact";
    index?: number;
}

export function MagazineCard({ article, variant = "standard", index = 0 }: MagazineCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
    const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
    const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / rect.width);
        y.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url;
    const excerpt = article.summary || article.content?.replace(/<[^>]+>/g, "").slice(0, 120) + "...";

    const sizeClasses = {
        hero: "md:col-span-2 lg:col-span-3 row-span-2 h-[600px] lg:h-[700px]",
        feature: "md:col-span-2 lg:col-span-2 h-[450px]",
        standard: "h-[400px]",
        compact: "h-[320px]"
    };

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            className={cn(
                "group relative rounded-3xl overflow-hidden cursor-pointer",
                sizeClasses[variant]
            )}
        >
            <Link href={`/blog/${article.slug}`} className="block h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={article.image_url || "/images/placeholder.webp"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end" style={{ transform: "translateZ(50px)" }}>
                    {/* Category Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4"
                    >
                        <span className="inline-flex items-center px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                            {article.category || "Genel"}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <h3 className={cn(
                        "font-black text-white leading-[0.95] tracking-tight mb-4 transition-all duration-500",
                        variant === "hero" ? "text-4xl sm:text-5xl lg:text-6xl" :
                            variant === "feature" ? "text-3xl sm:text-4xl" :
                                "text-2xl sm:text-3xl"
                    )}>
                        {article.title}
                    </h3>

                    {/* TL;DR on Hover */}
                    <motion.div
                        initial={false}
                        animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pb-2 border-t border-white/20">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">TL;DR</p>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{excerpt}</p>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            {authorAvatar && (
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                                    <Image src={authorAvatar} alt={authorName} width={32} height={32} className="object-cover" />
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-bold text-white">{authorName}</p>
                                <p className="text-[10px] text-white/50 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {article.created_at && formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-white/50">
                            <span className="flex items-center gap-1 text-[10px]">
                                <Eye className="w-3 h-3" />
                                {article.views || 0}
                            </span>
                            <ArrowUpRight className="w-5 h-5 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: "translateZ(80px)" }}>
                    <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>

                {/* Shine Effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 0.3s"
                    }}
                />
            </Link>
        </motion.article>
    );
}
