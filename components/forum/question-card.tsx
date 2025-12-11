"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronUp, ChevronDown, MessageCircle, Share, BadgeCheck } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React from "react";

interface QuestionCardProps {
    question: any;
    userVote?: number;
}

export const QuestionCard = React.memo(({ question, userVote = 0 }: QuestionCardProps) => {
    const router = useRouter();
    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
    };

    const handleProfileClick = (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        router.push(`/kullanici/${username}`);
    };

    const handleVote = async (e: React.MouseEvent, type: 1 | -1) => {
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
            }
        } catch (error) {
            setVoteState(previousVote);
            setVotes(previousCount);
            toast.error("Bağlantı hatası.");
        } finally {
            setIsVoting(false);
        }
    };

    const rawContent = question.content?.replace(/[#*`]/g, '') || "";
    const shouldTruncate = rawContent.length > 300;
    const contentPreview = shouldTruncate && !isExpanded
        ? rawContent.slice(0, 300)
        : rawContent;

    const answerCount = question.answers?.length || question.answers?.[0]?.count || 0;

    return (
        <div
            className="group bg-card border border-black dark:border-white rounded-lg cursor-pointer transition-all duration-200 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none overflow-hidden"
            onClick={handleCardClick}
        >
            {/* Cosmic background effect */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="px-3 py-5 sm:px-5 sm:py-5 relative z-10">
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="flex-shrink-0 relative group/avatar"
                    >
                        <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover/avatar:ring-primary/20 transition-all duration-300">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                                className="font-semibold text-foreground hover:underline text-[15px]"
                            >
                                {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                            </button>
                            {question.profiles?.is_verified && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500 flex-shrink-0">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
                            <span>{question.category}</span>
                            <span>·</span>
                            <span>
                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: false, locale: tr })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Title - Clean and readable */}
                <h3 className="font-heading font-bold text-[18px] sm:text-[19px] leading-[1.4] mb-3 text-foreground/95 group-hover:text-blue-400 transition-colors">
                    {question.title}
                </h3>

                {/* Content with Gradient Fade - Optimized for reading */}
                <div className="relative mb-3">
                    <div className={cn(
                        "text-[15.5px] text-foreground/85 leading-[1.7] font-sans",
                        shouldTruncate && !isExpanded && "max-h-[120px] overflow-hidden"
                    )}>
                        <p className="whitespace-pre-wrap">{contentPreview}</p>
                    </div>
                    {/* Gradient Overlay on truncated content */}
                    {shouldTruncate && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
                    )}
                </div>

                {shouldTruncate && !isExpanded && (
                    <div className="flex justify-center mb-3 pt-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/40 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm group/btn"
                        >
                            <span className="group-hover/btn:translate-y-0.5 transition-transform duration-300">devamını oku</span>
                            <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                        </button>
                    </div>
                )}

                {/* Action Bar - Brutalist Space Style */}
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-black/20 dark:border-white/20">
                    {/* Upvote Pill - Brutalist */}
                    <div
                        className={cn(
                            "flex items-center rounded-lg border border-black dark:border-white overflow-hidden transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]",
                            voteState !== 0 ? "bg-primary/20" : "bg-transparent"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:bg-black/10",
                                voteState === 1 && "text-primary font-black"
                            )}
                            disabled={isVoting}
                        >
                            <ChevronUp className={cn(
                                "w-5 h-5 stroke-[3px]",
                                voteState === 1 && "stroke-primary"
                            )} />
                            <span className="text-sm font-black min-w-[20px] text-center">
                                {votes}
                            </span>
                        </button>
                        <div className="w-0.5 h-full bg-black dark:bg-white"></div>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={cn(
                                "px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:bg-black/10",
                                voteState === -1 && "text-destructive font-black"
                            )}
                            disabled={isVoting}
                        >
                            <ChevronDown className={cn(
                                "w-5 h-5 stroke-[3px]",
                                voteState === -1 && "stroke-destructive"
                            )} />
                        </button>
                    </div>

                    {/* Comments - Brutalist */}
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 active:scale-95 bg-transparent"
                    >
                        <MessageCircle className="w-4 h-4 stroke-[2.5px]" />
                        <span className="text-sm font-black">{answerCount}</span>
                    </button>

                    {/* Share - Brutalist */}
                    <button
                        className="p-1.5 rounded-lg border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 active:scale-95 bg-transparent ml-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`https://fizikhub.com/forum/${question.id}`);
                            toast.success("Link kopyalandı!");
                        }}
                    >
                        <Share className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                </div>
            </div>
        </div>
    );
});

QuestionCard.displayName = 'QuestionCard';
