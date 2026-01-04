"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, MessageCircle, Bookmark, ExternalLink, Edit2, FileEdit } from "lucide-react";
import { ProfileArticleCard } from "@/components/profile/profile-article-card";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

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
    // Combine bookmarked items into single list with type indicator
    const savedItems = [
        ...(bookmarkedArticles || []).map((item: any) => ({
            type: 'article' as const,
            id: item.articles?.id,
            title: item.articles?.title,
            slug: item.articles?.slug,
            date: item.created_at,
            category: item.articles?.category
        })),
        ...(bookmarkedQuestions || []).map((item: any) => ({
            type: 'question' as const,
            id: item.questions?.id,
            title: item.questions?.title,
            date: item.created_at,
            category: item.questions?.category
        }))
    ].filter(item => item.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <Tabs defaultValue="articles" className="w-full">
                {/* Tab Navigation - Cleaner */}
                <TabsList className="w-full justify-start bg-card border-2 border-foreground/10 rounded-xl p-1 mb-4 flex-wrap h-auto gap-1">
                    <TabsTrigger
                        value="articles"
                        className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground transition-all font-bold text-xs px-4 py-2"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Makaleler
                        <span className="ml-1.5 opacity-60">({articles.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="questions"
                        className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground transition-all font-bold text-xs px-4 py-2"
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Sorular
                        <span className="ml-1.5 opacity-60">({questions.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="answers"
                        className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground transition-all font-bold text-xs px-4 py-2"
                    >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Cevaplar
                        <span className="ml-1.5 opacity-60">({answers.length})</span>
                    </TabsTrigger>

                    {isOwnProfile && drafts.length > 0 && (
                        <TabsTrigger
                            value="drafts"
                            className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground transition-all font-bold text-xs px-4 py-2"
                        >
                            <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                            Taslaklar
                            <span className="ml-1.5 opacity-60">({drafts.length})</span>
                        </TabsTrigger>
                    )}

                    {isOwnProfile && (
                        <TabsTrigger
                            value="saved"
                            className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground transition-all font-bold text-xs px-4 py-2"
                        >
                            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                            Kaydedilenler
                            <span className="ml-1.5 opacity-60">({savedItems.length})</span>
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Articles Tab */}
                <TabsContent value="articles" className="mt-0">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articles.map((article) => (
                                <ProfileArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="Henüz makale yok"
                            description="İlk makaleni yazarak başla!"
                        />
                    )}
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="mt-0">
                    {questions.length > 0 ? (
                        <div className="space-y-3">
                            {questions.map((question) => (
                                <Link key={question.id} href={`/forum/${question.id}`}>
                                    <div className="group p-4 rounded-xl border border-foreground/10 hover:border-amber-500/30 bg-card hover:bg-amber-500/5 transition-all duration-200">
                                        <h3 className="text-base font-bold text-foreground group-hover:text-amber-500 transition-colors mb-2 line-clamp-1">
                                            {question.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{format(new Date(question.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {question.answers?.length || 0} cevap
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={MessageSquare}
                            title="Henüz soru yok"
                            description="İlk soruyu sen sor!"
                        />
                    )}
                </TabsContent>

                {/* Answers Tab */}
                <TabsContent value="answers" className="mt-0">
                    {answers.length > 0 ? (
                        <div className="space-y-3">
                            {answers.map((answer) => (
                                <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                    <div className="p-4 rounded-xl border border-foreground/10 bg-card hover:bg-foreground/5 transition-colors">
                                        <p className="text-foreground/80 text-sm leading-relaxed mb-2 line-clamp-2">
                                            {answer.content}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MessageCircle className="w-3 h-3" />
                                            <span className="line-clamp-1">{answer.questions?.title || `Soru #${answer.question_id}`}</span>
                                            <span>•</span>
                                            <span>{format(new Date(answer.created_at), 'dd MMM', { locale: tr })}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={MessageCircle}
                            title="Henüz cevap yok"
                            description="Soruları cevaplamaya başla!"
                        />
                    )}
                </TabsContent>

                <TabsContent value="drafts" className="mt-0">
                    {drafts.length > 0 ? (
                        <div className="space-y-3">
                            {drafts.map((draft) => (
                                <div key={draft.id} className="group p-4 rounded-xl border-2 border-dashed border-foreground/20 bg-card hover:bg-foreground/5 transition-all flex justify-between items-center">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded">Taslak</span>
                                            <span className="text-xs text-muted-foreground">{format(new Date(draft.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-foreground line-clamp-1">
                                            {draft.title || "(Başlıksız Taslak)"}
                                        </h3>
                                    </div>
                                    <Link href={`/makale/duzenle/${draft.id}`}>
                                        <Button size="sm" variant="outline" className="gap-2 font-bold border-2">
                                            <Edit2 className="w-4 h-4" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FileEdit}
                            title="Taslak yok"
                            description="Yarım kalan işin yok, harika!"
                        />
                    )}
                </TabsContent>

                {/* Saved Tab - Unified List (No Nested Tabs) */}
                <TabsContent value="saved" className="mt-0">
                    {savedItems.length > 0 ? (
                        <div className="space-y-2">
                            {savedItems.map((item) => (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    href={item.type === 'article' ? `/blog/${item.slug}` : `/forum/${item.id}`}
                                >
                                    <div className="group flex items-center gap-3 p-3 rounded-xl border border-foreground/10 hover:border-amber-500/30 bg-card hover:bg-amber-500/5 transition-all duration-200">
                                        <div className={`p-2 rounded-lg ${item.type === 'article' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {item.type === 'article' ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-foreground group-hover:text-amber-500 transition-colors line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="uppercase">{item.type === 'article' ? 'Makale' : 'Soru'}</span>
                                                {item.category && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{item.category}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Bookmark}
                            title="Kaydedilen içerik yok"
                            description="İlginç içerikleri kaydet!"
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Simplified Empty State Component
function EmptyState({
    icon: Icon,
    title,
    description
}: {
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <div className="text-center py-10 rounded-xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02]">
            <Icon className="w-12 h-12 mx-auto mb-3 text-foreground/20" />
            <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
