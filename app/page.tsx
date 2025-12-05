import dynamic from "next/dynamic";

import { HeroSection3D } from "@/components/home/hero-section-3d";
const ModernArticleGrid = dynamic(() => import("@/components/home/modern-article-grid").then(mod => mod.ModernArticleGrid));
const FeaturesSection = dynamic(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection));
const TrendingQuestions = dynamic(() => import("@/components/home/trending-questions").then(mod => mod.TrendingQuestions));
const DailyFact = dynamic(() => import("@/components/home/daily-fact").then(mod => mod.DailyFact));
const BlackHoleBackground = dynamic(() => import("@/components/home/black-hole-background").then(mod => mod.BlackHoleBackground), { ssr: false });

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "Evrenin sırlarını çözmeye çalışanların buluşma noktası. Fizik, uzay ve bilim üzerine eğlenceli içerikler, soru-cevap forumu ve bilim sözlüğü.",
  openGraph: {
    title: "Fizikhub | Eğlenceli Bilim Platformu",
    description: "Evrenin sırlarını çözmeye çalışanların buluşma noktası. Fizik, uzay ve bilim üzerine eğlenceli içerikler.",
    type: "website",
  },
};

// Create a cached version of the data fetching function
const getCachedHomepageData = unstable_cache(
  async () => {
    // Create a direct client to avoid cookie dependency in cached function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch articles and trending questions in parallel
    const [articlesResult, questionsResult] = await Promise.all([
      supabase
        .from('articles')
        .select('id, title, slug, summary, content, created_at, image_url, views, category, author:profiles(full_name, username, avatar_url)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('questions')
        .select(`
          id,
          title,
          created_at,
          votes,
          profiles(username, avatar_url),
          answers(count)
        `)
        .order('votes', { ascending: false })
        .limit(3)
    ]);

    return {
      articles: articlesResult.data || [],
      trendingQuestions: questionsResult.data || []
    };
  },
  ['homepage-data'], // Cache key
  {
    revalidate: 1800, // Revalidate every 30 minutes
    tags: ['homepage']
  }
);

export default async function Home() {
  const { articles: rawArticles, trendingQuestions } = await getCachedHomepageData();

  const articles = rawArticles.map(a => ({
    ...a,
    summary: a.summary || null,
    content: a.content || "",
    category: a.category || undefined
  }));

  // Transform questions data to match component interface
  const formattedQuestions = trendingQuestions?.map(q => {
    const profile = Array.isArray(q.profiles) ? q.profiles[0] : q.profiles;
    return {
      ...q,
      profiles: profile,
      answer_count: q.answers?.[0]?.count || 0
    };
  }) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fizikhub',
    description: 'Eğlenceli bilim platformu - Fizik, uzay ve bilim üzerine içerikler',
    url: 'https://fizikhub.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://fizikhub.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <main className="flex flex-col min-h-screen bg-background overflow-x-hidden relative">
        <BlackHoleBackground />
        <div className="relative z-10">
          <HeroSection3D />
          <ModernArticleGrid articles={articles} />
          <DailyFact />
          <FeaturesSection />
          <TrendingQuestions questions={formattedQuestions} />
        </div>
      </main>
    </>
  );
}
