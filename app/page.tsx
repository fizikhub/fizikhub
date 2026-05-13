import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { FeedSkeleton } from "@/components/home/performance-skeletons";
import { processFeedData, formatSliderArticles } from "@/lib/feed-helpers";
import { SEO_PRIORITY_SLUGS } from "@/lib/seo-priority";
import { LazyDesktopSidebar } from "@/components/home/lazy-desktop-sidebar";
import { isLikelyIndexableArticle } from "@/lib/seo-utils";

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

    const articleSelect = 'id, title, slug, excerpt, cover_url, image_url, category, created_at, status, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)';

    const [articlesResult, priorityArticlesResult, questionsResult, profilesResult, storiesResult, groupsResult] = await Promise.all([
      // Fetch Articles & Blogs (using same table)
      supabase
        .from('articles')
        .select(articleSelect)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(16), // keep homepage payload tight for mobile

      // Keep proven Google Search Console opportunities linked from the homepage.
      supabase
        .from('articles')
        .select(articleSelect)
        .eq('status', 'published')
        .in('slug', SEO_PRIORITY_SLUGS),

      // Fetch Questions
      supabase
        .from('questions')
        .select('id, title, content, created_at, category, votes, tags, profiles(username, full_name, avatar_url, is_verified), answers(count)')
        .order('created_at', { ascending: false })
        .limit(20),

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

    const latestArticles = (articlesResult.data || []).filter((article: any) => isLikelyIndexableArticle(article));
    const priorityArticles = (priorityArticlesResult.data || []).filter((article: any) => isLikelyIndexableArticle(article));
    const seenSlugs = new Set(priorityArticles.map((article: any) => article.slug));

    return {
      articles: [
        ...priorityArticles.sort((a: any, b: any) => SEO_PRIORITY_SLUGS.indexOf(a.slug) - SEO_PRIORITY_SLUGS.indexOf(b.slug)),
        ...latestArticles.filter((article: any) => !seenSlugs.has(article.slug)),
      ],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || [],
      // Map stories to match NexusStories expected format temporarily or update component to handle both
      stories: (storiesResult?.data || []).map((s: any) => ({
        id: s.id,
        name: s.title || "Hikaye",
        image: s.media_url,
        href: "#",
        color: "from-purple-500 to-pink-500", // Default gradient for now
        content: s.content || "", // Empty if no content
        author: s.author?.username || "FizikHub",
        author_id: s.author_id,
        isDynamic: true, // Flag to distinguish
        group_id: s.group_id,
        category: s.category
      })),
      groups: (groupsResult?.data || []).map((g: any) => ({
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
  ['feed-data-v3-fixed'], // Bump version to invalidate cache
  { revalidate: 60, tags: ['feed'] }
);





export default async function Home() {
  const { articles, questions, suggestedUsers, stories, groups } = await getCachedFeedData();

  // Process and Merge Data
  const feedItems = processFeedData(articles, questions);

  // JSON-LD Structured Data for Homepage (ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.fizikhub.com/#collection',
        url: 'https://www.fizikhub.com',
        name: 'Fizikhub Ana Sayfa',
        description: 'Fizik, uzay, kuantum ve bilim içerikleri için güncel Türkçe keşif akışı.',
        inLanguage: 'tr-TR',
        isPartOf: { '@id': 'https://www.fizikhub.com/#website' },
        mainEntity: { '@id': 'https://www.fizikhub.com/#latest-articles' },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.fizikhub.com/#latest-articles',
        name: 'Öne çıkan Fizikhub makaleleri',
        itemListElement: articles.map((article: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            url: `https://www.fizikhub.com/makale/${article.slug}`,
            name: article.title,
            headline: article.title,
            image: article.cover_url || article.image_url || "https://www.fizikhub.com/og-image.jpg",
            datePublished: article.created_at,
            author: {
              '@type': 'Person',
              name: article.author?.full_name || article.author?.username || 'FizikHub Yazarı'
            }
          }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />

      <div className="container max-w-[1250px] mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-8 xl:pt-10">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 pt-4 lg:pt-0">

          <div className="lg:col-span-12 mt-0 sm:px-0">
            <CompactHero />
            <div data-nosnippet>
              <NexusStories initialStories={stories} initialGroups={groups} />
            </div>
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-0 sm:space-y-6 xl:min-h-screen border-r border-foreground/5 md:border-r-0 md:pr-0 w-full md:max-w-[650px] md:mx-auto xl:mx-0">
            <LatestArticlesSlider
              articles={formatSliderArticles(articles)}
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
