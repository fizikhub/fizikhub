import { createClient } from "@/lib/supabase-server";
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

    // Fetch pending articles - RLS should allow admin to see all
    // Use explicit relationship name to avoid ambiguity (author_id vs reviewed_by)
    const { data: pendingArticles, error } = await supabase
        .from('articles')
        .select(`
            *,
            author:profiles!author_id (
                username,
                full_name
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error && process.env.NODE_ENV === 'development') {
        console.error("❌ Admin Panel Error:", error);
    }

    // Check current user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (process.env.NODE_ENV === 'development') {
            console.log("👤 Current user role:", profile?.role);
        }
    }

    if (process.env.NODE_ENV === 'development') {
        if (!pendingArticles || pendingArticles.length === 0) {
            console.log("⚠️ NO PENDING ARTICLES RETURNED (check RLS policies)");
        } else {
            console.log(`✅ Found ${pendingArticles.length} pending articles:`,
                pendingArticles.map(a => ({ id: a.id, title: a.title, status: a.status }))
            );
        }
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
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                            <p className="text-lg font-semibold mb-2">Henüz inceleme bekleyen makale yok.</p>
                            <p className="text-sm text-muted-foreground">
                                Yeni makaleler gönderildiğinde burada görünecek.
                            </p>
                            {error && (
                                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
                                    <p className="text-sm text-destructive font-mono">{error.message}</p>
                                </div>
                            )}
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
