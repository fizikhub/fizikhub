import { HeroSection } from "@/components/home/hero-section";
import { ArticleGrid } from "@/components/home/article-grid";
import { EasterEggManager } from "@/components/easter-eggs/easter-egg-manager";
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
  // Home page only shows published articles from Admins
  const articles = await getArticles(supabase, { status: 'published', authorRole: 'admin' });

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
      <EasterEggManager />
      <div className="flex flex-col min-h-screen">
        <HeroSection />

        <div className="container py-6 sm:py-8 md:py-12 px-4">
          <div className="grid gap-4 sm:gap-6">
            <ArticleGrid articles={articles} />
          </div>
        </div>
      </div>
    </>
  );
}
