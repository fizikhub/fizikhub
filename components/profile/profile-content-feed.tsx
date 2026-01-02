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
        <div className="space-y-4">
            <Tabs defaultValue="articles" className="w-full">
                {/* Tab Navigation */}
                <TabsList className="w-full justify-start bg-muted/50 border border-border rounded-lg p-1 mb-4 flex-wrap h-auto gap-1">
                    <TabsTrigger
                        value="articles"
                        className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground transition-all text-xs px-3 py-1.5"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Makaleler
                        <span className="ml-1.5 opacity-50">({articles.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="questions"
                        className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground transition-all text-xs px-3 py-1.5"
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Sorular
                        <span className="ml-1.5 opacity-50">({questions.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="answers"
                        className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground transition-all text-xs px-3 py-1.5"
                    >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Cevaplar
                        <span className="ml-1.5 opacity-50">({answers.length})</span>
                    </TabsTrigger>

                    {isOwnProfile && drafts.length > 0 && (
                        <TabsTrigger
                            value="drafts"
                            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground transition-all text-xs px-3 py-1.5"
                        >
                            <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                            Taslaklar
                            <span className="ml-1.5 opacity-50">({drafts.length})</span>
                        </TabsTrigger>
                    )}

                    {isOwnProfile && (
                        <TabsTrigger
                            value="saved"
                            className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground transition-all text-xs px-3 py-1.5"
                        >
                            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                            Kayıtlı
                            <span className="ml-1.5 opacity-50">({savedItems.length})</span>
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Articles Tab */}
                <TabsContent value="articles" className="mt-0">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {articles.map((article) => (
                                <ProfileArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={FileText} title="Henüz makale yok" description="İlk makaleni yazarak başla!" />
                    )}
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="mt-0">
                    {questions.length > 0 ? (
                        <div className="space-y-2">
                            {questions.map((question) => (
                                <Link key={question.id} href={`/forum/${question.id}`}>
                                    <div className="group p-3 rounded-lg border border-border hover:border-foreground/20 bg-card hover:bg-muted/50 transition-colors">
                                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-1">
                                            {question.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{format(new Date(question.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {question.answers?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={MessageSquare} title="Henüz soru yok" description="İlk soruyu sen sor!" />
                    )}
                </TabsContent>

                {/* Answers Tab */}
                <TabsContent value="answers" className="mt-0">
                    {answers.length > 0 ? (
                        <div className="space-y-2">
                            {answers.map((answer) => (
                                <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                    <div className="p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                                        <p className="text-sm text-foreground/80 leading-relaxed mb-2 line-clamp-2">
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
                        <EmptyState icon={MessageCircle} title="Henüz cevap yok" description="Soruları cevaplamaya başla!" />
                    )}
                </TabsContent>

                {/* Drafts Tab */}
                <TabsContent value="drafts" className="mt-0">
                    {drafts.length > 0 ? (
                        <div className="space-y-2">
                            {drafts.map((draft) => (
                                <div key={draft.id} className="group p-3 rounded-lg border border-dashed border-border bg-card flex justify-between items-center">
                                    <div className="flex-1 min-w-0 mr-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-medium bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">Taslak</span>
                                            <span className="text-xs text-muted-foreground">{format(new Date(draft.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                        </div>
                                        <h3 className="text-sm font-medium text-foreground line-clamp-1">
                                            {draft.title || "(Başlıksız)"}
                                        </h3>
                                    </div>
                                    <Link href={`/makale/duzenle/${draft.id}`}>
                                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                                            <Edit2 className="w-3 h-3" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={FileEdit} title="Taslak yok" description="Yarım kalan işin yok!" />
                    )}
                </TabsContent>

                {/* Saved Tab */}
                <TabsContent value="saved" className="mt-0">
                    {savedItems.length > 0 ? (
                        <div className="space-y-2">
                            {savedItems.map((item) => (
                                <Link key={`${item.type}-${item.id}`} href={item.type === 'article' ? `/blog/${item.slug}` : `/forum/${item.id}`}>
                                    <div className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-foreground/20 bg-card hover:bg-muted/50 transition-colors">
                                        <div className={`p-1.5 rounded ${item.type === 'article' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {item.type === 'article' ? <FileText className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{item.type === 'article' ? 'Makale' : 'Soru'}</span>
                                                {item.category && <><span>•</span><span>{item.category}</span></>}
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Bookmark} title="Kayıtlı içerik yok" description="İlginç içerikleri kaydet!" />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="text-center py-12 rounded-lg border border-dashed border-border bg-muted/20">
            <Icon className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}
