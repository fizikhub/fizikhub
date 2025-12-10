"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, ArrowBigUp, ArrowBigDown, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

    const rawContent = question.content || "";
    const shouldTruncate = rawContent.length > 200;
    const contentPreview = shouldTruncate && !isExpanded
        ? rawContent.slice(0, 200) + "..."
        : rawContent;

    return (
        <div
            className="group brutalist-card p-5 sm:p-6 cursor-pointer hover:border-primary/50"
            onClick={handleCardClick}
        >
            {/* Author Info */}
            <div className="flex items-start gap-3 mb-4">
                <button
                    onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                    className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                    <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarImage src={question.profiles?.avatar_url || ""} />
                        <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                            {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                            className="font-bold text-foreground hover:text-primary transition-colors"
                        >
                            {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                        </button>
                        {question.profiles?.is_verified && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                                <path d="M10.6026 17.3271L19.2676 8.66205L17.8534 7.24783L10.6026 14.4986L6.50267 10.3986L5.08846 11.8128L10.6026 17.3271ZM12.0001 21.6667C10.6668 21.6667 9.41258 21.4125 8.23761 20.9042C7.06263 20.3959 6.03972 19.7042 5.16885 18.8292C4.29801 17.9542 3.60843 16.9334 3.1001 15.7667C2.59177 14.6 2.33761 13.3445 2.33761 12.0001C2.33761 10.6557 2.59177 9.40011 3.1001 8.23344C3.60843 7.06678 4.29801 6.04594 5.16885 5.17094C6.03972 4.29594 7.06263 3.60428 8.23761 3.09594C9.41258 2.58761 10.6668 2.33344 12.0001 2.33344C13.3334 2.33344 14.589 2.58761 15.7668 3.09594C16.9446 3.60428 17.9654 4.29594 18.8293 5.17094C19.6931 6.04594 20.3848 7.06678 20.9043 8.23344C21.4237 9.40011 21.6834 10.6557 21.6834 12.0001C21.6834 13.3445 21.4237 14.6 20.9043 15.7667C20.3848 16.9334 19.6931 17.9542 18.8293 18.8292C17.9654 19.7042 16.9446 20.3959 15.7668 20.9042C14.589 21.4125 13.3334 21.6667 12.0001 21.6667Z" />
                            </svg>
                        )}
                        <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                {question.title}
            </h3>

            {/* Content */}
            <div
                className={cn(
                    "text-base text-foreground/80 leading-relaxed mb-4",
                    !isExpanded && shouldTruncate && "line-clamp-3"
                )}
            >
                <p className="whitespace-pre-wrap">{contentPreview}</p>
                {shouldTruncate && !isExpanded && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                        }}
                        className="text-primary hover:underline font-medium mt-1 inline-block"
                    >
                        (devamını oku)
                    </button>
                )}
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="font-medium">
                        {question.category}
                    </Badge>
                    {question.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                        </Badge>
                    ))}
                    {question.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{question.tags.length - 3}
                        </Badge>
                    )}
                </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-4 border-t-2 border-border">
                {/* Vote Pill */}
                <div
                    className="flex items-center bg-secondary rounded-full border-2 border-border overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={(e) => handleVote(e, 1)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 hover:bg-primary/10 transition-colors",
                            voteState === 1 && "bg-primary/20 text-primary"
                        )}
                        disabled={isVoting}
                    >
                        <ArrowBigUp className={cn("w-5 h-5", voteState === 1 && "fill-current")} />
                        <span className="font-bold text-sm">{votes}</span>
                    </button>
                    <div className="w-px h-6 bg-border"></div>
                    <button
                        onClick={(e) => handleVote(e, -1)}
                        className={cn(
                            "px-2.5 py-1.5 hover:bg-destructive/10 transition-colors",
                            voteState === -1 && "bg-destructive/20 text-destructive"
                        )}
                        disabled={isVoting}
                    >
                        <ArrowBigDown className={cn("w-5 h-5", voteState === -1 && "fill-current")} />
                    </button>
                </div>

                {/* Comments */}
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-border bg-secondary hover:bg-primary/10 hover:border-primary/50 transition-colors"
                    onClick={handleCardClick}
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">{question.answers?.length || question.answers?.[0]?.count || 0}</span>
                </button>

                {/* Share */}
                <button
                    className="p-2 rounded-full border-2 border-border bg-secondary hover:bg-primary/10 hover:border-primary/50 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`https://fizikhub.com/forum/${question.id}`);
                        toast.success("Link kopyalandı!");
                    }}
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
