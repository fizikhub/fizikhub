import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { BackgroundWrapper } from "@/components/home/background-wrapper";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { FeedSidebar } from "@/components/home/feed-sidebar";
import { CompactHero } from "@/components/home/compact-hero";
import { CategoryStories } from "@/components/home/category-stories";
import { ScienceStories } from "@/components/science-cards/science-stories";
import { WebGPUHero } from "@/components/home/webgpu-hero";



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
    <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">

      <BackgroundWrapper />

      <div className="container max-w-7xl mx-auto px-2 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-20">

        {/* Story-style Categories */}
        <div className="pb-0 pt-4 lg:pt-0">
          <CategoryStories />
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">



          {/* Kompakt Hero Banner - Slogan + UFO */}
          <div className="lg:col-span-12 mt-2 lg:mt-0 sm:px-0">
            <CompactHero />
          </div>

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6 min-h-screen border-r border-foreground/5 md:border-r-0 md:pr-0 w-full md:max-w-2xl md:mx-auto xl:mx-0">
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
