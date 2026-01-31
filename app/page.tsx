import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { BackgroundWrapper } from "@/components/home/background-wrapper";
import { UnifiedFeed, FeedItem } from "@/components/home/unified-feed";
import { FeedSidebar } from "@/components/home/feed-sidebar";

import { MemeCorner } from "@/components/home/meme-corner";

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
      supabase
        .from('articles')
        .select('*, author:profiles!articles_author_id_fkey(full_name, username, avatar_url, is_writer)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20),

      supabase
        .from('questions')
        .select('*, profiles(username, full_name, avatar_url, is_verified), answers(count)')
        .order('created_at', { ascending: false })
        .limit(20),

      supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, is_writer, is_verified, bio')
        .limit(10)
    ]);

    return {
      articles: articlesResult.data || [],
      questions: questionsResult.data || [],
      suggestedUsers: profilesResult.data || []
    };
  },
  ['feed-data-v4'],
  { revalidate: 60, tags: ['feed'] }
);

export default async function Home() {
  const { articles, questions, suggestedUsers } = await getCachedFeedData();

  // Process and Merge Data
  const feedItems: FeedItem[] = [];

  articles.forEach((a: { author?: { is_writer?: boolean }; category?: string; created_at: string;[key: string]: any }) => {
    let type: FeedItem['type'] = a.author?.is_writer ? 'article' : 'blog';
    if (a.category === 'Deney') {
      type = 'experiment';
    } else if (a.category === 'Kitap İncelemesi') {
      type = 'book-review';
    } else if (a.category === 'Terim') {
      type = 'term';
    }

    feedItems.push({
      type: type,
      data: {
        ...a,
        likes_count: 0,
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

  feedItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

  return (
    <main className="min-h-screen bg-background relative selection:bg-emerald-500/30">
      <BackgroundWrapper />

      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 relative z-10 pt-0 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

          {/* Main Feed Column */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-0 min-h-screen w-full md:max-w-2xl md:mx-auto xl:mx-0">

            {/* === MEME CORNER (Desktop Only) === */}
            <div className="hidden lg:block mb-6">
              <MemeCorner />
            </div>

            {/* === FEED SECTION HEADER === */}
            <div className="flex items-center gap-3 pt-4 pb-2">
              <div className="w-1.5 h-6 bg-[#FFC800] rounded-full" />
              <h2 className="text-sm font-black uppercase tracking-wide text-black dark:text-white">
                Gündem
              </h2>
              <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
            </div>

            {/* === UNIFIED FEED === */}
            <UnifiedFeed items={feedItems} suggestedUsers={suggestedUsers} />
          </div>

          {/* Sidebar Column (XL only) */}
          <div className="hidden xl:block xl:col-span-5 relative">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
