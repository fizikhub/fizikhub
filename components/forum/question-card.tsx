"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronUp, ChevronDown, MessageSquare, Share2, BadgeCheck, Eye, MessageCircle } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CyberQuestionCard } from "@/components/themes/cybernetic/cyber-question-card";
import Link from "next/link";

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
            whileHover={{ y: -4, x: -2 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "group relative flex flex-col sm:flex-row gap-0",
                "bg-card rounded-xl overflow-hidden",
                "border-2 border-border transition-all duration-200",
                "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]",
                isCybernetic && "cyber-card border-l-2 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] !rounded-none bg-black/40",
                isPink && "hover:border-pink-300 hover:shadow-[8px_8px_0px_0px_rgba(255,105,180,0.4)]"
            )}
        >
            {/* Left Column: Voting (Desktop) - CLEAN CAPSULE STYLE - Compact Width */}
            <div className={cn(
                "hidden sm:flex flex-col items-center justify-center p-3 w-16 shrink-0 border-r-2 border-border",
                "bg-muted/5",
                isCybernetic && "border-cyan-500/20 bg-black/40",
                isPink && "bg-pink-50/50 border-pink-100"
            )}>
                <div className="flex flex-col items-center gap-1 bg-background border-2 border-border rounded-full py-2 px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                    <button
                        onClick={(e) => handleVote(e, 1)}
                        disabled={isVoting}
                        className={cn(
                            "p-2 rounded-full transition-all hover:bg-muted active:scale-95",
                            voteState === 1
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground",
                            isCybernetic && "rounded-none hover:bg-cyan-950/30 hover:text-cyan-400",
                            isPink && "hover:text-pink-600"
                        )}
                    >
                        <ChevronUp className="w-4 h-4 stroke-[4px]" />
                    </button>

                    <span className={cn(
                        "font-black text-base w-full text-center py-0.5",
                        votes > 0 ? "text-primary" : "text-muted-foreground",
                        votes < 0 && "text-red-500",
                        isPink && votes > 0 && "text-pink-600",
                        isCybernetic && votes > 0 && "text-cyan-400"
                    )}>
                        {votes}
                    </span>

                    <button
                        onClick={(e) => handleVote(e, -1)}
                        disabled={isVoting}
                        className={cn(
                            "p-2 rounded-full transition-all hover:bg-muted active:scale-95",
                            voteState === -1
                                ? "text-red-500 bg-red-500/10"
                                : "text-muted-foreground hover:text-foreground",
                            isCybernetic && "rounded-none hover:bg-red-950/30 hover:text-red-400"
                        )}
                    >
                        <ChevronDown className="w-4 h-4 stroke-[4px]" />
                    </button>
                </div>
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 flex flex-col">

                {/* Mobile Header: Author + Date */}
                <div className="flex sm:hidden items-center justify-between p-4 pb-0">
                    <Link href={`/kullanici/${question.profiles?.username}`} className="flex items-center gap-3 group/author">
                        <Avatar className="w-10 h-10 border-2 border-foreground group-hover/author:border-primary transition-colors">
                            <AvatarImage src={question.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                                {question.profiles?.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-none gap-1">
                            <span className="text-base font-bold text-foreground group-hover/author:text-primary transition-colors">
                                @{question.profiles?.username}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground/60">
                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                    </Link>
                    <span className={cn(
                        "px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider border-2 rounded",
                        "bg-background text-foreground border-border",
                        isCybernetic && "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 rounded-none",
                        isPink && "bg-pink-50 text-pink-700 border-pink-200"
                    )}>
                        {question.category}
                    </span>
                </div>

                {/* Main Content Info - UPSCALED & SPACIOUS */}
                <div className="p-5 sm:p-8 flex flex-col gap-5 flex-1 min-h-[160px] justify-start">
                    {/* Desktop Meta Row */}
                    <div className="hidden sm:flex items-center gap-3">
                        <span className={cn(
                            "px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider border-2 rounded",
                            "bg-background text-foreground border-border",
                            isCybernetic && "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 rounded-none",
                            isPink && "bg-pink-50 text-pink-700 border-pink-200"
                        )}>
                            {question.category}
                        </span>
                        <span className="text-muted-foreground text-sm font-bold flex items-center gap-1 opacity-60">
                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>

                    <Link href={`/forum/${question.id}`} className="group/title block space-y-3">
                        <h3 className={cn(
                            "text-xl sm:text-2xl font-black text-foreground leading-snug tracking-tight group-hover/title:text-primary transition-colors line-clamp-2",
                            isPink && "group-hover/title:text-pink-600",
                            isCybernetic && "group-hover/title:text-cyan-400"
                        )}>
                            {question.title}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base line-clamp-4 leading-relaxed opacity-80 group-hover/title:opacity-100 transition-opacity font-medium">
                            {stripHtml(question.content)}
                        </p>
                    </Link>
                </div>

                {/* Footer Status Bar - UPSCALED */}
                <div className="mt-auto py-3 px-4 sm:px-7 flex items-center justify-between border-t-2 border-border/50 bg-muted/5">

                    {/* MOBILE VOTES (Pill Style) */}
                    <div className="flex sm:hidden items-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center bg-background border-2 border-border rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            <button
                                onClick={(e) => handleVote(e, 1)}
                                disabled={isVoting}
                                className={cn(
                                    "p-1.5 px-2 hover:bg-muted transition-colors border-r-2 border-border",
                                    voteState === 1 && "bg-primary/10 text-primary"
                                )}
                            >
                                <ChevronUp className="w-5 h-5 stroke-[4px]" />
                            </button>
                            <span className={cn(
                                "text-base font-black px-3 min-w-[40px] text-center",
                                votes > 0 ? "text-primary" : "text-muted-foreground",
                                votes < 0 && "text-red-500"
                            )}>
                                {votes}
                            </span>
                            <button
                                onClick={(e) => handleVote(e, -1)}
                                disabled={isVoting}
                                className={cn(
                                    "p-1.5 px-2 hover:bg-muted transition-colors border-l-2 border-border",
                                    voteState === -1 && "bg-red-500/10 text-red-500"
                                )}
                            >
                                <ChevronDown className="w-5 h-5 stroke-[4px]" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Author */}
                    <Link
                        href={`/kullanici/${question.profiles?.username}`}
                        className="hidden sm:flex items-center gap-3 group/author bg-background border-2 border-transparent hover:border-border rounded-full pr-4 pl-1 py-1 transition-all"
                    >
                        <Avatar className={cn(
                            "w-8 h-8 border bg-muted"
                        )}>
                            <AvatarImage src={question.profiles?.avatar_url || undefined} />
                            <AvatarFallback className="font-bold text-xs">
                                {question.profiles?.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-muted-foreground group-hover/author:text-foreground transition-colors">
                                @{question.profiles?.username}
                            </span>
                            {question.profiles?.is_verified && (
                                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                            )}
                        </div>
                    </Link>

                    {/* Meta Stats */}
                    <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground ml-auto">
                        <div className={cn(
                            "flex items-center gap-2 transition-colors hover:text-foreground",
                        )}>
                            <MessageCircle className="w-5 h-5" />
                            <span>{question.answers?.[0]?.count || 0} <span className="hidden sm:inline">Cevap</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{question.views || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
