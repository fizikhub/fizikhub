import { notFound, permanentRedirect } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { NeoArticleHero } from "@/components/articles/neo-article-hero";
import { createStaticClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ArticleReader } from "@/components/blog/article-reader";
import { BookReviewDetail } from "@/components/book-review/book-review-detail";
import { TermDetail } from "@/components/term/term-detail";
import { ArticleErrorBoundary } from "@/components/blog/article-error-boundary";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CollapsibleQuickAnswer } from "@/components/articles/collapsible-quick-answer";
import { getSeoIntentForSlug, SEO_PRIORITY_ARTICLES, SEO_PRIORITY_SLUGS, type SeoIntentArticle } from "@/lib/seo-priority";
import { getClustersForArticleSlug, getRelatedUrlsForCluster } from "@/lib/seo-topic-clusters";
import { buildMetaDescription, getArticleCanonicalPath, getSiteUrl, isLikelyIndexableArticle, isLikelyIndexableTitle, toAbsoluteUrl } from "@/lib/seo-utils";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function toMetaDescription(article: any) {
    return buildMetaDescription(
        [article.excerpt, article.summary, article.content],
        `${article.title} hakkında Türkçe, sade ve örnekli Fizikhub makalesi.`,
    );
}

function getIntentRelatedArticles(override: SeoIntentArticle, currentSlug: string) {
    const configuredRelatedArticles = override.relatedSlugs
        .map((slug) => SEO_PRIORITY_ARTICLES.find((article) => article.slug === slug))
        .filter(Boolean) as SeoIntentArticle[];
    const fallbackRelatedArticles = SEO_PRIORITY_ARTICLES.filter((article) => article.slug !== currentSlug);
    return [
        ...configuredRelatedArticles,
        ...fallbackRelatedArticles.filter((article) => !configuredRelatedArticles.some((related) => related.slug === article.slug)),
    ].slice(0, 4);
}

function getFirstYoutubeVideo(content?: string | null) {
    if (!content) return null;

    const match = content.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (!match?.[1]) return null;

    const id = match[1];
    return {
        id,
        url: match[0],
        embedUrl: `https://www.youtube.com/embed/${id}`,
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
}

function ArticleTopicClusterLinks({ slug }: { slug: string }) {
    const clusters = getClustersForArticleSlug(slug);
    const links = clusters
        .flatMap(getRelatedUrlsForCluster)
        .filter((link) => link.href !== `/makale/${slug}`)
        .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
        .slice(0, 10);

    if (clusters.length === 0 && links.length === 0) return null;

    return (
        <section className="mx-auto mt-6 max-w-4xl px-4" aria-labelledby="article-topic-cluster-title">
            <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Konu ağı</p>
                <h2 id="article-topic-cluster-title" className="mt-2 text-lg font-black tracking-normal text-foreground">
                    Bu makalenin bağlı olduğu fizik kümeleri
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                    {clusters.map((cluster) => (
                        <span key={cluster.slug} className="rounded-[7px] border border-foreground/15 px-3 py-2 text-xs font-black text-foreground">
                            {cluster.title}
                        </span>
                    ))}
                </div>
                {links.length > 0 && (
                    <nav className="mt-4 flex flex-wrap gap-2" aria-label="Makale ile ilgili öğrenme kaynakları">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-[7px] border border-foreground/15 bg-background px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-[#FFC800] hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </section>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createStaticClient();
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Makale Bulunamadı",
            robots: { index: false, follow: true },
        };
    }

    const baseUrl = getSiteUrl();
    const authorName = article.author?.full_name || article.author?.username || 'Fizikhub';
    const category = article.category || 'Makale';

    const fallbackOgUrl = new URL(`${baseUrl}/api/og`);
    fallbackOgUrl.searchParams.set('title', article.title);
    fallbackOgUrl.searchParams.set('author', authorName);
    fallbackOgUrl.searchParams.set('category', category);

    const coverUrl = toAbsoluteUrl(article.cover_url || (article as any).image_url, baseUrl) || fallbackOgUrl.toString();
    const canonicalPath = getArticleCanonicalPath(article) || `/makale/${article.slug || slug}`;
    const canonicalUrl = `${baseUrl}${canonicalPath}`;
    const shouldIndex = isLikelyIndexableArticle(article) && article.category !== 'Deney';

    const intentOverride = getSeoIntentForSlug(article.slug || slug);
    const description = intentOverride?.metadataDescription || toMetaDescription(article);

    const tags = (article as any).tags as string[] | undefined;

    return {
        title: intentOverride?.metadataTitle || article.title,
        description,
        keywords: intentOverride ? [...intentOverride.expandedKeywords] : (tags && tags.length > 0 ? tags : ["fizik", "bilim", "fizikhub", article.category || "makale"]),
        authors: [{
            name: authorName,
            url: article.author?.username
                ? `https://www.fizikhub.com/kullanici/${article.author.username}`
                : 'https://www.fizikhub.com'
        }],
        openGraph: {
            title: intentOverride?.metadataTitle || article.title,
            description,
            url: canonicalUrl,
            type: "article",
            locale: "tr_TR",
            publishedTime: article.created_at,
            modifiedTime: (article as any).updated_at || article.created_at,
            authors: [authorName],
            section: article.category || 'Fizik',
            tags: tags || [],
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
            title: intentOverride?.metadataTitle || article.title,
            description,
            images: [coverUrl],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: shouldIndex,
            follow: true,
            googleBot: {
                index: shouldIndex,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
        other: {
            "article:published_time": article.created_at,
            "article:modified_time": (article as any).updated_at || article.created_at,
            "article:section": article.category || "Fizik",
            "article:author": authorName,
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
        .select('slug, category')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20); // Pre-render top 20 recent articles

    const slugs = new Set([
        ...SEO_PRIORITY_SLUGS,
        ...(articles?.filter((article) => article.category !== 'Deney').map((article) => article.slug).filter(Boolean) || []),
    ]);

    return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = createStaticClient();
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    if (article.category === 'Deney') {
        permanentRedirect(`/deney/${article.slug || slug}`);
    }

    // Group all independent sequential queries into a Promise.all block
    // We only fetch public data to ensure this page remains statically cacheable.
    // User-specific data (likes, bookmarks, auth status) will be fetched client-side.
    const [
        likesRes,
        referencesRes,
        commentsRes,
        relatedRes
    ] = await Promise.all([
        supabase.from('article_likes').select('id', { count: 'exact', head: true }).eq('article_id', article.id),
        supabase.from('article_references').select('id, title, url, created_at').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('article_comments').select('id, content, created_at, parent_comment_id, user_id').eq('article_id', article.id).order('created_at', { ascending: true }),
        supabase.from('articles').select('id, title, slug, excerpt, cover_url, category, created_at, author:author_id(username, full_name, avatar_url)').eq('status', 'published').eq('category', article.category || 'Genel').neq('id', article.id).not('slug', 'is', null).order('created_at', { ascending: false }).limit(8)
    ]);

    const dbLikeCount = likesRes.count || 0;
    const references = referencesRes.data || [];
    const commentsData = commentsRes.data || [];
    const relatedArticles = (relatedRes.data || [])
        .filter((relatedArticle: any) => isLikelyIndexableTitle(relatedArticle.title))
        .slice(0, 3);

    const likeCount = article.title === "Sessiz Bir Varsayım: Yerçekimi" ? 7 : dbLikeCount;

    // Fetch profiles separately
    const userIds = commentsData?.map(c => c.user_id) || [];
    const { data: profiles } = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds) : { data: [] };

    // Combine comments with profiles
    const comments = commentsData?.map(({ user_id, ...comment }) => {
        const publicProfile = profiles?.find((profile) => profile.id === user_id);

        return {
            ...comment,
            profiles: {
                username: publicProfile?.username || 'unknown',
                full_name: publicProfile?.full_name || null,
                avatar_url: publicProfile?.avatar_url || null,
            },
        };
    }) || [];

    // Calculate reading time
    const readingTime = calculateReadingTime(article.content || "");
    const formattedReadingTime = formatReadingTime(readingTime);

    // JSON-LD structured data for Article — full E-E-A-T signals
    const articleTags = (article as any).tags as string[] | undefined;
    const intentOverride = getSeoIntentForSlug(article.slug);
    const articleDescription = intentOverride?.metadataDescription || toMetaDescription(article);
    const baseUrl = getSiteUrl();
    const articleUrl = `${baseUrl}/makale/${article.slug}`;
    const articleImageUrl = toAbsoluteUrl(article.cover_url || (article as any).image_url, baseUrl) || `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}`;
    const authorUrl = article.author?.username ? `${baseUrl}/kullanici/${article.author.username}` : baseUrl;
    const semanticTopics = intentOverride?.expandedKeywords || (articleTags && articleTags.length > 0 ? articleTags : [article.category || 'Fizik']);
    const displayTitle = intentOverride?.h1 || article.title;
    const citations = references
        .map((reference: any) => reference.url || reference.title)
        .filter(Boolean);
    const video = getFirstYoutubeVideo(article.content);

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${articleUrl}#article`,
            url: articleUrl,
            headline: displayTitle,
            alternativeHeadline: intentOverride ? article.title : undefined,
            description: articleDescription,
            image: {
                '@type': 'ImageObject',
                url: articleImageUrl,
                width: 1200,
                height: 630,
            },
            thumbnailUrl: articleImageUrl,
            datePublished: article.created_at,
            dateModified: (article as { updated_at?: string }).updated_at || article.created_at,
            wordCount: article.content ? article.content.split(/\s+/).length : 0,
            timeRequired: `PT${readingTime}M`,
            inLanguage: 'tr-TR',
            articleSection: article.category || 'Fizik',
            keywords: intentOverride?.expandedKeywords.join(', ') || (articleTags && articleTags.length > 0 ? articleTags.join(', ') : 'fizik, bilim, fizikhub'),
            citation: citations.length > 0 ? citations : undefined,
            isAccessibleForFree: true,
            about: semanticTopics.map((topic) => ({
                '@type': 'Thing',
                name: topic,
            })),
            mentions: intentOverride?.relatedQueries.map((topic) => ({
                '@type': 'Thing',
                name: topic,
            })),
            learningResourceType: 'Açıklayıcı makale',
            educationalLevel: 'Lise ve lisans başlangıç',
            audience: {
                '@type': 'EducationalAudience',
                educationalRole: 'student',
            },
            author: {
                '@type': 'Person',
                '@id': article.author?.username ? `${authorUrl}#person` : `${baseUrl}/#organization`,
                name: article.author?.full_name || article.author?.username || 'Fizikhub Ekibi',
                url: authorUrl,
            },
            publisher: {
                '@type': 'Organization',
                '@id': `${baseUrl}/#organization`,
                name: 'Fizikhub',
                url: baseUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/icon-512.png`,
                    width: 512,
                    height: 512,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': articleUrl,
            },
            isPartOf: {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                name: 'Fizikhub',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': articleUrl,
            url: articleUrl,
            name: displayTitle,
            description: articleDescription,
            inLanguage: 'tr-TR',
            isPartOf: { '@id': `${baseUrl}/#website` },
            ...(intentOverride && {
                mainEntity: {
                    '@id': `${articleUrl}#defined-term`,
                },
            }),
            primaryImageOfPage: {
                '@type': 'ImageObject',
                url: articleImageUrl,
            },
            breadcrumb: { '@id': `${articleUrl}#breadcrumb` },
        },
        ...(video ? [{
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            '@id': `${articleUrl}#video`,
            name: displayTitle,
            description: articleDescription,
            thumbnailUrl: [video.thumbnailUrl],
            uploadDate: article.created_at,
            embedUrl: video.embedUrl,
            contentUrl: video.url,
            inLanguage: 'tr-TR',
            publisher: {
                '@type': 'Organization',
                '@id': `${baseUrl}/#organization`,
                name: 'Fizikhub',
                logo: {
                    '@type': 'ImageObject',
                    url: `${baseUrl}/icon-512.png`,
                    width: 512,
                    height: 512,
                },
            },
            isPartOf: {
                '@id': articleUrl,
            },
        }] : []),
        ...(intentOverride ? [{
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            '@id': `${articleUrl}#defined-term`,
            name: intentOverride.summaryTitle.replace(/\?$/, ''),
            description: intentOverride.summary,
            inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Fizikhub Bilim Sözlüğü',
                url: `${baseUrl}/sozluk`,
            },
            url: articleUrl,
            inLanguage: 'tr-TR',
        }] : []),
        ...(intentOverride?.questions ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${articleUrl}#faq`,
            mainEntity: intentOverride.questions.map(q => ({
                '@type': 'Question',
                name: q.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: q.answer,
                },
            })),
        }] : []),
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': `${articleUrl}#breadcrumb`,
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Makaleler', item: `${baseUrl}/makale` },
                { '@type': 'ListItem', position: 3, name: displayTitle, item: articleUrl },
            ],
        },
    ];

    return (
        <>
            {jsonLd.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <ReadingProgress />

            <div className="min-h-screen overflow-x-hidden bg-background pb-20">
                {article.category === 'Kitap İncelemesi' ? (
                    <ArticleErrorBoundary fallback={
                        <div className="container max-w-4xl mx-auto px-4 py-10">
                            <h1 className="text-3xl font-black mb-4">{article.title}</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <MarkdownRenderer content={article.content || ""} demoteH1 />
                            </div>
                        </div>
                    }>
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
                    </ArticleErrorBoundary>
                ) : article.category === 'Terim' ? (
                    <ArticleErrorBoundary fallback={
                        <div className="container max-w-4xl mx-auto px-4 py-10">
                            <h1 className="text-3xl font-black mb-4">{article.title}</h1>
                            <div className="prose dark:prose-invert max-w-none">
                                <MarkdownRenderer content={article.content || ""} demoteH1 />
                            </div>
                        </div>
                    }>
                        <TermDetail
                            article={article}
                            readingTime={formattedReadingTime}
                            likeCount={likeCount || 0}
                            initialLiked={false}
                            initialBookmarked={false}
                        />
                    </ArticleErrorBoundary>
                ) : (
                    <>
                        {/* Hero is OUTSIDE error boundary — always visible (static JSX, no JS risk) */}
                        <NeoArticleHero
                            article={article}
                            readingTime={formattedReadingTime}
                            titleOverride={intentOverride?.h1}
                            introOverride={intentOverride?.summary}
                        />



                        {/* Only interactive reader is wrapped — fallback shows plain article text */}
                        <ArticleErrorBoundary fallback={
                            <div className="container max-w-4xl mx-auto px-4 py-10">
                                <div className="prose dark:prose-invert max-w-none">
                                    <MarkdownRenderer content={article.content || ""} demoteH1 />
                                </div>
                            </div>
                        }>
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
                        </ArticleErrorBoundary>

                        {intentOverride && (
                            <CollapsibleQuickAnswer
                                override={intentOverride}
                                relatedArticles={getIntentRelatedArticles(intentOverride, article.slug)}
                            />
                        )}
                        <ArticleTopicClusterLinks slug={article.slug} />
                    </>
                )}
            </div>
        </>
    );
}
