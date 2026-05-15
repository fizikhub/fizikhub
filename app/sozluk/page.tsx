import type { Metadata } from "next";
import { Book, Hash, Search } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { DictionaryList } from "@/components/dictionary/dictionary-list";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { slugify } from "@/lib/slug";

const SITE_URL = "https://www.fizikhub.com";

export const metadata: Metadata = {
    title: "Bilim Sözlüğü | Fizik, Uzay ve Bilim Terimleri",
    description: "Fizik, astronomi, kuantum, termodinamik ve modern bilim terimleri için kısa, güvenilir ve sade Türkçe açıklamalar.",
    openGraph: {
        title: "Bilim Sözlüğü — Fizikhub",
        description: "Fizik, uzay ve modern bilim kavramları için kısa, sade ve güvenilir Türkçe açıklamalar.",
        type: "website",
        url: `${SITE_URL}/sozluk`,
        siteName: "Fizikhub",
        locale: "tr_TR",
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Fizikhub Bilim Sözlüğü",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Bilim Sözlüğü — Fizikhub",
        description: "Fizik, uzay ve modern bilim terimleri için kısa Türkçe sözlük.",
        images: [`${SITE_URL}/og-image.jpg`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    alternates: { canonical: `${SITE_URL}/sozluk` },
};

export const revalidate = 3600;

const MAX_STRUCTURED_DATA_TERMS = 250;

export default async function DictionaryPage() {
    const supabase = await createClient();
    const terms = await getDictionaryTerms(supabase);
    const categories = Array.from(new Set(terms.map((term) => term.category).filter(Boolean)));

    const combinedJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}/sozluk#webpage`,
                name: 'Fizikhub Bilim Sözlüğü',
                description: 'Fizik, astronomi, kuantum, termodinamik ve modern bilim terimleri için kısa Türkçe açıklamalar.',
                url: `${SITE_URL}/sozluk`,
                inLanguage: 'tr-TR',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${SITE_URL}/#website`,
                    name: 'Fizikhub',
                    url: SITE_URL,
                },
                about: categories.slice(0, 12).map((category) => ({
                    '@type': 'Thing',
                    name: category,
                })),
            },
            {
                '@type': 'DefinedTermSet',
                '@id': `${SITE_URL}/sozluk#defined-term-set`,
                name: 'Fizikhub Bilim Sözlüğü',
                description: 'Fizik, astronomi, kuantum, termodinamik ve modern bilim terimlerinin Türkçe açıklamaları.',
                url: `${SITE_URL}/sozluk`,
                inLanguage: 'tr-TR',
                hasDefinedTerm: terms.slice(0, MAX_STRUCTURED_DATA_TERMS).map((term) => ({
                    '@type': 'DefinedTerm',
                    name: term.term,
                    description: term.definition,
                    url: `${SITE_URL}/sozluk/${slugify(term.term)}`,
                    termCode: term.category || 'Bilim',
                })),
            },
            {
                '@type': 'ItemList',
                name: 'Bilim Sözlüğü Terimleri',
                itemListElement: terms.slice(0, MAX_STRUCTURED_DATA_TERMS).map((term, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: term.term,
                    url: `${SITE_URL}/sozluk/${slugify(term.term)}`,
                })),
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
            />
            <BreadcrumbJsonLd items={[{ name: 'Sözlük', href: '/sozluk' }]} />
            <div className="container mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <section className="group relative mb-8 flex flex-col overflow-hidden rounded-xl border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] dark:bg-zinc-900 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative z-10 flex flex-col items-start gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="border-2 border-black bg-[#FFC800] px-3 py-1 text-2xl font-black uppercase leading-tight text-black shadow-[2px_2px_0px_0px_#000] transition-transform origin-left -rotate-1 group-hover:rotate-0 sm:text-3xl md:text-4xl">
                                Bilim Sözlüğü
                            </h1>
                            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                                <Hash className="h-3 w-3" />
                                {terms.length} terim
                            </div>
                        </div>
                        <p className="max-w-2xl font-['Inter'] text-sm font-semibold leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                            Fizik, uzay ve modern bilim kavramları; gereksiz akademik sis olmadan, kısa ve net Türkçe açıklamalarla tek yerde. Aradığın terimi temizce yakala.
                        </p>
                    </div>
                    
                    <div className="relative z-10 mt-5 flex flex-wrap gap-2 lg:mt-0 lg:max-w-[280px] lg:justify-end">
                        {categories.slice(0, 5).map((category) => (
                            <Badge
                                key={category}
                                variant="outline"
                                className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                    
                    {/* Background decoration matching cards */}
                    <div className="absolute -right-20 -top-20 z-0 h-48 w-48 rounded-full bg-gradient-to-br from-gray-100 to-transparent opacity-50 transition-transform duration-500 group-hover:scale-110 dark:from-zinc-800" />
                </section>

                <DictionaryList initialTerms={terms} />

                <section className="mt-12 border-t-[3px] border-black pt-8 dark:border-white">
                    <div className="max-w-4xl space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-normal sm:text-3xl">
                            Fizik ve bilim terimleri için temiz Türkçe kaynak
                        </h2>
                        <p className="text-base font-semibold leading-relaxed text-muted-foreground">
                            Bu sözlük; fizik, astronomi, kuantum fiziği, termodinamik, optik, elektromanyetizma,
                            nükleer fizik ve kozmoloji kavramlarını hızlıca anlamak isteyen öğrenciler, meraklılar
                            ve içerik üreticileri için hazırlandı. Her açıklama gereksiz akademik sis olmadan,
                            kavramın özünü ve doğru bilimsel bağlamını verecek şekilde yazıldı.
                        </p>
                        <p className="text-base font-semibold leading-relaxed text-muted-foreground">
                            Aradığın şey bir formülün arkasındaki fikir, bir uzay haberinde geçen terim ya da derste
                            kafaya takılan kısa bir tanım olabilir. Fizikhub Bilim Sözlüğü, bu kavramları arama
                            motorlarının da rahat okuyabileceği açık başlıklar, tekil terim sayfaları ve yapılandırılmış
                            veriyle düzenli olarak sunar.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
