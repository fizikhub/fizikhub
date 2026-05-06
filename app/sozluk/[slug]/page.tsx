import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createStaticClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { slugify } from "@/lib/slug";

type PageProps = {
    params: Promise<{ slug: string }>;
};

const SITE_URL = "https://www.fizikhub.com";

export const revalidate = 3600;

function truncateAtWordBoundary(text: string, limit: number) {
    if (text.length <= limit) return text;

    const candidate = text.slice(0, limit + 1);
    const lastSpace = candidate.lastIndexOf(" ");

    if (lastSpace <= Math.floor(limit * 0.6)) {
        return `${text.slice(0, limit).trim()}...`;
    }

    return `${candidate.slice(0, lastSpace).trim()}...`;
}

async function getTermBySlug(slug: string) {
    const supabase = createStaticClient();
    const terms = await getDictionaryTerms(supabase);
    return terms.find((term) => slugify(term.term) === slug) || null;
}

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const terms = await getDictionaryTerms(supabase);

    return terms.map((term) => ({
        slug: slugify(term.term),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) {
        return {
            title: "Terim Bulunamadı | Fizikhub",
        };
    }

    const description = truncateAtWordBoundary(term.definition, 152);
    const canonical = `${SITE_URL}/sozluk/${slug}`;

    return {
        title: `${term.term} Nedir? | Bilim Sözlüğü`,
        description,
        openGraph: {
            title: `${term.term} Nedir? — Fizikhub Sözlük`,
            description,
            type: "article",
            url: canonical,
            siteName: "Fizikhub",
            images: [
                {
                    url: `${SITE_URL}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: `${term.term} fizik sözlüğü`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${term.term} Nedir? — Fizikhub`,
            description,
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
        alternates: { canonical },
    };
}

export default async function DictionaryTermPage({ params }: PageProps) {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) notFound();

    const canonical = `${SITE_URL}/sozluk/${slug}`;
    const supabase = createStaticClient();
    const terms = await getDictionaryTerms(supabase);
    const relatedTerms = terms
        .filter((item) => item.category === term.category && item.term !== term.term)
        .slice(0, 6);

    const combinedJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "DefinedTerm",
                "@id": `${canonical}#defined-term`,
                name: term.term,
                description: term.definition,
                inDefinedTermSet: {
                    "@type": "DefinedTermSet",
                    name: "Fizikhub Bilim Sözlüğü",
                    url: `${SITE_URL}/sozluk`,
                },
                termCode: slug,
                url: canonical,
                inLanguage: "tr-TR",
            },
            {
                "@type": "WebPage",
                "@id": `${canonical}#webpage`,
                name: `${term.term} nedir?`,
                description: term.definition,
                url: canonical,
                inLanguage: "tr-TR",
                isPartOf: {
                    "@type": "WebSite",
                    "@id": `${SITE_URL}/#website`,
                    name: "Fizikhub",
                    url: SITE_URL,
                },
                mainEntity: {
                    "@id": `${canonical}#defined-term`,
                },
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
            />
            <BreadcrumbJsonLd items={[
                { name: "Sözlük", href: "/sozluk" },
                { name: term.term, href: `/sozluk/${slug}` },
            ]} />

            <main className="container mx-auto min-h-screen max-w-3xl px-4 py-8 md:py-12">
                <Link
                    href="/sozluk"
                    className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Sözlüğe Dön
                </Link>

                <article className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-5 sm:p-7">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {term.category && (
                            <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                                {term.category}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-black uppercase leading-tight tracking-normal text-white sm:text-4xl">
                        {term.term}
                    </h1>

                    <div className="mt-6 border-t border-zinc-800 pt-6">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-500">
                            {term.term} nedir?
                        </h2>
                        <p className="text-base font-medium leading-relaxed text-zinc-300 sm:text-lg">
                            {term.definition}
                        </p>
                    </div>

                    <div className="mt-6 border-t border-zinc-800 pt-5">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-500">
                            Kısa not
                        </h2>
                        <p className="text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
                            {term.term} kavramı, {term.category || "bilim"} başlığındaki konuları okurken sık karşına çıkar.
                            Tanımı akılda tutmanın en iyi yolu, kavramı yalnızca ezberlemek değil; hangi olayda, hangi ölçümde
                            ya da hangi modelde işe yaradığını görmektir.
                        </p>
                    </div>

                    {relatedTerms.length > 0 && (
                        <nav className="mt-6 border-t border-zinc-800 pt-5" aria-label="İlgili sözlük terimleri">
                            <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-500">
                                İlgili terimler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {relatedTerms.map((relatedTerm) => (
                                    <Link
                                        key={relatedTerm.id}
                                        href={`/sozluk/${slugify(relatedTerm.term)}`}
                                        className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                                    >
                                        {relatedTerm.term}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}
                </article>
            </main>
        </>
    );
}
