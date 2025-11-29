import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
import { BlogList } from "@/components/blog/blog-list";
import { FeaturedArticleHero } from "@/components/articles/featured-article-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bilim Arşivi",
    description: "Evrenin sırlarını çözmeye çalışanların not defteri. Fizik, uzay ve bilim üzerine derinlemesine yazılar ve makaleler.",
    openGraph: {
        title: "Bilim Arşivi | Fizikhub",
        description: "Fizik, uzay ve bilim üzerine derinlemesine yazılar ve makaleler.",
        type: "website",
    },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
    const supabase = await createClient();
    const articles = await getArticles(supabase, { status: 'published', authorRole: 'all' });

    // Separate featured article (first one or specifically marked)
    const featuredArticle = articles.find(a => a.is_featured) || articles[0];
    const remainingArticles = articles.filter(a => a.id !== featuredArticle?.id);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Featured Hero Section */}
            {featuredArticle && <FeaturedArticleHero article={featuredArticle} />}

            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 sm:mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Son Yazılar
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Bilimin derinliklerine dalın.
                        </p>
                    </div>
                </div>

                {/* Articles Grid */}
                <BlogList initialArticles={remainingArticles} />
            </div>
        </div>
    );
}
