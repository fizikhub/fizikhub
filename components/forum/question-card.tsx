"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, Eye, BadgeCheck, ArrowBigUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: any;
    hasVoted?: boolean;
}

export function QuestionCard({ question, hasVoted }: QuestionCardProps) {
    const router = useRouter();
    const isSolved = question.is_solved;
    const hasAcceptedAnswer = question.accepted_answer_id !== null;

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
    };

    const handleProfileClick = (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        router.push(`/kullanici/${username}`);
    };

    return (
        <div
            className="group bg-card border-2 border-border hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex gap-4 p-5 sm:p-6">
                {/* Left: Upvote Section - Quora Style */}
                <div className="flex flex-col items-center gap-1 min-w-[48px] pt-1">
                    <div className={cn(
                        "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors",
                        hasVoted ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    )}>
                        <ArrowBigUp className={cn(
                            "h-6 w-6 transition-all",
                            hasVoted ? "fill-primary" : ""
                        )} />
                        <span className="text-sm font-bold">{question.votes || 0}</span>
                    </div>
                </div>

                {/* Right: Content Section */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                            className="hover:opacity-80 transition-opacity"
                        >
                            <Avatar className="w-6 h-6 border border-border">
                                <AvatarImage src={question.profiles?.avatar_url || ""} />
                                <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                    {question.profiles?.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <button
                                onClick={(e) => handleProfileClick(e, question.profiles?.username)}
                                className="font-semibold hover:text-primary transition-colors"
                            >
                                @{question.profiles?.username || "Anonim"}
                            </button>
                            {question.profiles?.is_verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                            )}
                            <span>•</span>
                            <span className="hidden sm:inline">
                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                            </span>
                            <span className="sm:hidden">
                                {formatDistanceToNow(new Date(question.created_at), { locale: tr })}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {question.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {question.content?.replace(/[#*`]/g, '') || "İçerik önizlemesi yok..."}
                    </p>

                    {/* Tags & Stats Row */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0 h-5 bg-secondary/50">
                                {question.category}
                            </Badge>
                            {question.tags?.slice(0, 2).map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-5 border-border/50 text-muted-foreground"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                            {(question.tags?.length || 0) > 2 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-border/50 text-muted-foreground">
                                    +{question.tags.length - 2}
                                </Badge>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{question.answers?.length || question.answers?.[0]?.count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{question.views || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
