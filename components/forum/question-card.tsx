"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, Heart, Share2, MoreHorizontal, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
    question: {
        id: number;
        title: string;
        content: string;
        category: string;
        created_at: string;
        votes: number;
        views: number;
        tags: string[];
        profiles?: {
            username: string | null;
            full_name: string | null;
            avatar_url: string | null;
            is_verified?: boolean | null;
        } | null;
        answers?: { count: number }[] | any[];
    };
    hasVoted?: boolean;
}

export function QuestionCard({ question, hasVoted = false }: QuestionCardProps) {
    const router = useRouter();
    const answerCount = question.answers?.[0]?.count || 0;

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/forum/${question.id}`);
        // Toast notification could be added here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
            className="group relative border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer p-4"
        >
            <div className="flex gap-3 sm:gap-4">
                {/* Avatar Column */}
                <div className="flex-shrink-0">
                    <Link
                        href={`/kullanici/${question.profiles?.username}`}
                        onClick={(e) => e.stopPropagation()}
                        className="relative block"
                    >
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback>{question.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Header: Author Info & Meta */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 text-sm overflow-hidden">
                            <Link
                                href={`/kullanici/${question.profiles?.username}`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold hover:underline truncate text-foreground"
                            >
                                {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                            </Link>
                            <span className="text-muted-foreground truncate">
                                @{question.profiles?.username || "anonim"}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground whitespace-nowrap hover:underline">
                                {formatDistanceToNow(new Date(question.created_at), { locale: tr, addSuffix: false })}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full -mr-2">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-2 mb-3">
                        <h3 className="text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                            {question.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                            {question.content}
                        </p>

                        {/* Tags & Category */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors border-0 font-medium">
                                {question.category}
                            </Badge>
                            {question.tags?.map((tag) => (
                                <span key={tag} className="text-sm text-blue-500 hover:underline">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between text-muted-foreground max-w-md mt-3">
                        {/* Comments */}
                        <button
                            className="flex items-center gap-2 group/action hover:text-blue-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); /* Add comment logic */ }}
                        >
                            <div className="p-2 rounded-full group-hover/action:bg-blue-500/10 transition-colors">
                                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{answerCount > 0 ? answerCount : ""}</span>
                        </button>

                        {/* Votes/Likes */}
                        <button
                            className={cn(
                                "flex items-center gap-2 group/action transition-colors",
                                hasVoted ? "text-pink-500" : "hover:text-pink-500"
                            )}
                            onClick={(e) => { e.stopPropagation(); /* Add vote logic */ }}
                        >
                            <div className="p-2 rounded-full group-hover/action:bg-pink-500/10 transition-colors">
                                <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", hasVoted && "fill-current")} />
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{question.votes || 0}</span>
                        </button>

                        {/* Views */}
                        <div className="flex items-center gap-2 group/action hover:text-primary transition-colors cursor-default">
                            <div className="p-2 rounded-full group-hover/action:bg-primary/10 transition-colors">
                                <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{question.views || 0}</span>
                        </div>

                        {/* Share */}
                        <button
                            className="flex items-center gap-2 group/action hover:text-green-500 transition-colors"
                            onClick={handleShare}
                        >
                            <div className="p-2 rounded-full group-hover/action:bg-green-500/10 transition-colors">
                                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
