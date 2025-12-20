import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { NewArticleForm } from "@/components/article/new-article-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Fetch article
    const { data: article, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !article) {
        redirect("/profil"); // Or 404
    }

    // Authorization: Only author can edit
    if (article.author_id !== user.id) {
        redirect("/profil");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("has_written_article")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="border-b-2 border-foreground/10 bg-card shadow-sm sticky top-0 z-10">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/profil">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Geri</span>
                                </Button>
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black">Makale Düzenle</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-5xl mx-auto px-4 py-8">
                <NewArticleForm
                    userId={user.id}
                    isFirstArticle={!profile?.has_written_article}
                    initialData={{
                        id: article.id, // Important for update logic
                        title: article.title,
                        content: article.content,
                        excerpt: article.excerpt,
                        category: article.category,
                        coverUrl: article.cover_url || article.image_url,
                        status: article.status
                    }}
                />
            </div>
        </div>
    );
}
