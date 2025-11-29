import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Book, MessageSquare, Users } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { getArticles, getDictionaryTerms } from "@/lib/api";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";
import { AdminQuestionsList } from "@/components/admin/admin-questions-list";
import { AdminDictionaryList } from "@/components/admin/admin-dictionary-list";
import { AdminUsersList } from "@/components/admin/admin-users-list";
import { AdminReportsList } from "@/components/admin/admin-reports-list";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { getReports } from "@/app/actions/report";

import { AdminBroadcastForm } from "@/components/admin/admin-broadcast-form";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: termsCount } = await supabase.from('dictionary_terms').select('*', { count: 'exact', head: true });
    const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });


    // Fetch data for management
    const articles = await getArticles(supabase);
    const terms = await getDictionaryTerms(supabase);

    // Fetch questions with answer count
    const { data: questions } = await supabase
        .from('questions')
        .select(`
            *,
            answers(count)
        `)
        .order('created_at', { ascending: false });

    const questionsWithCount = questions?.map(q => ({
        ...q,
        answer_count: q.answers?.[0]?.count || 0
    })) || [];

    // Fetch all users for management
    // Fetch recent users for management (limit to 50 for performance)
    const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    // Fetch reports
    const reports = await getReports();

    // Recent Activity Data
    const recentQuestions = questions?.slice(0, 5) || [];
    const recentUsers = allUsers?.slice(0, 5) || [];

    return (
        <div className="space-y-8">
            <Tabs defaultValue="overview" className="w-full">
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <TabsList className="grid w-full grid-cols-4 min-w-[400px]">
                        <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                        <TabsTrigger value="articles">Makaleler</TabsTrigger>
                        <TabsTrigger value="forum">Forum</TabsTrigger>
                        <TabsTrigger value="dictionary">Sözlük</TabsTrigger>
                        <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
                        <TabsTrigger value="reports">Raporlar</TabsTrigger>
                        <TabsTrigger value="broadcast">Duyuru</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Genel Bakış</h1>
                        <p className="text-muted-foreground">
                            Sitenin güncel durumunu buradan takip edebilirsin.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{articlesCount || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sözlük Terimi</CardTitle>
                                <Book className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{termsCount || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Forum Sorusu</CardTitle>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{questionsCount || 0}</div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Recent Activity Section */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                        <Card className="col-span-7">
                            <CardHeader>
                                <CardTitle>Son Sorular</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentQuestions.map((question) => (
                                        <div key={question.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="space-y-1">
                                                <Link href={`/forum/${question.id}`} className="font-medium hover:underline line-clamp-1">
                                                    {question.title}
                                                </Link>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span>{question.profiles?.username || "Anonim"}</span>
                                                    <span>•</span>
                                                    <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                                                </div>
                                            </div>
                                            <div className="text-xs font-medium bg-muted px-2 py-1 rounded">
                                                {question.category}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="articles" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">Makaleler</h2>
                        <p className="text-muted-foreground">Tüm makaleleri buradan yönetebilirsin.</p>
                    </div>
                    <AdminArticlesList initialArticles={articles} />
                </TabsContent>

                <TabsContent value="forum" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">Forum Soruları</h2>
                        <p className="text-muted-foreground">Tüm soruları buradan yönetebilirsin.</p>
                    </div>
                    <AdminQuestionsList initialQuestions={questionsWithCount} />
                </TabsContent>

                <TabsContent value="dictionary" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">Sözlük Terimleri</h2>
                        <p className="text-muted-foreground">Tüm terimleri buradan yönetebilirsin.</p>
                    </div>
                    <AdminDictionaryList initialTerms={terms} />
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">Kullanıcılar</h2>
                        <p className="text-muted-foreground">Tüm kayıtlı kullanıcıları buradan yönetebilirsin.</p>
                    </div>
                    <AdminUsersList initialUsers={allUsers || []} />
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">Raporlar</h2>
                        <p className="text-muted-foreground">Kullanıcı şikayetlerini buradan yönetebilirsin.</p>
                    </div>
                    <AdminReportsList initialReports={reports} />
                </TabsContent>

                <TabsContent value="broadcast" className="space-y-4">
                    <AdminBroadcastForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
