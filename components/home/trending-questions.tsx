"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight, ThumbsUp, MessageCircle, Flame } from "lucide-react";
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
        <section className="py-20 bg-muted/20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                            <span className="text-sm font-medium text-orange-500 uppercase tracking-wider">Popüler</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">Gündemdeki Sorular</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Topluluğun en çok tartıştığı konulara göz at ve sohbete katıl.
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden md:block"
                    >
                        <Button variant="outline" className="rounded-full h-12 px-6 text-base group" asChild>
                            <Link href="/forum">
                                Foruma Git
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Mobile Horizontal Scroll / Desktop Grid */}
                <div className="relative -mx-4 px-4 pb-8 sm:pb-0 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible scrollbar-hide">
                    <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-max sm:w-full">
                        {questions.map((question, index) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="w-[300px] sm:w-auto flex-shrink-0"
                            >
                                <Link href={`/forum/${question.id}`} className="group block h-full">
                                    <div className="h-full bg-card border border-border/50 rounded-[1.5rem] p-6 sm:p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <MessageSquare className="w-32 h-32 -mr-10 -mt-10 rotate-12" />
                                        </div>

                                        <div className="flex items-center gap-3 mb-6">
                                            <Avatar className="w-10 h-10 border-2 border-background ring-2 ring-border/50">
                                                <AvatarImage src={question.profiles?.avatar_url || ""} />
                                                <AvatarFallback>{question.profiles?.username?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-foreground/90">@{question.profiles?.username}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg sm:text-xl font-bold mb-6 line-clamp-3 group-hover:text-primary transition-colors leading-relaxed">
                                            {question.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mt-auto pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{question.votes} Oy</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{question.answer_count} Cevap</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Mobile 'View All' Card */}
                        <div className="w-[200px] sm:hidden flex-shrink-0 flex items-center justify-center">
                            <Link href="/forum" className="flex flex-col items-center gap-4 text-muted-foreground hover:text-primary transition-colors p-8">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                                <span className="font-medium">Tüm Soruları Gör</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full rounded-full h-12 text-base" asChild>
                        <Link href="/forum">Foruma Git</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
