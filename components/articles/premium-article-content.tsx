"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Quote } from "lucide-react";

const MarkdownRenderer = dynamic(() => import("@/components/markdown-renderer").then(mod => mod.MarkdownRenderer), {
    loading: () => <div className="h-96 w-full animate-pulse bg-muted/20 rounded-xl" />
});

interface PremiumArticleContentProps {
    article: any;
}

export function PremiumArticleContent({ article }: PremiumArticleContentProps) {
    return (
        <section className="relative py-16 md:py-24">
            {/* Elegant Typography Focus */}
            <div className="container max-w-[85ch] mx-auto px-4">

                {/* Introduction / Abstract Section */}
                <div className="mb-20 p-8 md:p-12 bg-foreground/[0.02] border-y border-foreground/10 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-foreground/30" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-foreground/30" />

                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-4 block">Abstract / Özet</span>
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/80 italic">
                        {article.excerpt || "Bu makalenin özeti henüz eklenmemiştir. İçerik aşağıda yer almaktadır."}
                    </p>
                </div>

                {/* Main Content Body */}
                <div className={cn(
                    "prose prose-lg dark:prose-invert max-w-none",
                    // Scientific Typography
                    "prose-p:font-serif prose-p:text-[1.15rem] prose-p:leading-[1.8] prose-p:text-foreground/90 prose-p:mb-8",
                    "prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground",
                    "prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-10 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-foreground/5",
                    "prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6",
                    // Academic Links
                    "prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-a:decoration-foreground/30 hover:prose-a:decoration-foreground transition-all",
                    // Premium Blockquotes
                    "prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-2xl prose-blockquote:leading-relaxed prose-blockquote:py-10 prose-blockquote:px-0 prose-blockquote:border-none prose-blockquote:text-center prose-blockquote:text-foreground prose-blockquote:mx-auto prose-blockquote:max-w-2xl",
                    // List Decorations
                    "prose-li:font-serif prose-li:marker:text-foreground/40",
                    // KaTeX / Math specific tweaks (if any)
                    "prose-math:bg-foreground/5 prose-math:p-4 prose-math:rounded-lg overflow-x-auto",
                    // Image/Figure styles
                    "prose-img:rounded-sm prose-img:shadow-2xl prose-img:border border-foreground/10"
                )}>
                    <MarkdownRenderer
                        content={article.content || ""}
                        fontFamily="serif"
                        fontSize="lg"
                    />
                </div>

                {/* Article Footer Decorative Element */}
                <div className="mt-20 flex justify-center opacity-20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-foreground" />
                        <div className="w-2 h-2 rounded-full border border-foreground" />
                        <div className="w-12 h-px bg-foreground" />
                    </div>
                </div>
            </div>
        </section>
    );
}
