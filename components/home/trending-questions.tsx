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
        <section className="py-24 bg-muted/30">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading">
                            Gündemdeki Sorular
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Topluluğun en çok tartıştığı konulara göz at
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-full group hidden sm:inline-flex" asChild>
                        <Link href="/forum">
                            Foruma Git
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/forum/${question.id}`} className="group block h-full">
                                <div className="h-full bg-background border border-border/50 rounded-3xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                        <MessageSquare className="w-32 h-32 -mr-10 -mt-10 rotate-12" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-10 h-10 border border-border">
                                            <AvatarImage src={question.profiles?.avatar_url || ""} />
                                            <AvatarFallback>{question.profiles?.username?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-foreground/90">@{question.profiles?.username}</span>
                                            <span className="text-muted-foreground text-xs">
                                                {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-6 line-clamp-2 group-hover:text-primary transition-colors font-heading leading-snug">
                                        {question.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-auto">
                                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            <span className="font-medium">{question.votes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span className="font-medium">{question.answer_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full rounded-full" asChild>
                        <Link href="/forum">Foruma Git</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
