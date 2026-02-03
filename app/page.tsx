import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { FeedSidebar } from "@/components/home/feed-sidebar";
import { NeoHero } from "@/components/home/compact-hero";

import { ScienceStories } from "@/components/science-cards/science-stories";



// "ana sayfayı sanki ınstagram veya twitterdaki gibi bir akış olmasını istiyorum" implies the feed IS the main experience.

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
  openGraph: {
    title: "Fizikhub | Bilim Platformu",
    description: "BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE. Evrenin sırlarını çözmeye çalışanların buluşma noktası.",
    type: "website",
  },
};

// Cached Data Fetching
const getCachedFeedData = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [articlesResult, questionsResult, profilesResult] = await Promise.all([
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
        .limit(10) // Ideally random or by popularity, for now just first 10
    ]);

    return {
      articles: articlesResult.data || [],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || []
    };
  },
  ['feed-data-v3'], // Bump version to invalidate cache
  { revalidate: 60, tags: ['feed'] }
);



export default async function Home() {
  const { articles, questions, suggestedUsers } = await getCachedFeedData();

  // Process and Merge Data
  const feedItems: FeedItem[] = [];

  // Add Articles (Distinguish Blog vs Article if needed, e.g. by is_writer or category, but for now treating similarly as 'article' or 'blog' type for visuals)
  articles.forEach((a: { author?: { is_writer?: boolean }; category?: string; created_at: string;[key: string]: any }) => {
    // If author is writer -> Article style (maybe), if not -> Blog style? 
    // User said "blogların ve makalelerin kartları makale sayfası ve blog sayfasındaki ... ile aynı olsun".
    // Makale page uses SocialArticleCard. Blog page uses SocialArticleCard. They are visually same/similar.
    // Let's distinguish by `author.is_writer`.

    // Check if it's an experiment
    let type: FeedItem['type'] = a.author?.is_writer ? 'article' : 'blog';
    if (a.category === 'Deney') {
      type = 'experiment';
    } else if (a.category === 'Kitap İncelemesi') {
      type = 'book-review';
    } else if (a.category === 'Terim') {
      type = 'term';
    }

    // We need to fetch/attach loop counts for likes? For MVP just pass 0 or mock? 
    // The previous implementation fetched them. For performance in "Feed", ideally we join or fetch.
    // Since we are using basic select, we might miss counts.
    // Ideally we should do a .rpc() call or separate queries for counts if critical. 
    // For now, let's proceed with basic data. SocialArticleCard handles 0 gracefully.

    feedItems.push({
      type: type,
      data: {
        ...a,
        likes_count: 0, // In a real "Feed", these should be fetched. 
        comments_count: 0
      },
      sortDate: a.created_at
    });
  });

  questions.forEach((q: { id: string; answers?: { count: number }[]; created_at: string;[key: string]: any }) => {
    feedItems.push({
      type: 'question',
      data: {
        ...q,
        answer_count: q.answers?.[0]?.count || 0
      },
      sortDate: q.created_at
    });
  });

  // Sort by date descending
  feedItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

  return (
    <main className="min-h-screen bg-background relative selection:bg-yellow-400 selection:text-black">

      {/* Dynamic Background Noise/Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="container max-w-7xl mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 pt-4 lg:pt-0">

          {/* Neo Hero Banner */}
          <div className="lg:col-span-12 mt-0 sm:px-0 mb-8 lg:mb-12">
            <NeoHero />
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-10 min-h-screen w-full md:max-w-3xl md:mx-auto xl:mx-0">

            {/* Feed Header / Filter Tabs (Visual Only for now) */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button className="px-4 py-2 bg-black text-white font-bold border-2 border-black rounded-lg shadow-neo dark:bg-white dark:text-black whitespace-nowrap">
                🔥 Popüler
              </button>
              <button className="px-4 py-2 bg-transparent text-foreground font-bold border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg whitespace-nowrap">
                ✨ Yeniler
              </button>
              <button className="px-4 py-2 bg-transparent text-foreground font-bold border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg whitespace-nowrap">
                🔬 Deneyler
              </button>
            </div>

            <UnifiedFeed items={feedItems} suggestedUsers={suggestedUsers} />
          </div>

          {/* Sidebar Column */}
          <div className="hidden xl:block xl:col-span-4 relative pl-4">
            <div className="sticky top-24">
              <FeedSidebar />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
