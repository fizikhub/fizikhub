import { notFound } from "next/navigation";
import { type Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { simulations } from "@/components/simulations/data";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";

// Import simulation components
import { ProjectileSim } from "@/components/simulations/ProjectileSim";
import { OpticsSim } from "@/components/simulations/OpticsSim";
import { PendulumSim } from "@/components/simulations/PendulumSim";
import { WaveSim } from "@/components/simulations/WaveSim";
import { SpringMassSim } from "@/components/simulations/SpringMassSim";
import { ElectricFieldSim } from "@/components/simulations/ElectricFieldSim";
import { ParticleCollisionSim } from "@/components/simulations/ParticleCollisionSim";
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

                <nav className="mt-6 flex flex-wrap gap-2" aria-label="Simülasyonla ilgili kaynaklar">
                    <Link href={relatedArticleHref} className="rounded-[7px] border border-[#FFC800] bg-[#FFC800] px-3 py-2 text-xs font-black text-black">
                        İlgili konu anlatımı
                    </Link>
                    <Link href="/testler" className="rounded-[7px] border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-100 hover:border-[#FFC800]">
                        Fizik testleri
                    </Link>
                    <Link href="/sozluk" className="rounded-[7px] border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-100 hover:border-[#FFC800]">
                        Bilim sözlüğü
                    </Link>
                    {clusterLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="rounded-[7px] border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-100 hover:border-[#FFC800]">
                            {link.label}
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

    if (!sim) {
        return {
            title: "Simülasyon Bulunamadı | FizikHub",
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
                url: `https://www.fizikhub.com/simulasyonlar/${slug}`,
            },
            alternates: { canonical: `https://www.fizikhub.com/simulasyonlar/${slug}` },
        };
    }

    return {
        title: `${sim.title} Simülasyonu | FizikHub`,
        description: `${sim.title} ile fizik kurallarını interaktif olarak keşfedin.`,
        openGraph: {
            title: `${sim.title} Simülasyonu — Fizikhub`,
            description: `${sim.title} ile fizik kurallarını interaktif olarak keşfedin.`,
            type: 'website',
            url: `https://www.fizikhub.com/simulasyonlar/${slug}`,
        },
        alternates: { canonical: `https://www.fizikhub.com/simulasyonlar/${slug}` },
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
        case "collision":
            Component = ParticleCollisionSim;
            break;
        default:
            Component = ComingSoonSimulation;
    }

    const SimComponent = Component;
    const serializableSim = serializeSimulation(sim);
    const canonical = `https://www.fizikhub.com/simulasyonlar/${sim.slug}`;
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "@id": `${canonical}#learning-resource`,
            name: sim.title,
            description: sim.description,
            learningResourceType: "Simulation",
            educationalLevel: sim.difficulty,
            teaches: sim.tags,
            url: canonical,
            inLanguage: "tr-TR",
            isAccessibleForFree: true,
            provider: {
                "@type": "Organization",
                name: "Fizikhub",
                url: "https://www.fizikhub.com",
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
            url: canonical,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "TRY",
            },
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
