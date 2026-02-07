import { createClient } from "@/lib/supabase-server";
import { NeoArticleCard } from "@/components/articles/neo-article-card";
import { Flame, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Makaleler | FizikHub",
    description: "Bilimsel makaleler ve araştırmalar.",
};

export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MakalePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'latest';

    const supabase = await createClient();

    let query = supabase
        .from('articles')
        .select(`*, author:profiles!articles_author_id_fkey!inner(*)`)
        .eq('status', 'published')
        .eq('author.is_writer', true);

    if (category) query = query.eq('category', category);

    query = sort === 'popular'
        ? query.order('views', { ascending: false })
        : query.order('created_at', { ascending: false });

    const { data: articles } = await query;
    const list = articles || [];

    const { data: catData } = await supabase.from('articles').select('category').eq('status', 'published');
    const cats = [...new Set((catData || []).map(a => a.category).filter(Boolean))] as string[];

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* Başlık */}
                <header className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight">Makaleler</h1>
                    <p className="text-muted-foreground text-sm mt-1">{list.length} yazı</p>
                </header>

                {/* Filtreler */}
                <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    <Tab href="/makale" on={!category && sort === 'latest'}>Son</Tab>
                    <Tab href="/makale?sort=popular" on={sort === 'popular'}>
                        <Flame className="w-3.5 h-3.5" /> Popüler
                    </Tab>
                    <span className="text-border">|</span>
                    {cats.map(c => (
                        <Tab key={c} href={`/makale?category=${c}`} on={category === c}>{c}</Tab>
                    ))}
                </nav>

                {/* Liste */}
                {list.length > 0 ? (
                    <div className="space-y-6">
                        {list.map(article => (
                            <NeoArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-muted-foreground">
                        Bu kategoride henüz içerik yok.
                    </div>
                )}

                {/* Yazar CTA */}
                <aside className="mt-16 p-6 rounded-xl bg-muted/50 border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Yazarlık</p>
                    <h2 className="text-lg font-bold mb-1">Sen de yaz</h2>
                    <p className="text-sm text-muted-foreground mb-4">Araştırmalarını paylaş.</p>
                    <Link href="/yazar" className="text-sm font-semibold underline underline-offset-4 hover:no-underline">
                        Başvur →
                    </Link>
                </aside>
            </div>
        </main>
    );
}

function Tab({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${on ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
        >
            {children}
        </Link>
    );
}
