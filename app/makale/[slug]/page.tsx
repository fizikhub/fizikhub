import { ReadingProgress } from "@/components/blog/reading-progress";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { BookReviewDetail } from "@/components/book-review/book-review-detail";
import { TermDetail } from "@/components/term/term-detail";
import { BookmarkButton } from "@/components/bookmark-button";
import { LikeButton } from "@/components/articles/like-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { AuthorCard } from "@/components/blog/author-card";
import { RelatedArticles } from "@/components/blog/related-articles";
import { notFound } from "next/navigation";
import { PremiumArticleHeader } from "@/components/articles/premium-article-header";
import { PremiumArticleContent } from "@/components/articles/premium-article-content";
import { ScientificSidebar } from "@/components/articles/scientific-sidebar";
import { CommentSection } from "@/components/articles/comment-section";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

    let coverUrl = article.cover_url;

    // Ensure absolute URL for social media crawlers
    if (!coverUrl) {
        coverUrl = "https://fizikhub.com/og-image.jpg";
    } else if (coverUrl.startsWith("/")) {
        coverUrl = `https://fizikhub.com${coverUrl}`;
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
            url: `https://fizikhub.com/makale/${article.slug}`,
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
            siteName: "Fizikhub",
            locale: "tr_TR",
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            images: [coverUrl],
            creator: "@fizikhub",
            site: "@fizikhub",
        },
    };
}

// Enable ISR with no revalidation for immediate updates (temp for debugging)
export const revalidate = 0;

export async function generateStaticParams() {
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: articles } = await supabase
        .from('articles')
        .select('slug')
        .order('created_at', { ascending: false })
        .limit(20); // Pre-render top 20 recent articles

    return articles?.map((article) => ({
        slug: article.slug,
    })) || [];
}

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
    const { count: dbLikeCount } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', article.id);

    const likeCount = article.title === "Sessiz Bir Varsayım: Yerçekimi" ? 7 : dbLikeCount;

    const { data: userLike } = user ? await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', article.id)
        .eq('user_id', user.id)
        .single() : { data: null };

    // Fetch bookmark status
    const { data: userBookmark } = user ? await supabase
        .from('article_bookmarks')
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


    if (commentsData && commentsData.length > 0) {

    }

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

    // Fetch related articles
    const { data: relatedArticles } = await supabase
        .from('articles')
        .select(`
            id,
            title,
            slug,
            excerpt,
            excerpt,
            cover_url,
            category,
            created_at,
            author:author_id (
                username,
                full_name
            )
        `)
        .eq('category', article.category || 'Genel')
        .neq('id', article.id)
        .order('created_at', { ascending: false })
        .limit(3);

    // Check if user is admin
    const isAdmin = user?.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    // Calculate reading time
    const readingTime = calculateReadingTime(article.content || "");
    const formattedReadingTime = formatReadingTime(readingTime);

    // JSON-LD structured data for Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: (article.content || "").substring(0, 160) + "...",
        image: article.cover_url || 'https://fizikhub.com/og-image.png',
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
                {article.category === 'Kitap İncelemesi' ? (
                    <BookReviewDetail
                        article={article}
                        readingTime={formattedReadingTime}
                        likeCount={likeCount || 0}
                        initialLiked={!!userLike}
                        initialBookmarked={!!userBookmark}
                        comments={comments || []}
                        isLoggedIn={!!user}
                        userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
                    />
                ) : article.category === 'Terim' ? (
                    <TermDetail
                        article={article}
                        readingTime={formattedReadingTime}
                        likeCount={likeCount || 0}
                        initialLiked={!!userLike}
                        initialBookmarked={!!userBookmark}
                    />
                ) : (
                    <div className="flex flex-col">
                        {/* New Scientific Header */}
                        <PremiumArticleHeader
                            article={article}
                            readingTime={formattedReadingTime}
                        />

                        <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24">
                            <div className="flex flex-col xl:flex-row gap-12 lg:gap-20">
                                {/* Main Article Stream */}
                                <main className="flex-1 min-w-0">
                                    <PremiumArticleContent article={article} />

                                    {/* Interaction Footer (Action Bar) */}
                                    <div className="mt-12 pt-12 border-t border-foreground/10">
                                        <div className="flex flex-wrap items-center justify-between gap-6 mb-16 px-6 py-8 bg-foreground/[0.02] rounded-2xl border border-foreground/5">
                                            <div className="flex items-center gap-6">
                                                <LikeButton
                                                    articleId={article.id}
                                                    initialLiked={!!userLike}
                                                    initialCount={likeCount || 0}
                                                />
                                                <div className="w-px h-8 bg-foreground/10" />
                                                <BookmarkButton
                                                    type="article"
                                                    itemId={article.id}
                                                    initialBookmarked={!!userBookmark}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Share Article</span>
                                                <ShareButtons title={article.title} slug={article.slug} />
                                            </div>
                                        </div>

                                        {/* Author, Related & Comments */}
                                        <div className="space-y-20 lg:space-y-32">
                                            <div className="bg-foreground/[0.02] border border-foreground/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden group transition-all hover:bg-foreground/[0.03]">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                                <AuthorCard author={(article.author as any) || {}} />
                                            </div>

                                            {relatedArticles && relatedArticles.length > 0 && (
                                                <div className="space-y-12">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-px flex-1 bg-foreground/10" />
                                                        <h3 className="text-xl font-display font-bold uppercase tracking-[0.2em] text-foreground/30">Benzer Tahkikatlar</h3>
                                                        <div className="h-px flex-1 bg-foreground/10" />
                                                    </div>
                                                    <RelatedArticles articles={relatedArticles as any} />
                                                </div>
                                            )}

                                            {/* Comments Section */}
                                            <div className="space-y-12 pt-12 border-t border-dashed border-foreground/10">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-3xl font-display font-medium text-foreground tracking-tight">
                                                        Müzakere & Yorumlar <span className="text-foreground/20 ml-3 text-xl">({comments.length})</span>
                                                    </h3>
                                                </div>
                                                <div className="bg-foreground/[0.01] border border-foreground/5 rounded-3xl p-6 md:p-12">
                                                    <CommentSection
                                                        articleId={article.id}
                                                        comments={comments || []}
                                                        isLoggedIn={!!user}
                                                        isAdmin={isAdmin}
                                                        userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </main>

                                {/* Scientific Sidebar (Desktop Only) */}
                                <ScientificSidebar article={article} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
