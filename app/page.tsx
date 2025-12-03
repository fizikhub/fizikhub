import { HeroSection3D } from "@/components/home/hero-section-3d";
import { ModernArticleGrid } from "@/components/home/modern-article-grid";
import { FeaturesSection } from "@/components/home/features-section";
import { TrendingQuestions } from "@/components/home/trending-questions";

import { createClient } from "@/lib/supabase-server";
import { getArticles } from "@/lib/api";
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

export default async function Home() {
  const supabase = await createClient();

  // Fetch articles and trending questions in parallel
  const [rawArticles, { data: trendingQuestions }] = await Promise.all([
    getArticles(supabase, {
      status: 'published',
      authorRole: 'admin',
      fields: 'id, title, slug, summary, content, created_at, image_url, views, category, author:profiles(full_name, username, avatar_url)'
    }),
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


      <main className="flex flex-col min-h-screen bg-background overflow-x-hidden">
        <HeroSection3D />
        <FeaturesSection />
        <ModernArticleGrid articles={articles} />
        <TrendingQuestions questions={formattedQuestions} />
      </main>
    </>
  );
}
