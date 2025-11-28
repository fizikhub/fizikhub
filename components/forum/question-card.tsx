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
            <Card className="border hover:border-primary/30 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-xl">
                <CardContent className="p-3 sm:p-5">
                    <div className="flex gap-3 sm:gap-4 items-start">
                        {/* Avatar Column - Only show on desktop */}
                        <div className="hidden sm:block flex-shrink-0 pt-1">
                            {question.profiles?.username ? (
                                <Link
                                    href={`/kullanici/${question.profiles.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-all group-hover:ring-primary/30">
                                        <AvatarImage src={question.profiles?.avatar_url || ""} className="object-cover" />
                                        <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">
                                            {question.profiles?.username?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                            ) : (
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">?</AvatarFallback>
                                </Avatar>
                            )}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-2.5">
                            {/* Header: Metadata & Badges */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground flex items-center gap-1">
                                        @{question.profiles?.username || "Anonim"}
                                        {question.profiles?.is_verified && (
                                            <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                        )}
                                    </span>
                                    <span>•</span>
                                    <span className="hidden sm:inline">{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                    <span className="sm:hidden">{formatDistanceToNow(new Date(question.created_at), { locale: tr })}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {isSolved && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0 h-5 px-1.5 text-[10px]">
                                            <CheckCircle2 className="h-3 w-3 mr-0.5" />
                                            <span className="hidden sm:inline">Çözüldü</span>
                                        </Badge>
                                    )}

                                    <Badge variant="outline" className="text-[10px] h-5 px-2 font-normal border-border/50 bg-background/50">
                                        {question.category || "Genel"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-sm sm:text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {question.title}
                            </h3>

                            {/* Preview Content - Desktop only */}
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                                {question.content}
                            </p>

                            {/* Footer: Tags & Stats */}
                            <div className="flex items-center justify-between pt-1 sm:pt-2 gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {question.tags?.slice(0, 2).map((tag) => (
                                        <span key={tag} className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                                    <VoteButton
                                        questionId={question.id}
                                        initialVotes={question.votes || 0}
                                        initialHasVoted={hasVoted}
                                        className="border-0 shadow-none px-0 py-0 hover:bg-transparent text-muted-foreground hover:text-primary h-auto min-h-0"
                                    />
                                    <div className="flex items-center gap-1 min-w-[2rem]">
                                        <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="text-[11px] sm:text-xs">{answerCount}</span>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{question.views || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
