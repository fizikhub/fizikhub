"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, ArrowUp, ArrowDown, Eye, CheckCircle2, Flame, Share2, MoreHorizontal } from "lucide-react";
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
            transition={{ duration: 0.3 }}
            onClick={handleCardClick}
            className="group"
        >
            <Card className="border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row">
                    {/* Voting Column - Left Side (Desktop) / Top (Mobile) */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4 sm:gap-2 p-3 sm:p-4 sm:w-16 sm:border-r border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                                <ArrowUp className={cn("h-5 w-5", hasVoted && "text-primary fill-primary")} />
                            </Button>
                            <span className={cn("text-lg font-bold tabular-nums", hasVoted ? "text-primary" : "text-muted-foreground")}>
                                {question.votes || 0}
                            </span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500">
                                <ArrowDown className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex sm:hidden items-center gap-2 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" /> {answerCount}
                            </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 sm:p-5">
                        {/* Header: Meta & Badges */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors font-medium">
                                    {question.category}
                                </Badge>
                                {isSolved && (
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Çözüldü</span>
                                    </Badge>
                                )}
                                {isHot && (
                                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-0 flex items-center gap-1">
                                        <Flame className="h-3 w-3" />
                                        <span>Popüler</span>
                                    </Badge>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                                {formatDistanceToNow(new Date(question.created_at), { locale: tr, addSuffix: true })}
                            </span>
                        </div>

                        {/* Title & Content */}
                        <div className="space-y-2 mb-4">
                            <h3 className="text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                                {question.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {question.content}
                            </p>
                        </div>

                        {/* Footer: Tags & Author */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <div className="flex flex-wrap gap-2">
                                {question.tags?.map((tag) => (
                                    <span key={tag} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md hover:bg-secondary hover:text-foreground transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Desktop Stats */}
                                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md", answerCount > 0 ? "bg-green-500/10 text-green-600 font-medium" : "")}>
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{answerCount} cevap</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{question.views || 0}</span>
                                    </div>
                                </div>

                                {/* Author */}
                                <Link
                                    href={`/kullanici/${question.profiles?.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 pl-4 sm:border-l border-border/40 group/author"
                                >
                                    <Avatar className="h-6 w-6 ring-1 ring-border group-hover/author:ring-primary/30 transition-all">
                                        <AvatarImage src={question.profiles?.avatar_url || ""} />
                                        <AvatarFallback className="text-[10px]">{question.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-foreground group-hover/author:text-primary transition-colors max-w-[100px] truncate">
                                        {question.profiles?.username || "Anonim"}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
