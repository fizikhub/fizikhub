"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, Eye, ArrowUp, CheckCircle2, Flame, Zap, BadgeCheck, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "./vote-button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
        profiles: {
            username: string;
            full_name: string | null;
            avatar_url: string | null;
            is_verified?: boolean;
        };
        answers: { count: number }[];
    };
    hasVoted?: boolean;
}

export function QuestionCard({ question, hasVoted = false }: QuestionCardProps) {
    const router = useRouter();
    const answerCount = question.answers?.[0]?.count || 0;
    const isSolved = false; // TODO: Check if any answer is accepted
    const isHot = (question.votes || 0) > 5;
    const isNew = new Date(question.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/forum/${question.id}`);
        // You could add a toast here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={handleCardClick}
            className="group relative"
        >
            {/* Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

            <Card className="relative border border-white/10 shadow-sm hover:shadow-xl bg-card/50 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4 sm:gap-6">
                        {/* Stats Column - Desktop */}
                        <div className="hidden sm:flex flex-col gap-3 items-center min-w-[60px] text-xs text-muted-foreground pt-1">
                            <div className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-secondary/30 group-hover:bg-primary/10 transition-colors w-full">
                                <ArrowUp className={cn("h-4 w-4 mb-1", hasVoted ? "text-primary fill-primary" : "text-muted-foreground")} />
                                <span className={cn("text-lg font-bold", hasVoted ? "text-primary" : "text-foreground")}>
                                    {question.votes || 0}
                                </span>
                            </div>

                            <div className={cn(
                                "flex flex-col items-center gap-0.5 p-2 rounded-lg w-full transition-colors",
                                answerCount > 0 ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-secondary/30"
                            )}>
                                <MessageSquare className="h-4 w-4 mb-1" />
                                <span className="font-bold">{answerCount}</span>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* Mobile Stats & Meta */}
                            <div className="flex sm:hidden items-center justify-between text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 font-medium text-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                        <ArrowUp className="h-3 w-3" /> {question.votes || 0}
                                    </span>
                                    <span className={cn("flex items-center gap-1 font-medium px-2 py-1 rounded-md", answerCount > 0 ? "bg-green-500/10 text-green-600" : "bg-secondary/50")}>
                                        <MessageSquare className="h-3 w-3" /> {answerCount}
                                    </span>
                                </div>
                                <span className="text-[10px]">{formatDistanceToNow(new Date(question.created_at), { locale: tr })}</span>
                            </div>

                            {/* Title & Category */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base sm:text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {question.title}
                                    </h3>
                                    {isSolved && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0 h-6 px-2 text-xs flex-shrink-0 animate-pulse">
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                            <span className="hidden sm:inline">Çözüldü</span>
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 items-center">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
                                        {question.category}
                                    </Badge>
                                    {question.tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border-0">
                                            #{tag}
                                        </Badge>
                                    ))}
                                    {isHot && (
                                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200/20">
                                            <Flame className="h-3 w-3 mr-1" /> Popüler
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Preview Content */}
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {question.content}
                            </p>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/kullanici/${question.profiles?.username}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 group/author"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-2 ring-background group-hover/author:ring-primary/20 transition-all">
                                                <AvatarImage src={question.profiles?.avatar_url || ""} />
                                                <AvatarFallback className="text-[10px] sm:text-xs">{question.profiles?.username?.[0]}</AvatarFallback>
                                            </Avatar>
                                            {question.profiles?.is_verified && (
                                                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                                    <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs sm:text-sm font-medium text-foreground group-hover/author:text-primary transition-colors">
                                                @{question.profiles?.username || "Anonim"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-full">
                                        <Eye className="h-3 w-3" />
                                        <span>{question.views || 0}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
