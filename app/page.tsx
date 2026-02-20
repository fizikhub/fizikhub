import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CompactHero } from "@/components/home/compact-hero";
import { NexusStories } from "@/components/home/nexus-stories";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { FeedSkeleton, SliderSkeleton, SidebarSkeleton } from "@/components/home/performance-skeletons";
import { processFeedData, formatSliderArticles } from "@/lib/feed-helpers";

// Lazy Load Heavy Components
const UnifiedFeed = dynamic(() => import("@/components/home/unified-feed").then(mod => mod.UnifiedFeed), {
  loading: () => <FeedSkeleton />,
  ssr: true // Keep SSR for SEO, but chunk it
});

const FeedSidebar = dynamic(() => import("@/components/home/feed-sidebar").then(mod => mod.FeedSidebar), {
  loading: () => <SidebarSkeleton />,
  ssr: true
});

const LatestArticlesSlider = dynamic(() => import("@/components/home/latest-articles-slider").then(mod => mod.LatestArticlesSlider), {
  loading: () => <SliderSkeleton />,
  ssr: true
});

// "ana sayfayı sanki ınstagram veya twitterdaki gibi bir akış olmasını istiyorum" implies the feed IS the main experience.

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Fizik makaleleri, bilim forumu, sözlük, testler ve interaktif simülasyonlar. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
  keywords: ["fizik", "bilim", "uzay", "kuantum", "astrofizik", "TYT fizik", "AYT fizik", "bilim forumu", "fizik soruları", "bilim sözlüğü"],
  openGraph: {
    title: "Fizikhub — Bilimi Ti'ye Alıyoruz",
    description: "Fizik makaleleri, bilim forumu, sözlük, testler ve interaktif simülasyonlar. Türkçe bilim platformu.",
    type: "website",
    url: "https://fizikhub.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fizikhub — Bilimi Ti'ye Alıyoruz" }],
    locale: "tr_TR",
    siteName: "Fizikhub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fizikhub — Bilimi Ti'ye Alıyoruz",
    description: "Fizik makaleleri, bilim forumu, sözlük, testler ve interaktif simülasyonlar.",
    images: ["/og-image.jpg"],
    creator: "@fizikhub",
  },
};

// Cached Data Fetching
const getCachedFeedData = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [articlesResult, questionsResult, profilesResult, storiesResult, groupsResult] = await Promise.all([
      // Fetch Articles & Blogs (using same table)
      supabase
        .from('articles')
        .select('*, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20), // get recent 20

      // Fetch Questions
      supabase
        .from('questions')
        .select('*, profiles(username, full_name, avatar_url, is_verified), answers(count)')
        .order('created_at', { ascending: false })
        .limit(20),

      // Fetch Suggested Users (e.g., writers or active users)
      supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, is_writer, is_verified, bio')
        .limit(10), // Ideally random or by popularity, for now just first 10

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
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    return {
      articles: articlesResult.data || [],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || [],
      // Map stories to match NexusStories expected format temporarily or update component to handle both
      stories: (storiesResult?.data || []).map((s: any) => ({
        name: s.title || "Hikaye",
        image: s.media_url,
        href: "#",
        color: "from-purple-500 to-pink-500", // Default gradient for now
        content: s.content || "", // Empty if no content
        author: s.author?.username || "FizikHub",
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
    '@type': 'ItemList',
    itemListElement: articles.map((article: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        url: `https://fizikhub.com/blog/${article.slug}`,
        name: article.title,
        headline: article.title,
        image: article.cover_url || "https://fizikhub.com/og-image.png",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />

      <div className="container max-w-[1250px] mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-20">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 pt-4 lg:pt-0">

          <div className="lg:col-span-12 mt-0 sm:px-0">
            <CompactHero />
            <NexusStories initialStories={stories} initialGroups={groups} />
            <LatestArticlesSlider
              articles={formatSliderArticles(articles)}
            />
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6 min-h-screen border-r border-foreground/5 md:border-r-0 md:pr-0 w-full md:max-w-[650px] md:mx-auto xl:mx-0 mt-0">
            <UnifiedFeed items={feedItems} suggestedUsers={suggestedUsers} />
          </div>

          {/* Sidebar Column */}
          <div className="hidden xl:block xl:col-span-5 relative">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
