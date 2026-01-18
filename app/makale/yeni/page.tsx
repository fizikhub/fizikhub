import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { NewArticleForm } from "@/components/article/new-article-form";
import { ExperimentEditor } from "@/components/experiment/experiment-editor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewArticlePageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const type = searchParams.type;
    const isExperiment = type === 'experiment';

    // Check if user has written an article before and seen guide
    const { data: profile } = await supabase
        .from("profiles")
        .select("has_written_article, has_seen_article_guide")
        .eq("id", user.id)
        .single();

    const isFirstArticle = !profile?.has_written_article;
    const hasSeenGuide = profile?.has_seen_article_guide || false;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="border-b-2 border-foreground/10 bg-card shadow-sm sticky top-0 z-10">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/profil">
                                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Vazgeç</span>
                                </Button>
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black tracking-tight">
                                {isExperiment ? 'Deney Paylaş' : 'Blog Oluştur'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-5xl mx-auto px-4 py-8">
                {isExperiment ? (
                    <ExperimentEditor userId={user.id} />
                ) : (
                    <NewArticleForm
                        userId={user.id}
                        isFirstArticle={isFirstArticle}
                        hasSeenGuide={hasSeenGuide}
                    />
                )}
            </div>
        </div>
    );
}
