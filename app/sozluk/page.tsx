import type { Metadata } from "next";
import Link from "next/link";
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
    const popularTermNames = ["Atom", "Entropi", "Kuantum", "Karadelik", "Big Bang (Büyük Patlama)", "Kızıla Kayma"];
    const popularTerms = popularTermNames
        .map((name) => terms.find((term) => term.term === name))
        .filter((term): term is NonNullable<typeof term> => Boolean(term));

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
            <div className="container mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-6 md:py-8">
                <section className="mb-6 border-b border-zinc-800 pb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {terms.length} terim · {categories.length} alan
                    </p>
                    <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-normal text-white sm:text-4xl">
                        Bilim Sözlüğü
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
                        Fizik, uzay ve modern bilim terimleri için kısa, sade ve doğru Türkçe açıklamalar.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {categories.slice(0, 6).map((category) => (
                            <span
                                key={category}
                                className="rounded-full border border-zinc-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-300"
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {popularTerms.map((term) => (
                            <Link
                                key={term.id}
                                href={`/sozluk/${slugify(term.term)}`}
                                className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                {term.term}
                            </Link>
                        ))}
                    </div>
                </section>

                <DictionaryList initialTerms={terms} />

                <section className="mt-10 border-t border-zinc-800 pt-6">
                    <div className="max-w-3xl space-y-3">
                        <h2 className="text-xl font-black uppercase tracking-normal text-white sm:text-2xl">
                            Fizik terimlerini sade dille okumak
                        </h2>
                        <p className="text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
                            Bu sözlük; fizik, astronomi, kuantum fiziği, termodinamik, optik, elektromanyetizma,
                            nükleer fizik ve kozmoloji kavramlarını hızlıca anlamak isteyen öğrenciler, meraklılar
                            ve içerik üreticileri için hazırlandı.
                        </p>
                        <p className="text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
                            Her terim kendi sayfasına bağlanır; başlık, açıklama, canonical URL, sitemap kaydı ve
                            yapılandırılmış veri aynı ana URL üzerinde tutarlı kalır.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
