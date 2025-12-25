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
                        <Link href={`/makale/${latestArticle.slug}`} className="block group my-2">
                            <div className="border-4 border-black dark:border-white bg-card hover:bg-accent transition-colors duration-200 flex flex-col sm:flex-row">
                                {/* Image */}
                                <div className="relative w-full sm:w-32 md:w-40 aspect-video sm:aspect-square flex-shrink-0 overflow-hidden border-b-4 sm:border-b-0 sm:border-r-4 border-black dark:border-white">
                                    <Image
                                        src={latestArticle.image_url || "/placeholder-article.jpg"}
                                        alt={latestArticle.title}
                                        fill
                                        className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-200"
                                    />
                                    <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-[10px] font-black uppercase tracking-wider">
                                        Makale
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground block mb-1">
                                            {latestArticle.category || "Genel"}
                                        </span>
                                        <h3 className="font-black text-base md:text-lg uppercase leading-tight line-clamp-2 group-hover:underline decoration-2 underline-offset-4">
                                            {latestArticle.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-2 border-t-2 border-border text-xs">
                                        <span className="font-bold">Oku →</span>
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
