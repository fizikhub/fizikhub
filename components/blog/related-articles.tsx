import { BlogCard } from "./blog-card";

interface RelatedArticlesProps {
    articles: any[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
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
                                : article.author || null // Handle both array and object
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
