"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: any;
    hasVoted?: boolean;
}

export function QuestionCard({ question, hasVoted }: QuestionCardProps) {
    const isSolved = question.is_solved;
    const hasAcceptedAnswer = question.accepted_answer_id !== null;

    return (
        <Link href={`/forum/${question.id}`} className="group block h-full">
            <div className="h-full bg-card border-2 border-border p-6 hover:border-black dark:hover:border-white transition-all duration-200 flex flex-col gap-4 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 relative overflow-hidden">



                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-black dark:border-white">
                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                            <AvatarFallback className="font-bold bg-primary text-primary-foreground">
                                {question.profiles?.username?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm hover:underline decoration-2 underline-offset-2">
                                @{question.profiles?.username || "Anonim"}
                            </span>
                            <span className="text-muted-foreground text-xs font-bold uppercase">
                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase">
                        {question.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                        {question.content?.replace(/[#*`]/g, '') || "İçerik önizlemesi yok..."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-muted border border-border text-xs font-bold uppercase text-muted-foreground">
                            {question.category}
                        </span>
                        {question.tags?.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-4 text-sm font-bold text-muted-foreground border-t-2 border-border/50">
                    <div className={cn("flex items-center gap-2 px-3 py-1 border-2 border-transparent", hasVoted ? "text-primary border-primary/20 bg-primary/5" : "")}>
                        <ThumbsUp className={cn("w-4 h-4", hasVoted ? "fill-current" : "")} />
                        <span>{question.votes || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{question.answers?.length || question.answers?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 ml-auto">
                        <Eye className="w-4 h-4" />
                        <span>{question.views || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
