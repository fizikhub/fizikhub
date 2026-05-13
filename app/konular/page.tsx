import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Atom, Orbit, Sigma } from "lucide-react";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { SEO_PRIORITY_ARTICLES, type SeoIntentArticle } from "@/lib/seo-priority";

export const revalidate = 3600;

const SITE_URL = "https://www.fizikhub.com";

export const metadata: Metadata = {
    title: "Fizik Konuları: Kuantum, Uzay, Entropi ve Formüller",
    description: "Fizik konuları rehberi: kuantum fiziği, kara delikler, entropi, karanlık madde, fotoelektrik olay ve basit harmonik hareketi sade anlatımlarla öğren.",
    openGraph: {
        title: "Fizik Konuları — Fizikhub",
        description: "Kuantum, uzay, termodinamik ve mekanik konularını kısa cevap, formül ve örneklerle keşfet.",
        type: "website",
        url: `${SITE_URL}/konular`,
        siteName: "Fizikhub",
        locale: "tr_TR",
        images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Fizikhub fizik konuları" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Fizik Konuları — Fizikhub",
        description: "Kuantum, uzay, termodinamik ve mekanik için Türkçe konu rehberleri.",
        images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${SITE_URL}/konular` },
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
};

const topicGroups = [
    {
        title: "Kuantum ve modern fizik",
        description: "Işığın kuantum doğası, parçacıklar ve klasik fiziğin zorlandığı deneyler.",
        icon: Atom,
        slugs: [
            "kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990",
            "klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619",
            "parcacik-fizigine-giris-evrenin-perde-arkasi-1767186788291",
        ],
    },
    {
        title: "Uzay ve kozmoloji",
        description: "Kara delikler, karanlık madde, teleskoplar ve evrenin büyük ölçekli yapısı.",
        icon: Orbit,
        slugs: [
            "karanlik-madde-nedir-nasil-gorunur",
            "kara-delige-dusersek-ne-olur-1766107168421",
            "evrenin-derinliklerine-bakis-james-webb-uzay-teleskobu",
        ],
    },
    {
        title: "Mekanik ve termodinamik",
        description: "Hareket, salınım, enerji dağılımı ve doğadaki süreçlerin yönü.",
        icon: Sigma,
        slugs: [
            "fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj",
            "entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662",
        ],
    },
];

function getArticle(slug: string) {
    return SEO_PRIORITY_ARTICLES.find((article) => article.slug === slug);
}

function isSeoArticle(article: SeoIntentArticle | undefined): article is SeoIntentArticle {
    return Boolean(article);
}

function toSectionId(title: string) {
    return title
        .toLocaleLowerCase("tr-TR")
        .replace(/[^a-z0-9ğüşöçıİ\s-]/gi, "")
        .replace(/\s+/g, "-");
}

export default function TopicsPage() {
    const allTopicArticles = topicGroups.flatMap((group) =>
        group.slugs.map(getArticle).filter(isSeoArticle),
    );

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${SITE_URL}/konular#collection`,
                url: `${SITE_URL}/konular`,
                name: "Fizikhub Fizik Konuları",
                description: "Fizik, kuantum, uzay, termodinamik ve mekanik konuları için Türkçe rehber sayfası.",
                inLanguage: "tr-TR",
                isPartOf: { "@id": `${SITE_URL}/#website` },
                mainEntity: { "@id": `${SITE_URL}/konular#item-list` },
            },
            {
                "@type": "ItemList",
                "@id": `${SITE_URL}/konular#item-list`,
                name: "Fizik konu rehberleri",
                itemListElement: allTopicArticles.map((article, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${SITE_URL}/makale/${article.slug}`,
                    name: article.title,
                    description: article.description,
                })),
            },
        ],
    };

    return (
        <>
            <BreadcrumbJsonLd items={[{ name: "Konular", href: "/konular" }]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
                <div className="mx-auto max-w-6xl">
                    <header className="max-w-4xl">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fizikhub konu rehberi</p>
                        <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal sm:text-5xl">
                            Fizik konuları: kuantum, uzay, entropi ve formüller
                        </h1>
                        <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-muted-foreground sm:text-lg">
                            En çok aranan fizik sorularını kısa cevap, formül, örnek ve ilgili kavram bağlantılarıyla tek bir okuma rotasında bul.
                        </p>
                    </header>

                    <div className="mt-8 grid gap-5">
                        {topicGroups.map((group) => {
                            const Icon = group.icon;
                            const articles = group.slugs.map(getArticle).filter(isSeoArticle);
                            const sectionId = toSectionId(group.title);

                            return (
                                <section
                                    key={group.title}
                                    className="border-t border-foreground/15 py-6"
                                    aria-labelledby={`${sectionId}-title`}
                                >
                                    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                                        <div>
                                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[8px] border-2 border-black bg-[#FFC800] text-black shadow-[3px_3px_0_#000]">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <h2 id={`${sectionId}-title`} className="text-2xl font-black tracking-normal">
                                                {group.title}
                                            </h2>
                                            <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
                                                {group.description}
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {articles.map((article) => (
                                                <Link
                                                    key={article.slug}
                                                    href={`/makale/${article.slug}`}
                                                    className="group rounded-[8px] border-2 border-black bg-card p-4 shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
                                                >
                                                    <h3 className="text-lg font-black leading-snug tracking-normal group-hover:text-yellow-500">
                                                        {article.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
                                                        {article.description}
                                                    </p>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {article.keywords.slice(0, 3).map((keyword) => (
                                                            <span
                                                                key={keyword}
                                                                className="rounded-[6px] bg-muted px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground"
                                                            >
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                                                        Rehberi oku <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}
