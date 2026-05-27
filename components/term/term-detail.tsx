"use client";

import { Hash, Calendar, Heart, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { m as motion } from "framer-motion";
import { toast } from "sonner";


import { MarkdownRenderer } from "@/components/markdown-renderer";

interface TermArticle {
    title: string;
    content: string | null;
    created_at: string;
    author?: {
        username?: string | null;
        full_name?: string | null;
        avatar_url?: string | null;
    } | null;
}

interface TermDetailProps {
    article: TermArticle;
    readingTime: string;
    likeCount: number;
    initialLiked: boolean;
    initialBookmarked: boolean;
}

export function TermDetail({ article, readingTime, likeCount }: TermDetailProps) {
    const content = article.content || "";
    // Extract metadata
    const metadataMatch = content.match(/<!--meta (.*?) -->/);
    const metadata = metadataMatch ? JSON.parse(metadataMatch[1]) : {};

    // Fallback metadata
    const termName = metadata.termName || article.title;
    const relatedField = metadata.relatedField || "Genel Bilim";

    // Clean content
    let cleanContent = content.replace(/<!--meta .*? -->/, "");
    cleanContent = cleanContent.trim();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">

            {/* Background Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-16 relative z-10">

                {/* Back Button */}
                <Link prefetch={false} href="/makale?category=Terim" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 sm:mb-12 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wider">Terimler Sözlüğüne Dön</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-card border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Watermark */}
                    <div className="absolute right-8 top-8 text-[12rem] leading-none font-grotesk text-blue-500/5 select-none pointer-events-none">
                        &rdquo;
                    </div>

                    <div className="relative z-10 space-y-8">
                        {/* Header */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/10 text-xs sm:text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                    <Hash className="w-4 h-4" />
                                    {relatedField}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-foreground tracking-tight leading-tight">
                                {termName}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border/30 pb-8">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8 border border-border/50">
                                        <AvatarImage src={article.author?.avatar_url || undefined} />
                                        <AvatarFallback>{article.author?.full_name?.[0] || "A"}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-bold text-foreground">{article.author?.full_name || article.author?.username}</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(new Date(article.created_at), 'd MMMM yyyy', { locale: tr })}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{readingTime}</span>
                                {likeCount > 0 && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3.5 h-3.5" />
                                            {likeCount}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-xl prose-p:leading-loose prose-p:font-grotesk prose-p:text-muted-foreground/90">
                            <MarkdownRenderer content={cleanContent} />
                        </div>

                        {/* Academic Citation Block (GEO/AI search optimized) */}
                        <div className="mt-12 p-6 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-sm space-y-4">
                            <div className="flex items-center gap-2.5">
                                <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
                                    <Hash className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black uppercase tracking-wider text-blue-500">Akademik Atıf ve Kaynakça</h3>
                            </div>
                            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                                Bu bilimsel terim makalesini akademik çalışmalarınızda veya ödevlerinizde kaynak göstermek için aşağıdaki formatları kopyalayabilirsiniz. Yapay zeka arama motorları için optimize edilmiştir.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                {/* APA */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">APA Formatı</span>
                                        <button
                                            onClick={() => {
                                                const citationText = `${article.author?.full_name || article.author?.username || 'Fizikhub'}. (${format(new Date(article.created_at), "yyyy")}). "${termName}" Bilim Terimi. Fizikhub. Erişim adresi: ${window.location.href}`;
                                                navigator.clipboard.writeText(citationText);
                                                toast.success("APA formatı kopyalandı!");
                                            }}
                                            className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase"
                                        >
                                            Kopyala
                                        </button>
                                    </div>
                                    <div className="bg-black/40 border border-border/30 rounded-xl p-3 text-xs text-slate-300 font-mono select-all break-all leading-normal">
                                        {article.author?.full_name || article.author?.username || 'Fizikhub'}. ({format(new Date(article.created_at), "yyyy")}). &quot;{termName}&quot; Bilim Terimi. Fizikhub. Erişim adresi: <span className="text-blue-400">{typeof window !== 'undefined' ? window.location.href : `https://www.fizikhub.com/makale/${termName}`}</span>
                                    </div>
                                </div>

                                {/* BibTeX */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">BibTeX Formatı</span>
                                        <button
                                            onClick={() => {
                                                const citationText = `@misc{fizikhub_${termName},\n  author = {${article.author?.full_name || article.author?.username || 'Fizikhub'}},\n  title = {${termName} Terimi Açıklaması},\n  howpublished = {Fizikhub Bilim Sözlüğü},\n  year = {${format(new Date(article.created_at), "yyyy")}},\n  url = {${window.location.href}}\n}`;
                                                navigator.clipboard.writeText(citationText);
                                                toast.success("BibTeX formatı kopyalandı!");
                                            }}
                                            className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase"
                                        >
                                            Kopyala
                                        </button>
                                    </div>
                                    <pre className="bg-black/40 border border-border/30 rounded-xl p-3 text-[11px] text-slate-300 font-mono overflow-x-auto select-all leading-normal whitespace-pre">
{`@misc{fizikhub_${termName},
  author = {${article.author?.full_name || article.author?.username || 'Fizikhub'}},
  title = {${termName} Terimi Açıklaması},
  howpublished = {Fizikhub Bilim Sözlüğü},
  year = {${format(new Date(article.created_at), "yyyy")}},
  url = {${typeof window !== 'undefined' ? window.location.href : `https://www.fizikhub.com/makale/${termName}`}}
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Footer Interactions */}
                        <div className="flex items-center justify-between pt-8 border-t border-border/30 mt-12">
                            <div className="flex gap-4">
                                <Button variant="outline" className="gap-2 rounded-full border-2 hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    Paylaş
                                </Button>
                            </div>

                            {/* Like / Actions Placeholder - Logic can be added later or reused from ArticleActions */}
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
