import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { FeedSidebar } from "@/components/home/feed-sidebar";
import { CompactHero } from "@/components/home/compact-hero";

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

    const [articlesResult, questionsResult, profilesResult, storiesResult] = await Promise.all([
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
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
    ]);

    return {
      articles: articlesResult.data || [],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || [],
      // Map stories to match NexusStories expected format temporarily or update component to handle both
      stories: (storiesResult?.data || []).map((s: any) => ({
        name: "Admin", // Or fetch author name
        image: s.media_url,
        href: "#",
        color: "from-purple-500 to-pink-500", // Default gradient for now
        content: "Admin story content", // or logic to handle
        author: "FizikHub",
        isDynamic: true // Flag to distinguish
      }))
    };
  },
  ['feed-data-v3'], // Bump version to invalidate cache
  { revalidate: 60, tags: ['feed'] }
);

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { NexusStories } from "@/components/home/nexus-stories";
import { LatestArticlesSlider } from "@/components/home/latest-articles-slider";
import { processFeedData, formatSliderArticles } from "@/lib/feed-helpers";

export default async function Home() {
  const { articles, questions, suggestedUsers, stories } = await getCachedFeedData();

  // Process and Merge Data
  const feedItems = processFeedData(articles, questions);

  return (
    <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
      <ScrollProgress />
      <BackToTop />

      <div className="container max-w-[1250px] mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-20">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 pt-4 lg:pt-0">

          <div className="lg:col-span-12 mt-0 sm:px-0">
            <CompactHero />
            <NexusStories initialStories={stories} />
            <LatestArticlesSlider
              articles={formatSliderArticles(articles)}
            />
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6 min-h-screen border-r border-foreground/5 md:border-r-0 md:pr-0 w-full md:max-w-[650px] md:mx-auto xl:mx-0 mt-4 md:mt-0">
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
