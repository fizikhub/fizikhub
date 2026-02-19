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
        default:
            Component = () => <div className="p-8 text-center text-white">Bu simülasyon henüz yapım aşamasında.</div>;
    }

    // Cast to any to allow passing new props (content) to components that might not have updated interfaces yet.
    const SimComponent = Component as any;

    return (
        <div className="min-h-screen bg-background flex flex-col font-[family-name:var(--font-outfit)]">
            {/* 
               We're removing the header here because SimWrapper (used inside ProjectileSim and OpticsSim) 
               provides its own full-screen layout. 
               However, older simulations might still need it.
               For consistency, we will hide it for simulations that likely use SimWrapper.
            */}

            {(sim.id !== "projectile" && sim.id !== "optics" && sim.id !== "spring") && (
                <div className="border-b-[3px] border-black sticky top-0 z-50 py-2 sm:py-3 px-4" style={{ backgroundColor: sim.color }}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ViewTransitionLink href="/simulasyonlar">
                                <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                    <ArrowLeft className="w-4 h-4 text-black" />
                                </div>
                            </ViewTransitionLink>
                            <h1 className="text-sm sm:text-lg font-black text-black uppercase tracking-tight flex items-center gap-2">
                                {sim.title}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 relative">
                <SimComponent content={sim.content} />
            </div>
        </div>
    );
}
