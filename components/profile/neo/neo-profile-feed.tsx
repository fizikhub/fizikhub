"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, MessageCircle, Bookmark, PenTool, LayoutGrid } from "lucide-react";
import { NeoFeedItem } from "./neo-feed-item";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NeoProfileFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    drafts?: any[];
    isOwnProfile?: boolean;
}

export function NeoProfileFeed({
    articles,
    questions,
    answers,
    bookmarkedArticles,
    bookmarkedQuestions,
    drafts = [],
    isOwnProfile = true
}: NeoProfileFeedProps) {
    const router = useRouter();

    // Combine bookmarked items
    const savedItems = useMemo(() => [
        ...(bookmarkedArticles || []).map((item: any) => ({
            type: 'article' as const,
            id: item.articles?.id || item.id,
            title: item.articles?.title || "Bilinmeyen Başlık",
            slug: item.articles?.slug,
            date: item.created_at,
            category: item.articles?.category,
            author: item.articles?.author
        })),
        ...(bookmarkedQuestions || []).map((item: any) => ({
            type: 'question' as const,
            id: item.questions?.id || item.id,
            title: item.questions?.title || "Bilinmeyen Soru",
            date: item.created_at,
            category: item.questions?.category,
        }))
    ].filter(item => item.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [bookmarkedArticles, bookmarkedQuestions]);

    return (
        <div className="w-full">
            <Tabs defaultValue="articles" className="w-full">

                {/* NEO TABS LIST - Horizontal Scrollable */}
                <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    <TabsList className="h-auto w-auto bg-transparent p-0 gap-3 justify-start">
                        <NeoTabTrigger value="articles" label="Makaleler" count={articles?.length} />
                        <NeoTabTrigger value="questions" label="Sorular" count={questions?.length} />
                        <NeoTabTrigger value="answers" label="Cevaplar" count={answers?.length} />

                        {isOwnProfile && drafts?.length > 0 && (
                            <NeoTabTrigger value="drafts" label="Taslaklar" count={drafts.length} />
                        )}

                        {isOwnProfile && savedItems.length > 0 && (
                            <NeoTabTrigger value="saved" label="Kaydedilenler" count={savedItems.length} />
                        )}
                    </TabsList>
                </div>

                {/* CONTENT AREAS */}

                {/* 1. Articles */}
                <TabsContent value="articles" className="mt-2 space-y-4 focus-visible:outline-none">
                    {articles?.length > 0 ? (
                        articles.map((article) => (
                            <NeoFeedItem
                                key={article.id}
                                type="article"
                                title={article.title}
                                description={article.excerpt}
                                href={`/blog/${article.slug}`}
                                date={article.created_at}
                                category={article.category}
                                stats={{
                                    likes: article.likes_count,
                                    views: article.views
                                }}
                            />
                        ))
                    ) : (
                        <NeoEmptyState title="Henüz Makale Yok" message="Bilimsel yazılarını burada paylaş." />
                    )}
                </TabsContent>

                {/* 2. Questions */}
                <TabsContent value="questions" className="mt-2 space-y-4 focus-visible:outline-none">
                    {questions?.length > 0 ? (
                        questions.map((question) => (
                            <NeoFeedItem
                                key={question.id}
                                type="question"
                                title={question.title}
                                href={`/forum/${question.id}`}
                                date={question.created_at}
                                category={question.category}
                                stats={{
                                    comments: question.answers_count,
                                    views: question.views
                                }}
                            />
                        ))
                    ) : (
                        <NeoEmptyState title="Soru Yok" message="Henüz bir soru sormadın." />
                    )}
                </TabsContent>

                {/* 3. Answers */}
                <TabsContent value="answers" className="mt-2 space-y-4 focus-visible:outline-none">
                    {answers?.length > 0 ? (
                        answers.map((answer) => (
                            <NeoFeedItem
                                key={answer.id}
                                type="answer"
                                title={answer.questions?.title || "Silinmiş Soru"}
                                description={answer.content}
                                href={`/forum/${answer.questions?.id || '#'}`}
                                date={answer.created_at}
                            />
                        ))
                    ) : (
                        <NeoEmptyState title="Cevap Yok" message="Tartışmalara katıl ve cevap ver." />
                    )}
                </TabsContent>

                {/* 4. Drafts */}
                <TabsContent value="drafts" className="mt-2 space-y-4 focus-visible:outline-none">
                    {drafts?.length > 0 ? (
                        drafts.map((draft: any) => (
                            <NeoFeedItem
                                key={draft.id}
                                type="draft"
                                title={draft.title || "(Başlıksız Taslak)"}
                                href={`/makale/duzenle/${draft.id}`}
                                date={draft.created_at}
                                category={draft.category}
                                status="draft"
                            />
                        ))
                    ) : null}
                </TabsContent>

                {/* 5. Saved */}
                <TabsContent value="saved" className="mt-2 space-y-4 focus-visible:outline-none">
                    {savedItems?.length > 0 ? (
                        savedItems.map((item) => (
                            <NeoFeedItem
                                key={`${item.type}-${item.id}`}
                                type={item.type}
                                title={item.title}
                                href={item.type === 'article' ? `/blog/${item.slug}` : `/forum/${item.id}`}
                                date={item.date}
                                category={item.category}
                            />
                        ))
                    ) : null}
                </TabsContent>

            </Tabs>
        </div>
    );
}

function NeoTabTrigger({ value, label, count }: { value: string, label: string, count?: number }) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "relative h-10 px-4 rounded-lg font-black text-sm uppercase tracking-wide border-2 border-transparent transition-all",
                "bg-zinc-100 dark:bg-zinc-800 text-neutral-500",
                "data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black",
                "data-[state=active]:shadow-[2px_2px_0px_#A3E635]",
                "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
        >
            {label}
            {count !== undefined && count > 0 && (
                <span className="ml-2 text-xs opacity-60 bg-white/20 px-1.5 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </TabsTrigger>
    );
}

function NeoEmptyState({ title, message }: { title: string, message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-black/20 rounded-xl bg-zinc-50/50">
            <div className="w-12 h-12 bg-zinc-200 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-black uppercase mb-1">{title}</h3>
            <p className="text-sm font-medium text-neutral-500">{message}</p>
        </div>
    );
}
