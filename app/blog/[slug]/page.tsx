import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { LikeButton } from "@/components/articles/like-button";
import { CommentSection } from "@/components/articles/comment-section";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedArticles } from "@/components/blog/related-articles";
import { AuthorCard } from "@/components/blog/author-card";
import { ArticleHero } from "@/components/articles/article-hero";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);

    if (!article) {
        return {
            title: "Makale Bulunamadı",
        };
    }

    return {
        title: article.title,
        description: (article.content || "").substring(0, 160) + "...",
        openGraph: {
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            type: "article",
            publishedTime: article.created_at,
            authors: ["Fizikhub"],
            images: [article.image_url || "/og-image.png"],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            images: [article.image_url || "/og-image.png"],
        },
    };
}

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);

    if (!article) {
        notFound();
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch likes data
    const { count: likeCount } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', article.id);

    const { data: userLike } = user ? await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', article.id)
        .eq('user_id', user.id)
        .single() : { data: null };

    // Fetch comments with user profiles
    const { data: commentsData } = await supabase
        .from('article_comments')
        .select(`
            id,
            content,
            created_at,
            parent_comment_id,
            user_id
        `)
        .eq('article_id', article.id)
        .order('created_at', { ascending: true });

    // Fetch profiles separately
    const userIds = commentsData?.map(c => c.user_id) || [];
    const { data: profiles } = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds) : { data: [] };

    // Combine comments with profiles
    const comments = commentsData?.map(comment => ({
        ...comment,
        profiles: profiles?.find(p => p.id === comment.user_id) || {
            id: comment.user_id,
            username: 'unknown',
            full_name: null,
            avatar_url: null
        }
    })) || [];

    // Check if user is admin
    const isAdmin = user?.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    // Calculate reading time
    const readingTime = calculateReadingTime(article.content || "");

    // JSON-LD structured data for Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: (article.content || "").substring(0, 160) + "...",
        image: article.image_url || 'https://fizikhub.com/og-image.png',
        datePublished: article.created_at,
        dateModified: (article as any).updated_at || article.created_at,
        author: {
            '@type': 'Person',
            name: article.author?.full_name || article.author?.username || 'Fizikhub Ekibi',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Fizikhub',
            logo: {
                '@type': 'ImageObject',
                url: 'https://fizikhub.com/og-image.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://fizikhub.com/blog/${article.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />

            <div className="min-h-screen bg-background pb-20">
                {/* Immersive Hero */}
                <ArticleHero article={article} readingTime={readingTime} />

                <div className="container max-w-7xl mx-auto px-0 sm:px-6 md:px-8 -mt-10 sm:-mt-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
                        {/* Article Content */}
                        <article className="lg:col-span-10 bg-background/80 backdrop-blur-xl rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl border-x-0 sm:border border-t border-b-0 sm:border-b border-white/10 min-h-screen sm:min-h-0">
                            {/* Author Card at Top */}
                            <div className="mb-8 sm:mb-10">
                                <AuthorCard author={article.author || {}} />
                            </div>

                            {/* Article Body with Improved Typography */}
                            <MarkdownRenderer content={article.content || ""} className="prose-lg sm:prose-xl leading-relaxed max-w-none" />

                            {/* Like & Share Section */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-border/40">
                                <LikeButton
                                    articleId={article.id}
                                    initialLiked={!!userLike}
                                    initialCount={likeCount || 0}
                                />
                                <ShareButtons title={article.title} slug={article.slug} />
                            </div>

                            {/* Related Articles */}
                            <div className="mt-12">
                                <RelatedArticles currentArticleId={article.id} category={article.category || "Genel"} />
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12 sm:mt-16">
                                <CommentSection
                                    articleId={article.id}
                                    comments={comments || []}
                                    isLoggedIn={!!user}
                                    isAdmin={isAdmin}
                                    userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
                                />
                            </div>
                        </article>

                        {/* Table of Contents Sidebar */}
                        <aside className="hidden lg:block lg:col-span-2 space-y-8">
                            <div className="sticky top-24">
                                <TableOfContents content={article.content || ""} />

                                {/* Mobile/Tablet Only: Floating Action Button (Optional future addition) */}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
