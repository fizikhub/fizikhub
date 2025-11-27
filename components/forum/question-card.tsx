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
            <Card className="border-0 shadow-none bg-transparent hover:bg-card/40 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl">
                <CardContent className="p-0 sm:p-4">
                    <div className="flex gap-4 items-start">
                        {/* Avatar Column */}
                        <div className="hidden sm:block flex-shrink-0 pt-1">
                            {question.profiles?.username ? (
                                <Link
                                    href={`/kullanici/${question.profiles.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Avatar className="h-10 w-10 ring-2 ring-background transition-transform group-hover:scale-105">
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
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Header: Metadata & Badges */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="sm:hidden font-medium text-foreground flex items-center gap-1">
                                        @{question.profiles?.username || "Anonim"}
                                        {question.profiles?.is_verified && (
                                            <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                        )}
                                    </span>
                                    <span className="hidden sm:inline flex items-center gap-1">
                                        <span className="font-medium text-foreground hover:underline cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            if (question.profiles?.username) router.push(`/kullanici/${question.profiles.username}`);
                                        }}>
                                            @{question.profiles?.username || "Anonim"}
                                        </span>
                                        {question.profiles?.is_verified && (
                                            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                                        )}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {isSolved && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0 h-5 px-1.5 text-[10px]">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Çözüldü
                                        </Badge>
                                    )}

                                    <Badge variant="outline" className="text-[10px] h-5 px-2 font-normal border-border/50 bg-background/50">
                                        {question.category || "Genel"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-base sm:text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {question.title}
                            </h3>

                            {/* Preview Content */}
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                                {question.content}
                            </p>

                            {/* Footer: Tags & Stats */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-wrap gap-1.5">
                                    {question.tags?.slice(0, 3).map((tag) => (
                                        <span key={tag} className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                                    <VoteButton
                                        questionId={question.id}
                                        initialVotes={question.votes || 0}
                                        initialHasVoted={hasVoted}
                                        className="border-0 shadow-none px-0 py-0 hover:bg-transparent text-muted-foreground hover:text-primary"
                                    />
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        <span>{answerCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{question.views || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Separator */}
                    <div className="h-px bg-border/30 mt-4 sm:hidden" />
                </CardContent>
            </Card>
        </motion.div>
    );
}
