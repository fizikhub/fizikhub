"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare, MessageCircle, Bookmark } from "lucide-react";
import { ProfileArticleCard } from "@/components/profile/profile-article-card";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ProfileContentFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
}

export function ProfileContentFeed({
    articles,
    questions,
    answers,
    bookmarkedArticles,
    bookmarkedQuestions
}: ProfileContentFeedProps) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="articles" className="w-full">
                {/* Tab Navigation */}
                <TabsList className="w-full justify-start bg-card border-2 border-foreground/10 rounded-lg p-1.5 mb-8 flex-wrap h-auto gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                    <TabsTrigger
                        value="articles"
                        className="rounded data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none text-muted-foreground transition-all font-black uppercase text-[10px] tracking-wider"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Makaleler
                        <span className="ml-1.5 opacity-75">({articles.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="questions"
                        className="rounded data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none text-muted-foreground transition-all font-black uppercase text-[10px] tracking-wider"
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Sorular
                        <span className="ml-1.5 opacity-75">({questions.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="answers"
                        className="rounded data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none text-muted-foreground transition-all font-black uppercase text-[10px] tracking-wider"
                    >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Cevaplar
                        <span className="ml-1.5 opacity-75">({answers.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="saved"
                        className="rounded data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-none text-muted-foreground transition-all font-black uppercase text-[10px] tracking-wider"
                    >
                        <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                        Kaydedilenler
                    </TabsTrigger>
                </TabsList>

                {/* Articles Tab */}
                <TabsContent value="articles" className="mt-0">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <ProfileArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="Henüz makale yok"
                            description="İlk makaleni yazarak başla!"
                            color="cyan"
                        />
                    )}
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="mt-0">
                    {questions.length > 0 ? (
                        <div className="space-y-4">
                            {questions.map((question) => (
                                <Link key={question.id} href={`/forum/${question.id}`}>
                                    <div className="group p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.12)] dark:hover:shadow-[5px_5px_0px_rgba(255,255,255,0.12)] hover:-translate-y-1 transition-all duration-300 bg-card">
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-amber-500 transition-colors mb-3">
                                            {question.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{format(new Date(question.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-4 h-4" />
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
                            title="Henüz soru sorulmamış"
                            description="İlk soruyu sen sor!"
                            color="amber"
                        />
                    )}
                </TabsContent>

                {/* Answers Tab */}
                <TabsContent value="answers" className="mt-0">
                    {answers.length > 0 ? (
                        <div className="space-y-4">
                            {answers.map((answer) => (
                                <div
                                    key={answer.id}
                                    className="p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)] bg-card"
                                >
                                    <p className="text-foreground/90 leading-relaxed mb-3 line-clamp-3">
                                        {answer.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Soru #{answer.question_id} · {format(new Date(answer.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={MessageCircle}
                            title="Henüz cevap verilmemiş"
                            description="Soruları cevaplamaya başla!"
                            color="purple"
                        />
                    )}
                </TabsContent>

                {/* Saved Tab */}
                <TabsContent value="saved" className="mt-0">
                    <Tabs defaultValue="saved-articles" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="saved-articles">
                                Makaleler ({bookmarkedArticles?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="saved-questions">
                                Sorular ({bookmarkedQuestions?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved-articles">
                            {bookmarkedArticles && bookmarkedArticles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {bookmarkedArticles.map((item: any) => (
                                        <ProfileArticleCard key={item.articles.id} article={item.articles} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Bookmark}
                                    title="Kaydedilen makale yok"
                                    description="İlginç makaleleri kaydet!"
                                    color="pink"
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="saved-questions">
                            {bookmarkedQuestions && bookmarkedQuestions.length > 0 ? (
                                <div className="space-y-4">
                                    {bookmarkedQuestions.map((item: any) => (
                                        <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                            <div className="group p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50 shadow-[3px_3px_0px_rgba(0,0,0,0.08)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.12)] dark:hover:shadow-[5px_5px_0px_rgba(255,255,255,0.12)] hover:-translate-y-1 transition-all duration-300 bg-card">
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-pink-500 transition-colors mb-3">
                                                    {item.questions.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {item.questions.content?.substring(0, 150)}...
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Bookmark}
                                    title="Kaydedilen soru yok"
                                    description="İlginç soruları kaydet!"
                                    color="pink"
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Empty State Component
function EmptyState({
    icon: Icon,
    title,
    description,
    color
}: {
    icon: any;
    title: string;
    description: string;
    color: string;
}) {
    const colorClasses = {
        cyan: "text-cyan-500 border-cyan-500/20 bg-cyan-500/5",
        amber: "text-amber-500 border-amber-500/20 bg-amber-500/5",
        purple: "text-purple-500 border-purple-500/20 bg-purple-500/5",
        pink: "text-pink-500 border-pink-500/20 bg-pink-500/5"
    };

    return (
        <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className={`w-16 h-16 mx-auto mb-4 ${color === 'cyan' ? 'text-cyan-500/30' : color === 'amber' ? 'text-amber-500/30' : color === 'purple' ? 'text-purple-500/30' : 'text-pink-500/30'}`} />
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
