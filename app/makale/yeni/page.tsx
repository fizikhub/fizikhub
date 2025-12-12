import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { NewArticleForm } from "@/components/article/new-article-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewArticlePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user has written an article before
    const { data: profile } = await supabase
        .from("profiles")
        .select("has_written_article")
        .eq("id", user.id)
        .single();

    const isFirstArticle = !profile?.has_written_article;

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
                            <h1 className="text-xl md:text-2xl font-black">Yeni Makale</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-5xl mx-auto px-4 py-8">
                <NewArticleForm
                    userId={user.id}
                    isFirstArticle={isFirstArticle}
                />
            </div>
        </div>
    );
}
