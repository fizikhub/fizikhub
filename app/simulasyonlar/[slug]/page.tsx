import { notFound } from "next/navigation";
import { simulations } from "@/components/simulations/data";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { ArrowLeft } from "lucide-react";

// Import simulation components (lazy loading would be better but keeping simple for now)
import ProjectileSim from "@/components/simulations/projectile/projectile-sim";
import PendulumSim from "@/components/simulations/pendulum/pendulum-sim";
import SolarSystemSim from "@/components/simulations/solar-system/solar-system-sim";
import WaveSim from "@/components/simulations/waves/wave-sim";
import { SpringMassSim } from "@/components/simulations/SpringMassSim";

export function generateStaticParams() {
    return simulations.map((sim) => ({
        slug: sim.slug,
    }));
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

    return (
        <div className="min-h-screen bg-background flex flex-col font-[family-name:var(--font-outfit)]">
            {/* Simulation Header */}
            <div className="border-b-[3px] border-black sticky top-0 z-50" style={{ backgroundColor: sim.color }}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ViewTransitionLink href="/simulasyonlar">
                            <div className="flex items-center justify-center w-10 h-10 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                <ArrowLeft className="w-5 h-5 text-black" />
                            </div>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight flex items-center gap-2">
                                <sim.icon className="w-6 h-6" />
                                {sim.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                <Component />
            </div>
        </div>
    );
}
