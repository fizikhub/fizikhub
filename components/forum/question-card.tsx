"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, Eye, ArrowUp, CheckCircle2, Flame, Zap, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "./vote-button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={handleCardClick}
            className="group"
        >
            <Card className="border-0 sm:border hover:border-primary/30 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-xl">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-4 sm:gap-6">
                        {/* Stats Column - Desktop */}
                        <div className="hidden sm:flex flex-col gap-3 items-center min-w-[60px] text-xs text-muted-foreground pt-1">
                            <div className="flex flex-col items-center gap-0.5">
                                <span className="text-lg font-bold text-foreground">{question.votes || 0}</span>
                                <span>oy</span>
                            </div>
                            <div className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${answerCount > 0 ? 'bg-green-500/10 text-green-600 border border-green-500/20' : ''}`}>
                                <span className={`text-lg font-bold ${answerCount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>{answerCount}</span>
                                <span>cevap</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 opacity-70">
                                <span className="font-medium">{question.views || 0}</span>
                                <span>bakış</span>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Mobile Stats & Meta */}
                            <div className="flex sm:hidden items-center justify-between text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-foreground">{question.votes || 0} oy</span>
                                    <span className={answerCount > 0 ? "text-green-600 font-medium" : ""}>{answerCount} cevap</span>
                                </div>
                                <span>{formatDistanceToNow(new Date(question.created_at), { locale: tr })}</span>
                            </div>

                            {/* Title & Category */}
                            <div className="space-y-1.5">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base sm:text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {question.title}
                                    </h3>
                                    {isSolved && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0 h-5 px-1.5 text-[10px] flex-shrink-0">
                                            <CheckCircle2 className="h-3 w-3 mr-0.5" />
                                            <span className="hidden sm:inline">Çözüldü</span>
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {question.tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Author & Date (Desktop) */}
                            <div className="hidden sm:flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/30">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                    <Link
                                        href={`/kullanici/${question.profiles?.username}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                    >
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                                            <AvatarFallback className="text-[10px]">{question.profiles?.username?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground">@{question.profiles?.username || "Anonim"}</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Author */}
                            <div className="flex sm:hidden items-center gap-2 mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground">
                                <Link
                                    href={`/kullanici/${question.profiles?.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 font-medium text-foreground"
                                >
                                    <Avatar className="h-4 w-4">
                                        <AvatarImage src={question.profiles?.avatar_url || ""} />
                                        <AvatarFallback className="text-[8px]">{question.profiles?.username?.[0]}</AvatarFallback>
                                    </Avatar>
                                    @{question.profiles?.username || "Anonim"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
