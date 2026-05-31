"use client";

import { useRouter } from "next/navigation";
import { OptimizedAvatar } from "@/components/ui/optimized-image";
import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link"; // [NEW]

const stripHtml = (html: string) => html.replace(/<[^>]*>?/g, '');
const relativeTimeFormatter = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });

function formatRelativeTime(dateLike: string, now: number) {
    const diffSeconds = Math.round((new Date(dateLike).getTime() - now) / 1000);
    const divisions = [
        { amount: 60, unit: "second" },
        { amount: 60, unit: "minute" },
        { amount: 24, unit: "hour" },
        { amount: 7, unit: "day" },
        { amount: 4.345, unit: "week" },
        { amount: 12, unit: "month" },
        { amount: Number.POSITIVE_INFINITY, unit: "year" },
    ] as const;

    let duration = diffSeconds;
    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return relativeTimeFormatter.format(Math.round(duration), division.unit);
        }
        duration /= division.amount;
    }

    return "";
}

interface QuestionCardProps {
    question: QuestionCardData;
    userVote?: number;
    badgeLabel?: string;
    badgeClassName?: string;
}

interface QuestionCardData {
    id: number;
    title: string;
    content?: string | null;
    created_at: string;
    category?: string | null;
    votes?: number | null;
    answer_count?: number | null;
    answers?: { count?: number | null }[] | null;
    full_name?: string | null;
    profiles?: {
        username?: string | null;
        avatar_url?: string | null;
    } | null;
}

export const QuestionCard = React.memo(({ question, userVote = 0, badgeLabel }: QuestionCardProps) => {
    const router = useRouter();
    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [renderedAt] = useState(() => Date.now());

    useEffect(() => {
        setVoteState(userVote);
    }, [userVote]);

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
        } catch {
            setVoteState(previousVote);
            setVotes(previousCount);
        } finally {
            setIsVoting(false);
        }
    };

    const answerCount = question.answer_count ?? question.answers?.[0]?.count ?? question.answers?.length ?? 0;
    const cleanContent = stripHtml(question.content || "").slice(0, 300);

    return (
        <article className="w-full h-full">
            <ViewTransitionLink
                prefetch={false}
                href={`/forum/${question.id}`}
                className={cn(
                    "relative flex flex-col w-full h-full overflow-hidden transition-all duration-200 cursor-pointer group",
                    // CONTAINER STYLE
                    "bg-white dark:bg-[#1e1e21]",
                    "border-2 sm:border-[3px] border-black dark:border-zinc-700 rounded-[8px]",
                    "shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.12)] sm:dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]",
                    "hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
            >
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Hover accent line on left */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#EAB308] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-l-[8px]" />

                {/* 1. Header Bar (Yellow Theme) */}
                <div className="flex items-center justify-between gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b-2 sm:border-b-[3px] border-black dark:border-zinc-700 bg-[#EAB308] z-10 relative">
                    <span className="font-black text-[11px] uppercase tracking-[0.14em] text-black truncate">
                        {question.category || "GENEL"}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                        <time dateTime={question.created_at} className="text-[10px] font-black text-black/55 uppercase tracking-widest">
                            {formatRelativeTime(question.created_at, renderedAt)}
                        </time>
                        {badgeLabel && (
                            <div className="bg-black text-[#EAB308] px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                {badgeLabel}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Main Body */}
                <div className="flex-1 p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3 z-10 relative">

                    {/* Title */}
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg min-[390px]:text-xl sm:text-2xl font-black text-black dark:text-zinc-50 leading-[1.12] tracking-normal group-hover:text-[#EAB308] transition-colors duration-200 line-clamp-2">
                        {question.title}
                    </h2>

                    {/* Content Snippet */}
                    <div className="relative">
                        <p
                            data-nosnippet
                            className={cn(
                                "font-[family-name:var(--font-inter)] text-sm sm:text-[15px] font-medium text-neutral-600 dark:text-zinc-400 leading-relaxed",
                                !isExpanded && "line-clamp-3 sm:line-clamp-4"
                            )}
                        >
                            {cleanContent}
                            {!isExpanded && (question.content?.length ?? 0) > 160 && "..."}
                            {isExpanded && question.content && (
                                <span className="block mt-2">
                                    {stripHtml(question.content).slice(160)}
                                </span>
                            )}
                        </p>

                        {(question.content?.length ?? 0) > 160 && !isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsExpanded(true);
                                }}
                                className="mt-3 min-h-11 text-[10px] font-black uppercase tracking-widest text-[#EAB308] bg-black hover:bg-zinc-800 px-3 py-2 rounded-[8px] transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
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
                                className="mt-3 min-h-11 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                ▲ Küçült
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="mt-auto px-3.5 sm:px-5 py-2.5 sm:py-3 border-t-2 sm:border-t-[3px] border-black dark:border-zinc-700 bg-neutral-50 dark:bg-[#161618] flex flex-col min-[390px]:flex-row min-[390px]:items-center justify-between gap-2.5 sm:gap-3 z-10 relative">

                    {/* Author (Left) */}
                    <div className="flex items-center gap-2.5 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/kullanici/${question.profiles?.username}`);
                            }}
                            className="flex min-h-11 items-center gap-2 group/author cursor-pointer rounded-[8px] pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]"
                        >
                            <div className="w-7 h-7 rounded-full border-[2px] border-black dark:border-zinc-600 overflow-hidden bg-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.1)]">
                                <OptimizedAvatar
                                    src={question.profiles?.avatar_url}
                                    alt={question.profiles?.username || "?"}
                                    size={28}
                                    className="w-full h-full"
                                />
                            </div>
                            <span className="max-w-[9rem] truncate text-[11px] font-black uppercase tracking-wider text-neutral-500 dark:text-zinc-500 group-hover/author:text-[#EAB308] transition-colors">
                                {question.full_name || question.profiles?.username}
                            </span>
                        </button>
                    </div>

                    {/* Actions (Right) */}
                    <div className="flex items-center justify-end gap-3">

                        {/* Vote Pod */}
                        <div className="flex items-center border-[2px] border-black dark:border-zinc-600 bg-white dark:bg-[#1e1e21] rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => handleVote(e, 1)}
                                aria-label="Soruyu yükselt"
                                className={cn("min-w-11 min-h-11 px-2 py-1 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors border-r-[2px] border-black dark:border-zinc-600", voteState === 1 && "bg-green-100 dark:bg-green-900/50")}>
                                <ChevronUp className={cn("w-3.5 h-3.5 stroke-[3px]", voteState === 1 ? "text-green-500" : "text-black dark:text-zinc-400")} />
                            </button>
                            <span className={cn("px-2 min-w-[20px] text-center text-[11px] font-black tabular-nums", votes > 0 ? "text-green-500" : (votes < 0 ? "text-red-500" : "text-neutral-400 dark:text-zinc-500"))}>
                                {votes}
                            </span>
                            <button
                                onClick={(e) => handleVote(e, -1)}
                                aria-label="Soruyu düşür"
                                className={cn("min-w-11 min-h-11 px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border-l-[2px] border-black dark:border-zinc-600", voteState === -1 && "bg-red-100 dark:bg-red-900/50")}>
                                <ChevronDown className={cn("w-3.5 h-3.5 stroke-[3px]", voteState === -1 ? "text-red-500" : "text-black dark:text-zinc-400")} />
                            </button>
                        </div>

                        {/* Comment count */}
                        <div className="flex min-h-11 items-center gap-1.5 rounded-[8px] px-2 text-neutral-500 dark:text-zinc-500 group-hover:text-neutral-700 dark:group-hover:text-zinc-300 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-[11px] font-black tabular-nums">{answerCount}</span>
                            <span className="hidden min-[430px]:inline text-[10px] font-black uppercase tracking-wider">Yanıt</span>
                        </div>
                    </div>
                </div>
            </ViewTransitionLink>
        </article>
    );
});

QuestionCard.displayName = 'QuestionCard';
