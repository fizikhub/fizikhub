import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Brain, FlaskConical, HelpCircle, Network, Sigma } from "lucide-react";
import { simulations } from "@/components/simulations/data";
import { getDictionaryTerms } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { SEO_PRIORITY_ARTICLES } from "@/lib/seo-priority";
import { getClusterResourceLinks, getTopicClusterBySlug, getTopicClusterHref, SEO_TOPIC_CLUSTERS, type SeoClusterResourceType, type SeoTopicCluster } from "@/lib/seo-topic-clusters";
import { getTopicStudyGuide, isThinTopicCluster } from "@/lib/topic-study-guides";
import { getSiteUrl, truncateForMeta } from "@/lib/seo-utils";
import { slugify } from "@/lib/slug";
import { createStaticClient } from "@/lib/supabase-server";

type PageProps = {
    params: Promise<{ slug: string }>;
};

type TopicResource = {
    type: SeoClusterResourceType;
    slug: string;
    href: string;
    title: string;
    description: string;
    label: string;
};

type TopicFaqItem = {
    question: string;
    answer: string;
};

export const revalidate = 3600;

const typeConfig: Record<SeoClusterResourceType, { label: string; icon: typeof BookOpen }> = {
    article: { label: "Makale", icon: BookOpen },
    term: { label: "Sözlük", icon: Sigma },
    quiz: { label: "Test", icon: HelpCircle },
    simulation: { label: "Simülasyon", icon: FlaskConical },
    topic: { label: "Konu", icon: Network },
};

function humanizeSlug(slug: string) {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toLocaleUpperCase("tr-TR") + part.slice(1))
        .join(" ");
}

function getTopicFaqItems(cluster: SeoTopicCluster): TopicFaqItem[] {
    const resourceTypes = [
        cluster.articleSlugs.length > 0 ? "makale" : null,
        cluster.termSlugs.length > 0 ? "sözlük" : null,
        cluster.quizSlugs.length > 0 ? "test" : null,
        cluster.simulationSlugs.length > 0 ? "simülasyon" : null,
    ].filter(Boolean);
    const resourceSummary = resourceTypes.length > 0
        ? resourceTypes.join(", ")
        : "konu bağlantıları";
    const aliases = cluster.aliases.slice(0, 3).join(", ");

    return cluster.intentQuestions.slice(0, 4).map((question, index) => ({
        question,
        answer: index === 0
            ? `${cluster.title} konusu; ${aliases || cluster.title} gibi alt kavramları birlikte okuyarak anlaşılır. Fizikhub bu başlık için ${resourceSummary} kaynaklarını tek öğrenme rotasında toplar.`
            : `${question.replace(/\?$/, "")} sorusunu çalışırken önce temel tanımı, sonra ilgili örnekleri ve varsa interaktif simülasyonu incelemek gerekir. Bu hub, ${cluster.title} bağlantılarını bu sıraya yakın biçimde listeler.`,
    }));
}

async function getTopicResources(slug: string): Promise<TopicResource[]> {
    const cluster = getTopicClusterBySlug(slug);
    if (!cluster) return [];

    const supabase = createStaticClient();
    const resourceLinks = getClusterResourceLinks(cluster);
    const articleSlugs = cluster.articleSlugs;
    const quizSlugs = cluster.quizSlugs;

    const [articleResult, quizResult, terms] = await Promise.all([
        articleSlugs.length > 0
            ? supabase
                .from("articles")
                .select("title, slug, excerpt, content")
                .eq("status", "published")
                .in("slug", articleSlugs)
            : Promise.resolve({ data: [] }),
        quizSlugs.length > 0
            ? supabase
                .from("quizzes")
                .select("title, slug, description")
                .in("slug", quizSlugs)
            : Promise.resolve({ data: [] }),
        getDictionaryTerms(),
    ]);

    const articlesBySlug = new Map((articleResult.data || []).map((article) => [article.slug, article]));
    const quizzesBySlug = new Map((quizResult.data || []).map((quiz) => [quiz.slug, quiz]));
    const termsBySlug = new Map(terms.map((term) => [slugify(term.term), term]));
    const simulationsBySlug = new Map(simulations.map((simulation) => [simulation.slug, simulation]));
    const priorityArticlesBySlug = new Map<string, typeof SEO_PRIORITY_ARTICLES[number]>(
        SEO_PRIORITY_ARTICLES.map((article) => [article.slug, article]),
    );

    return resourceLinks.map((link) => {
        if (link.type === "article") {
            const article = articlesBySlug.get(link.slug);
            const priorityArticle = priorityArticlesBySlug.get(link.slug);
            return {
                ...link,
                title: article?.title || priorityArticle?.title || humanizeSlug(link.slug),
                description: truncateForMeta(article?.excerpt || article?.content || priorityArticle?.description || "Fizikhub konu rehberi makalesi.", 150),
            };
        }

        if (link.type === "term") {
            const term = termsBySlug.get(link.slug);
            return {
                ...link,
                title: term?.term || humanizeSlug(link.slug),
                description: truncateForMeta(term?.definition || `${humanizeSlug(link.slug)} kavramı için Fizikhub bilim sözlüğü açıklaması.`, 150),
            };
        }

        if (link.type === "quiz") {
            const quiz = quizzesBySlug.get(link.slug);
            return {
                ...link,
                title: quiz?.title || humanizeSlug(link.slug),
                description: truncateForMeta(quiz?.description || `${humanizeSlug(link.slug)} konusunu test sorularıyla pekiştir.`, 150),
            };
        }

        const simulation = simulationsBySlug.get(link.slug);
        return {
            ...link,
            title: simulation?.title || humanizeSlug(link.slug),
            description: truncateForMeta(simulation ? `${simulation.description} Temel formül: ${simulation.formula}.` : "Fizikhub interaktif fizik simülasyonu.", 150),
        };
    });
}

export function generateStaticParams() {
    return SEO_TOPIC_CLUSTERS.map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const cluster = getTopicClusterBySlug(slug);

    if (!cluster) {
        return {
            title: "Konu Bulunamadı",
            robots: { index: false, follow: true },
        };
    }

    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}${getTopicClusterHref(cluster)}`;
    const description = truncateForMeta(`${cluster.title}: ${cluster.intentQuestions.join(" ")} ${cluster.aliases.join(", ")} konularını makale, sözlük ve simülasyon bağlantılarıyla öğren.`, 158);

    return {
        title: `${cluster.title} Konu Rehberi | Fizikhub`,
        description,
        keywords: [...cluster.aliases, cluster.title, "fizik konu anlatımı", "Fizikhub"],
        openGraph: {
            title: `${cluster.title} Konu Rehberi — Fizikhub`,
            description,
            type: "website",
            url: canonical,
            siteName: "Fizikhub",
            locale: "tr_TR",
            images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: `${cluster.title} konu rehberi` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${cluster.title} Konu Rehberi — Fizikhub`,
            description,
            images: [`${baseUrl}/og-image.jpg`],
        },
        alternates: {
            canonical,
            languages: {
                "tr-TR": canonical,
                "x-default": canonical,
            },
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
    };
}

export default async function TopicClusterPage({ params }: PageProps) {
    const { slug } = await params;
    const cluster = getTopicClusterBySlug(slug);
    if (!cluster) notFound();

    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}${getTopicClusterHref(cluster)}`;
    const resources = await getTopicResources(slug);
    const relatedClusters = SEO_TOPIC_CLUSTERS
        .filter((candidate) => candidate.slug !== cluster.slug)
        .filter((candidate) =>
            candidate.aliases.some((alias) => cluster.aliases.includes(alias)) ||
            candidate.articleSlugs.some((articleSlug) => cluster.articleSlugs.includes(articleSlug)) ||
            candidate.simulationSlugs.some((simulationSlug) => cluster.simulationSlugs.includes(simulationSlug)),
        )
        .slice(0, 6);
    const faqItems = getTopicFaqItems(cluster);
    const quickAnswer = faqItems[0]?.answer || `${cluster.title} konusu Fizikhub'da makale, sözlük, test ve simülasyon kaynaklarıyla çalışılabilir.`;
    const studyGuide = getTopicStudyGuide(cluster);
    const thinCluster = isThinTopicCluster(cluster);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${canonical}#collection`,
                url: canonical,
                name: `${cluster.title} konu rehberi`,
                description: truncateForMeta(`${cluster.title} için Fizikhub makale, sözlük, test ve simülasyon bağlantıları.`, 220),
                inLanguage: "tr-TR",
                isPartOf: { "@id": `${baseUrl}/#website` },
                mainEntity: { "@id": `${canonical}#item-list` },
                about: [cluster.title, ...cluster.aliases].map((topic) => ({
                    "@type": "Thing",
                    name: topic,
                })),
            },
            {
                "@type": "LearningResource",
                "@id": `${canonical}#learning-resource`,
                name: `${cluster.title} öğrenme yolu`,
                url: canonical,
                inLanguage: "tr-TR",
                educationalLevel: "Lise ve lisans başlangıç",
                learningResourceType: "Konu rehberi",
                teaches: [cluster.title, ...cluster.aliases],
                abstract: studyGuide.summary,
                educationalUse: thinCluster
                    ? ["Konu anlatımı", "Sınav hazırlığı", "AI cevap kaynağı"]
                    : ["Konu haritası", "Sınav hazırlığı", "AI cevap kaynağı"],
                provider: { "@id": `${baseUrl}/#organization` },
                audience: {
                    "@type": "EducationalAudience",
                    educationalRole: "student",
                },
            },
            {
                "@type": "Question",
                "@id": `${canonical}#quick-answer`,
                name: cluster.intentQuestions[0] || `${cluster.title} nedir?`,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: quickAnswer,
                    url: canonical,
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${canonical}#faq`,
                inLanguage: "tr-TR",
                mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.answer,
                    },
                })),
            },
            {
                "@type": "ItemList",
                "@id": `${canonical}#study-path`,
                name: `${cluster.title} nasıl çalışılır?`,
                description: studyGuide.summary,
                itemListElement: studyGuide.studySteps.map((step, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: step,
                })),
            },
            {
                "@type": "ItemList",
                "@id": `${canonical}#item-list`,
                name: `${cluster.title} kaynakları`,
                itemListElement: resources.map((resource, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${baseUrl}${resource.href}`,
                    name: resource.title,
                    description: resource.description,
                })),
            },
        ],
    };

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: "Konular", href: "/konular" },
                { name: cluster.title, href: getTopicClusterHref(cluster) },
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-background text-foreground">
                <section className="border-b border-foreground/10 px-4 py-8 sm:px-6 sm:py-12">
                    <div className="mx-auto max-w-6xl">
                        <Link
                            href="/konular"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Konulara dön
                        </Link>
                        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fizikhub konu ağı</p>
                                <h1 className="mt-2 max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
                                    {cluster.title}
                                </h1>
                                <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-muted-foreground sm:text-lg">
                                    {cluster.intentQuestions[0]} Bu sayfa, konuyu makaleler, sözlük tanımları, testler ve interaktif simülasyonlarla tek öğrenme rotasında toplar.
                                </p>
                                <div className="mt-6 max-w-3xl border-l-4 border-[#EAB308] pl-4">
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Kısa cevap</p>
                                    <p className="mt-2 text-sm font-semibold leading-7 text-foreground sm:text-base">
                                        {quickAnswer}
                                    </p>
                                </div>
                            </div>
                            <aside className="border-t border-foreground/15 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                                <div className="flex items-center gap-2 text-sm font-black">
                                    <Brain className="h-4 w-4 text-yellow-500" />
                                    Arama niyetleri
                                </div>
                                <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted-foreground">
                                    {cluster.intentQuestions.map((question) => (
                                        <li key={question}>{question}</li>
                                    ))}
                                </ul>
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="topic-resources-title">
                    <div className="mx-auto max-w-6xl">
                        <section className="mb-8 border-y border-foreground/10 py-6" aria-labelledby="topic-study-guide-title">
                            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        {thinCluster ? "Güçlendirilmiş konu anlatımı" : "Konu özeti"}
                                    </p>
                                    <h2 id="topic-study-guide-title" className="mt-2 text-2xl font-black tracking-normal sm:text-3xl">
                                        {cluster.title} için kavram iskeleti
                                    </h2>
                                    <p className="mt-4 text-sm font-semibold leading-7 text-muted-foreground sm:text-base">
                                        {studyGuide.summary}
                                    </p>
                                    {studyGuide.formulaFocus.length > 0 && (
                                        <div className="mt-5 flex flex-wrap gap-2" aria-label="Odak formül ve kavramlar">
                                            {studyGuide.formulaFocus.map((formula) => (
                                                <span key={formula} className="rounded-[7px] border border-[#EAB308]/50 bg-[#EAB308]/10 px-3 py-2 text-xs font-black text-foreground">
                                                    {formula}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Temel fikirler</h3>
                                        <ul className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted-foreground">
                                            {studyGuide.keyIdeas.map((idea) => (
                                                <li key={idea}>{idea}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Çalışma rotası</h3>
                                        <ol className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted-foreground">
                                            {studyGuide.studySteps.map((step) => (
                                                <li key={step}>{step}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-l-4 border-destructive/70 pl-4">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sık hata</p>
                                <p className="mt-2 text-sm font-semibold leading-7 text-foreground">
                                    {studyGuide.commonPitfall}
                                </p>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Kaynaklar</p>
                                <h2 id="topic-resources-title" className="mt-2 text-2xl font-black tracking-normal sm:text-3xl">
                                    Bu konuyu öğrenmek için sıradaki duraklar
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {cluster.aliases.map((alias) => (
                                    <span key={alias} className="rounded-[7px] border border-foreground/15 px-3 py-1.5 text-xs font-black text-muted-foreground">
                                        {alias}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {resources.map((resource) => {
                                const Icon = typeConfig[resource.type].icon;
                                return (
                                    <Link
                                        key={`${resource.type}-${resource.slug}`}
                                        href={resource.href}
                                        className="group rounded-[8px] border-2 border-black bg-card p-5 shadow-[4px_4px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] dark:border-zinc-700 dark:shadow-[4px_4px_0_rgba(255,255,255,0.12)] dark:hover:shadow-[2px_2px_0_rgba(255,255,255,0.12)]"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 rounded-[7px] bg-[#EAB308] px-2.5 py-1 text-xs font-black uppercase text-black">
                                                <Icon className="h-3.5 w-3.5" />
                                                {typeConfig[resource.type].label}
                                            </span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                        <h3 className="mt-4 text-xl font-black leading-snug tracking-normal group-hover:text-yellow-500">
                                            {resource.title}
                                        </h3>
                                        <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
                                            {resource.description}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {faqItems.length > 0 && (
                    <section className="border-t border-foreground/10 px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="topic-faq-title">
                        <div className="mx-auto max-w-6xl">
                            <div className="max-w-3xl">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sık sorulanlar</p>
                                <h2 id="topic-faq-title" className="mt-2 text-2xl font-black tracking-normal sm:text-3xl">
                                    {cluster.title} için kısa cevaplar
                                </h2>
                            </div>
                            <div className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
                                {faqItems.map((item) => (
                                    <article key={item.question} className="grid gap-2 py-5 md:grid-cols-[280px_1fr] md:gap-6">
                                        <h3 className="text-base font-black leading-7 tracking-normal">
                                            {item.question}
                                        </h3>
                                        <p className="text-sm font-semibold leading-7 text-muted-foreground">
                                            {item.answer}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {relatedClusters.length > 0 && (
                    <section className="border-t border-foreground/10 px-4 py-8 sm:px-6 sm:py-12" aria-labelledby="related-topics-title">
                        <div className="mx-auto max-w-6xl">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bağlantılı konular</p>
                            <h2 id="related-topics-title" className="mt-2 text-2xl font-black tracking-normal">
                                Sonra bakılacak konu ağları
                            </h2>
                            <div className="mt-5 flex flex-wrap gap-3">
                                {relatedClusters.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={getTopicClusterHref(related)}
                                        className="rounded-[7px] border border-foreground/15 px-4 py-2 text-sm font-black text-muted-foreground transition-colors hover:border-[#EAB308] hover:text-foreground"
                                    >
                                        {related.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
