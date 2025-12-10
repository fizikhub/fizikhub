"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, ArrowBigUp, ArrowBigDown, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { voteQuestion } from "@/app/forum/actions"; // We'll use this directly or via a wrapper
import { useState } from "react";
import { toast } from "sonner";

interface QuestionCardProps {
    question: any;
    userVote?: number; // 1 for up, -1 for down, undefined/0 for none
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

        // Optimistic update
        const previousVote = voteState;
        const previousCount = votes;

        let newVote: 1 | -1 | 0 = type;
        let newCount = votes;

        if (voteState === type) {
            // Toggle off
            newVote = 0;
            newCount -= type;
        } else {
            // Change vote (e.g. -1 to 1 is +2, 0 to 1 is +1)
            newVote = type;
            newCount += (type - (voteState || 0));
        }

        setVoteState(newVote);
        setVotes(newCount);
        setIsVoting(true);

        try {
            const result = await voteQuestion(question.id, type);
            if (!result.success) {
                // Revert
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

    // Clean content for preview
    const rawContent = question.content || "";
    // If content is long, truncate it
    const shouldTruncate = rawContent.length > 200;
    const contentPreview = shouldTruncate && !isExpanded
        ? rawContent.slice(0, 200) + "..."
        : rawContent;

    return (
        <div
            className="group bg-card border-b border-border hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors p-4 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Header: Author Info */}
            <div className="flex items-center gap-3 mb-2"> // Quora style: Avatar + Name/Creds
                <button
                    onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                    className="flex-shrink-0"
                >
                    <Avatar className="w-9 h-9 border border-border/50">
                        <AvatarImage src={question.profiles?.avatar_url || ""} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                </button>
                <div className="flex flex-col text-sm leading-none">
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-foreground hover:underline" onClick={(e) => handleProfileClick(e, question.profiles?.username)}>
                            {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                        </span>
                        {question.profiles?.is_verified && (
                            <span className="text-blue-500">
                                {/* Verified Check */}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.6026 17.3271L19.2676 8.66205L17.8534 7.24783L10.6026 14.4986L6.50267 10.3986L5.08846 11.8128L10.6026 17.3271ZM12.0001 21.6667C10.6668 21.6667 9.41258 21.4125 8.23761 20.9042C7.06263 20.3959 6.03972 19.7042 5.16885 18.8292C4.29801 17.9542 3.60843 16.9334 3.1001 15.7667C2.59177 14.6 2.33761 13.3445 2.33761 12.0001C2.33761 10.6557 2.59177 9.40011 3.1001 8.23344C3.60843 7.06678 4.29801 6.04594 5.16885 5.17094C6.03972 4.29594 7.06263 3.60428 8.23761 3.09594C9.41258 2.58761 10.6668 2.33344 12.0001 2.33344C13.3334 2.33344 14.589 2.58761 15.7668 3.09594C16.9446 3.60428 17.9654 4.29594 18.8293 5.17094C19.6931 6.04594 20.3848 7.06678 20.9043 8.23344C21.4237 9.40011 21.6834 10.6557 21.6834 12.0001C21.6834 13.3445 21.4237 14.6 20.9043 15.7667C20.3848 16.9334 19.6931 17.9542 18.8293 18.8292C17.9654 19.7042 16.9446 20.3959 15.7668 20.9042C14.589 21.4125 13.3334 21.6667 12.0001 21.6667Z" />
                                </svg>
                            </span>
                        )}
                        <span className="text-muted-foreground mx-1">·</span>
                        <span className="text-muted-foreground font-normal">
                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>
                    <div className="text-muted-foreground truncate max-w-[200px] sm:max-w-md mt-0.5 font-normal">
                        {/* Credential - For now static or from profile if available (assuming 'bio' or similar could be here) */}
                        {question.profiles?.bio || "Fizik Meraklısı"}
                    </div>
                </div>

                <button className="ml-auto text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors">
                    <span className="sr-only">Menu</span>
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content Part */}
            <div className="mb-2">
                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-amber-500 transition-colors">
                    {question.title}
                </h3>

                <div
                    className={cn(
                        "text-sm sm:text-base text-foreground/90 leading-relaxed font-serif sm:font-sans",
                        !isExpanded && "cursor-pointer"
                    )}
                    onClick={(e) => {
                        if (shouldTruncate && !isExpanded) {
                            e.stopPropagation();
                            setIsExpanded(true);
                        }
                    }}
                >
                    <p className="whitespace-pre-wrap">{contentPreview}</p>
                    {shouldTruncate && !isExpanded && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(true);
                            }}
                            className="text-blue-500 hover:underline mt-1 font-medium bg-gradient-to-r from-transparent via-card to-card sm:bg-transparent pl-2"
                        >
                            (devamını oku)
                        </button>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {/* Vote Pill */}
                    <div
                        className="flex items-center bg-secondary/50 hover:bg-secondary/80 rounded-full border border-border/50 transition-colors overflow-hidden h-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={(e) => handleVote(e, 1)}
                            className={cn(
                                "flex items-center gap-1 px-3 h-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                voteState === 1 && "text-amber-500"
                            )}
                        >
                            <ArrowBigUp className={cn("w-5 h-5", voteState === 1 && "fill-current")} />
                            <span className="text-xs sm:text-sm">{new Intl.NumberFormat('tr-TR', { notation: "compact" }).format(votes)}</span>
                        </button>
                        <div className="w-px h-4 bg-border/50"></div>
                        <button
                            onClick={(e) => handleVote(e, -1)}
                            className={cn(
                                "px-2 h-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                voteState === -1 && "text-red-500"
                            )}
                        >
                            <ArrowBigDown className={cn("w-5 h-5", voteState === -1 && "fill-current")} />
                        </button>
                    </div>

                    {/* Comments */}
                    <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-secondary/50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs sm:text-sm">{question.answers?.length || question.answers?.[0]?.count || 0}</span>
                    </button>

                    {/* Share */}
                    <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-secondary/50 transition-colors rotate-90 sm:rotate-0">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
