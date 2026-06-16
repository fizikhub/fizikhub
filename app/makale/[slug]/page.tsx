import { notFound, permanentRedirect } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { NeoArticleHero } from "@/components/articles/neo-article-hero";
import { createStaticClient, hasSupabasePublicConfig } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ArticleReader } from "@/components/blog/article-reader";
import { BookReviewDetail } from "@/components/book-review/book-review-detail";
import { TermDetail } from "@/components/term/term-detail";
import { ArticleErrorBoundary } from "@/components/blog/article-error-boundary";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ServerMarkdownRenderer } from "@/components/server-markdown-renderer";
import { CollapsibleQuickAnswer } from "@/components/articles/collapsible-quick-answer";
import { JsonLd } from "@/components/seo/json-ld";
import { getSeoIntentForSlug, SEO_PRIORITY_ARTICLES, SEO_PRIORITY_SLUGS, type SeoIntentArticle } from "@/lib/seo-priority";
import { getClustersForArticleSlug, getRelatedUrlsForCluster, getTopicClusterHref } from "@/lib/seo-topic-clusters";
import { buildMetaDescription, getArticleCanonicalPath, getCanonicalOrigin, getSiteUrl, isLikelyIndexableArticle, isLikelyIndexableTitle, toAbsoluteUrl } from "@/lib/seo-utils";
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
                                className="rounded-[7px] border border-foreground/15 bg-background px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-[#EAB308] hover:text-foreground"
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

const ENTITY_WIKIPEDIA_MAPPINGS: Record<string, string> = {
    // Physics & General Science
    'fizik': 'https://tr.wikipedia.org/wiki/Fizik',
    'kuantum': 'https://tr.wikipedia.org/wiki/Kuantum_mekani%C4%9Fi',
    'kuantum mekaniği': 'https://tr.wikipedia.org/wiki/Kuantum_mekani%C4%9Fi',
    'kuantum fiziği': 'https://tr.wikipedia.org/wiki/Kuantum_mekani%C4%9Fi',
    'yerçekimi': 'https://tr.wikipedia.org/wiki/K%C3%BCtle%C3%A7ekimi',
    'kütleçekimi': 'https://tr.wikipedia.org/wiki/K%C3%BCtle%C3%A7ekimi',
    'görelilik': 'https://tr.wikipedia.org/wiki/G%C3%B6relilik_kuram%C4%B1',
    'relativite': 'https://tr.wikipedia.org/wiki/G%C3%B6relilik_kuram%C4%B1',
    'kara delik': 'https://tr.wikipedia.org/wiki/Kara_delik',
    'entropi': 'https://tr.wikipedia.org/wiki/Entropi',
    'termodinamik': 'https://tr.wikipedia.org/wiki/Termodinamik',
    'atom': 'https://tr.wikipedia.org/wiki/Atom',
    'ışık hızı': 'https://tr.wikipedia.org/wiki/I%C5%9F%C4%B1k_h%C4%B1z%C4%B1',
    'sicim teorisi': 'https://tr.wikipedia.org/wiki/Sicim_kuram%C4%B1',
    'karanlık madde': 'https://tr.wikipedia.org/wiki/Karanl%C4%B1k_madde',
    'karanlık enerji': 'https://tr.wikipedia.org/wiki/Karanl%C4%B1k_enerji',
    'büyük patlama': 'https://tr.wikipedia.org/wiki/B%C3%BCy%C3%BCk_Patlama',
    'astrofizik': 'https://tr.wikipedia.org/wiki/Astrofizik',
    'kozmoloji': 'https://tr.wikipedia.org/wiki/Fiziksel_kozmoloji',
};

function resolveEntity(name: string): string | null {
    const key = name.toLowerCase().trim();
    return ENTITY_WIKIPEDIA_MAPPINGS[key] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: "Makale Bulunamadı",
            robots: { index: false, follow: true },
        };
    }

    const baseUrl = getSiteUrl();
    const canonicalOrigin = getCanonicalOrigin();
    const authorName = article.author?.full_name || article.author?.username || 'Fizikhub';
    const category = article.category || 'Makale';

    const fallbackOgUrl = new URL(`${baseUrl}/api/og`);
    fallbackOgUrl.searchParams.set('title', article.title);
    fallbackOgUrl.searchParams.set('author', authorName);
    fallbackOgUrl.searchParams.set('category', category);

    const coverUrl = toAbsoluteUrl(article.cover_url || (article as any).image_url, baseUrl) || fallbackOgUrl.toString();
    const canonicalPath = getArticleCanonicalPath(article) || `/makale/${article.slug || slug}`;
    const canonicalUrl = `${canonicalOrigin}${canonicalPath}`;
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
            languages: {
                "tr-TR": canonicalUrl,
                "x-default": canonicalUrl,
            },
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
            "citation_title": intentOverride?.metadataTitle || article.title,
            "citation_author": authorName,
            "citation_publication_date": article.created_at,
            "citation_online_date": article.created_at,
            "citation_language": "tr",
            "citation_public_url": canonicalUrl,
            "dc.publisher": "Fizikhub",
            "dc.language": "tr-TR",
        },
    };
}

// Enable ISR with 10 minute revalidation
export const revalidate = 600;

export async function generateStaticParams() {
    if (!hasSupabasePublicConfig()) return [];

    const supabase = createStaticClient();
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
    const canonicalOrigin = getCanonicalOrigin();
    const canonicalPath = getArticleCanonicalPath(article) || `/makale/${article.slug || slug}`;
    const articleUrl = `${canonicalOrigin}${canonicalPath}`;
    const articleImageUrl = toAbsoluteUrl(article.cover_url || (article as any).image_url, baseUrl) || `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}`;
    const authorUrl = article.author?.username ? `${baseUrl}/kullanici/${article.author.username}` : baseUrl;
    const authorName = article.author?.full_name || article.author?.username || 'Fizikhub Ekibi';
    const semanticTopics = intentOverride?.expandedKeywords || (articleTags && articleTags.length > 0 ? articleTags : [article.category || 'Fizik']);
    const topicClusters = getClustersForArticleSlug(article.slug || slug);
    const clusterUrls = topicClusters.map((cluster) => `${baseUrl}${getTopicClusterHref(cluster)}`);
    const learningTopics = Array.from(new Set([
        ...topicClusters.map((cluster) => cluster.title),
        ...semanticTopics,
    ].filter(Boolean)));
    const displayTitle = intentOverride?.h1 || article.title;
    const citations = references
        .map((reference: any) => reference.url || reference.title)
        .filter(Boolean);
    const video = getFirstYoutubeVideo(article.content);

    let reviewMeta: any = {};
    if (article.category === 'Kitap İncelemesi' && article.content) {
        try {
            const match = article.content.match(/^<!--meta\s+(.*?)\s+-->/);
            if (match && match[1]) {
                reviewMeta = JSON.parse(match[1]);
            }
        } catch (e) {
            console.error("Failed to parse book review metadata in page schema", e);
        }
    }

    const jsonLd = [
        // Explicit top-level Organization node for structural AI clarity & indexing
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${baseUrl}/#organization`,
            'name': 'Fizikhub',
            'url': baseUrl,
            'logo': {
                '@type': 'ImageObject',
                'url': `${baseUrl}/icon-512.png`,
                'width': 512,
                'height': 512,
            },
            'sameAs': [
                'https://twitter.com/fizikhub',
                'https://www.instagram.com/fizikhub',
                'https://www.youtube.com/@fizikhub',
            ],
        },
        // Explicit top-level Person (Author) node for enhanced E-E-A-T score
        ...(article.author?.username ? [{
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${authorUrl}#person`,
            'name': authorName,
            'url': authorUrl,
            'jobTitle': 'Bilim Yazarı / Editör',
            'worksFor': {
                '@id': `${baseUrl}/#organization`,
            },
            'knowsAbout': ['Fizik', 'Kozmoloji', 'Astrofizik', 'Dalga Mekaniği', 'Termodinamik', 'Kuantum Fiziği'],
            'sameAs': (article.author as any).academic_url ? [(article.author as any).academic_url] : [],
        }] : []),
        ...(article.category === 'Kitap İncelemesi' ? [{
            '@context': 'https://schema.org',
            '@type': 'Review',
            '@id': `${articleUrl}#review`,
            'url': articleUrl,
            'headline': displayTitle,
            'description': articleDescription,
            'datePublished': article.created_at,
            'dateModified': (article as any).updated_at || article.created_at,
            'inLanguage': 'tr-TR',
            'author': {
                '@type': 'Person',
                '@id': article.author?.username ? `${authorUrl}#person` : `${baseUrl}/#organization`,
                'name': authorName,
            },
            'publisher': {
                '@id': `${baseUrl}/#organization`,
            },
            'itemReviewed': {
                '@type': 'Book',
                'name': reviewMeta.bookTitle || article.title,
                'author': {
                    '@type': 'Person',
                    'name': reviewMeta.bookAuthor || 'Bilinmeyen Yazar'
                }
            },
            'reviewRating': {
                '@type': 'Rating',
                'ratingValue': reviewMeta.rating || 8,
                'bestRating': '10',
                'worstRating': '1'
            },
            'about': semanticTopics.map((topic) => {
                const sameAsUrl = resolveEntity(topic);
                return {
                    '@type': 'Thing',
                    'name': topic,
                    ...(sameAsUrl ? { 'sameAs': sameAsUrl } : {}),
                };
            }),
        }] : [{
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
            // GEO Entity Resolution using Wikipedia SameAs mapping for AI Engine Authority
            about: semanticTopics.map((topic) => {
                const sameAsUrl = resolveEntity(topic);
                return {
                    '@type': 'Thing',
                    name: topic,
                    ...(sameAsUrl ? { sameAs: sameAsUrl } : {}),
                };
            }),
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': articleUrl,
            },
            isPartOf: [
                {
                    '@type': 'WebSite',
                    '@id': `${baseUrl}/#website`,
                    name: 'Fizikhub',
                },
                ...clusterUrls.map((url) => ({
                    '@type': 'CollectionPage',
                    '@id': `${url}#collection`,
                })),
            ],
            // GEO Entity Resolution for related mentions
            mentions: (intentOverride?.relatedQueries || []).map((topic) => {
                const sameAsUrl = resolveEntity(topic);
                return {
                    '@type': 'Thing',
                    name: topic,
                    ...(sameAsUrl ? { sameAs: sameAsUrl } : {}),
                };
            }),
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
                jobTitle: article.author?.full_name ? 'Bilim Editörü / Fizikçi' : undefined,
                worksFor: {
                    '@type': 'Organization',
                    name: 'Fizikhub',
                    url: baseUrl,
                },
                knowsAbout: ['Fizik', 'Kozmoloji', 'Astrofizik', 'Dalga Mekaniği', 'Termodinamik', 'Kuantum Fiziği'],
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
        }]),
        {
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            '@id': `${articleUrl}#learning-resource`,
            name: `${displayTitle} öğrenme rehberi`,
            url: articleUrl,
            description: articleDescription,
            inLanguage: 'tr-TR',
            isAccessibleForFree: true,
            learningResourceType: 'Açıklayıcı makale',
            educationalLevel: 'Lise ve lisans başlangıç',
            teaches: learningTopics,
            keywords: learningTopics.join(', '),
            about: learningTopics.map((topic) => ({
                '@type': 'Thing',
                name: topic,
            })),
            ...(clusterUrls.length > 0 ? {
                isPartOf: clusterUrls.map((url) => ({
                    '@type': 'CollectionPage',
                    '@id': `${url}#collection`,
                })),
            } : {}),
            mainEntity: {
                '@id': `${articleUrl}#article`,
            },
            provider: {
                '@id': `${baseUrl}/#organization`,
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
            relatedLink: [
                ...clusterUrls,
                ...topicClusters.flatMap(getRelatedUrlsForCluster).map((link) => `${baseUrl}${link.href}`),
            ].filter((url, index, all) => all.indexOf(url) === index && url !== articleUrl).slice(0, 12),
            mainEntity: {
                '@id': `${articleUrl}#article`,
            },
            ...(intentOverride && {
                hasPart: [
                    { '@id': `${articleUrl}#defined-term` },
                    { '@id': `${articleUrl}#faq` },
                ],
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
                <JsonLd key={i} data={schema} />
            ))}
            <ReadingProgress />

            <div className="min-h-screen overflow-x-hidden bg-background pb-20">
            {/* 
              SEO: Server-rendered article content for search engine crawlers.
              This is the full article text rendered as static HTML on the server,
              ensuring Google can read it without executing JavaScript.
              Hidden from visual users via sr-only but fully crawlable.
            */}
            <article className="sr-only" aria-hidden="true" data-seo-content="true">
                <h1>{article.title}</h1>
                {article.excerpt && <p>{article.excerpt}</p>}
                <ServerMarkdownRenderer content={article.content || ""} />
            </article>

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

                        {intentOverride && (
                            <CollapsibleQuickAnswer
                                override={intentOverride}
                                relatedArticles={getIntentRelatedArticles(intentOverride, article.slug)}
                            />
                        )}

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

                        <ArticleTopicClusterLinks slug={article.slug} />
                    </>
                )}
            </div>
        </>
    );
}
