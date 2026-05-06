import type { Metadata } from "next";
import { Book, Hash, Search } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { DictionaryList } from "@/components/dictionary/dictionary-list";
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

export default async function DictionaryPage() {
    const supabase = await createClient();
    const terms = await getDictionaryTerms(supabase);
    const categories = Array.from(new Set(terms.map((term) => term.category).filter(Boolean)));

    const collectionPageJsonLd = {
        '@context': 'https://schema.org',
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
    };

    const definedTermSetJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        '@id': `${SITE_URL}/sozluk#defined-term-set`,
        name: 'Fizikhub Bilim Sözlüğü',
        description: 'Fizik, astronomi, kuantum, termodinamik ve modern bilim terimlerinin Türkçe açıklamaları.',
        url: `${SITE_URL}/sozluk`,
        inLanguage: 'tr-TR',
        hasDefinedTerm: terms.slice(0, 100).map((term) => ({
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.definition,
            url: `${SITE_URL}/sozluk/${slugify(term.term)}`,
            termCode: term.category || 'Bilim',
        })),
    };

    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Bilim Sözlüğü Terimleri',
        itemListElement: terms.slice(0, 100).map((term, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: term.term,
            url: `${SITE_URL}/sozluk/${slugify(term.term)}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <BreadcrumbJsonLd items={[{ name: 'Sözlük', href: '/sozluk' }]} />
            <div className="container mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-6 md:py-10">
                <section className="mb-8 overflow-hidden rounded-xl border-[3px] border-black bg-zinc-950 text-white shadow-[6px_6px_0px_#000]">
                    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="flex min-w-0 gap-4">
                            <div className="hidden h-16 w-16 shrink-0 items-center justify-center border-[3px] border-white bg-[#FFC800] text-black shadow-[4px_4px_0px_rgba(255,255,255,0.9)] sm:flex">
                                <Book className="h-8 w-8 stroke-[3px]" />
                            </div>
                            <div className="min-w-0">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black">
                                    <Hash className="h-3.5 w-3.5" />
                                    {terms.length} terim, {categories.length} alan
                                </div>
                                <h1 className="text-3xl font-black uppercase leading-none tracking-normal sm:text-4xl md:text-5xl">
                                    Bilim Sözlüğü
                                </h1>
                                <p className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-zinc-300 sm:text-lg">
                                    Fizik, uzay ve modern bilim kavramları; kısa, net ve Türkçe açıklamalarla tek yerde.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                            {categories.slice(0, 6).map((category) => (
                                <span
                                    key={category}
                                    className="rounded-full border-2 border-black bg-[#FFC800] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="border-t-[3px] border-black bg-[#FFC800] px-5 py-3 text-sm font-black uppercase tracking-wider text-black sm:px-6">
                        <Search className="mr-2 inline h-4 w-4 align-[-2px] stroke-[3px]" />
                        Terimi yaz, kartı aç, kavramı temizce yakala.
                    </div>
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
