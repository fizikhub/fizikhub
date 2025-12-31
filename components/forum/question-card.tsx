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
import { motion } from "framer-motion";

interface QuestionCardProps {
    question: any;
    userVote?: number;
    badgeLabel?: string;
    badgeClassName?: string;
}

export const QuestionCard = React.memo(({ question, userVote = 0, badgeLabel, badgeClassName }: QuestionCardProps) => {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            className="group bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-blue-500/5 hover:border-border/90"
            onClick={handleCardClick}
        >
            {/* 1. TOP BAR: Category & Date */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-muted/20 to-muted/10 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {badgeLabel || "SORU"}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                        {question.category}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground/70">
                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                </span>
            </div>

            {/* 3. CONTENT BODY */}
            <div className="p-5 flex flex-col gap-3">
                {/* Author Mini-Row (Top of content) */}
                <div className="flex items-center gap-2 mb-1">
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="relative group/avatar"
                    >
                        <Avatar className="w-6 h-6 border border-border">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                                {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
                    >
                        {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                    </button>
                    {question.profiles?.is_verified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl leading-[1.2] text-foreground group-hover:text-blue-500 transition-colors">
                    {question.title}
                </h3>

                {/* Content Preview */}
                <div className="relative">
                    <p className="text-[15px] leading-relaxed text-muted-foreground font-sans whitespace-pre-wrap line-clamp-4">
                        {contentPreview}
                    </p>
                    {shouldTruncate && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    )}
                </div>
            </div>

            {/* 4. BOTTOM ACTION BAR */}
            <div className="mt-auto px-4 py-3 bg-gradient-to-r from-muted/5 to-transparent border-t border-border/40 flex items-center justify-between pointer-events-auto">
                {/* Left Actions - Voting */}
                <div className="flex items-center rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => handleVote(e, 1)}
                        className={cn(
                            "px-2 py-1 hover:bg-muted/50 transition-colors",
                            voteState === 1 && "text-primary bg-primary/10"
                        )}
                        disabled={isVoting}
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className={cn("px-2 text-sm font-bold border-x border-border min-w-[30px] text-center", voteState !== 0 && "text-foreground")}>
                        {votes}
                    </span>
                    <button
                        onClick={(e) => handleVote(e, -1)}
                        className={cn(
                            "px-2 py-1 hover:bg-muted/50 transition-colors",
                            voteState === -1 && "text-destructive bg-destructive/10"
                        )}
                        disabled={isVoting}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="w-4 h-4 stroke-[2.5px]" />
                        <span>{answerCount}</span>
                    </button>

                    <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`https://fizikhub.com/forum/${question.id}`);
                            toast.success("Link kopyalandı!");
                        }}
                    >
                        <Share className="w-4.5 h-4.5 stroke-[2.5px]" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
