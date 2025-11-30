import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Kaydedilenler - FizikHub",
    description: "Kaydettiğiniz makaleler ve sorular.",
};

export default async function BookmarksPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch bookmarked articles
    const { data: bookmarkedArticles } = await supabase
        .from('article_bookmarks')
        .select(`
            created_at,
            articles (
                id,
                title,
                slug,
                excerpt,
                created_at,
                author:profiles(full_name, username)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch bookmarked questions
    const { data: bookmarkedQuestions } = await supabase
        .from('question_bookmarks')
        .select(`
            created_at,
            questions (
                id,
                title,
                content,
                created_at,
                category,
                profiles(full_name, username),
                answers(count)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Bookmark className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kaydedilenler</h1>
                    <p className="text-muted-foreground">Daha sonra okumak için kaydettiğiniz içerikler.</p>
                </div>
            </div>

            <Tabs defaultValue="articles" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                    <TabsTrigger
                        value="articles"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Makaleler</span>
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {bookmarkedArticles?.length || 0}
                            </Badge>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="questions"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Sorular</span>
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {bookmarkedQuestions?.length || 0}
                            </Badge>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-4 animate-in fade-in-50 duration-300">
                    {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
                            <Bookmark className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                            <p className="text-muted-foreground font-medium">Henüz hiç makale kaydetmediniz.</p>
                            <Link href="/blog">
                                <span className="text-primary hover:underline mt-2 inline-block text-sm">Makaleleri Keşfet</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {bookmarkedArticles.map((item: any) => (
                                <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {item.articles.title}
                                                    </h3>
                                                    <p className="text-muted-foreground line-clamp-2 text-sm">
                                                        {item.articles.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                                        <span>{item.articles.author?.full_name || "Yazar"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr })}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="questions" className="space-y-4 animate-in fade-in-50 duration-300">
                    {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
                            <Bookmark className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                            <p className="text-muted-foreground font-medium">Henüz hiç soru kaydetmediniz.</p>
                            <Link href="/forum">
                                <span className="text-primary hover:underline mt-2 inline-block text-sm">Soruları Keşfet</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {bookmarkedQuestions.map((item: any) => (
                                <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.questions.category || "Genel"}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.questions.answers?.[0]?.count || 0} Cevap
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {item.questions.title}
                                                    </h3>
                                                    <p className="text-muted-foreground line-clamp-2 text-sm">
                                                        {item.questions.content.substring(0, 150)}...
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                                        <span>{item.questions.profiles?.full_name || "Kullanıcı"}</span>
                                                        <span>•</span>
                                                        <span>{formatDistanceToNow(new Date(item.questions.created_at), { addSuffix: true, locale: tr })}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
