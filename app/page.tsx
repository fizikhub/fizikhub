import { HeroSection } from "@/components/home/hero-section";
import { ArticleGrid } from "@/components/home/article-grid";
import { EasterEggManager } from "@/components/easter-eggs/easter-egg-manager";
import { createClient } from "@/lib/supabase-server";
import { getArticles, getDictionaryTerms } from "@/lib/api";
import { CalculatorWidget } from "@/components/CalculatorWidget";
import { TermOfTheDay } from "@/components/TermOfTheDay";
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
  const articles = await getArticles(supabase);
  const terms = await getDictionaryTerms(supabase);

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

        <div className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 order-2 md:order-1">
              <ArticleGrid articles={articles} />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <TermOfTheDay terms={terms} />
              <CalculatorWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
