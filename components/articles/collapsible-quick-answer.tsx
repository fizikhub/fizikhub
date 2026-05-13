"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuickAnswerProps {
    override: {
        summaryTitle: string;
        summary: string;
        formulaTitle: string;
        formula: string;
        formulaExplanation: string;
        exampleTitle: string;
        example: string;
        subtopics: readonly string[];
        questions: readonly { question: string; answer: string }[];
        termLinks: readonly { href: string; label: string }[];
        relatedQueries: readonly string[];
    };
    relatedArticles: { slug: string; title: string }[];
}

export function CollapsibleQuickAnswer({ override, relatedArticles }: QuickAnswerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="container mx-auto max-w-3xl px-4 mt-10 sm:mt-14 mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between gap-3",
                    "px-5 py-4 sm:px-6 sm:py-5",
                    "bg-zinc-50 dark:bg-zinc-950",
                    "border-2 border-zinc-200 dark:border-zinc-800",
                    "transition-all duration-200",
                    isOpen ? "rounded-t-2xl border-b-0" : "rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
                aria-expanded={isOpen}
                id="quick-answer-toggle"
            >
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFC800] border-2 border-black text-black font-black text-sm shadow-[2px_2px_0px_0px_#000]">
                        ⚡
                    </span>
                    <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Kısa Cevap</p>
                        <p className="text-base sm:text-lg font-black text-zinc-950 dark:text-white leading-tight mt-0.5">
                            {override.summaryTitle}
                        </p>
                    </div>
                </div>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 text-zinc-500 transition-transform duration-300 flex-shrink-0",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="border-2 border-t-0 border-zinc-200 dark:border-zinc-800 rounded-b-2xl bg-zinc-50 dark:bg-zinc-950 px-5 py-5 sm:px-6 sm:py-6 space-y-6">
                    {/* Summary */}
                    <p className="text-base font-medium leading-8 text-zinc-700 dark:text-zinc-300">
                        {override.summary}
                    </p>

                    {/* Formula & Example */}
                    <div className="grid gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">{override.formulaTitle}</p>
                            <p className="mt-2 rounded-[8px] border border-zinc-300 bg-white px-3 py-2 font-mono text-sm font-black text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
                                {override.formula}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{override.formulaExplanation}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">{override.exampleTitle}</p>
                            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{override.example}</p>
                        </div>
                    </div>

                    {/* Subtopics */}
                    <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
                        <h3 className="text-lg font-black tracking-normal text-zinc-950 dark:text-white">
                            Bu konuda bilmen gereken alt başlıklar
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {override.subtopics.map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded-[7px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-black text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="grid gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                        <h3 className="text-lg font-black tracking-normal text-zinc-950 dark:text-white">
                            Sık sorulan sorular
                        </h3>
                        {override.questions.map((item) => (
                            <div key={item.question}>
                                <h4 className="text-base font-black text-zinc-950 dark:text-white">{item.question}</h4>
                                <p className="mt-1 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{item.answer}</p>
                            </div>
                        ))}
                    </div>

                    {/* Related + Terms */}
                    <div className="grid gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">İlgili okumalar</p>
                            <div className="mt-3 grid gap-2">
                                {relatedArticles.map((article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/makale/${article.slug}`}
                                        className="text-sm font-black text-zinc-950 underline decoration-[#FFC800] decoration-2 underline-offset-4 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-200"
                                    >
                                        {article.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Terimler ve aranan alt konular</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {override.termLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="rounded-[7px] border border-zinc-950 bg-[#FFC800] px-2.5 py-1.5 text-xs font-black text-black hover:bg-white"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {override.relatedQueries.map((query) => (
                                    <span
                                        key={query}
                                        className="rounded-[7px] border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-black text-zinc-900 hover:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                    >
                                        {query}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
