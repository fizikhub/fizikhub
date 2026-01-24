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

    const [isExpanded, setIsExpanded] = useState(false);
    const rawContent = question.content?.replace(/[#*`]/g, '') || "";
    const isLongContent = rawContent.length > 300;

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
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div
                onClick={handleCardClick}
                className={cn(
                    "relative flex flex-col sm:flex-row overflow-hidden transition-all duration-200 cursor-pointer",
                    "bg-white dark:bg-zinc-900", // Stark BG
                    "border-[3px] border-black dark:border-white", // Hard Thicker Borders
                    "shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]", // Hard Shadow
                    "hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                    "group rounded-xl"
                )}
            >
                {/* Desktop Vote Column - Pop Style */}
                <div className="hidden sm:flex flex-col items-center justify-center p-3 w-16 shrink-0 border-r-2 border-black dark:border-white bg-neo-yellow/20 dark:bg-zinc-800/50">
                    <div className="flex flex-col items-center gap-1.5">
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            disabled={isVoting}
                            className={cn(
                                "h-9 w-9 rounded-lg border-2 border-transparent hover:border-black transition-all text-black flex items-center justify-center",
                                "hover:bg-neo-green hover:shadow-[2px_2px_0px_0px_#000]",
                                voteState === 1 && "bg-neo-green border-black shadow-[2px_2px_0px_0px_#000]"
                            )}
                        >
                            <ChevronUp className="w-6 h-6 stroke-[3px]" />
                        </button>

                        <span className={cn(
                            "font-black text-lg w-full text-center py-1 text-black dark:text-white",
                            votes > 0 ? "text-neo-green-darker" : "",
                            votes < 0 && "text-neo-red"
                        )}>
                            {votes}
                        </span>

                        <button
                            onClick={(e) => handleVote(e, -1)}
                            disabled={isVoting}
                            className={cn(
                                "h-9 w-9 rounded-lg border-2 border-transparent hover:border-black transition-all text-black flex items-center justify-center",
                                "hover:bg-neo-orange hover:shadow-[2px_2px_0px_0px_#000]",
                                voteState === -1 && "bg-neo-orange border-black shadow-[2px_2px_0px_0px_#000]"
                            )}
                        >
                            <ChevronDown className="w-6 h-6 stroke-[3px]" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Header: Author & Meta */}
                    <div className="flex items-center justify-between p-4 sm:p-5 pb-2 sm:pb-3 border-b-2 sm:border-b-0 border-black/10">
                        <div className="flex items-center gap-3">
                            <Link href={`/kullanici/${question.profiles?.username}`} onClick={(e) => e.stopPropagation()}>
                                <Avatar className="w-10 h-10 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                                    <AvatarImage src={question.profiles?.avatar_url || undefined} />
                                    <AvatarFallback className="font-black text-xs bg-neo-pink text-black">
                                        {question.profiles?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-sm text-black dark:text-white hover:underline decoration-neo-pink decoration-2 underline-offset-2">
                                        @{question.profiles?.username}
                                    </span>
                                    {question.profiles?.is_verified && (
                                        <BadgeCheck className="w-4 h-4 text-neo-blue fill-black/10" />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-500">
                                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>

                        {/* Category Badge - Pop Pill */}
                        <div className="hidden sm:flex items-center justify-center text-[10px] font-black uppercase tracking-widest bg-neo-blue text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-full px-3 py-1">
                            {question.category}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="px-4 sm:px-5 py-2 sm:py-2 flex-1 space-y-2">
                        <div className="flex sm:hidden mb-2">
                            <div className="text-[10px] font-black uppercase tracking-widest bg-neo-blue text-black border-2 border-black shadow-[1px_1px_0px_0px_#000] rounded-full px-2 py-0.5">
                                {question.category}
                            </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-black dark:text-white leading-tight group-hover:text-neo-purple transition-colors">
                            {question.title}
                        </h3>

                        <p className={cn(
                            "text-gray-600 dark:text-gray-300 text-sm sm:text-base font-medium leading-relaxed font-sans",
                            !isExpanded && "line-clamp-3"
                        )}>
                            {stripHtml(question.content)}
                        </p>

                        {isLongContent && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wide mt-1 hover:underline decoration-2 underline-offset-2 text-black dark:text-white"
                            >
                                {isExpanded ? (
                                    <>KÜÇÜLT <ChevronUp className="w-3 h-3 stroke-[3]" /></>
                                ) : (
                                    <>DEVAMINI OKU <ChevronDown className="w-3 h-3 stroke-[3]" /></>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 p-4 sm:p-5 pt-3 sm:pt-3 flex items-center justify-between border-t-2 sm:border-t-0 border-black/5">

                        {/* Mobile Vote Pill */}
                        <div className="flex sm:hidden items-center bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => handleVote(e, 1)}
                                className={cn("p-1.5 px-3 hover:bg-neo-green/20 transition-colors border-r-2 border-black flex items-center justify-center", voteState === 1 && "bg-neo-green")}
                            >
                                <ChevronUp className="w-4 h-4 stroke-[3px] text-black" />
                            </button>
                            <span className={cn("px-3 font-black text-sm text-black")}>
                                {votes}
                            </span>
                            <button
                                onClick={(e) => handleVote(e, -1)}
                                className={cn("p-1.5 px-3 hover:bg-neo-orange/20 transition-colors border-l-2 border-black flex items-center justify-center", voteState === -1 && "bg-neo-orange")}
                            >
                                <ChevronDown className="w-4 h-4 stroke-[3px] text-black" />
                            </button>
                        </div>

                        {/* Stats / Action Pills */}
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-neo-yellow border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black text-black">
                                <MessageCircle className="w-4 h-4 stroke-[2.5px]" />
                                <span>{question.answers?.[0]?.count || 0}<span className="hidden sm:inline"> Cevap</span></span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white rounded-lg text-xs font-bold text-gray-500 hover:shadow-[2px_2px_0px_0px_#000] transition-shadow">
                                <Eye className="w-4 h-4" />
                                <span>{question.views || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
