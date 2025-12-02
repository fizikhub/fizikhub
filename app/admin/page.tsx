import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Book, MessageSquare, Users } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats
    const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: termsCount } = await supabase.from('dictionary_terms').select('*', { count: 'exact', head: true });
    const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // Fetch recent questions
    const { data: recentQuestions } = await supabase
        .from('questions')
        .select(`
            *,
            profiles (
                username
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch recent users
    const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    return (
        <div className="space-y-8">
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kullanıcı</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Son Sorular</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentQuestions?.map((question) => (
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

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Son Üyeler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers?.map((user) => (
                                <div key={user.id} className="flex items-center gap-4 border-b pb-2 last:border-0 last:pb-0">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.username || ""} className="h-full w-full object-cover" />
                                        ) : (
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.username || "İsimsiz"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
