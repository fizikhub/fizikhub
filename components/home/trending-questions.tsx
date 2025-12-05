"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Question {
    id: number;
    title: string;
    created_at: string;
    votes: number;
    answer_count: number;
    profiles: {
        username: string | null;
        avatar_url: string | null;
    } | null;
}

export function TrendingQuestions({ questions }: { questions: Question[] }) {
    if (!questions || questions.length === 0) return null;

    return (
        <section className="py-24 bg-muted/20">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b-2 border-black dark:border-white pb-6">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter mb-2 uppercase">
                            Gündem
                        </h2>
                        <p className="text-muted-foreground text-lg font-medium">
                            Topluluğun en çok tartıştığı konular.
                        </p>
                    </div>
                    <Link href="/forum" className="hidden sm:flex items-center gap-2 font-bold hover:underline decoration-2 underline-offset-4">
                        FORUMA GİT
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/forum/${question.id}`} className="group block">
                                <div className="bg-background border-2 border-border p-6 hover:border-black dark:hover:border-white transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1">

                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <Avatar className="w-10 h-10 border-2 border-black dark:border-white">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                                            <AvatarFallback className="font-bold">{question.profiles?.username?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">@{question.profiles?.username}</span>
                                            <span className="text-muted-foreground text-xs font-medium uppercase">
                                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                                            {question.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-none border border-border">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{question.votes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-none border border-border">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{question.answer_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link href="/forum">
                        <div className="brutalist-button inline-flex px-8 py-3 items-center justify-center gap-2 w-full">
                            FORUMA GİT
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
