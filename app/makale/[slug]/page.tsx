import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedArticles } from "@/components/blog/related-articles";
import { NeoArticleHero } from "@/components/articles/neo-article-hero";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ArticleReader } from "@/components/blog/article-reader";
import { BookReviewDetail } from "@/components/book-review/book-review-detail";
import { TermDetail } from "@/components/term/term-detail";

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

    const coverUrl = article.cover_url && article.cover_url.length > 0
        ? article.cover_url
        : "https://fizikhub.com/og-image.jpg"; // Updated to match layout's default

    return {
        title: article.title,
        description: (article.content || "").substring(0, 160) + "...",
        openGraph: {
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            type: "article",
            publishedTime: article.created_at,
            authors: ["Fizikhub"],
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            images: [coverUrl],
        },
    };
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export async function generateStaticParams() {
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
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
                    <>
                        {/* Immersive Neo Hero */}
                        <NeoArticleHero article={article} readingTime={formattedReadingTime} />

                        {/* State-managed Article Reader */}
                        <ArticleReader
                            article={article}
                            readingTime={formattedReadingTime}
                            likeCount={likeCount || 0}
                            initialLiked={!!userLike}
                            initialBookmarked={!!userBookmark}
                            comments={comments || []}
                            isLoggedIn={!!user}
                            isAdmin={isAdmin}
                            userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
                            relatedArticles={relatedArticles || []}
                        />
                    </>
                )}
            </div>
        </>
    );
}
