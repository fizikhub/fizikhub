"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Bookmark, Bell, MessageCircle, Microscope, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/forum/question-card";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import { NotificationsList } from "@/components/profile/notifications-list";
import { ConversationList } from "@/components/messaging/conversation-list";

interface ProfileTabsProps {
    questions: any[];
    answers: any[];
    conversations: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    userId: string;
    profile: any;
}

export function ProfileTabs({
    questions,
    answers,
    conversations,
    bookmarkedArticles,
    bookmarkedQuestions,
    userId,
    profile
}: ProfileTabsProps) {
    return (
        <Tabs defaultValue="questions" className="mb-20">
            <TabsList className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-2 gap-4 h-auto flex flex-wrap justify-start">
                <TabsTrigger
                    value="questions"
                    className="rounded-lg border border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-amber-100/60 font-mono font-bold uppercase tracking-wider transition-all hover:bg-amber-500/5 group"
                >
                    <div className="flex items-center gap-2">
                        <Microscope className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                        <span>Sorular</span>
                    </div>
                </TabsTrigger>

                <TabsTrigger
                    value="answers"
                    className="rounded-lg border border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-amber-100/60 font-mono font-bold uppercase tracking-wider transition-all hover:bg-amber-500/5 group"
                >
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                        <span>Cevaplar</span>
                    </div>
                </TabsTrigger>

                <TabsTrigger
                    value="notifications"
                    className="rounded-lg border border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-amber-100/60 font-mono font-bold uppercase tracking-wider transition-all hover:bg-amber-500/5 group"
                >
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                        <span>Bildirimler</span>
                    </div>
                </TabsTrigger>

                <TabsTrigger
                    value="messages"
                    className="rounded-lg border border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-amber-100/60 font-mono font-bold uppercase tracking-wider transition-all hover:bg-amber-500/5 group"
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                        <span>Mesajlar</span>
                    </div>
                </TabsTrigger>

                <TabsTrigger
                    value="saved"
                    className="rounded-lg border border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 text-amber-100/60 font-mono font-bold uppercase tracking-wider transition-all hover:bg-amber-500/5 group"
                >
                    <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                        <span>Kaydedilenler</span>
                    </div>
                </TabsTrigger>
            </TabsList>

            {/* Questions Tab Content */}
            <TabsContent value="questions" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <Link href={`/forum/${question.id}`} key={question.id}>
                                <div className="bg-black/60 backdrop-blur-sm border border-amber-500/20 p-4 hover:border-amber-500/60 transition-all group relative overflow-hidden rounded-xl">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
                                    <div className="pl-4">
                                        <h3 className="font-bold text-lg text-amber-100 mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors font-sans">
                                            {question.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-mono text-amber-200/50">
                                            <span>{format(new Date(question.created_at), 'dd.MM.yyyy', { locale: tr })}</span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {question.answers?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-amber-500/20 rounded-xl bg-amber-950/10">
                            <p className="text-amber-200/50 font-mono uppercase tracking-widest">Veri Bulunamadı</p>
                        </div>
                    )}
                </div>
            </TabsContent>

            {/* Answers Tab Content */}
            <TabsContent value="answers" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {answers.length > 0 ? (
                        answers.map((answer) => (
                            <div key={answer.id} className="bg-black/60 backdrop-blur-sm border border-amber-500/20 p-4 hover:border-amber-500/60 transition-all group relative overflow-hidden rounded-xl">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
                                <div className="pl-4">
                                    <p className="font-medium text-amber-100/80 mb-2 line-clamp-3 font-sans">
                                        "{answer.content}"
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-mono text-amber-200/50 mt-2">
                                        <Activity className="w-3 h-3" />
                                        <span>Soru ID: #{answer.question_id}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-amber-500/20 rounded-xl bg-amber-950/10">
                            <p className="text-amber-200/50 font-mono uppercase tracking-widest">Veri Bulunamadı</p>
                        </div>
                    )}
                </div>
            </TabsContent>

            <TabsContent value="notifications">
                <div className="border border-dashed border-amber-500/20 p-12 text-center bg-amber-950/10 rounded-xl">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-amber-500/20" />
                    <p className="text-amber-200/50 font-mono uppercase">Bildirim bulunamadı.</p>
                </div>
            </TabsContent>

            <TabsContent value="messages">
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                    <ConversationList initialConversations={conversations} currentConversationId={null} />
                </div>
            </TabsContent>

            <TabsContent value="saved">
                <Tabs defaultValue="articles">
                    <TabsList className="bg-black/20 border border-white/10 mb-6 p-1 h-auto rounded-lg inline-flex">
                        <TabsTrigger value="articles" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 rounded px-4 py-1.5 h-auto text-xs font-mono">
                            MAKALELER ({bookmarkedArticles?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="questions" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 rounded px-4 py-1.5 h-auto text-xs font-mono">
                            SORULAR ({bookmarkedQuestions?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                        <TabsContent value="articles" className="space-y-4">
                            {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                                <div className="border border-dashed border-white/10 p-12 text-center bg-black/20 rounded-xl">
                                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-white/20" />
                                    <p className="text-white/30 font-mono uppercase mb-4">Arşiv boş.</p>
                                    <Link href="/blog">
                                        <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">KEŞFET</Button>
                                    </Link>
                                </div>
                            ) : (
                                bookmarkedArticles.map((item: any) => (
                                    <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                        <div className="bg-black/40 border border-white/10 p-6 rounded-xl hover:border-amber-500/50 transition-all hover:bg-amber-950/20 group">
                                            <h3 className="font-black uppercase mb-2 text-lg text-white group-hover:text-amber-400 transition-colors">{item.articles.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-3 font-mono text-xs">{item.articles.excerpt}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-white/5 pt-3 mt-2">
                                                <span className="font-bold text-amber-500/80">{item.articles.author?.full_name || "YAZAR"}</span>
                                                <span>•</span>
                                                <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr }).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-4">
                            {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                                <div className="border border-dashed border-white/10 p-12 text-center bg-black/20 rounded-xl">
                                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-white/20" />
                                    <p className="text-white/30 font-mono uppercase mb-4">Soru arşivi boş.</p>
                                    <Link href="/forum">
                                        <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">KEŞFET</Button>
                                    </Link>
                                </div>
                            ) : (
                                bookmarkedQuestions.map((item: any) => (
                                    <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                        <div className="bg-black/40 border border-white/10 p-6 rounded-xl hover:border-amber-500/50 transition-all hover:bg-amber-950/20 group">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant="outline" className="rounded border-white/20 text-gray-400">{item.questions.category || "GENEL"}</Badge>
                                                <span className="text-xs text-amber-500/50 font-mono">
                                                    {item.questions.answers?.[0]?.count || 0} CEVAP
                                                </span>
                                            </div>
                                            <h3 className="font-black uppercase mb-2 text-lg text-white group-hover:text-amber-400 transition-colors">{item.questions.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-3 border-l-2 border-amber-500/30 pl-3">
                                                {item.questions.content.substring(0, 150)}...
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </TabsContent>
        </Tabs>
    );
}
