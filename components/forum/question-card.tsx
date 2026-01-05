"use client";


import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronUp, ChevronDown, MessageCircle, Share, BadgeCheck } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CyberQuestionCard } from "@/components/themes/cybernetic/cyber-question-card";

interface QuestionCardProps {
    question: any;
    userVote?: number;
    badgeLabel?: string;
    badgeClassName?: string;
}

export const QuestionCard = React.memo(({ question, userVote = 0, badgeLabel, badgeClassName }: QuestionCardProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';
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

    // ----------------------------------------------------------------------
    // RENDER: CYBERNETIC THEME (Temporarily Disabled)
    // ----------------------------------------------------------------------
    // if (isCybernetic) {
    //     return (
    //         <CyberQuestionCard
    //             question={question}
    //             userVote={voteState}
    //             votes={votes}
    //             answerCount={question.answers?.[0]?.count || 0}
    //             onVote={(type) => handleVote({ preventDefault: () => {}, stopPropagation: () => {} } as any, type)}
    //             onClick={handleCardClick}
    //         />
    //     );
    // }

    // ----------------------------------------------------------------------
    // RENDER: STANDARD THEME
    // ----------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            className={cn(
                "group bg-card border border-border rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md hover:border-border/80",
                // Cybernetic theme overrides
                isCybernetic && "cyber-card cyber-lift"
            )}
            onClick={handleCardClick}
        >
            {/* 1. TOP BAR: Category & Date */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tracking-wide text-blue-600 dark:text-blue-400">
                        {badgeLabel || "SORU"}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground/60">
                        •
                    </span>
                    <span className="text-xs font-medium tracking-wide text-foreground/80">
                        {question.category}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground/60">
                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                </span>
            </div>

            {/* 3. CONTENT BODY */}
            <div className="p-5 flex flex-col gap-3">
                {/* Author Mini-Row (Top of content) */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="relative"
                    >
                        <Avatar className="w-5 h-5 border border-border">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                                {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    <button
                        onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                    </button>
                    {question.profiles?.is_verified && (
                        <BadgeCheck className="w-3 h-3 text-blue-500" />
                    )}
                </div>

                {/* Title */}
                <h3 className={cn(
                    "font-heading font-extrabold text-xl sm:text-2xl leading-[1.2] text-foreground group-hover:text-blue-500 transition-colors",
                    isCybernetic && "group-hover:cyber-text"
                )}>
                    {question.title}
                </h3>

                {/* Content Preview */}
                <div className="relative">
                    <p className={cn(
                        "text-[15px] leading-relaxed text-muted-foreground font-sans whitespace-pre-wrap",
                        !isExpanded && "line-clamp-3"
                    )}>
                        {isExpanded ? rawContent : contentPreview}
                    </p>
                    {shouldTruncate && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                    )}
                </div>

                {/* Devamını Oku Button (In-place expand) */}
                {shouldTruncate && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="text-xs font-bold text-primary hover:underline self-start mt-1"
                    >
                        {isExpanded ? "Daralt" : "Devamını Oku"}
                    </button>
                )}
            </div>

            {/* 4. BOTTOM ACTION BAR */}
            <div className="mt-auto px-5 py-3 border-t border-border/50 flex items-center justify-between pointer-events-auto bg-muted/5">
                {/* Left Actions - Voting */}
                <div className="flex items-center rounded-md border border-border bg-background shadow-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
