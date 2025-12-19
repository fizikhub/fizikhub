"use client";

import { QuestionCard } from "@/components/forum/question-card";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Fragment } from "react";

interface QuestionListProps {
    initialQuestions: any[];
    userVotes: Map<number, number>;
    latestArticle?: any;
}

export function QuestionList({ initialQuestions, userVotes, latestArticle }: QuestionListProps) {
    const questions = useRealtimeQuestions(initialQuestions);

    return (
        <div className="space-y-3">
            {questions.map((question, index) => (
                <Fragment key={question.id}>
                    <QuestionCard
                        question={question}
                        userVote={userVotes.get(question.id)}
                    />
                    {index === 2 && latestArticle && (
                        <Link href={`/blog/${latestArticle.slug}`} className="block group">
                            <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-1 transition-all hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <Sparkles className="h-24 w-24 -rotate-12 text-primary" />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 bg-background/50 backdrop-blur-sm rounded-lg p-4 h-full items-center">
                                    {/* Image */}
                                    <div className="relative h-24 w-24 sm:h-20 sm:w-32 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-sm">
                                        <Image
                                            src={latestArticle.image_url || "/placeholder-article.jpg"}
                                            alt={latestArticle.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center sm:text-left min-w-0">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20 animate-pulse">
                                                <Sparkles className="h-3 w-3" />
                                                YENİ MAKALE
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                                {latestArticle.category || "Genel"}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {latestArticle.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 mb-2">
                                            {latestArticle.summary}
                                        </p>
                                        <div className="flex items-center justify-center sm:justify-start text-xs font-bold text-primary group-hover:underline decoration-2 underline-offset-4">
                                            HEMEN OKU
                                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </Fragment>
            ))}
        </div>
    );
}
