import { createClient } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";
import { ArticleEditor } from "@/components/writer/article-editor";

interface EditArticlePageProps {
    params: {
        id: string;
    };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is a writer
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_writer")
        .eq("id", user.id)
        .single();

    if (!profile?.is_writer) {
        redirect("/");
    }

    const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("id", params.id)
        .eq("author_id", user.id)
        .single();

    if (!article) {
        notFound();
    }

    return (
        <div className="container max-w-4xl py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Makaleyi Düzenle</h1>
                <p className="text-muted-foreground mt-1">İçeriğinizi güncelleyin ve tekrar onaya gönderin.</p>
            </div>
            <ArticleEditor article={article} />
        </div>
    );
}
