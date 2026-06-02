import { notFound } from "next/navigation";
import { type Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, ListChecks, Sparkles } from "lucide-react";
import { simulations } from "@/components/simulations/data";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { getSiteUrl } from "@/lib/seo-utils";
import { SimulationLearningTracker } from "@/components/simulations/simulation-learning-tracker";

// Import simulation components
import { ProjectileSim } from "@/components/simulations/ProjectileSim";
import { OpticsSim } from "@/components/simulations/OpticsSim";
import { PendulumSim } from "@/components/simulations/PendulumSim";
import { WaveSim } from "@/components/simulations/WaveSim";
import { SpringMassSim } from "@/components/simulations/SpringMassSim";
import { ElectricFieldSim } from "@/components/simulations/ElectricFieldSim";
import { ParticleCollisionSim } from "@/components/simulations/ParticleCollisionSim";
import { OhmCircuitSim } from "@/components/simulations/OhmCircuitSim";
import { PhotoelectricSim } from "@/components/simulations/PhotoelectricSim";
import { getClustersForSimulationSlug, getRelatedUrlsForCluster } from "@/lib/seo-topic-clusters";
// Note: Solar System remains in subdirectory as it might be complex/3D
import SolarSystemSim from "@/components/simulations/solar-system/solar-system-sim";


type SerializableSimulation = Omit<(typeof simulations)[number], "icon">;
type SimulationComponent = ComponentType<{ simData: SerializableSimulation }>;

function ComingSoonSimulation() {
    return <div className="p-8 text-center text-white">Bu simülasyon henüz yapım aşamasında.</div>;
}

function serializeSimulation(sim: (typeof simulations)[number]): SerializableSimulation {
    return {
        id: sim.id,
        slug: sim.slug,
        title: sim.title,
        description: sim.description,
        color: sim.color,
        formula: sim.formula,
        difficulty: sim.difficulty,
        tags: sim.tags,
        seo: sim.seo,
        content: sim.content,
        learning: sim.learning,
    };
}

function SimulationSeoContent({ sim }: { sim: (typeof simulations)[number] }) {
    const relatedArticleHref = sim.tags.some((tag) => tag.toLocaleLowerCase("tr-TR").includes("optik"))
        ? "/makale"
        : sim.tags.some((tag) => tag.toLocaleLowerCase("tr-TR").includes("harmonik"))
            ? "/makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj"
            : "/makale";
    const clusterLinks = getClustersForSimulationSlug(sim.slug)
        .flatMap(getRelatedUrlsForCluster)
        .filter((link) => link.href !== `/simulasyonlar/${sim.slug}`)
        .filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index)
        .slice(0, 8);
    const learning = sim.learning;
    const resourceLinks: Array<{ label: string; href: string; featured?: boolean }> = [
        { label: "İlgili konu anlatımı", href: relatedArticleHref, featured: true },
        { label: "Fizik testleri", href: "/testler" },
        { label: "Bilim sözlüğü", href: "/sozluk" },
        ...learning.relatedResources.map((resource) => ({ label: resource.label, href: resource.href })),
        ...clusterLinks,
    ].filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index);

    return (
        <section className="bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6" aria-labelledby="simulation-seo-title">
            <div className="mx-auto max-w-4xl">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Fizik simülasyonu</p>
                <h2 id="simulation-seo-title" className="mt-2 text-2xl font-black tracking-normal text-white sm:text-3xl">
                    {sim.title} ne öğretir?
                </h2>
                <div className="mt-4 grid gap-5 text-sm font-medium leading-7 text-zinc-300 sm:text-base">
                    <p>
                        {sim.description} Bu sayfa, {sim.tags.join(", ")} konularını yalnızca okuyarak değil, değişkenleri oynatarak anlamak için hazırlanmış interaktif bir öğrenme alanıdır.
                        Google ve diğer arama sistemlerinin konuyu doğru anlaması için simülasyonun amacı, formülü ve kullanım bağlamı bu metinde açık şekilde verilmiştir.
                    </p>
                    <p>
                        Temel bağıntı <strong className="text-white">{sim.formula}</strong> şeklindedir. Simülasyonda değişkenleri değiştirdiğinde hareketin, alan çizgilerinin, dalga deseninin veya enerji dönüşümünün nasıl değiştiğini gözlemleyebilirsin.
                        Bu yaklaşım özellikle AI Mode gibi çok adımlı arama deneyimlerinde “nasıl çalışır”, “hangi değişken neyi etkiler” ve “örnekle açıkla” türü sorulara kaynak olacak görünür metin sağlar.
                    </p>
                </div>

                <div className="mt-7 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[8px] border border-zinc-800 bg-black/40 p-4">
                        <div className="mb-3 flex items-center gap-2 text-[#EAB308]">
                            <Sparkles className="h-4 w-4" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Öğrenme hedefi</h3>
                        </div>
                        <p className="text-lg font-black leading-snug text-white">{learning.bigQuestion}</p>
                        <p className="mt-3 text-sm font-semibold leading-6 text-zinc-400">{learning.outcome}</p>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-[7px] border border-zinc-700 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-300">
                            <Clock3 className="h-3.5 w-3.5 text-[#EAB308]" />
                            Yaklaşık {learning.estimatedMinutes} dakika
                        </div>
                    </div>

                    <div className="rounded-[8px] border border-zinc-800 bg-black/40 p-4">
                        <div className="mb-3 flex items-center gap-2 text-[#EAB308]">
                            <ListChecks className="h-4 w-4" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Deney defteri</h3>
                        </div>
                        <ol className="space-y-3">
                            {learning.checkpoints.map((checkpoint, index) => (
                                <li key={checkpoint} className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm font-semibold leading-6 text-zinc-300">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-zinc-700 bg-zinc-900 text-[11px] font-black text-[#EAB308]">
                                        {index + 1}
                                    </span>
                                    <span>{checkpoint}</span>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-4 rounded-[7px] border border-[#EAB308]/40 bg-[#EAB308]/10 p-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#EAB308]">Hızlı kontrol</p>
                            <p className="mt-1 text-sm font-bold leading-6 text-zinc-100">{learning.quickCheck}</p>
                        </div>
                    </div>
                </div>

                <SimulationLearningTracker slug={sim.slug} title={sim.title} learning={learning} />

                <nav className="mt-6 flex flex-wrap gap-2" aria-label="Simülasyonla ilgili kaynaklar">
                    {resourceLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={link.featured
                                ? "rounded-[7px] border border-[#EAB308] bg-[#EAB308] px-3 py-2 text-xs font-black text-black"
                                : "inline-flex items-center gap-1 rounded-[7px] border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-100 hover:border-[#EAB308]"
                            }
                        >
                            {link.label}
                            {!link.featured && <ArrowRight className="h-3.5 w-3.5" />}
                        </Link>
                    ))}
                </nav>
            </div>
        </section>
    );
}

export function generateStaticParams() {
    return simulations.map((sim) => ({
        slug: sim.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const sim = simulations.find((s) => s.slug === slug);
    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}/simulasyonlar/${slug}`;
    const image = `${baseUrl}/og-image.jpg`;

    if (!sim) {
        return {
            title: "Simülasyon Bulunamadı",
            robots: { index: false, follow: true },
        };
    }

    if (sim.seo) {
        return {
            title: sim.seo.title,
            description: sim.seo.description,
            keywords: sim.seo.keywords,
            openGraph: {
                title: sim.seo.title,
                description: sim.seo.description,
                type: 'website',
                url: canonical,
                images: [{ url: image, width: 1200, height: 630, alt: `${sim.title} fizik simülasyonu` }],
            },
            twitter: {
                card: "summary_large_image",
                title: sim.seo.title,
                description: sim.seo.description,
                images: [image],
            },
            alternates: { canonical },
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

    const description = `${sim.title} ile fizik kurallarını interaktif olarak keşfedin.`;

    return {
        title: `${sim.title} Simülasyonu | FizikHub`,
        description,
        openGraph: {
            title: `${sim.title} Simülasyonu — Fizikhub`,
            description,
            type: 'website',
            url: canonical,
            images: [{ url: image, width: 1200, height: 630, alt: `${sim.title} fizik simülasyonu` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${sim.title} Simülasyonu — Fizikhub`,
            description,
            images: [image],
        },
        alternates: { canonical },
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

export default async function SimulationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sim = simulations.find((s) => s.slug === slug);

    if (!sim) {
        notFound();
    }

    // Map slug to component
    let Component: SimulationComponent;
    switch (sim.id) {
        case "projectile":
            Component = ProjectileSim;
            break;
        case "optics":
            Component = OpticsSim;
            break;
        case "pendulum":
            Component = PendulumSim;
            break;
        case "solar":
            Component = SolarSystemSim;
            break;
        case "wave":
            Component = WaveSim;
            break;
        case "spring":
            Component = SpringMassSim;
            break;
        case "electric":
            Component = ElectricFieldSim;
            break;
        case "circuit":
            Component = OhmCircuitSim;
            break;
        case "photoelectric":
            Component = PhotoelectricSim;
            break;
        case "collision":
            Component = ParticleCollisionSim;
            break;
        default:
            Component = ComingSoonSimulation;
    }


    const SimComponent = Component;
    const serializableSim = serializeSimulation(sim);
    const baseUrl = getSiteUrl();
    const canonical = `${baseUrl}/simulasyonlar/${sim.slug}`;
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "@id": `${canonical}#learning-resource`,
            name: sim.title,
            description: sim.description,
            learningResourceType: "Simulation",
            interactivityType: "active",
            educationalLevel: sim.difficulty,
            educationalUse: ["Interactive simulation", "Guided inquiry", "Retrieval practice"],
            teaches: [...sim.tags, sim.learning.outcome],
            assesses: sim.learning.quickCheck,
            competencyRequired: sim.learning.prerequisite,
            timeRequired: `PT${sim.learning.estimatedMinutes}M`,
            keywords: [...sim.tags, ...(sim.seo?.keywords || [])],
            url: canonical,
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            provider: {
                "@type": "Organization",
                name: "Fizikhub",
                url: baseUrl,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": `${canonical}#app`,
            name: sim.title,
            description: sim.description,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            featureList: [
                "Interactive physics controls",
                "Guided experiment missions",
                "AI lab assistant",
                "Learning checkpoints",
            ],
            url: canonical,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "@id": `${canonical}#formula-term`,
            name: `${sim.title} Formülü`,
            description: `${sim.title} konusuna ait temel fizik formülü: ${sim.formula}`,
            inDefinedTermSet: {
                "@type": "DefinedTermSet",
                name: "Fizikhub Bilim Sözlüğü",
                url: `${baseUrl}/sozluk`,
            },
            url: canonical,
            inLanguage: "tr-TR",
        },
    ];


    return (
        <div className="min-h-[100dvh] bg-black">
            {jsonLd.map((schema) => (
                <script
                    key={schema["@id"]}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <BreadcrumbJsonLd items={[
                { name: "Simülasyonlar", href: "/simulasyonlar" },
                { name: sim.title, href: `/simulasyonlar/${sim.slug}` },
            ]} />
            <SimComponent simData={serializableSim} />
            <SimulationSeoContent sim={sim} />
        </div>
    );
}
