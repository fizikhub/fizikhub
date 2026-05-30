import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { FeedSkeleton } from "@/components/home/performance-skeletons";
import { processFeedData, formatSliderArticles } from "@/lib/feed-helpers";
import { FeedArticleData, FeedQuestionData } from "@/components/home/unified-feed";
import { SEO_PRIORITY_SLUGS } from "@/lib/seo-priority";
import { LazyDesktopSidebar } from "@/components/home/lazy-desktop-sidebar";
import { getSiteUrl, isLikelyIndexableArticle, toAbsoluteUrl } from "@/lib/seo-utils";

// ─── Supabase Query Result Types ─────────────────────────────────
interface FeedAuthorRow {
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  is_writer?: boolean | null;
  is_verified?: boolean | null;
}

interface FeedArticleRow {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  summary?: string | null;
  content?: string | null;
  category: string;
  cover_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  created_at: string;
  reading_time?: number | null;
  status?: string | null;
  author?: FeedAuthorRow | null;
}

interface FeedStoryRow {
  id: string;
  title?: string | null;
  media_url?: string | null;
  content?: string | null;
  author_id: string;
  group_id?: string | null;
  category?: string | null;
  created_at: string;
  expires_at: string;
  author?: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null;
}

interface FeedGroupRow {
  id: string;
  title: string;
  cover_url?: string | null;
  created_at: string;
}

// Dynamic Imports (Client boundaries lazy loaded automatically)
const ScrollProgress = dynamic(() => import("@/components/ui/scroll-progress").then(mod => mod.ScrollProgress));
const BackToTop = dynamic(() => import("@/components/ui/back-to-top").then(mod => mod.BackToTop));
const NexusStories = dynamic(() => import("@/components/home/nexus-stories").then(mod => mod.NexusStories));
// CompactHero is statically imported — its text is the LCP element and must be server-rendered.
import { CompactHero } from "@/components/home/compact-hero";

// Lazy Load Heavy Components
const UnifiedFeed = dynamic(() => import("@/components/home/unified-feed").then(mod => mod.UnifiedFeed), {
  loading: () => <FeedSkeleton />,
  ssr: true
});

// LCP Component is NO LONGER LatestArticlesSlider, CompactHero is the LCP component.
const LatestArticlesSlider = dynamic(() => import("@/components/home/latest-articles-slider").then(mod => mod.LatestArticlesSlider));

// "ana sayfayı sanki ınstagram veya twitterdaki gibi bir akış olmasını istiyorum" implies the feed IS the main experience.

export const metadata: Metadata = {
  title: "Fizikhub: Fizik, Uzay, Kuantum ve Bilim Rehberi",
  description: "Fizikhub'da kuantum fiziği, kara delikler, entropi, karanlık madde ve temel fizik konularını sade makaleler, formüller ve örneklerle öğren.",
  keywords: ["fizik", "bilim", "uzay", "kuantum", "astrofizik", "TYT fizik", "AYT fizik", "bilim forumu", "fizik makaleleri", "bilim sözlüğü", "türkçe bilim platformu", "interaktif fizik", "fizik deneyleri"],
  openGraph: {
    title: "Fizikhub — Fizik, Uzay ve Kuantum İçin Türkçe Bilim Rehberi",
    description: "Kuantum fiziği, kara delikler, entropi, karanlık madde ve temel fizik konularını sade makaleler, formüller ve örneklerle keşfet.",
    type: "website",
    url: "https://www.fizikhub.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub — Bilimi Ti'ye Alıyoruz" }],
    locale: "tr_TR",
    siteName: "Fizikhub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fizikhub — Fizik, Uzay ve Kuantum Rehberi",
    description: "Fizik kavramlarını sade anlatımlar, formüller, örnekler ve bilim forumuyla keşfet.",
    images: ["/og-image.jpg"],
    creator: "@fizikhub",
  },
  alternates: {
    canonical: "https://www.fizikhub.com",
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

// Cached Data Fetching
const getCachedFeedData = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim()
    );

    const articleSelect = '*, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)';

    const [articlesResult, priorityArticlesResult, questionsResult, profilesResult, storiesResult, groupsResult] = await Promise.all([
      // Fetch Articles & Blogs (using same table)
      supabase
        .from('articles')
        .select(articleSelect)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12), // Optimized for mobile and performance

      // Keep proven Google Search Console opportunities linked from the homepage.
      supabase
        .from('articles')
        .select(articleSelect)
        .eq('status', 'published')
        .in('slug', SEO_PRIORITY_SLUGS),

      // Fetch Questions
      supabase
        .from('questions')
        .select('id, title, content, created_at, category, votes, tags, author:profiles(username, full_name, avatar_url, is_verified), answers(count)')
        .order('created_at', { ascending: false })
        .limit(12),

      // Fetch Suggested Users (Top writers by reputation)
      supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, is_writer, is_verified, bio, reputation')
        .eq('is_writer', true)
        .order('reputation', { ascending: false })
        .limit(10),

      // Fetch Active Stories (Admin only for now as per policy)
      supabase
        .from('stories')
        .select('id, title, media_url, content, author_id, group_id, category, created_at, expires_at, author:profiles(username, full_name, avatar_url)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(12),

      // Fetch Story Groups
      supabase
        .from('story_groups')
        .select('id, title, cover_url, created_at')
        .order('created_at', { ascending: false })
        .limit(12)
    ]);

    const latestArticles = ((articlesResult.data || []) as FeedArticleRow[]).filter((article) => isLikelyIndexableArticle(article));
    const priorityArticles = ((priorityArticlesResult.data || []) as FeedArticleRow[]).filter((article) => isLikelyIndexableArticle(article));
    const seenSlugs = new Set(priorityArticles.map((article) => article.slug));

    return {
      articles: [
        ...priorityArticles.sort((a, b) => SEO_PRIORITY_SLUGS.indexOf(a.slug as typeof SEO_PRIORITY_SLUGS[number]) - SEO_PRIORITY_SLUGS.indexOf(b.slug as typeof SEO_PRIORITY_SLUGS[number])),
        ...latestArticles.filter((article) => !seenSlugs.has(article.slug)),
      ],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || [],
      // Map stories to match NexusStories expected format temporarily or update component to handle both
      stories: ((storiesResult?.data || []) as FeedStoryRow[]).map((s) => ({
        id: s.id,
        name: s.title || "Hikaye",
        image: s.media_url || "",
        href: "#",
        color: "from-purple-500 to-pink-500", // Default gradient for now
        content: s.content || "", // Empty if no content
        author: s.author?.username || "FizikHub",
        author_id: s.author_id,
        isDynamic: true, // Flag to distinguish
        group_id: s.group_id,
        category: s.category
      })),
      groups: ((groupsResult?.data || []) as FeedGroupRow[]).map((g) => ({
        id: g.id,
        name: g.title,
        image: g.cover_url || "/placeholder.png",
        href: "#",
        color: "from-zinc-800 to-zinc-900",
        content: "",
        author: "FizikHub"
      }))
    };
  },
  ['feed-data-v8-homepage-content-previews'], // Bump version to invalidate cache
  { revalidate: 60, tags: ['feed'] }
);

export default async function Home() {
  const { articles, questions, suggestedUsers, stories, groups } = await getCachedFeedData();
  const baseUrl = getSiteUrl();

  // Process and Merge Data
  const feedItems = processFeedData(articles as unknown as FeedArticleData[], questions as unknown as FeedQuestionData[]);
  const latestArticleDate = articles
    .map((article) => article.created_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  // JSON-LD Structured Data for Homepage (ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/#collection`,
        url: baseUrl,
        name: 'Fizikhub Ana Sayfa',
        description: 'Fizik, uzay, kuantum ve bilim içerikleri için güncel Türkçe keşif akışı.',
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${baseUrl}/#website` },
        mainEntity: { '@id': `${baseUrl}/#latest-articles` },
        publisher: { '@id': `${baseUrl}/#organization` },
        dateModified: latestArticleDate,
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Fizikhub',
        description: 'Fizik, uzay, kuantum ve bilim içerikleri için Türkçe başvuru kaynağı.',
        inLanguage: 'tr-TR',
        publisher: { '@id': `${baseUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/ara?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Fizikhub',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.ico`
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'iletisim@fizikhub.com',
          availableLanguage: ['Turkish', 'English']
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'TR',
          addressLocality: 'Istanbul'
        },
        sameAs: [
          'https://twitter.com/fizikhub',
          'https://github.com/fizikhub'
        ]
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        url: baseUrl,
        name: 'Fizikhub Ana Sayfa',
        isPartOf: { '@id': `${baseUrl}/#website` },
        contributor: suggestedUsers.map((user) => ({
          '@type': 'Person',
          name: user.full_name || `@${user.username}`,
          url: `${baseUrl}/kullanici/${user.username}`,
          jobTitle: user.is_writer ? "Fizik ve Bilim Yazarı" : "Bilim Katkıcısı"
        }))
      },
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#latest-articles`,
        name: 'Öne çıkan Fizikhub makaleleri',
        itemListElement: articles.slice(0, 12).map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            '@id': `${baseUrl}/makale/${article.slug}#article`,
            url: `${baseUrl}/makale/${article.slug}`,
            name: article.title,
            headline: article.title,
            description: article.excerpt || `${article.title} hakkında Fizikhub makalesi.`,
            image: toAbsoluteUrl(article.cover_url || article.image_url, baseUrl) || `${baseUrl}/og-image.jpg`,
            datePublished: article.created_at,
            author: {
              '@type': 'Person',
              name: article.author?.full_name || article.author?.username || 'FizikHub Yazarı'
            },
            publisher: { '@id': `${baseUrl}/#organization` },
            mainEntityOfPage: `${baseUrl}/makale/${article.slug}`,
          }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden pb-[calc(92px+env(safe-area-inset-bottom))] md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_16%_0%,rgba(234,179,8,0.07),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(35,169,250,0.08),transparent_24%)]"
      />

      <div className="container max-w-[1250px] mx-auto px-3 sm:px-4 md:px-6 relative z-10 pt-3 lg:pt-8 xl:pt-10">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-5 lg:gap-8 pt-0">

          <div className="lg:col-span-12 mt-0">
            <CompactHero />
            <div data-nosnippet>
              <NexusStories initialStories={stories} initialGroups={groups} />
            </div>
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-5 sm:space-y-6 xl:min-h-screen md:pr-0 w-full md:max-w-[660px] md:mx-auto xl:mx-0">
            <LatestArticlesSlider
              articles={formatSliderArticles(articles as unknown as FeedArticleData[])}
            />
            <div data-nosnippet>
              <UnifiedFeed items={feedItems} suggestedUsers={suggestedUsers} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="hidden xl:block xl:col-span-5 relative">
            <LazyDesktopSidebar suggestedUsers={suggestedUsers} />
          </div>
        </div>
      </div>
    </main>
  );
}
