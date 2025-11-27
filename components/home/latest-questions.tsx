"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface Question {
    id: number;
    title: string;
    created_at: string;
    category: string | null;
    author: {
        username: string | null;
        avatar_url: string | null;
    } | null;
    answers: { count: number }[];
}

interface LatestQuestionsProps {
    questions: Question[];
}

export function LatestQuestions({ questions }: LatestQuestionsProps) {
    return (
        <section className="py-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">Forumdan Son Sesler</h2>
                        <p className="text-muted-foreground">Topluluğun tartıştığı en son konular.</p>
                    </div>
                    <Link href="/forum">
                        <Button variant="outline" className="gap-2">
                            Foruma Git <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link href={`/forum/${question.id}`}>
                                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={question.author?.avatar_url || ""} />
                                                        <AvatarFallback className="text-[9px]">{question.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{question.author?.username || "Anonim"}</span>
                                                    <span>•</span>
                                                    <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                                </div>
                                                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                                    {question.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mt-2">
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {question.category || "Genel"}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/30 px-2 py-1 rounded-full">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                <span>{question.answers?.[0]?.count || 0}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
