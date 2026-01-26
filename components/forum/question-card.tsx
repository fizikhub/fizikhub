"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, Eye, ChevronUp, ChevronDown, BadgeCheck, ArrowBigUp } from "lucide-react";
import { voteQuestion } from "@/app/forum/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
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

    const [voteState, setVoteState] = useState(userVote);
    const [votes, setVotes] = useState(question.votes || 0);
    const [isVoting, setIsVoting] = useState(false);

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
    };

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
    const cleanContent = stripHtml(question.content || "").slice(0, 200);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
        >
            <div
                onClick={handleCardClick}
                className={cn(
                    "relative flex flex-col w-full h-full overflow-hidden transition-all duration-200 cursor-pointer group",
                    "bg-white dark:bg-zinc-900",
                    "border-[3px] border-black dark:border-white",
                    "shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#fff]",
                    "hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff]",
                    "hover:translate-x-[2px] hover:translate-y-[2px]"
                )}
            >
                {/* 1. Header Bar (Yellow Strip like Article) */}
                <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white bg-[#F2C32E] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                        <span className="bg-black text-white font-black uppercase tracking-widest px-2 py-0.5 text-[10px]">
                            {question.category || "GENEL"}
                        </span>
                        {/* New Badge? */}
                        {badgeLabel && <span className="text-[10px] font-bold text-black border border-black px-1 rounded-sm">{badgeLabel}</span>}
                    </div>
                    <span className="font-bold text-black uppercase tracking-wider text-[10px]">
                        {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                    </span>
                </div>

                {/* 2. Main Body */}
                <div className="flex-1 p-5 flex flex-col gap-3">

                    {/* User Info (Mini) */}
                    <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-6 h-6 border border-black dark:border-white">
                            <AvatarImage src={question.profile?.avatar_url || question.profiles?.avatar_url} />
                            <AvatarFallback className="text-[10px] bg-zinc-200 text-black">
                                {question.profiles?.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-zinc-500">@{question.profiles?.username}</span>
                        {question.profiles?.is_verified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                    </div>

                    <h3 className="font-sans font-black text-xl sm:text-2xl leading-tight text-black dark:text-white group-hover:text-[#A26FE3] transition-colors">
                        {question.title}
                    </h3>

                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-mono">
                        {cleanContent}
                        {question.content?.length > 200 && "..."}
                    </p>
                </div>

                {/* 3. Action Footer */}
                <div className="flex items-center justify-between border-t-[3px] border-black dark:border-white bg-zinc-50 dark:bg-zinc-800 px-4 py-3">

                    {/* Vote Action (Left) */}
                    <div className="flex items-center gap-1 bg-white dark:bg-black border-2 border-black dark:border-white rounded-lg overflow-hidden shadow-sm" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={cn(
                                "p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border-r border-zinc-200 dark:border-zinc-700",
                                voteState === 1 && "bg-green-100 dark:bg-green-900/50 text-green-600"
                            )}>
                            <ArrowBigUp className={cn("w-5 h-5", voteState === 1 && "fill-green-500 stroke-green-600")} />
                        </button>
                        <span className={cn("px-2 font-black text-sm min-w-[20px] text-center", votes > 0 ? "text-green-600" : (votes < 0 ? "text-red-500" : "text-zinc-500"))}>
                            {votes}
                        </span>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={cn(
                                "p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border-l border-zinc-200 dark:border-zinc-700",
                                voteState === -1 && "bg-red-100 dark:bg-red-900/50 text-red-600"
                            )}>
                            <div className="rotate-180"><ArrowBigUp className={cn("w-5 h-5", voteState === -1 && "fill-red-500 stroke-red-600")} /></div>
                        </button>
                    </div>

                    {/* Stats (Right) */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">{answerCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-xs font-bold">{question.views || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

QuestionCard.displayName = 'QuestionCard';
