import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { simulations } from "@/components/simulations/data";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { ArrowLeft } from "lucide-react";

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
        };
    }

    return {
        title: `${sim.title} Simülasyonu | FizikHub`,
        description: `${sim.title} ile fizik kurallarını interaktif olarak keşfedin.`,
    };
}

export default async function SimulationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sim = simulations.find((s) => s.slug === slug);

    if (!sim) {
        notFound();
    }

    // Map slug to component
    let Component;
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
            Component = () => <div className="p-8 text-center text-white">Bu simülasyon henüz yapım aşamasında.</div>;
    }

    // Cast to any to allow passing new props (simData) to components
    const SimComponent = Component as any;

    // Strip functions to prevent Next.js serialization error
    const { icon, ...serializableSim } = sim;

    return (
        <div className="min-h-[100dvh] bg-black">
            <SimComponent simData={serializableSim} />
        </div>
    );
}
