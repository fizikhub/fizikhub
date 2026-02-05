"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Dna } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { EvolutionarySimulation } from "@/components/simulations/EvolutionarySimulation";

export default function EvrimselYurumePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#FACC15] border-b-[4px] border-black p-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ViewTransitionLink href="/simulasyonlar">
                            <div className="flex items-center justify-center w-10 h-10 bg-white border-[2px] border-black shadow-[3px_3px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                                <ArrowLeft className="w-6 h-6 text-black" />
                            </div>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter text-black">
                                Evrimsel Yürüme
                            </h1>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-black/60">
                                Soft-Body Genetik Algoritma
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-0 sm:p-4 mt-4">
                <div className="border-[4px] border-black shadow-[12px_12px_0px_0px_#000] rounded-none sm:rounded-3xl overflow-hidden bg-white">
                    <EvolutionarySimulation />
                </div>
            </div>
        </div>
    );
}
