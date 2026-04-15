import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FeedSkeleton, SliderSkeleton, SidebarSkeleton } from "@/components/home/performance-skeletons";
import { processFeedData, formatSliderArticles } from "@/lib/feed-helpers";

// Dynamic Imports with SSR False to reduce hydration & main-thread work
const ScrollProgress = dynamic(() => import("@/components/ui/scroll-progress").then(mod => mod.ScrollProgress), { ssr: false });
const BackToTop = dynamic(() => import("@/components/ui/back-to-top").then(mod => mod.BackToTop), { ssr: false });
const NexusStories = dynamic(() => import("@/components/home/nexus-stories").then(mod => mod.NexusStories), { ssr: false });
// CompactHero is statically imported — its text is the LCP element and must be server-rendered.
import { CompactHero } from "@/components/home/compact-hero";

// Lazy Load Heavy Components
const UnifiedFeed = dynamic(() => import("@/components/home/unified-feed").then(mod => mod.UnifiedFeed), {
  loading: () => <FeedSkeleton />,
  ssr: true
});

// FeedSidebar — dynamically imported (no ssr:false in Server Components)
const FeedSidebar = dynamic(() => import("@/components/home/feed-sidebar").then(mod => mod.FeedSidebar), {
  loading: () => <SidebarSkeleton />,
});

// LCP Component — STATIC IMPORT so Next.js can preload the hero image
import { LatestArticlesSlider } from "@/components/home/latest-articles-slider";

// "ana sayfayı sanki ınstagram veya twitterdaki gibi bir akış olmasını istiyorum" implies the feed IS the main experience.

export const metadata: Metadata = {
  title: "Fizik, Uzay ve Bilim Eğitim Platformu | Fizikhub",
  description: "Fizikhub: En güncel bilimsel makaleler, fizik forum tartışmaları, interaktif uzay simülasyonları, kuantum fiziği ve çevrimiçi soru testleri. Türkçe bilim platformu.",
  keywords: ["fizik", "bilim", "uzay", "kuantum", "astrofizik", "TYT fizik", "AYT fizik", "bilim forumu", "fizik makaleleri", "bilim sözlüğü", "türkçe bilim platformu", "interaktif fizik", "fizik deneyleri"],
  openGraph: {
    title: "Fizikhub — Türkiye'nin Fizik, Uzay ve Bilim Merkezi",
    description: "Türkçe bilim platformu: Fizik makaleleri, aktif bilim forumu, kavram sözlüğü, eğitim testleri ve interaktif fizik simülasyonları.",
    type: "website",
    url: "https://www.fizikhub.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub — Bilimi Ti'ye Alıyoruz" }],
    locale: "tr_TR",
    siteName: "Fizikhub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fizikhub — Türkiye'nin Fizik, Uzay ve Bilim Merkezi",
    description: "En güncel fizik makaleleri, bilim forumu tartışmaları, kuantum sırları ve testler. Keşfetmeye anasayfadan başla.",
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

    const [articlesResult, questionsResult, profilesResult, storiesResult, groupsResult] = await Promise.all([
      // Fetch Articles & Blogs (using same table)
      supabase
        .from('articles')
        .select('id, title, slug, excerpt, content, cover_url, image_url, category, created_at, status, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20), // get recent 20

      // Fetch Questions
      supabase
        .from('questions')
        .select('id, title, content, created_at, category, votes, author_id, tags, profiles(username, full_name, avatar_url, is_verified), answers(count)')
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
        .select('*, author:profiles(username, full_name, avatar_url)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .order('created_at', { ascending: false }),

      // Fetch Story Groups
      supabase
        .from('story_groups')
        .select('id, title, cover_url, created_at')
        .order('created_at', { ascending: false })
    ]);

    return {
      articles: articlesResult.data || [],
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

import { preload } from "react-dom";
import { getImageProps } from "next/image";

export default async function Home() {
  const { articles, questions, suggestedUsers, stories, groups } = await getCachedFeedData();

  // Process and Merge Data
  const feedItems = processFeedData(articles, questions);
  
  // Format slider articles to find the LCP image
  const sliderArticles = formatSliderArticles(articles);
  
  // Explicitly Preload the LCP Image to defeat CSS render-blocking
  if (sliderArticles && sliderArticles.length > 0 && sliderArticles[0].image) {
    const { props: { src, srcSet, sizes } } = getImageProps({
      src: sliderArticles[0].image,
      alt: sliderArticles[0].title || "LCP Article",
      fill: true,
      sizes: "(max-width: 640px) 215px, 275px",
      priority: true,
      quality: 85,
    });
    
    // This tells React to hoist a <link rel="preload" as="image"> to the very top of <head>
    preload(src, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: sizes,
      fetchPriority: "high",
    });
  }

  // JSON-LD Structured Data for Homepage (ItemList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        url: `https://www.fizikhub.com/makale/${article.slug}`,
        name: article.title,
        headline: article.title,
        image: article.cover_url || "https://www.fizikhub.com/og-image.png",
        datePublished: article.created_at,
        author: {
          '@type': 'Person',
          name: article.author?.full_name || article.author?.username || 'FizikHub Yazarı'
        }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
      <h1 className="sr-only">Fizik, Bilim, Uzay ve Kuantum Evreni Platformu | Fizikhub</h1>
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
            <NexusStories initialStories={stories} initialGroups={groups} />
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-0 sm:space-y-6 xl:min-h-screen border-r border-foreground/5 md:border-r-0 md:pr-0 w-full md:max-w-[650px] md:mx-auto xl:mx-0">
            <LatestArticlesSlider
              articles={formatSliderArticles(articles)}
            />
            <UnifiedFeed items={feedItems} suggestedUsers={suggestedUsers} />
          </div>

          {/* Sidebar Column */}
          <div className="hidden xl:block xl:col-span-5 relative">
            <FeedSidebar suggestedUsers={suggestedUsers} />
          </div>
        </div>
      </div>
    </main>
  );
}
