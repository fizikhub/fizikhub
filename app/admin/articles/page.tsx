import { createClient } from "@/lib/supabase-server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getArticles } from "@/lib/api";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";
import { AdminArticleApproval } from "@/components/admin/admin-article-approval";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminArticlesPage() {
    const supabase = await createClient();

    // Fetch all articles
    const articles = await getArticles(supabase, { status: null, authorRole: 'all' });

    // Use SERVICE ROLE to bypass RLS for admin panel
    const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("🔍 Admin Panel: Fetching pending articles...");

    // Fetch pending articles with SERVICE ROLE (bypasses RLS)
    const { data: pendingArticles, error } = await serviceSupabase
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

    if (error) {
        console.error("❌ Admin Panel Error:", error);
    }

    if (!pendingArticles || pendingArticles.length === 0) {
        console.log("⚠️ NO PENDING ARTICLES FOUND");
    } else {
        console.log(`✅ Found ${pendingArticles.length} pending articles:`,
            pendingArticles.map(a => ({ id: a.id, title: a.title, status: a.status }))
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Makale Yönetimi</h1>
                <p className="text-muted-foreground">
                    Makaleleri onayla, düzenle veya sil.
                </p>
            </div>

            <Tabs defaultValue="approval" className="w-full">
                <TabsList>
                    <TabsTrigger value="approval" className="relative">
                        İncelemeler
                        {pendingArticles && pendingArticles.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
                                {pendingArticles.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="list">Tüm Makaleler</TabsTrigger>
                </TabsList>

                <TabsContent value="approval" className="mt-6">
                    {!pendingArticles || pendingArticles.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Henüz inceleme bekleyen makale yok.</p>
                        </div>
                    ) : (
                        <AdminArticleApproval pendingArticles={pendingArticles} />
                    )}
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                    <AdminArticlesList initialArticles={articles} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
