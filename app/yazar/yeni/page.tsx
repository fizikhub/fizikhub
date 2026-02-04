import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ArticleEditor } from "@/components/writer/article-editor";

export default async function NewArticlePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is a writer
    // Check if user is a writer
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_writer, role")
        .eq("id", user.id)
        .single();

    if (!profile?.is_writer && profile?.role !== 'author' && profile?.role !== 'admin') {
        redirect("/");
    }

    return (
        <div className="container max-w-4xl py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Makale</h1>
                <p className="text-muted-foreground mt-1">Bilgi birikiminizi paylaşın.</p>
            </div>
            <ArticleEditor />
        </div>
    );
}
