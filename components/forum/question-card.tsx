"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedAvatar } from "@/components/ui/optimized-image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, Eye, ThumbsUp, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]

const stripHtml = (html: string) => html.replace(/<[^>]*>?/g, '');

interface QuestionCardProps {
    question: any;
    userVote?: number;
    badgeLabel?: string;
    badgeClassName?: string;
}

export const QuestionCard = React.memo(({ question, userVote = 0, badgeLabel }: QuestionCardProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Removed handleCardClick in favor of Link

    const handleVote = async (e: React.MouseEvent, type: 1 | -1) => {
        e.preventDefault();
        e.stopPropagation();
        if (isVoting) return;

        const previousVote = voteState;
        const previousCount = votes;

        let newVote: 1 | -1 | 0 = type;
        let newCount = votes;

        if (voteState === type) {
            newVote = 0;
            newCount -= type;
        } else {
            newVote = type;
            newCount += (type - (voteState || 0));
        }

        setVoteState(newVote);
        setVotes(newCount);
        setIsVoting(true);

        try {
            const result = await voteQuestion(question.id, type);
            if (!result.success) {
                setVoteState(previousVote);
                setVotes(previousCount);
                if (result.error === "Giriş yapmalısınız.") {
                    toast.error("Oy vermek için giriş yapmalısınız.");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            } else {
                // Haptic feedback could go here
            }
        } catch (error) {
            setVoteState(previousVote);
            setVotes(previousCount);
        } finally {
            setIsVoting(false);
        }
    };

    const answerCount = question.answers?.length || question.answers?.[0]?.count || 0;
    const cleanContent = stripHtml(question.content || "").slice(0, 300);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
        >
            <ViewTransitionLink
                href={`/forum/${question.id}`}
                className={cn(
                    "relative flex flex-col w-full h-full overflow-hidden transition-all duration-200 cursor-pointer group rounded-[8px]",
                    // CONTAINER STYLE (MATCHING TERM CARD)
                    "bg-white dark:bg-[#27272a]",
                    "border-[3px] border-black",
                    "shadow-[4px_4px_0px_0px_#000]",
                    "hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
            >
                {/* NOISE TEXTURE (If desired, consistent with Term) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* 1. Header Bar (Yellow Theme) */}
                <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-[#FFBD2E] z-10 relative">
                    <span className="font-black text-[10px] sm:text-xs uppercase tracking-widest text-black/80">
                        {question.category || "GENEL"}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">
                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        {badgeLabel && (
                            <div className="bg-black text-[#FFBD2E] px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]">
                                {badgeLabel}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Main Body */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3 z-10 relative">

                    {/* Title (Big like TermCard) */}
                    <h3 className="font-[family-name:var(--font-outfit)] text-xl sm:text-3xl font-black text-black dark:text-zinc-50 leading-[0.9] uppercase tracking-tighter mb-1 group-hover:text-[#FFBD2E] transition-colors line-clamp-3">
                        {question.title}
                    </h3>

                    {/* Content Snippet */}
                    <div className="relative">
                        <p className={cn(
                            "font-[family-name:var(--font-inter)] text-sm font-medium text-neutral-600 dark:text-zinc-400 leading-relaxed font-mono-accent",
                            !isExpanded && "line-clamp-4"
                        )}>
                            {cleanContent}
                            {!isExpanded && question.content?.length > 160 && "..."}
                            {isExpanded && question.content && (
                                <span className="block mt-2">
                                    {stripHtml(question.content).slice(160)}
                                </span>
                            )}
                        </p>

                        {question.content?.length > 160 && !isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent link nav
                                    e.stopPropagation();
                                    setIsExpanded(true);
                                }}
                                className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#FFBD2E] hover:underline bg-black px-2 py-1 rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            >
                                Devamını Oku
                            </button>
                        )}

                        {isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsExpanded(false);
                                }}
                                className="mt-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                Küçült
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. Footer (Term Style) */}
                <div className="mt-auto px-5 py-3 border-t-[3px] border-black bg-neutral-50 dark:bg-[#18181b] flex items-center justify-between z-10 relative">

                    {/* Author (Left) */}
                    <div className="flex items-center gap-2 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/kullanici/${question.profiles?.username}`);
                            }}
                            className="flex items-center gap-2 group/author cursor-pointer"
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000]">
                                <OptimizedAvatar
                                    src={question.profiles?.avatar_url}
                                    alt={question.profiles?.username || "?"}
                                    size={24}
                                    className="w-full h-full"
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase text-black dark:text-zinc-400 group-hover/author:text-[#FFBD2E] transition-colors">
                                {question.full_name || question.profiles?.username}
                            </span>
                        </button>
                    </div>

                    {/* Actions (Right) */}
                    <div className="flex items-center gap-3">

                        {/* Vote Pod */}
                        <div className="flex items-center gap-1 border-2 border-black bg-white dark:bg-black rounded-md overflow-hidden shadow-[2px_2px_0px_0px_#000]" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => handleVote(e, 1)}
                                className={cn("px-1.5 py-0.5 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border-r border-black", voteState === 1 && "bg-green-100 dark:bg-green-900")}>
                                <ChevronUp className={cn("w-3.5 h-3.5 stroke-[3px]", voteState === 1 ? "text-green-600" : "text-black dark:text-zinc-400")} />
                            </button>
                            <span className={cn("px-1 min-w-[16px] text-center text-[10px] font-black", votes > 0 ? "text-green-600" : (votes < 0 ? "text-red-500" : "text-black dark:text-zinc-300"))}>
                                {votes}
                            </span>
                            <button
                                onClick={(e) => handleVote(e, -1)}
                                className={cn("px-1.5 py-0.5 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border-l border-black", voteState === -1 && "bg-red-100 dark:bg-red-900")}>
                                <ChevronDown className={cn("w-3.5 h-3.5 stroke-[3px]", voteState === -1 ? "text-red-600" : "text-black dark:text-zinc-400")} />
                            </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">{answerCount}</span>
                        </div>
                    </div>
                </div>
            </ViewTransitionLink>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
