import { notFound, permanentRedirect } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ExperimentViewer } from "@/components/experiment/experiment-viewer";
import { isAdminEmail } from "@/lib/admin";
import { buildMetaDescription, getSiteUrl, isLikelyIndexableTitle, toAbsoluteUrl } from "@/lib/seo-utils";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);

    if (!article) {
        return {
            title: "Deney Bulunamadı",
            robots: { index: false, follow: true },
        };
    }

    const baseUrl = getSiteUrl();
    const description = buildMetaDescription(
        [article.excerpt, article.summary, article.content],
        `${article.title} deneyini Fizikhub'da adım adım incele.`,
    );
    const imageUrl = toAbsoluteUrl(article.cover_url || (article as { image_url?: string }).image_url, baseUrl) || `${baseUrl}/og-image.jpg`;
    const canonicalPath = article.category === 'Deney' ? `/deney/${article.slug || slug}` : `/makale/${article.slug || slug}`;

    return {
        title: article.title,
        description,
        robots: {
            index: article.category === 'Deney',
            follow: true,
        },
        openGraph: {
            title: article.title,
            description,
            type: "article",
            publishedTime: article.created_at,
            authors: ["Fizikhub"],
            images: [imageUrl],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseUrl}${canonicalPath}`,
        },
    };
}

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export default async function ExperimentPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);

    if (!article) {
        notFound();
    }

    if (article.category !== 'Deney') {
        permanentRedirect(`/makale/${article.slug || slug}`);
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Group all independent queries into a Promise.all block
    const [
        { count: dbLikeCount },
        { data: userLike },
        { data: userBookmark },
        { data: commentsData },
        { data: relatedArticles }
    ] = await Promise.all([
        supabase.from('article_likes').select('id', { count: 'exact', head: true }).eq('article_id', article.id),
        user ? supabase.from('article_likes').select('id').eq('article_id', article.id).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
        user ? supabase.from('article_bookmarks').select('id').eq('article_id', article.id).eq('user_id', user.id).single() : Promise.resolve({ data: null }),
        supabase.from('article_comments').select('id, content, created_at, parent_comment_id, user_id').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('articles').select('id, title, slug, excerpt, cover_url, category, created_at, author:author_id(username, full_name)').eq('status', 'published').eq('category', 'Deney').neq('id', article.id).not('slug', 'is', null).order('created_at', { ascending: false }).limit(8)
    ]);

    const likeCount = dbLikeCount;

    // Fetch profiles separately
    const userIds = commentsData?.map(c => c.user_id) || [];
    const { data: profiles } = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds) : { data: [] };

    // Combine comments with profiles
    const comments = commentsData?.map(({ user_id, ...comment }) => {
        const publicProfile = profiles?.find(p => p.id === user_id);

        return {
            ...comment,
            profiles: {
                username: publicProfile?.username || 'unknown',
                full_name: publicProfile?.full_name || null,
                avatar_url: publicProfile?.avatar_url || null,
            },
        };
    }) || [];

    // Check if user is admin
    const isAdmin = isAdminEmail(user?.email);

    // Calculate reading time
    const readingTime = calculateReadingTime(article.content || "");
    const formattedReadingTime = formatReadingTime(readingTime);
    const baseUrl = getSiteUrl();
    const articleUrl = `${baseUrl}/deney/${article.slug}`;
    const description = buildMetaDescription(
        [article.excerpt, article.summary, article.content],
        `${article.title} deneyini Fizikhub'da adım adım incele.`,
    );
    const imageUrl = toAbsoluteUrl(article.cover_url || (article as { image_url?: string }).image_url, baseUrl) || `${baseUrl}/og-image.jpg`;
    const filteredRelatedArticles = (relatedArticles || [])
        .filter((relatedArticle: any) => isLikelyIndexableTitle(relatedArticle.title))
        .slice(0, 3);

    // JSON-LD structured data for Article
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${articleUrl}#article`,
        url: articleUrl,
        headline: article.title,
        description,
        image: imageUrl,
        datePublished: article.created_at,
        dateModified: (article as { updated_at?: string }).updated_at || article.created_at,
        author: {
            '@type': 'Person',
            name: article.author?.full_name || article.author?.username || 'Fizikhub Ekibi',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Fizikhub',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.fizikhub.com/icon-512.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReadingProgress />

            <ExperimentViewer
                article={article}
                readingTime={formattedReadingTime}
                likeCount={likeCount || 0}
                initialLiked={!!userLike}
                initialBookmarked={!!userBookmark}
                comments={comments || []}
                isLoggedIn={!!user}
                isAdmin={isAdmin}
                userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
                relatedArticles={filteredRelatedArticles}
            />
        </>
    );
}
