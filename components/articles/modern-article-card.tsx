"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Clock, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/api";

interface ModernArticleCardProps {
    article: Article;
    index?: number;
}

export function ModernArticleCard({ article, index = 0 }: ModernArticleCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);
    const brightness = useTransform(mouseY, [-300, 300], [1.1, 0.9]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ perspective: 1000 }}
            className="group h-full"
        >
            <Link href={`/blog/${article.slug}`} className="block h-full">
                <motion.div
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        filter: `brightness(${brightness})`,
                        transformStyle: "preserve-3d",
                    }}
                    className="relative h-full bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/20"
                >
                    {/* Image Container */}
                    <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />

                        {/* Dynamic Glare Effect */}
                        <motion.div
                            style={{
                                x: useTransform(mouseX, [-300, 300], [-100, 100]),
                                y: useTransform(mouseY, [-300, 300], [-100, 100]),
                                opacity: useTransform(mouseY, [-300, 300], [0, 0.3]),
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent z-20 pointer-events-none mix-blend-overlay"
                        />

                        <Image
                            src={article.image_url || "/images/placeholder-article.webp"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                            <Badge variant="secondary" className="bg-background/50 backdrop-blur-md border-white/10 text-xs font-medium">
                                {article.category}
                            </Badge>
                            {article.is_featured && (
                                <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-0 shadow-lg shadow-amber-500/20 animate-pulse">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Öne Çıkan
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6 z-20 -mt-12 space-y-4">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                            <span className="flex items-center gap-1 bg-background/50 backdrop-blur px-2 py-1 rounded-full border border-white/5">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                            </span>
                            <span className="flex items-center gap-1 bg-background/50 backdrop-blur px-2 py-1 rounded-full border border-white/5">
                                <Eye className="w-3 h-3" />
                                {article.views || 0}
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2" style={{ transform: "translateZ(20px)" }}>
                            {article.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                            {article.summary}
                        </p>

                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-background">
                                    <Image
                                        src={article.profiles?.avatar_url || "/images/default-avatar.png"}
                                        alt={article.profiles?.full_name || "Yazar"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    {article.profiles?.full_name || "Anonim"}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                Oku <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}
