import { getPendingArticles } from "./actions";
import { AuthorPanelClient } from "./client-page";
import { WriteArticleAction } from "./WriteArticleAction";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function YazarPaneliPage() {
    const { articles, error } = await getPendingArticles();

    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-black mb-4">Erişim Reddedildi</h1>
                <p className="text-zinc-400">{error}</p>
            </div>
        );
    }



    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Yazar Ekibi Paneli</h1>
                        <p className="text-zinc-400">
                            İncelenmeyi bekleyen makaleleri onaylayın. 4 yazar onayı alan makaleler otomatik olarak yayınlanır.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <WriteArticleAction />
                        
                        <Link href="/yazar-paneli/manifesto">
                            <Button variant="outline" className="font-bold border-2 border-black dark:border-zinc-800 h-11 px-5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Yazar Rehberi
                            </Button>
                        </Link>
                    </div>
                </div>

                <AuthorPanelClient initialArticles={articles || []} />
            </div>
        </main>
    );
}
