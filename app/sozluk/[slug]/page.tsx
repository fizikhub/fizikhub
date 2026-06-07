import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDictionaryTerms } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SEO_PRIORITY_ARTICLES } from "@/lib/seo-priority";
import { getClustersForTermSlug, getRelatedUrlsForCluster } from "@/lib/seo-topic-clusters";
import { slugify } from "@/lib/slug";

type PageProps = {
    params: Promise<{ slug: string }>;
};

const SITE_URL = "https://www.fizikhub.com";

export const revalidate = 3600;

const TERM_ARTICLE_SLUGS: Record<string, string[]> = {
    entropi: ["entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662"],
    "planck-sabiti": ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
    "siyah-cisim": ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
    "kara-cisim": ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
    "siyah-cisim-isimasi": ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
    "kara-cisim-isimasi": ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
    "periyodik-hareket": ["fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj"],
    "basit-harmonik-hareket": ["fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj"],
    "harmonik-hareket": ["fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj"],
    "karanlik-madde": ["karanlik-madde-nedir-nasil-gorunur"],
    "fotoelektrik-olay": ["klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619"],
    karadelik: ["kara-delige-dusersek-ne-olur-1766107168421"],
    "olay-ufku": ["kara-delige-dusersek-ne-olur-1766107168421"],
    "standart-model": ["parcacik-fizigine-giris-evrenin-perde-arkasi-1767186788291"],
    "kizila-kayma": ["evrenin-derinliklerine-bakis-james-webb-uzay-teleskobu"],
};

const TERM_SIMULATION_LINKS: Record<string, { href: string; label: string }[]> = {
    "acisal-hiz": [{ href: "/simulasyonlar/gunes-sistemi", label: "Güneş Sistemi simülasyonu" }],
    "acisal-momentum": [{ href: "/simulasyonlar/gunes-sistemi", label: "Yörünge hareketi simülasyonu" }],
    "basit-harmonik-hareket": [{ href: "/simulasyonlar/basit-sarkac", label: "Basit sarkaç simülasyonu" }, { href: "/simulasyonlar/yay-kutle", label: "Yay-kütle simülasyonu" }],
    "harmonik-hareket": [{ href: "/simulasyonlar/yay-kutle", label: "Yay-kütle simülasyonu" }],
    "bernoulli-ilkesi": [{ href: "/simulasyonlar/atis-hareketi", label: "Atış hareketi simülasyonu" }],
    "elektrik-alan": [{ href: "/simulasyonlar/elektrik-alan", label: "Elektrik alan simülasyonu" }],
    "momentum": [{ href: "/simulasyonlar/1d-carpisma", label: "Çarpışma simülasyonu" }],
    "snell-yasasi": [{ href: "/simulasyonlar/optik-laboratuvari", label: "Optik laboratuvarı" }],
};

const CATEGORY_CONTEXT_NOTES: Record<string, string> = {
    "Akışkanlar Mekaniği": "Akışkanlar mekaniğinde bu kavramı basınç, hız ve ortamın davranışı birlikte değişirken düşünmek en iyi sonucu verir.",
    Astronomi: "Astronomi konularında bu terimi gözlem, uzaklık ölçeği ve gökcisimlerinin zaman içindeki değişimiyle birlikte okumak anlamayı kolaylaştırır.",
    Astrofizik: "Astrofizikte bu kavram tek başına bir tanım değil; kütleçekim, ışınım ve gözlem verileriyle birlikte çalışan bir açıklama aracıdır.",
    "Atom Fiziği": "Atom fiziğinde bu terim, çekirdek ve elektron davranışını ayırarak düşündüğünde daha net yerine oturur.",
    Bilişim: "Bilişim tarafında bu kavramı fiziksel sistemlerin bilgi işleme biçimiyle birlikte okumak, soyut tanımı somutlaştırır.",
    "Dalga Mekaniği": "Dalga mekaniğinde bu kavramı frekans, genlik ve ortam bilgisiyle birlikte ele almak gerekir; tek bir sayı çoğu zaman yeterli olmaz.",
    "Elektrik Devreleri": "Devre konularında bu terimi akımın yolu, gerilimin paylaşımı ve elemanların bağlantı biçimiyle birlikte düşünmek pratik çözümü hızlandırır.",
    Elektromanyetizma: "Elektromanyetizmada bu kavram, elektrik ve manyetik alanların birbirini nasıl etkilediğini takip ederken anlam kazanır.",
    Elektronik: "Elektronikte bu terimi yalnızca parça adı gibi değil, sinyalin ve enerjinin devre içinde nasıl yönlendirildiğini anlatan bir araç gibi düşün.",
    Fizik: "Fizikte bu kavramı bir formül ezberi olarak değil, hangi büyüklüğü ölçtüğünü ve hangi koşulda işe yaradığını sorarak öğrenmek daha kalıcıdır.",
    Görelilik: "Görelilikte bu kavramı zaman, uzay ve gözlemci seçiminin birbirinden bağımsız olmadığını hatırlayarak okumak gerekir.",
    Kimya: "Kimya başlığında bu terim, atomların bağ kurma biçimi ve maddenin makroskobik davranışı arasındaki köprüyü kurar.",
    Kozmoloji: "Kozmolojide bu kavramı evrenin ölçeği, genişleme geçmişi ve gözlenebilir kanıtlarla birlikte değerlendirmek gerekir.",
    "Kuantum Fiziği": "Kuantum fiziğinde bu kavram çoğu zaman gündelik sezgiyle değil, olasılık, ölçüm ve enerji düzeyi fikriyle daha doğru anlaşılır.",
    Madde: "Madde konularında bu terim, mikroskobik yapı ile gözlediğimiz yoğunluk, iletkenlik veya faz gibi özellikler arasındaki bağlantıyı kurar.",
    Matematik: "Matematikte bu kavram, fiziksel bir olayı sadeleştirmek ve ölçülebilir hale getirmek için kullanılan dilin parçasıdır.",
    Mekanik: "Mekanikte bu terimi kuvvet, hareket ve enerji arasındaki ilişkiyi aynı anda izleyerek düşünmek en sağlam başlangıçtır.",
    "Modern Fizik": "Modern fizikte bu kavram klasik sezginin yetmediği durumlarda ortaya çıkar; deney sonucu ve model ilişkisini birlikte okumak gerekir.",
    "Nükleer Fizik": "Nükleer fizikte bu terim çekirdeğin kararlılığı, enerji dönüşümü ve radyasyon davranışıyla birlikte ele alındığında netleşir.",
    Optik: "Optikte bu kavramı ışığın doğrultusu, dalga boyu ve ortam değişimiyle birlikte düşünmek görsel örnekleri açıklamayı kolaylaştırır.",
    "Parçacık Fiziği": "Parçacık fiziğinde bu kavramı temel etkileşimler, yükler ve korunum yasalarıyla birlikte okumak gerekir.",
    "Teorik Fizik": "Teorik fizikte bu kavram, gözlenen bir davranışı daha genel bir matematiksel çerçeveye yerleştirmek için kullanılır.",
    Termodinamik: "Termodinamikte bu terimi ısı, iş, enerji aktarımı ve denge fikriyle birlikte düşündüğünde tanım kuru bir ezber olmaktan çıkar.",
};

function truncateAtWordBoundary(text: string, limit: number) {
    if (text.length <= limit) return text;

    const candidate = text.slice(0, limit + 1);
    const lastSpace = candidate.lastIndexOf(" ");

    if (lastSpace <= Math.floor(limit * 0.6)) {
        return `${text.slice(0, limit).trim()}...`;
    }

    return `${candidate.slice(0, lastSpace).trim()}...`;
}

function getTermContextNote(term: string, category: string | null) {
    if (!category) {
        return `${term} kavramını öğrenirken önce neyi ölçtüğünü, sonra hangi örneklerde karşına çıktığını ayırmak tanımı daha kalıcı yapar.`;
    }

    return CATEGORY_CONTEXT_NOTES[category] || `${term} kavramını ${category} başlığı içinde, tanımdaki ana büyüklükleri ve örnek kullanım alanlarını ayırarak okumak en pratik yoldur.`;
}

async function getTermBySlug(slug: string) {
    const terms = await getDictionaryTerms();
    return terms.find((term) => slugify(term.term) === slug) || null;
}

export async function generateStaticParams() {
    const terms = await getDictionaryTerms();

    return terms.map((term) => ({
        slug: slugify(term.term),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) {
        return {
            title: "Terim Bulunamadı",
        };
    }

    const description = truncateAtWordBoundary(term.definition, 152);
    const canonical = `${SITE_URL}/sozluk/${slug}`;

    return {
        title: `${term.term} Nedir? | Bilim Sözlüğü`,
        description,
        keywords: [
            `${term.term} nedir`,
            `${term.term} tanımı`,
            term.category || "bilim terimi",
            "Fizikhub Bilim Sözlüğü",
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
        alternates: {
            canonical,
            languages: {
                "tr-TR": canonical,
                "x-default": canonical,
            },
        },
        other: {
            "citation_title": `${term.term} Nedir? Bilim Sözlüğü`,
            "citation_author": "Fizikhub",
            "citation_publication_date": term.created_at,
            "citation_online_date": term.created_at,
            "citation_language": "tr",
            "citation_public_url": canonical,
            "dc.publisher": "Fizikhub",
            "dc.language": "tr-TR",
        },
    };
}

export default async function DictionaryTermPage({ params }: PageProps) {
    const { slug } = await params;
    const term = await getTermBySlug(slug);

    if (!term) notFound();

    const canonical = `${SITE_URL}/sozluk/${slug}`;
    const terms = await getDictionaryTerms();
    const relatedTerms = terms
        .filter((item) => item.category === term.category && item.term !== term.term)
        .slice(0, 6);
    const relatedArticleSlugs = TERM_ARTICLE_SLUGS[slug] || [];
    const relatedArticles = relatedArticleSlugs
        .map((articleSlug) => SEO_PRIORITY_ARTICLES.find((article) => article.slug === articleSlug))
        .filter(Boolean) as typeof SEO_PRIORITY_ARTICLES[number][];
    const relatedSimulations = TERM_SIMULATION_LINKS[slug] || [];
    const clusterLinks = getClustersForTermSlug(slug)
        .flatMap(getRelatedUrlsForCluster)
        .filter((link) => link.href !== `/sozluk/${slug}`)
        .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
        .slice(0, 8);
    const contextNote = getTermContextNote(term.term, term.category);
    const citationAccessDate = new Date().toLocaleDateString("tr-TR");

    const combinedJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "DefinedTerm",
                "@id": `${canonical}#defined-term`,
                name: term.term,
                description: term.definition,
                alternateName: `${term.term} nedir`,
                inDefinedTermSet: {
                    "@type": "DefinedTermSet",
                    "@id": `${SITE_URL}/sozluk#defined-term-set`,
                    name: "Fizikhub Bilim Sözlüğü",
                    url: `${SITE_URL}/sozluk`,
                },
                termCode: slug,
                url: canonical,
                inLanguage: "tr-TR",
                about: term.category ? {
                    "@type": "Thing",
                    name: term.category,
                } : undefined,
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
                educationalLevel: ["Ortaöğretim", "Lise", "Üniversiteye hazırlık"],
                audience: {
                    "@type": "EducationalAudience",
                    educationalRole: "student",
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${canonical}#faq`,
                inLanguage: "tr-TR",
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
                        name: `${term.term} nerede işine yarar?`,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: contextNote,
                        },
                    },
                ],
            }
        ]
    };

    return (
        <>
            <JsonLd data={combinedJsonLd} />
            <BreadcrumbJsonLd items={[
                { name: "Sözlük", href: "/sozluk" },
                { name: term.term, href: `/sozluk/${slug}` },
            ]} />

            <main className="container mx-auto min-h-screen max-w-4xl px-4 pb-28 pt-7 md:pb-16 md:pt-10">
                <Link
                    href="/sozluk"
                    className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-black bg-[#18181b] px-4 py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[#FFE500] hover:text-black hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] dark:border-black"
                >
                    <ArrowLeft className="h-4 w-4 stroke-[3px]" />
                    Sözlüğe Dön
                </Link>

                <article className="relative overflow-hidden rounded-[16px] border-[3px] border-black bg-[#18181b] p-6 text-white shadow-[8px_8px_0px_0px_#000] sm:p-8 md:p-10">
                    
                    {/* Technical Grid Pattern Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Physics Theme Decoration: Atomic Shell on top-right */}
                    <div className="pointer-events-none absolute -right-6 -top-6 z-0 h-40 w-40 opacity-[0.03] text-white">
                        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-full w-full">
                            <circle cx="50" cy="50" r="4" fill="currentColor" />
                            <ellipse cx="50" cy="50" rx="36" ry="12" transform="rotate(0 50 50)" />
                            <ellipse cx="50" cy="50" rx="36" ry="12" transform="rotate(60 50 50)" />
                            <ellipse cx="50" cy="50" rx="36" ry="12" transform="rotate(120 50 50)" />
                            <circle cx="14" cy="50" r="1.5" fill="currentColor" />
                            <circle cx="68" cy="18" r="1.5" fill="currentColor" />
                            <circle cx="68" cy="82" r="1.5" fill="currentColor" />
                        </svg>
                    </div>

                    {/* Physics Theme Decoration: Quantum Wave on bottom-right */}
                    <div className="pointer-events-none absolute -bottom-4 -right-4 z-0 h-36 w-48 opacity-[0.04] text-[#FFE500]">
                        <svg viewBox="0 0 150 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-full w-full">
                            <line x1="10" y1="50" x2="140" y2="50" strokeDasharray="3 3" />
                            <line x1="20" y1="10" x2="20" y2="90" strokeDasharray="3 3" />
                            <path d="M 20 50 Q 50 10, 80 50 T 140 50" fill="none" stroke="currentColor" strokeWidth="2" />
                            <line x1="50" y1="50" x2="50" y2="20" />
                            <polygon points="50,15 47,22 53,22" fill="currentColor" />
                            <line x1="110" y1="50" x2="110" y2="80" />
                            <polygon points="110,85 107,78 113,78" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="relative z-10 mb-6 flex flex-wrap items-center gap-2">
                        {term.category && (
                            <span className="rounded-xl border-2 border-black bg-[#242427] px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-zinc-100 shadow-[2px_2px_0px_0px_#000]">
                                {term.category}
                            </span>
                        )}
                        <span className="rounded-xl border-2 border-black bg-[#FFE500] px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
                            Bilim Sözlüğü
                        </span>
                    </div>

                    <h1 className="relative z-10 inline-block max-w-full break-words border-[3px] border-black bg-[#FFE500] px-4 py-2.5 text-3xl font-black uppercase leading-tight tracking-normal text-black shadow-[4px_4px_0px_0px_#000] -rotate-1 sm:text-5xl md:text-6xl transition-transform duration-200 hover:rotate-0">
                        {term.term}
                    </h1>

                    <section className="relative z-10 mt-8 border-t-2 border-zinc-800/80 pt-6">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-[#FFE500] border-l-4 border-[#FFE500] pl-3 leading-none">
                            {term.term} nedir?
                        </h2>
                        <p className="text-lg font-bold leading-relaxed text-zinc-100 sm:text-xl md:text-2xl">
                            {term.definition}
                        </p>
                    </section>

                    <section className="relative z-10 mt-6 border-t-2 border-zinc-800/80 pt-6">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400 border-l-4 border-zinc-500 pl-3 leading-none">
                            Nerede işine yarar?
                        </h2>
                        <p className="text-base font-semibold leading-relaxed text-zinc-300 sm:text-lg">
                            {contextNote}
                        </p>
                    </section>

                    {relatedArticles.length > 0 && (
                        <nav className="relative z-10 mt-8 border-t-2 border-zinc-800/80 pt-6" aria-label="İlgili makaleler">
                            <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400 border-l-4 border-zinc-500 pl-3 leading-none">
                                Bu konuyu derinleştir
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {relatedArticles.map((article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/makale/${article.slug}`}
                                        className="group relative rounded-xl border-2 border-black bg-[#242427] p-4 text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000]"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="group-hover:text-[#FFE500] transition-colors leading-snug">{article.title}</span>
                                            <span className="text-zinc-500 font-normal group-hover:text-white transition-colors pl-2">→</span>
                                        </div>
                                        <span className="block text-xs font-semibold leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                            {article.description}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}

                    <nav className="relative z-10 mt-8 border-t-2 border-zinc-800/80 pt-6" aria-label="İlgili öğrenme kaynakları">
                        <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400 border-l-4 border-zinc-500 pl-3 leading-none">
                            Test ve simülasyonla pekiştir
                        </h2>
                        <div className="flex flex-wrap gap-2.5">
                            <Link
                                href="/testler"
                                className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-[#FFE500] px-4 py-2 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]"
                            >
                                Fizik testleri
                            </Link>
                            {relatedSimulations.length > 0 ? relatedSimulations.map((simulation) => (
                                <Link
                                    key={simulation.href}
                                    href={simulation.href}
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-[#242427] px-4 py-2 text-xs font-black text-zinc-100 shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[#FFE500] hover:text-black hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]"
                                >
                                    {simulation.label}
                                </Link>
                            )) : (
                                <Link
                                    href="/simulasyonlar"
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-[#242427] px-4 py-2 text-xs font-black text-zinc-100 shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[#FFE500] hover:text-black hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]"
                                >
                                    Fizik simülasyonları
                                </Link>
                            )}
                            {clusterLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-[#242427] px-4 py-2 text-xs font-black text-zinc-100 shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[#FFE500] hover:text-black hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Academic Citation Block (GEO/AI search optimized) */}
                    <section className="relative z-10 mt-8 border-t-2 border-zinc-800/80 pt-6" aria-labelledby="academic-citation-title">
                        <h2 id="academic-citation-title" className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400 border-l-4 border-zinc-500 pl-3 leading-none">
                            Akademik Atıf & Referans Gösterimi
                        </h2>
                        <div className="rounded-xl border-2 border-zinc-800 bg-[#242427] p-5 space-y-4">
                            <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                                Bu bilimsel kavramı makalenizde, araştırmanızda veya okul ödevinizde kaynak göstermek için aşağıdaki formatları kullanabilirsiniz. Kanonik URL, yayıncı ve açık başlık bilgisi özellikle korunmuştur.
                            </p>
                            
                            <div className="space-y-4">
                                {/* APA style */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-[#FFE500] uppercase tracking-widest block">APA FORMATI (Seçmek için tıkla)</span>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 font-mono select-all break-all leading-relaxed border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                        Fizikhub. (2026). &quot;{term.term}&quot;. Fizikhub Bilim Sözlüğü. Erişim adresi: {canonical}
                                    </div>
                                </div>

                                {/* BibTeX style */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-[#FFE500] uppercase tracking-widest block">BibTeX FORMATI (Seçmek için tıkla)</span>
                                    <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-300 font-mono overflow-x-auto select-all leading-normal whitespace-pre border-2 border-black shadow-[2px_2px_0px_0px_#000]">
{`@webpage{fizikhub_${slug},
  author = {Fizikhub},
  title = {${term.term} Nedir? Bilim Sözlüğü},
  year = {2026},
  url = {${canonical}},
  note = {Erişim Tarihi: ${citationAccessDate}}
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    {relatedTerms.length > 0 && (
                        <nav className="relative z-10 mt-8 border-t-2 border-zinc-800/80 pt-6" aria-label="İlgili sözlük terimleri">
                            <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-zinc-400 border-l-4 border-zinc-500 pl-3 leading-none">
                                İlgili terimler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {relatedTerms.map((relatedTerm) => (
                                    <Link
                                        key={relatedTerm.id}
                                        href={`/sozluk/${slugify(relatedTerm.term)}`}
                                        className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-zinc-800 px-4 py-2 text-xs font-black text-zinc-100 shadow-[2px_2px_0px_0px_#000] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-[#FFE500] hover:text-black hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]"
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
