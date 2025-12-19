import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { AdminArticleEditor } from "@/components/admin/admin-article-editor";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email?.toLowerCase() !== 'barannnbozkurttb.b@gmail.com') {
        notFound();
    }

    // Fetch article
    const { data: article, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', parseInt(id))
        .single();

    if (error || !article) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Makale Düzenle</h1>
                <p className="text-muted-foreground">
                    "{article.title}" makalesini düzenliyorsunuz.
                </p>
            </div>

            <AdminArticleEditor article={article} />
        </div>
    );
}
