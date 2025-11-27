import { createClient } from "@/lib/supabase-server";
import { BlogCard } from "./blog-card";

interface RelatedArticlesProps {
    currentArticleId: number;
    category: string;
}

export async function RelatedArticles({ currentArticleId, category }: RelatedArticlesProps) {
    const supabase = await createClient();

    // Fetch 3 related articles from same category
    const { data: articles } = await supabase
        .from('articles')
        .select(`
            id,
            title,
            slug,
            excerpt,
            image_url,
            category,
            created_at,
            author:author_id (
                username,
                full_name
            )
        `)
        .eq('category', category)
        .neq('id', currentArticleId)
        .order('created_at', { ascending: false })
        .limit(3);

    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">İlgili Makaleler</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: any) => (
                    <BlogCard
                        key={article.id}
                        article={{
                            ...article,
                            content: null,
                            author_id: null,
                            published: true,
                            author: Array.isArray(article.author) && article.author.length > 0
                                ? article.author[0]
                                : null
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
