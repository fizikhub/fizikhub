"use client";

import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]
import { OptimizedImage, OptimizedAvatar } from "@/components/ui/optimized-image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, Bookmark, Share2, MessageCircle, MoreHorizontal } from "lucide-react";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { toggleArticleLike, toggleArticleBookmark } from "@/app/makale/actions";
import { useHaptic } from "@/hooks/use-haptic";
// Confetti and other heavy interactions will be loaded on demand to minimize TBT


interface NeoArticleCardProps {
    article: Article;
    initialLikes?: number;
    initialComments?: number;
    initialIsLiked?: boolean;
    initialIsBookmarked?: boolean;
    className?: string;
    priority?: boolean;
}

export function NeoArticleCard({
    article,
    initialLikes = 0,
    initialIsLiked = false,
    initialIsBookmarked = false,
    className,
    priority = false
}: NeoArticleCardProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const { triggerHaptic } = useHaptic();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLikeLoading) return;

        if (!isLiked) {
            triggerHaptic();
            // Dynamite import for heavy interaction library (canvas-confetti)
            import("@/lib/confetti").then(mod => {
                mod.triggerSmallConfetti(e.clientX, e.clientY);
            });
        }

        const previousLiked = isLiked;
        const previousCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLikeLoading(true);

        try {
            const result = await toggleArticleLike(article.id);
            if (!result.success) {
                setIsLiked(previousLiked);
                setLikeCount(previousCount);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Giriş yapmalısınız!");
                }
            }
        } catch {
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const previousBookmarked = isBookmarked;
        setIsBookmarked(!isBookmarked);

        try {
            const result = await toggleArticleBookmark(article.id);
            if (!result.success) {
                setIsBookmarked(previousBookmarked);
                if (result.error === "Giriş yapmalısınız.") toast.error("Giriş yapmalısınız!");
            } else if (!previousBookmarked) {
                toast.success("Kaydedildi!");
            }
        } catch {
            setIsBookmarked(previousBookmarked);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/makale/${article.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link kopyalandı!");
    };

    const getPreviewText = (htmlContent: string | null | undefined, summary: string | null | undefined) => {
        const text = htmlContent 
            ? htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() 
            : (summary || "Bu makale için içerik önizlemesi bulunmuyor.");
            
        return text.replace(/^[#\s]+/, '');
    };

    const previewText = getPreviewText(article.content, article.summary);

    const authorName = article.author?.full_name || article.profiles?.full_name || "Anonim";
    const authorAvatar = article.author?.avatar_url || article.profiles?.avatar_url || "/images/default-avatar.png";

    return (
        <ViewTransitionLink href={`/makale/${article.slug}`} className="block group rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <article
                className={cn(
                    "flex flex-col relative overflow-hidden",
                    // COLOR PALETTE: Dark Mode = #27272a (Zinc 800) - Lighter than background
                    "bg-white dark:bg-[#27272a]",
                    // BORDER: Softer on mobile, full on desktop
                    "border-2 sm:border-[3px] border-black rounded-[8px]",
                    // SHADOW: Lighter on mobile
                    "shadow-[3px_3px_0px_0px_#000] sm:shadow-neo border-black",
                    // HOVER
                    "transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]",
                    className
                )}
            >
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. IMAGE SECTION */}
                <div className="relative aspect-[16/9] w-full border-b-2 sm:border-b-[3px] border-black bg-[#EAB308] z-10 overflow-hidden">
                    <OptimizedImage
                        src={article.image_url || "/images/placeholder-article.webp"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 350px"
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3 right-3 z-20 perspective-500">
                        <span className="inline-block max-w-full truncate bg-[#EAB308] border-[2px] border-black text-black px-2.5 py-1 sm:px-3 font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform origin-center">
                            {article.category || "GENEL"}
                        </span>
                    </div>
                </div>

                {/* 2. CONTENT SECTION */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2.5 sm:gap-3 z-10 relative">

                    {/* Title - High Contrast White in Dark Mode */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-[19px] min-[390px]:text-[20px] sm:text-2xl font-black text-black dark:text-zinc-50 leading-[1.08] uppercase tracking-normal mb-0.5 sm:mb-1">
                        <span className="bg-gradient-to-r from-transparent to-transparent group-hover:from-[#EAB308]/30 group-hover:to-[#EAB308]/30 transition-all duration-300 rounded-sm">
                            {article.title}
                        </span>
                    </h3>

                    {/* Preview Text - Lighter Grey for Contrast */}
                    <p
                        data-nosnippet
                        className="font-[family-name:var(--font-inter)] text-[14px] sm:text-[15px] font-medium text-neutral-600 dark:text-zinc-300 line-clamp-3 leading-relaxed tracking-normal"
                    >
                        {previewText}
                    </p>

                    {/* Spacer */}
                    <div className="mt-auto"></div>

                    {/* SEPARATOR - Black Line */}
                    <div className="w-full h-px border-t-[2px] border-dashed border-black/10 dark:border-black/20 my-1 sm:my-2" />

                    {/* 3. AUTHOR & ACTIONS FOOTER */}
                    <div className="flex items-center justify-between gap-2 pt-1.5 sm:gap-3 sm:pt-2">

                        {/* Author */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="relative aspect-square w-9 sm:w-10 flex-shrink-0 rounded-full border-[1.5px] sm:border-2 border-black overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000]">
                                <OptimizedAvatar
                                    src={authorAvatar}
                                    alt={authorName}
                                    size={40}
                                    fillContainer
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col leading-none gap-0.5 min-w-0">
                                <span className="text-[11px] sm:text-xs font-black uppercase text-black dark:text-zinc-100 truncate tracking-normal max-w-[86px] min-[390px]:max-w-[140px] sm:max-w-[180px]">
                                    {authorName}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 dark:text-zinc-400 uppercase tracking-wide">
                                    {formatDistanceToNow(new Date(article.created_at || new Date()), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Actions Code - Pure Black Borders */}
                        <div className="relative flex items-center justify-end gap-1.5 sm:gap-2 flex-shrink-0">
                            {/* Like */}
                            <button
                                onClick={handleLike}
                                aria-label={isLiked ? "Beğeniyi kaldır" : "Makaleyi beğen"}
                                className={cn(
                                    "w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-[8px] border-[1.5px] sm:border-2 border-black transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
                                    isLiked ? "bg-[#EAB308] text-black" : "bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Heart className={cn("w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.5px]", isLiked ? "fill-black stroke-black" : "stroke-current")} />
                            </button>

                            {/* Comment */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const url = `/makale/${article.slug}#comments`;
                                    if (document.startViewTransition) {
                                        document.startViewTransition(() => {
                                            window.location.href = url;
                                        });
                                    } else {
                                        window.location.href = url;
                                    }
                                }}
                                aria-label="Yorumlara git"
                                className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-[8px] border-[1.5px] sm:border-2 border-black bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#23A9FA] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <MessageCircle className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.5px] stroke-current" />
                            </button>

                            {/* Mobile More */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsActionMenuOpen((open) => !open);
                                }}
                                aria-label="Diğer makale işlemleri"
                                aria-expanded={isActionMenuOpen}
                                className="w-11 h-11 min-[390px]:hidden flex items-center justify-center rounded-[8px] border-[1.5px] border-black bg-white dark:bg-[#18181b] text-black dark:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1.5px_1.5px_0px_0px_#000]"
                            >
                                <MoreHorizontal className="w-[18px] h-[18px] stroke-[2.5px] stroke-current" />
                            </button>

                            {isActionMenuOpen && (
                                <div className="absolute bottom-[calc(100%+0.5rem)] right-0 z-30 flex gap-1.5 rounded-[10px] border-2 border-black bg-[#27272a] p-1.5 shadow-[3px_3px_0px_0px_#000] min-[390px]:hidden">
                                    <button
                                        onClick={handleShare}
                                        aria-label="Makaleyi paylaş"
                                        className="w-11 h-11 flex items-center justify-center rounded-[8px] border-[1.5px] border-black bg-white text-black transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1.5px_1.5px_0px_0px_#000]"
                                    >
                                        <Share2 className="w-[18px] h-[18px] stroke-[2.5px] stroke-current" />
                                    </button>
                                    <button
                                        onClick={handleBookmark}
                                        aria-label={isBookmarked ? "Kaydı kaldır" : "Makaleyi kaydet"}
                                        className={cn(
                                            "w-11 h-11 flex items-center justify-center rounded-[8px] border-[1.5px] border-black transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1.5px_1.5px_0px_0px_#000]",
                                            isBookmarked ? "bg-black text-white" : "bg-white text-black"
                                        )}
                                    >
                                        <Bookmark className={cn("w-[18px] h-[18px] stroke-[2.5px]", isBookmarked ? "fill-current" : "stroke-current")} />
                                    </button>
                                </div>
                            )}

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                aria-label="Makaleyi paylaş"
                                className="hidden min-[390px]:flex w-11 h-11 sm:w-10 sm:h-10 items-center justify-center rounded-[8px] border-[1.5px] sm:border-2 border-black bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#00F050] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <Share2 className="w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.5px] stroke-current" />
                            </button>

                            {/* Bookmark */}
                            <button
                                onClick={handleBookmark}
                                aria-label={isBookmarked ? "Kaydı kaldır" : "Makaleyi kaydet"}
                                className={cn(
                                    "hidden min-[390px]:flex w-11 h-11 sm:w-10 sm:h-10 items-center justify-center rounded-[8px] border-[1.5px] sm:border-2 border-black transition-all",
                                    "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
                                    "shadow-[1.5px_1.5px_0px_0px_#000] sm:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
                                    isBookmarked ? "bg-black text-white" : "bg-white dark:bg-[#18181b] text-black dark:text-white hover:bg-[#FF90E8]"
                                )}
                            >
                                <Bookmark className={cn("w-[18px] h-[18px] sm:w-5 sm:h-5 stroke-[2.5px]", isBookmarked ? "fill-current" : "stroke-current")} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </ViewTransitionLink>
    );
}
