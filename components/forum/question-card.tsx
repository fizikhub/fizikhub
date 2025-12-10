"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, Share, ChevronUp, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { voteQuestion } from "@/app/forum/actions";
import { useState } from "react";
import { toast } from "sonner";

interface QuestionCardProps {
    question: any;
    userVote?: number;
}

export function QuestionCard({ question, userVote = 0 }: QuestionCardProps) {
    const router = useRouter();
    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
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
    const shouldTruncate = rawContent.length > 180;
    const contentPreview = shouldTruncate && !isExpanded
        ? rawContent.slice(0, 180)
        : rawContent;

    const answerCount = question.answers?.length || question.answers?.[0]?.count || 0;

    return (
        <div
            className="bg-card border border-border/50 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors overflow-hidden"
            onClick={handleCardClick}
        >
            <div className="px-3 py-5 sm:px-5 sm:py-5">
                {/* Author Row */}
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="flex-shrink-0"
                    >
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
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

                {/* Title - Bold, slightly blue tint on hover */}
                <h3 className="font-bold text-[17px] sm:text-lg leading-snug mb-2 text-foreground group-hover:text-blue-400">
                    {question.title}
                </h3>

                {/* Content */}
                <div className="text-[15px] text-foreground/90 leading-relaxed mb-3">
                    <span>{contentPreview}</span>
                    {shouldTruncate && !isExpanded && (
                        <>
                            <span className="text-muted-foreground">... </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(true);
                                }}
                                className="text-blue-500 hover:underline font-medium"
                            >
                                Read more
                            </button>
                        </>
                    )}
                </div>

                {/* Action Bar - Quora Style */}
                <div className="flex items-center gap-2 pt-2">
                    {/* Upvote Pill */}
                    <div
                        className="flex items-center rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-700/50 transition-colors",
                                voteState === 1 && "text-amber-500"
                            )}
                            disabled={isVoting}
                        >
                            <ChevronUp className={cn(
                                "w-5 h-5 stroke-[2.5px]",
                                voteState === 1 && "text-amber-500"
                            )} />
                            <span className="text-sm font-medium">
                                Upvote
                                {votes > 0 && <span className="ml-1">· {votes}</span>}
                            </span>
                        </button>
                        <div className="w-px h-5 bg-zinc-700"></div>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={cn(
                                "px-2.5 py-1.5 hover:bg-zinc-700/50 transition-colors",
                                voteState === -1 && "text-blue-500"
                            )}
                            disabled={isVoting}
                        >
                            <ChevronDown className={cn(
                                "w-5 h-5 stroke-[2.5px]",
                                voteState === -1 && "text-blue-500"
                            )} />
                        </button>
                    </div>

                    {/* Comments */}
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{answerCount}</span>
                    </button>

                    {/* Share */}
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:bg-zinc-700/50 transition-colors text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`https://fizikhub.com/forum/${question.id}`);
                            toast.success("Link kopyalandı!");
                        }}
                    >
                        <Share className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
