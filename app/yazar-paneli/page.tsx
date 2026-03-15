import { getPendingArticles } from "./actions";
import { AuthorPanelClient } from "./client-page";
import Link from "next/link";
import { BookOpen, PenSquare } from "lucide-react";
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
            <div className="container max-w-5xl mx-auto px-4">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Yazar Ekibi Paneli</h1>
                        <p className="text-zinc-400">
                            İncelenmeyi bekleyen makaleleri onaylayın. 4 yazar onayı alan makaleler otomatik olarak yayınlanır.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 flex-shrink-0">
                        <Link href="/makale/yeni">
                            <Button className="font-black border-2 border-black dark:border-zinc-800 bg-[#FFBD2E] text-black hover:bg-[#FFD268] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-12 px-6">
                                <PenSquare className="w-5 h-5 mr-2" />
                                Yazı Yaz
                            </Button>
                        </Link>
                        
                        <Link href="/yazar-paneli/manifesto">
                            <Button className="font-black border-2 border-black dark:border-zinc-800 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-12 px-6">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Yazar Manifestosu
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <AuthorPanelClient initialArticles={articles || []} />
            </div>
        </main>
    );
}
