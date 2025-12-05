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
            <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 h-auto gap-2 mb-6 rounded-none">
                <TabsTrigger
                    value="questions"
                    className="gap-2 rounded-none border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-background data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-bold uppercase">Sorular</span>
                    <Badge variant="secondary" className="ml-1 rounded-none text-[10px] h-5 px-1">{questions?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger
                    value="answers"
                    className="gap-2 rounded-none border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-background data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <FileText className="h-4 w-4" />
                    <span className="font-bold uppercase">Cevaplar</span>
                    <Badge variant="secondary" className="ml-1 rounded-none text-[10px] h-5 px-1">{answers?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger
                    value="notifications"
                    className="gap-2 rounded-none border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-background data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <Bell className="h-4 w-4" />
                    <span className="font-bold uppercase">Bildirimler</span>
                </TabsTrigger>
                <TabsTrigger
                    value="messages"
                    className="gap-2 rounded-none border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-background data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-bold uppercase">Mesajlar</span>
                </TabsTrigger>
                <TabsTrigger
                    value="saved"
                    className="gap-2 rounded-none border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-background data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all"
                >
                    <Bookmark className="h-4 w-4" />
                    <span className="font-bold uppercase">Arşiv</span>
                </TabsTrigger>
            </TabsList>

            <div className="mt-6">
                <TabsContent value="questions" className="space-y-4">
                    {!questions || questions.length === 0 ? (
                        <div className="border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center bg-muted/5">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <h3 className="font-black uppercase mb-2">VERİ BULUNAMADI ŞEF</h3>
                            <p className="text-muted-foreground text-sm mb-4 font-mono">Henüz sisteme bir soru girişi yapılmamış.</p>
                            <Link href="/forum">
                                <Button className="rounded-none font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
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
                        <div className="border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center bg-muted/5">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground font-mono uppercase">Henüz cevap kaydı yok.</p>
                        </div>
                    ) : (
                        answers.map((answer) => (
                            <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                <Card className="rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-mono">
                                            <Badge variant="outline" className="rounded-none border-black dark:border-white">CEVAP</Badge>
                                            <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr }).toUpperCase()}</span>
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground mb-2 uppercase">
                                            REF: <span className="text-foreground group-hover:text-primary transition-colors">{answer.questions?.title || "SİLİNMİŞ KAYIT"}</span>
                                        </p>
                                        <p className="text-sm line-clamp-2 border-l-2 border-primary/30 pl-3">{answer.content}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <CardContent className="p-4">
                            <NotificationsList userId={userId} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card className="rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <CardContent className="p-0">
                            <ConversationList conversations={conversations} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="saved">
                    <Tabs defaultValue="articles">
                        <TabsList className="bg-muted/50 rounded-none border border-black/10 dark:border-white/10 mb-4">
                            <TabsTrigger value="articles" className="gap-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <FileText className="h-4 w-4" />
                                MAKALELER ({bookmarkedArticles?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="questions" className="gap-2 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <MessageSquare className="h-4 w-4" />
                                SORULAR ({bookmarkedQuestions?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-4">
                            <TabsContent value="articles" className="space-y-4">
                                {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                                    <div className="border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center bg-muted/5">
                                        <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground font-mono uppercase mb-4">Arşiv boş.</p>
                                        <Link href="/blog">
                                            <Button variant="outline" className="rounded-none border-black dark:border-white">MAKALELERİ TARA</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    bookmarkedArticles.map((item: any) => (
                                        <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                            <Card className="rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                                <CardContent className="p-4">
                                                    <h3 className="font-black uppercase mb-2">{item.articles.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 font-mono text-xs">{item.articles.excerpt}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-dashed border-border pt-2 mt-2">
                                                        <span className="font-bold">{item.articles.author?.full_name || "YAZAR"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr }).toUpperCase()}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="questions" className="space-y-4">
                                {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                                    <div className="border-2 border-dashed border-black/20 dark:border-white/20 p-12 text-center bg-muted/5">
                                        <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground font-mono uppercase mb-4">Soru arşivi boş.</p>
                                        <Link href="/forum">
                                            <Button variant="outline" className="rounded-none border-black dark:border-white">SORULARI TARA</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    bookmarkedQuestions.map((item: any) => (
                                        <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                            <Card className="rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Badge variant="outline" className="rounded-none border-black dark:border-white">{item.questions.category || "GENEL"}</Badge>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {item.questions.answers?.[0]?.count || 0} CEVAP
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black uppercase mb-2">{item.questions.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 border-l-2 border-primary/30 pl-2">
                                                        {item.questions.content.substring(0, 150)}...
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-dashed border-border pt-2 mt-2">
                                                        <span className="font-bold">{item.questions.profiles?.full_name || "KULLANICI"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.questions.created_at), { addSuffix: true, locale: tr }).toUpperCase()}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
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
