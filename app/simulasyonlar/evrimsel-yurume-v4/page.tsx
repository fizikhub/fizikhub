"use client";

import { EvolutionarySimulation } from "@/components/simulations/EvolutionarySimulation";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { ArrowLeft } from "lucide-react";

export default function EvrimselYurumeV4Page() {
    return (
        <div className="min-h-screen bg-[#05050a]">
            {/* Custom Header V4 */}
            <div className="bg-black border-b border-cyan-500/50 p-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ViewTransitionLink href="/simulasyonlar">
                            <div className="flex items-center justify-center w-10 h-10 bg-cyan-950/30 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-95 transition-all">
                                <ArrowLeft className="w-6 h-6 text-cyan-400" />
                            </div>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-xl font-black uppercase italic tracking-tighter text-white">
                                BLOB-EVOLUTION <span className="text-cyan-400">V4</span>
                            </h1>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400/50">
                                Artificial Intelligence & Soft-Body Lab
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-0 sm:p-4 mt-8">
                <div className="border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-hidden bg-black/60 backdrop-blur-xl rounded-0 sm:rounded-3xl">
                    <EvolutionarySimulation />
                </div>
            </div>
        </div>
    );
}
