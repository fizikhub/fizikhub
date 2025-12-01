"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageCircle, ArrowUp, ArrowDown, Eye, CheckCircle2, Flame, Share2, MoreHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    const isSolved = false; // TODO: Check if any answer is accepted
    const isHot = (question.votes || 0) > 5;

    const handleCardClick = () => {
        router.push(`/forum/${question.id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/forum/${question.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={handleCardClick}
            className="group relative"
        >
            {/* Gradient Border Effect on Hover */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

            <Card className="relative border border-border/40 shadow-sm hover:shadow-xl bg-card/80 backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl">
                <CardContent className="p-5 sm:p-6">
                    {/* Header: User & Meta */}
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={`/kullanici/${question.profiles?.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 group/author"
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 ring-2 ring-background group-hover/author:ring-primary/20 transition-all">
                                    <AvatarImage src={question.profiles?.avatar_url || ""} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-medium">
                                        {question.profiles?.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {question.profiles?.is_verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-foreground group-hover/author:text-primary transition-colors">
                                    {question.profiles?.full_name || question.profiles?.username || "Anonim"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(question.created_at), { locale: tr, addSuffix: true })}
                                </span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            {isHot && (
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200/20 px-2 py-0.5 text-xs font-medium animate-pulse">
                                    <Flame className="h-3 w-3 mr-1" /> Popüler
                                </Badge>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="space-y-3 mb-5">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                                {question.title}
                            </h3>
                            {isSolved && (
                                <div className="flex-shrink-0" title="Çözüldü">
                                    <div className="bg-green-500/10 text-green-600 p-1.5 rounded-full">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                            {question.content}
                        </p>
                    </div>

                    {/* Footer: Tags & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/30">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
                                {question.category}
                            </Badge>
                            {question.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer border-0 font-normal">
                                    #{tag}
                                </Badge>
                            ))}
                            {(question.tags?.length || 0) > 3 && (
                                <span className="text-xs text-muted-foreground self-center">+{question.tags!.length - 3}</span>
                            )}
                        </div>

                        {/* Action Pills */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Vote Pill */}
                            <div className={cn(
                                "flex items-center gap-1 px-1.5 py-1 rounded-full border transition-colors",
                                hasVoted
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-muted/30 border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-muted/50"
                            )}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-background/80 hover:text-primary"
                                    onClick={(e) => { e.stopPropagation(); /* Vote logic */ }}
                                >
                                    <ArrowUp className={cn("h-4 w-4", hasVoted && "fill-current")} />
                                </Button>
                                <span className="text-sm font-bold min-w-[1.5ch] text-center">{question.votes || 0}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-background/80 hover:text-red-500"
                                    onClick={(e) => { e.stopPropagation(); /* Downvote logic */ }}
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Answer Pill */}
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
                                answerCount > 0
                                    ? "bg-green-500/5 border-green-500/20 text-green-600"
                                    : "bg-muted/30 border-border/50 text-muted-foreground"
                            )}>
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">{answerCount}</span>
                            </div>

                            {/* Share Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                onClick={handleShare}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
