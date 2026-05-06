import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Hash } from "lucide-react";
import { createStaticClient } from "@/lib/supabase-server";
import { getDictionaryTerms } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { slugify } from "@/lib/slug";

type PageProps = {
    params: Promise<{ slug: string }>;
};

const SITE_URL = "https://www.fizikhub.com";

export const revalidate = 3600;

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

    const description = term.definition.length > 155
        ? `${term.definition.slice(0, 152).trim()}...`
        : term.definition;
    const canonical = `${SITE_URL}/sozluk/${slug}`;

    return {
        title: `${term.term} Nedir? | Bilim Sözlüğü`,
        description,
        keywords: [
            term.term,
            `${term.term} nedir`,
            `${term.term} ne demek`,
            `${term.term} anlamı`,
            "bilim sözlüğü",
            "fizik sözlüğü",
            term.category || "bilim terimleri",
        ],
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
        alternates: { canonical },
    };
}

export default async function DictionaryTermPage({ params }: PageProps) {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) notFound();

    const canonical = `${SITE_URL}/sozluk/${slug}`;
    const jsonLd = {
        "@context": "https://schema.org",
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
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: `${term.term} nedir?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: term.definition,
                },
            },
            {
                "@type": "Question",
                name: `${term.term} hangi alanda kullanılır?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: `${term.term}, ${term.category || "bilim"} alanında kullanılan temel kavramlardan biridir.`,
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <BreadcrumbJsonLd items={[
                { name: "Sözlük", href: "/sozluk" },
                { name: term.term, href: `/sozluk/${slug}` },
            ]} />

            <main className="container mx-auto min-h-screen max-w-4xl px-4 py-10 md:py-16">
                <Link
                    href="/sozluk"
                    className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Sözlüğe Dön
                </Link>

                <article className="rounded-xl border-[3px] border-black bg-card p-6 shadow-[6px_6px_0px_#000] sm:p-8">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-lg border-[3px] border-black bg-[#FFC800] px-3 py-1 text-xs font-black uppercase tracking-widest text-black shadow-[2px_2px_0px_#000]">
                            <BookOpen className="h-4 w-4 stroke-[3px]" />
                            Sözlük
                        </span>
                        {term.category && (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                <Hash className="h-3.5 w-3.5" />
                                {term.category}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        {term.term}
                    </h1>

                    <div className="mt-8 border-t-[3px] border-black pt-8">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
                            {term.term} nedir?
                        </h2>
                        <p className="text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
                            {term.definition}
                        </p>
                    </div>

                    <div className="mt-8 border-t-[3px] border-black pt-6">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-muted-foreground">
                            Kısa not
                        </h2>
                        <p className="text-base font-semibold leading-relaxed text-muted-foreground">
                            {term.term} kavramı, {term.category || "bilim"} başlığındaki konuları okurken sık karşına çıkar.
                            Tanımı akılda tutmanın en iyi yolu, kavramı yalnızca ezberlemek değil; hangi olayda, hangi ölçümde
                            ya da hangi modelde işe yaradığını görmektir.
                        </p>
                    </div>
                </article>
            </main>
        </>
    );
}
