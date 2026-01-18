"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronUp, ChevronDown, MessageSquare, Share2, BadgeCheck, Eye } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
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

export const QuestionCard = React.memo(({ question, userVote = 0, badgeLabel }: QuestionCardProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isCybernetic = mounted && theme === 'cybernetic';
    const isPink = mounted && theme === 'pink';
    const isDarkPink = mounted && theme === 'dark-pink';
    const isCute = isPink || isDarkPink;

    // State
    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);

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
    // Keep preview short and punchy for the card
    const contentPreview = rawContent.length > 180 ? rawContent.slice(0, 180) + "..." : rawContent;

    // Calculate display values
    const answerCount = question.answers?.length || question.answers?.[0]?.count || 0;
    const timeAgo = formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr });

    // ----------------------------------------------------------------------
    // RENDER: CYBERNETIC THEME
    // ----------------------------------------------------------------------
    if (isCybernetic) {
        return (
            <CyberQuestionCard
                question={question}
                userVote={voteState}
                votes={votes}
                answerCount={answerCount}
                onVote={(type) => handleVote({ preventDefault: () => { }, stopPropagation: () => { } } as any, type)}
                onClick={handleCardClick}
            />
        );
    }

    // ----------------------------------------------------------------------
    // RENDER: PREMIUM NEOBRUTALIST (DEFAULT)
    // ----------------------------------------------------------------------
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -2,
                transition: { duration: 0.2 }
            }}
            className={cn(
                "group relative bg-card border border-border/60 rounded-xl overflow-hidden transition-all duration-300",
                "hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
                // Pink theme overrides
                isPink && "border-pink-200 hover:border-pink-300 hover:shadowness-pink",
                isDarkPink && "border-pink-900/50 hover:border-pink-500",
                "flex flex-row"
            )}
            onClick={handleCardClick}
        >
            {/* LEFT COLUMN: VOTING */}
            <div className={cn(
                "hidden sm:flex flex-col items-center p-3 gap-1 bg-muted/30 border-r border-border/40 min-w-[60px]",
                isCute && "bg-pink-500/5 border-pink-500/10"
            )}>
                <button
                    onClick={(e) => handleVote(e, 1)}
                    className={cn(
                        "p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-primary",
                        voteState === 1 && "text-green-500 bg-green-500/10"
                    )}
                >
                    <ChevronUp className="w-6 h-6 stroke-[3px]" />
                </button>

                <span className={cn(
                    "font-black text-lg",
                    voteState > 0 ? "text-green-500" : voteState < 0 ? "text-red-500" : "text-foreground"
                )}>
                    {votes}
                </span>

                <button
                    onClick={(e) => handleVote(e, -1)}
                    className={cn(
                        "p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-red-500",
                        voteState === -1 && "text-red-500 bg-red-500/10"
                    )}
                >
                    <ChevronDown className="w-6 h-6 stroke-[3px]" />
                </button>
            </div>

            {/* RIGHT COLUMN: CONTENT */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
                {/* Header: Author & Meta */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center gap-2 group/author cursor-pointer"
                            onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                        >
                            <Avatar className="w-6 h-6 border bg-muted">
                                <AvatarImage src={question.profiles?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px]">
                                    {question.profiles?.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-bold text-muted-foreground group-hover/author:text-foreground transition-colors">
                                @{question.profiles?.username}
                            </span>
                            {question.profiles?.is_verified && (
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                            )}
                        </div>
                        <span className="text-muted-foreground/40 text-xs">•</span>
                        <span className="text-xs font-medium text-muted-foreground/60">{timeAgo}</span>
                    </div>

                    {/* Category Pill */}
                    <div className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                        "bg-primary/5 text-primary border-primary/20",
                        isCute && "bg-pink-500/10 text-pink-500 border-pink-500/20"
                    )}>
                        {question.category}
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-1.5">
                    <h3 className={cn(
                        "text-lg sm:text-xl font-heading font-black leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2",
                        isCute && "group-hover:text-pink-500"
                    )}>
                        {question.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-sans opacity-90">
                        {contentPreview}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                    {/* Mobile Vote (Visible only on mobile) */}
                    <div className="flex sm:hidden items-center gap-2 bg-muted/40 rounded-md px-2 py-1" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={cn(voteState === 1 && "text-green-500")}
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className={cn("text-xs font-bold", voteState !== 0 && "text-foreground")}>{votes}</span>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={cn(voteState === -1 && "text-red-500")}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                        <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-bold">{answerCount} <span className="hidden sm:inline font-medium opacity-70">cevap</span></span>
                        </div>

                        <button
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(`https://fizikhub.com/forum/${question.id}`);
                                toast.success("Link kopyalandı!");
                            }}
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs font-medium">Paylaş</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
