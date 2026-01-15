"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, MessageCircle, Bookmark, Edit2, PenTool } from "lucide-react";
import { FeedItem } from "@/components/profile/feed-item";
import { FeedEmptyState } from "@/components/profile/feed-empty-state";
import { useRouter } from "next/navigation";

interface ProfileContentFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    drafts?: any[];
    isOwnProfile?: boolean;
}

export function ProfileContentFeed({
    articles,
    questions,
    answers,
    bookmarkedArticles,
    bookmarkedQuestions,
    drafts = [],
    isOwnProfile = true
}: ProfileContentFeedProps) {
    const router = useRouter();

    // Combine bookmarked items
    const savedItems = useMemo(() => [
        ...(bookmarkedArticles || []).map((item: any) => ({
            type: 'article' as const,
            id: item.articles?.id || item.id, // Fallbacks for safety
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
            // Question bookmarks might not have author expanded depending on query, careful here
        }))
    ].filter(item => item.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [bookmarkedArticles, bookmarkedQuestions]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Tabs defaultValue="articles" className="w-full">

                {/* 
                    Modern Segmented Tab Control 
                    Inspired by Reddit's profile nav but cleaner
                */}
                <div className="border-b border-border/40 pb-1 mb-8 overflow-x-auto scrollbar-hide">
                    <TabsList className="h-auto p-0 bg-transparent gap-8 w-full justify-start md:justify-start min-w-[320px]">
                        <TabTriggerItem value="articles" icon={FileText} label="Makaleler" count={articles?.length} />
                        <TabTriggerItem value="questions" icon={MessageSquare} label="Sorular" count={questions?.length} />
                        <TabTriggerItem value="answers" icon={MessageCircle} label="Cevaplar" count={answers?.length} />

                        {isOwnProfile && drafts?.length > 0 && (
                            <TabTriggerItem value="drafts" icon={PenTool} label="Taslaklar" count={drafts.length} />
                        )}

                        {isOwnProfile && savedItems.length > 0 && (
                            <TabTriggerItem value="saved" icon={Bookmark} label="Kaydedilenler" count={savedItems.length} />
                        )}
                    </TabsList>
                </div>

                {/* --- Content Areas --- */}

                {/* 1. Articles */}
                <TabsContent value="articles" className="mt-0 focus-visible:outline-none">
                    {articles?.length > 0 ? (
                        <div className="flex flex-col">
                            {articles.map((article) => (
                                <FeedItem
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
                            ))}
                        </div>
                    ) : (
                        <FeedEmptyState
                            icon={FileText}
                            title={isOwnProfile ? "Henüz makale yazmadın" : "Burada kullanıcının yazdığı makaleler görünür"}
                            description={isOwnProfile ? "Bilimsel merakını paylaşmaya ne dersin?" : "Henüz bir makale yayınlanmamış."}
                        />
                    )}
                </TabsContent>

                {/* 2. Questions */}
                <TabsContent value="questions" className="mt-0 focus-visible:outline-none">
                    {questions?.length > 0 ? (
                        <div className="flex flex-col">
                            {questions.map((question) => (
                                <FeedItem
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
                            ))}
                        </div>
                    ) : (
                        <FeedEmptyState
                            icon={MessageSquare}
                            title={isOwnProfile ? "Soru sormaya başla" : "Henüz soru sorulmamış"}
                            description={isOwnProfile ? "Takıldığın yerlerde topluluğun gücünü kullan." : "Bilim burada başlar, ama henüz başlamamış."}
                        />
                    )}
                </TabsContent>

                {/* 3. Answers */}
                <TabsContent value="answers" className="mt-0 focus-visible:outline-none">
                    {answers?.length > 0 ? (
                        <div className="flex flex-col">
                            {answers.map((answer) => (
                                <FeedItem
                                    key={answer.id}
                                    type="answer"
                                    title={answer.questions?.title || "Silinmiş Soru"}
                                    description={answer.content}
                                    href={`/forum/${answer.questions?.id || '#'}`}
                                    date={answer.created_at}
                                // stats={{ likes: answer.votes }} // access answer votes if available
                                />
                            ))}
                        </div>
                    ) : (
                        <FeedEmptyState
                            icon={MessageCircle}
                            title={isOwnProfile ? "Henüz cevap yok" : "Cevap yok ama potansiyel çok"}
                            description={isOwnProfile ? "Başkalarının sorularına ışık tutabilirsin." : "Kullanıcı henüz tartışmalara katılmamış."}
                        />
                    )}
                </TabsContent>

                {/* 4. Drafts */}
                <TabsContent value="drafts" className="mt-0 focus-visible:outline-none">
                    {drafts?.length > 0 ? (
                        <div className="flex flex-col">
                            {drafts.map((draft: any) => (
                                <FeedItem
                                    key={draft.id}
                                    type="draft"
                                    title={draft.title || "(Başlıksız Taslak)"}
                                    href={`/makale/duzenle/${draft.id}`}
                                    date={draft.created_at}
                                    category={draft.category}
                                    status="draft"
                                    onEdit={() => router.push(`/makale/duzenle/${draft.id}`)}
                                />
                            ))}
                        </div>
                    ) : null}
                </TabsContent>

                {/* 5. Saved */}
                <TabsContent value="saved" className="mt-0 focus-visible:outline-none">
                    {savedItems?.length > 0 ? (
                        <div className="flex flex-col">
                            {savedItems.map((item) => (
                                <FeedItem
                                    key={`${item.type}-${item.id}`}
                                    type={item.type}
                                    title={item.title}
                                    href={item.type === 'article' ? `/blog/${item.slug}` : `/forum/${item.id}`}
                                    date={item.date}
                                    category={item.category}
                                />
                            ))}
                        </div>
                    ) : null}
                </TabsContent>

            </Tabs>
        </div>
    );
}

// Small helper for cleaner code
function TabTriggerItem({ value, icon: Icon, label, count }: { value: string, icon: any, label: string, count?: number }) {
    return (
        <TabsTrigger
            value={value}
            className="
                group
                flex items-center gap-2 
                px-1 py-3 
                rounded-none 
                bg-transparent 
                border-b-2 border-transparent 
                data-[state=active]:border-foreground 
                data-[state=active]:bg-transparent 
                data-[state=active]:shadow-none 
                text-muted-foreground 
                data-[state=active]:text-foreground 
                transition-all duration-200
            "
        >
            <Icon className="w-4 h-4 group-data-[state=active]:stroke-[2.5px]" />
            <span className="font-medium text-sm">{label}</span>
            {count !== undefined && (
                <span className="text-xs text-muted-foreground/60 group-data-[state=active]:text-foreground/60 font-medium ml-0.5">
                    {count}
                </span>
            )}
        </TabsTrigger>
    );
}
