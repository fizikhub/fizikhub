"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Bookmark } from "lucide-react";
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
            <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="questions" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Sorular</span>
                    <Badge variant="secondary" className="ml-1">{questions?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="answers" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Cevaplar</span>
                    <Badge variant="secondary" className="ml-1">{answers?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                    🔔
                    <span>Bildirimler</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-2">
                    💬
                    <span>Mesajlar</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>Kaydedilenler</span>
                </TabsTrigger>
            </TabsList>

            <div className="mt-6">
                <TabsContent value="questions" className="space-y-4">
                    {!questions || questions.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <h3 className="font-semibold mb-2">Henüz soru yok</h3>
                                <p className="text-muted-foreground text-sm mb-4">İlk sorunu sorarak başla!</p>
                                <Link href="/forum">
                                    <Button>Soru Sor</Button>
                                </Link>
                            </CardContent>
                        </Card>
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
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-muted-foreground">Henüz cevap vermediniz.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        answers.map((answer) => (
                            <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                <Card className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <Badge variant="outline">Cevap</Badge>
                                            <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Soru: <span className="text-foreground">{answer.questions?.title || "Silinmiş"}</span>
                                        </p>
                                        <p className="text-sm line-clamp-2">{answer.content}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardContent className="p-4">
                            <NotificationsList userId={userId} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card>
                        <CardContent className="p-0">
                            <ConversationList conversations={conversations} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="saved">
                    <Tabs defaultValue="articles">
                        <TabsList>
                            <TabsTrigger value="articles" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Makaleler ({bookmarkedArticles?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="questions" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Sorular ({bookmarkedQuestions?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-4">
                            <TabsContent value="articles" className="space-y-4">
                                {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                            <p className="text-muted-foreground mb-4">Henüz makale kaydetmediniz.</p>
                                            <Link href="/blog">
                                                <Button variant="outline">Makaleleri Keşfet</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    bookmarkedArticles.map((item: any) => (
                                        <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                            <Card className="hover:border-primary/50 transition-colors">
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold mb-2">{item.articles.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.articles.excerpt}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{item.articles.author?.full_name || "Yazar"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr })}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="questions" className="space-y-4">
                                {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                            <p className="text-muted-foreground mb-4">Henüz soru kaydetmediniz.</p>
                                            <Link href="/forum">
                                                <Button variant="outline">Soruları Keşfet</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    bookmarkedQuestions.map((item: any) => (
                                        <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                            <Card className="hover:border-primary/50 transition-colors">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Badge variant="outline">{item.questions.category || "Genel"}</Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.questions.answers?.[0]?.count || 0} Cevap
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold mb-2">{item.questions.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {item.questions.content.substring(0, 150)}...
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{item.questions.profiles?.full_name || "Kullanıcı"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.questions.created_at), { addSuffix: true, locale: tr })}</span>
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
