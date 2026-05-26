import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDictionaryTerms } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
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
            title: "Terim Bulunamadı | Fizikhub",
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
        alternates: { canonical },
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
            }
        ]
    };
    const contextNote = getTermContextNote(term.term, term.category);

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

            <main className="container mx-auto min-h-screen max-w-4xl px-4 pb-28 pt-7 md:pb-16 md:pt-10">
                <Link
                    href="/sozluk"
                    className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5 dark:bg-zinc-900 dark:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Sözlüğe Dön
                </Link>

                <article className="relative overflow-hidden rounded-xl border-[3px] border-black bg-zinc-950 p-5 text-white shadow-[6px_6px_0px_0px_#000] sm:p-7 md:p-9">
                    <div className="relative z-10 mb-5 flex flex-wrap items-center gap-2">
                        {term.category && (
                            <span className="rounded-full border-2 border-white bg-zinc-900 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-100 shadow-[2px_2px_0px_0px_#000]">
                                {term.category}
                            </span>
                        )}
                        <span className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-black">
                            Bilim Sözlüğü
                        </span>
                    </div>

                    <h1 className="relative z-10 inline-block max-w-full break-words border-[3px] border-black bg-[#FFC800] px-3 py-2 text-3xl font-black uppercase leading-tight tracking-normal text-black shadow-[4px_4px_0px_0px_#000] -rotate-1 sm:text-5xl">
                        {term.term}
                    </h1>

                    <section className="relative z-10 mt-7 border-t-[3px] border-zinc-800 pt-6">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-[#FFC800]">
                            {term.term} nedir?
                        </h2>
                        <p className="text-lg font-semibold leading-relaxed text-zinc-100 sm:text-xl">
                            {term.definition}
                        </p>
                    </section>

                    <section className="relative z-10 mt-6 border-t-[3px] border-zinc-800 pt-5">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400">
                            Nerede işine yarar?
                        </h2>
                        <p className="text-base font-medium leading-relaxed text-zinc-300 sm:text-lg">
                            {contextNote}
                        </p>
                    </section>

                    {relatedArticles.length > 0 && (
                        <nav className="relative z-10 mt-6 border-t-[3px] border-zinc-800 pt-5" aria-label="İlgili makaleler">
                            <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400">
                                Bu konuyu derinleştir
                            </h2>
                            <div className="grid gap-2">
                                {relatedArticles.map((article) => (
                                    <Link
                                        key={article.slug}
                                        href={`/makale/${article.slug}`}
                                        className="rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-transform hover:-translate-y-0.5"
                                    >
                                        {article.title}
                                        <span className="mt-1 block text-xs font-semibold leading-relaxed text-zinc-600">
                                            {article.description}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}

                    <nav className="relative z-10 mt-6 border-t-[3px] border-zinc-800 pt-5" aria-label="İlgili öğrenme kaynakları">
                        <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400">
                            Test ve simülasyonla pekiştir
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/testler"
                                className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-[#FFC800] px-4 py-2 text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] transition-transform hover:-translate-y-0.5"
                            >
                                Fizik testleri
                            </Link>
                            {relatedSimulations.length > 0 ? relatedSimulations.map((simulation) => (
                                <Link
                                    key={simulation.href}
                                    href={simulation.href}
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-black text-zinc-100 transition-colors hover:border-[#FFC800] hover:text-white"
                                >
                                    {simulation.label}
                                </Link>
                            )) : (
                                <Link
                                    href="/simulasyonlar"
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-black text-zinc-100 transition-colors hover:border-[#FFC800] hover:text-white"
                                >
                                    Fizik simülasyonları
                                </Link>
                            )}
                            {clusterLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex min-h-11 items-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-black text-zinc-100 transition-colors hover:border-[#FFC800] hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {relatedTerms.length > 0 && (
                        <nav className="relative z-10 mt-6 border-t-[3px] border-zinc-800 pt-5" aria-label="İlgili sözlük terimleri">
                            <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400">
                                İlgili terimler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {relatedTerms.map((relatedTerm) => (
                                    <Link
                                        key={relatedTerm.id}
                                        href={`/sozluk/${slugify(relatedTerm.term)}`}
                                        className="inline-flex min-h-11 items-center rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] transition-transform hover:-translate-y-0.5"
                                    >
                                        {relatedTerm.term}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    )}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
                    <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-[#FFC800]/10" />
                </article>
            </main>
        </>
    );
}
