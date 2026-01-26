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
                            <div className="relative overflow-hidden border-[3px] border-black bg-neutral-50 dark:bg-[#18181b] shadow-[4px_4px_0px_0px_#06b6d4] hover:shadow-[2px_2px_0px_0px_#06b6d4] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-[8px] flex flex-col sm:flex-row">
                                {/* Cyan Header Strip */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-[#06b6d4] z-20"></div>

                                {/* Image */}
                                <div className="relative w-full sm:w-32 md:w-36 aspect-video sm:aspect-auto flex-shrink-0 overflow-hidden border-b-[3px] sm:border-b-0 sm:border-r-[3px] border-black">
                                    <Image
                                        src={latestArticle.image_url || "/placeholder-article.webp"}
                                        alt={latestArticle.title}
                                        fill
                                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute top-2 left-2 bg-[#06b6d4] border-2 border-black text-black px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                                        Makale
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0 z-10 bg-white dark:bg-[#18181b]">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#06b6d4] block mb-1">
                                            {latestArticle.category || "BİLİM"}
                                        </span>
                                        <h3 className="font-[family-name:var(--font-outfit)] font-black text-base md:text-lg uppercase leading-none text-black dark:text-zinc-100 line-clamp-2 group-hover:text-[#06b6d4] transition-colors">
                                            {latestArticle.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-2 text-xs">
                                        <span className="font-bold font-mono text-xs text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">Devamını Oku &rarr;</span>
                                        <Sparkles className="w-4 h-4 text-[#06b6d4] fill-current" />
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
