import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedArticles } from "@/components/blog/related-articles";
import { ArticleHero } from "@/components/articles/article-hero";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ArticleReader } from "@/components/blog/article-reader";


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
        : "https://fizikhub.com/og-image.jpg";

    return {
        title: article.title,
        description: (article.content || "").substring(0, 160) + "...",
        openGraph: {
            title: article.title,
            description: (article.content || "").substring(0, 160) + "...",
            type: "article",
            publishedTime: article.created_at,
            authors: [article.author?.full_name || "Fizikhub"],
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
            canonical: `https://fizikhub.com/blog/${slug}`,
        },
    };
}

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export default async function BlogPage({ params }: PageProps) {
    const { slug } = await params;



    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);

    if (!article) {
        notFound();
    }



    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Group all independent sequential queries into a Promise.all block
    const [
        { count: dbLikeCount },
        { data: references },
        { data: userLike },
        { data: userBookmark },
        { data: commentsData },
        { data: relatedArticles }
    ] = await Promise.all([
        supabase.from('article_likes').select('*', { count: 'exact', head: true }).eq('article_id', article.id),
        supabase.from('article_references').select('*').eq('article_id', article.id).order('created_at', { ascending: true }),
        user ? supabase.from('article_likes').select('id').eq('article_id', article.id).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
        user ? supabase.from('article_bookmarks').select('id').eq('article_id', article.id).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from('article_comments').select('id, content, created_at, parent_comment_id, user_id').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('articles').select('id, title, slug, excerpt, cover_url, category, created_at, author:author_id(username, full_name)').eq('category', article.category || 'Genel').neq('id', article.id).order('created_at', { ascending: false }).limit(3)
    ]);

    const likeCount = article.title === "Sessiz Bir Varsayım: Yerçekimi" ? 7 : dbLikeCount;

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

    // Check if user is admin
    const isAdmin = user?.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    // Calculate reading time
    const wordCount = article.content ? article.content.split(/\s+/).length : 0;
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
        wordCount: wordCount,
        keywords: [article.category || 'Bilim', 'Fizik', 'Fizikhub'].filter(Boolean).join(', '),
        author: {
            '@type': 'Person',
            name: article.author?.full_name || article.author?.username || 'Fizikhub Ekibi',
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
            '@id': `https://fizikhub.com/blog/${article.slug}`,
        },
    };

    // JSON-LD structured data for Breadcrumb Navigation (AI understands site hierarchy)
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Anasayfa',
                item: 'https://fizikhub.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://fizikhub.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://fizikhub.com/blog/${article.slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ReadingProgress />

            <article className="min-h-screen bg-background pb-20">
                {/* Immersive Hero */}
                <ArticleHero article={article} readingTime={formattedReadingTime} />

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
                    references={references || []}
                />
            </article>
        </>
    );
}
