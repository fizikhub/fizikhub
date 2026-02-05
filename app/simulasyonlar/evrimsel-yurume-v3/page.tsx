"use client";

import { BioEvolution3D } from "@/components/simulations/EvolutionarySimulation/BioEvolution3D";

export default function EvrimselYurumeV3Page() {
    return (
        <div className="fixed inset-0 bg-black z-[100]">
            <BioEvolution3D />
        </div>
    );
}
