"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Bookmark, Bell, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/forum/question-card";
import { formatDistanceToNow } from "date-fns";
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
            <TabsList className="w-full justify-start overflow-x-auto bg-black/40 border-b border-white/10 p-0 h-12 gap-0 mb-8 rounded-none no-scrollbar">
                <TabsTrigger
                    value="questions"
                    className="relative px-6 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 transition-all hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">Sorular</span>
                        <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{questions?.length || 0}</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="answers"
                    className="relative px-6 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 transition-all hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">Cevaplar</span>
                        <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{answers?.length || 0}</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="notifications"
                    className="relative px-6 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 transition-all hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">Bildirimler</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="messages"
                    className="relative px-6 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 transition-all hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">Mesajlar</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="saved"
                    className="relative px-6 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 transition-all hover:bg-white/5"
                >
                    <div className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        <span className="font-bold uppercase tracking-wider font-mono">Arşiv</span>
                    </div>
                </TabsTrigger>
            </TabsList>

            <div className="mt-6">
                <TabsContent value="questions" className="space-y-4">
                    {!questions || questions.length === 0 ? (
                        <div className="border border-dashed border-white/10 p-12 text-center bg-black/20 backdrop-blur-sm rounded-xl">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-white/20" />
                            <h3 className="font-black uppercase mb-2 text-white/50 tracking-widest">VERİ YOK</h3>
                            <p className="text-white/30 text-sm mb-6 font-mono">Sistemde soru kaydı bulunamadı.</p>
                            <Link href="/forum">
                                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                    SORU KAYDI OLUŞTUR
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={{
                                    ...question,
                                    profiles: {
                                        username: profile?.username || "Ben",
                                        full_name: profile?.full_name
                                    },
                                    answers: []
                                }}
                                hasVoted={false}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="answers" className="space-y-4">
                    {!answers || answers.length === 0 ? (
                        <div className="border border-dashed border-white/10 p-12 text-center bg-black/20 backdrop-blur-sm rounded-xl">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-white/20" />
                            <p className="text-white/30 font-mono uppercase">Cevap kaydı bulunamadı.</p>
                        </div>
                    ) : (
                        answers.map((answer) => (
                            <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                <div className="group relative bg-black/40 border border-white/10 p-6 rounded-xl hover:border-blue-500/50 transition-all hover:bg-blue-950/20">
                                    <div className="flex items-center gap-3 text-xs text-blue-300/50 mb-3 font-mono">
                                        <span className="bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">CEVAP</span>
                                        <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr }).toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mb-3 uppercase">
                                        REF: <span className="text-white group-hover:text-blue-400 transition-colors">{answer.questions?.title || "SİLİNMİŞ KAYIT"}</span>
                                    </p>
                                    <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-blue-500/30 pl-4">{answer.content}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <NotificationsList userId={userId} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="messages">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                        <ConversationList conversations={conversations} />
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
            </div>
        </Tabs>
    );
}
