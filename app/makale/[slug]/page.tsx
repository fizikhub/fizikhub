import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
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
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fizikhub.com'}/makale/${slug}`,
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

    // Group all independent sequential queries into a Promise.all block
    // We only fetch public data to ensure this page remains statically cacheable.
    // User-specific data (likes, bookmarks, auth status) will be fetched client-side.
    const [
        { count: dbLikeCount },
        { data: references },
        { data: commentsData },
        { data: relatedArticles }
    ] = await Promise.all([
        supabase.from('article_likes').select('id', { count: 'exact', head: true }).eq('article_id', article.id),
        supabase.from('article_references').select('id, title, url, created_at').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('article_comments').select('id, content, created_at, parent_comment_id, user_id').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('articles').select('id, title, slug, excerpt, cover_url, category, created_at, author:author_id(username, full_name, avatar_url)').eq('category', article.category || 'Genel').neq('id', article.id).order('created_at', { ascending: false }).limit(3)
    ]);

    const likeCount = article.title === "Sessiz Bir Varsayım: Yerçekimi" ? 7 : dbLikeCount;

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
        dateModified: (article as { updated_at?: string }).updated_at || article.created_at,
        wordCount: article.content ? article.content.split(/\s+/).length : 0,
        articleBody: article.content,
        author: {
            '@type': 'Person',
            name: article.author?.full_name || article.author?.username || 'Fizikhub Ekibi',
            url: article.author?.username ? `https://fizikhub.com/kullanici/${article.author.username}` : 'https://fizikhub.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Fizikhub',
            logo: {
                '@type': 'ImageObject',
                url: 'https://fizikhub.com/icon-512.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://fizikhub.com/makale/${article.slug}`,
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
                        initialLiked={false}
                        initialBookmarked={false}
                        comments={comments || []}
                        isLoggedIn={false}
                        userAvatar={undefined}
                    />
                ) : article.category === 'Terim' ? (
                    <TermDetail
                        article={article}
                        readingTime={formattedReadingTime}
                        likeCount={likeCount || 0}
                        initialLiked={false}
                        initialBookmarked={false}
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
                            initialLiked={false}
                            initialBookmarked={false}
                            comments={comments || []}
                            isLoggedIn={false}
                            isAdmin={false}
                            userAvatar={undefined}
                            relatedArticles={relatedArticles || []}
                            references={references || []}
                        />
                    </>
                )}
            </div>
        </>
    );
}
