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
        <section className="py-20 container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
                    >
                        Gündemdeki Sorular
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        className="text-muted-foreground"
                    >
                        Topluluğun en çok tartıştığı konulara göz at
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Button variant="outline" className="rounded-full group" asChild>
                        <Link href="/forum">
                            Foruma Git
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((question, index) => (
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/forum/${question.id}`} className="group block h-full">
                            <div className="h-full bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MessageSquare className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="w-8 h-8 border border-border">
                                        <AvatarImage src={question.profiles?.avatar_url || ""} />
                                        <AvatarFallback>{question.profiles?.username?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <span className="font-medium block text-foreground/90">@{question.profiles?.username}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-6 line-clamp-2 group-hover:text-primary transition-colors">
                                    {question.title}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                                    <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-full">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{question.votes}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-full">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>{question.answer_count}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
