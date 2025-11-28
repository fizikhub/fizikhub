import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { LikeButton } from "@/components/articles/like-button";
import { CommentSection } from "@/components/articles/comment-section";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedArticles } from "@/components/blog/related-articles";
import { AuthorCard } from "@/components/blog/author-card";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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
            <div className="container py-10 px-4 md:px-6 max-w-7xl mx-auto">
                <Link href={`/blog#article-${slug}`}>
                    <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Geri Dön
                    </Button>
                </Link>

                {/* Hero Section */}
                <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                    <Image
                        src={(article.image_url && (article.image_url.startsWith('http') || article.image_url.startsWith('/')))
                            ? article.image_url
                            : "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                            {article.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                            <span className="font-medium">{article.author?.full_name || article.author?.username || "Anonim"}</span>
                            <span>•</span>
                            <span>{format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{formatReadingTime(readingTime)} okuma</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Article Content */}
                    <article className="lg:col-span-8 xl:col-span-8">
                        {/* Author Card at Top */}
                        <div className="mb-8">
                            <AuthorCard author={article.author || {}} />
                        </div>

                        {/* Article Body with Improved Typography */}
                        <MarkdownRenderer content={article.content || ""} className="prose-lg" />

                        {/* Like & Share Section */}
                        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border">
                            <LikeButton
                                articleId={article.id}
                                initialLiked={!!userLike}
                                initialCount={likeCount || 0}
                            />
                            <ShareButtons title={article.title} slug={article.slug} />
                        </div>

                        {/* Related Articles */}
                        <RelatedArticles currentArticleId={article.id} category={article.category || "Genel"} />

                        {/* Comments Section */}
                        <div className="mt-16">
                            <CommentSection
                                articleId={article.id}
                                comments={comments || []}
                                isLoggedIn={!!user}
                                isAdmin={isAdmin}
                            />
                        </div>
                    </article>

                    {/* Table of Contents Sidebar */}
                    <aside className="lg:col-span-4 xl:col-span-4">
                        <TableOfContents content={article.content || ""} />
                    </aside>
                </div>
            </div>
        </>
    );
}
