import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";
import { AdminArticleApproval } from "@/components/admin/admin-article-approval";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
    const supabase = await createClient();

    // Fetch all articles
    const articles = await getArticles(supabase, { status: null, authorRole: 'all' });

    // Fetch pending articles
    const { data: pendingArticles } = await supabase
        .from('articles')
        .select(`
            *,
            profiles (
                username,
                full_name
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (!pendingArticles) {
        console.log("No pending articles found or error occurred");
    } else {
        console.log(`Found ${pendingArticles.length} pending articles`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Makale Yönetimi</h1>
                <p className="text-muted-foreground">
                    Makaleleri onayla, düzenle veya sil.
                </p>
            </div>

            <Tabs defaultValue="list" className="w-full">
                <TabsList>
                    <TabsTrigger value="list">Tüm Makaleler</TabsTrigger>
                    <TabsTrigger value="approval" className="relative">
                        Onay Bekleyenler
                        {pendingArticles && pendingArticles.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                                {pendingArticles.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-6">
                    <AdminArticlesList initialArticles={articles} />
                </TabsContent>

                <TabsContent value="approval" className="mt-6">
                    <AdminArticleApproval pendingArticles={pendingArticles || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
