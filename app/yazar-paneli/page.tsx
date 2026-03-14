import { getPendingArticles } from "./actions";
import { AuthorPanelClient } from "./client-page";

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
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2">Yazar Ekibi Paneli</h1>
                    <p className="text-zinc-400">
                        İncelenmeyi bekleyen makaleleri onaylayın. 4 yazar onayı alan makaleler otomatik olarak yayınlanır.
                    </p>
                </div>
                
                <AuthorPanelClient initialArticles={articles || []} />
            </div>
        </main>
    );
}
