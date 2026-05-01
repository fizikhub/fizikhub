import { notFound } from "next/navigation";
import { type Metadata } from "next";
import type { ComponentType } from "react";
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
        </div>
    );
}
