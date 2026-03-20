import { getMyArticles } from "../actions";
import { MyArticlesClient } from "./client-page";
import { WriteArticleAction } from "../WriteArticleAction";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function YazilarimPage() {
    const { articles, error } = await getMyArticles();

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
                        <div className="flex items-center gap-4 mb-2">
                            <Link href="/yazar-paneli">
                                <Button variant="ghost" size="icon" className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <h1 className="text-4xl font-black">Yazılarım</h1>
                        </div>
                        <p className="text-zinc-400">
                            Buradan sadece kendinize ait gönderilmiş makaleleri görüntüleyebilir ve düzenleyebilirsiniz. 
                            Düzenlediğiniz makalelerin onayları sıfırlanacaktır.
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

                <MyArticlesClient initialArticles={articles || []} />
            </div>
        </main>
    );
}
