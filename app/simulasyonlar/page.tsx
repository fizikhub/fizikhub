"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Atom,
    ArrowLeft,
    Play,
    Activity,
    Zap,
    Target,
    Magnet,
    Sparkles
} from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import {
    PendulumSim,
    SpringMassSim,
    WaveSim,
    ProjectileSim,
    ElectricFieldSim,
    ParticleCollisionSim
} from "@/components/simulations";

const simulations = [
    {
        id: "pendulum",
        title: "Sarkaç Hareketi",
        description: "Basit harmonik hareket ve periyot hesaplamaları",
        icon: Activity,
        color: "#FFC800",
        formula: "T = 2π√(L/g)",
        component: PendulumSim
    },
    {
        id: "spring",
        title: "Yay-Kütle Sistemi",
        description: "Hooke yasası görselleştirmesi",
        icon: Zap,
        color: "#3B82F6",
        formula: "F = -kx",
        component: SpringMassSim
    },
    {
        id: "wave",
        title: "Dalga Mekaniği",
        description: "Girişim ve süperpozisyon",
        icon: Sparkles,
        color: "#22C55E",
        formula: "y = A sin(kx - ωt)",
        component: WaveSim
    },
    {
        id: "projectile",
        title: "Projektil Hareketi",
        description: "Açı ve hız ile atış simülasyonu",
        icon: Target,
        color: "#EF4444",
        formula: "R = v²sin(2θ)/g",
        component: ProjectileSim
    },
    {
        id: "electric",
        title: "Elektrik Alanları",
        description: "Yük dağılımı ve alan çizgileri",
        icon: Magnet,
        color: "#A855F7",
        formula: "E = kq/r²",
        component: ElectricFieldSim
    },
    {
        id: "collision",
        title: "Parçacık Fiziği",
        description: "Çarpışmalar ve momentum korunumu",
        icon: Atom,
        color: "#F97316",
        formula: "p₁ + p₂ = p₁' + p₂'",
        component: ParticleCollisionSim
    }
];

export default function SimulasyonlarPage() {
    const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

    const activeSim = simulations.find(s => s.id === activeSimulation);

    return (
        <div className="min-h-screen bg-[#1A1A1A]">
            {/* Header */}
            <div className="bg-[#3B82F6] border-b-[3px] border-black">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <ViewTransitionLink href="/">
                            <div className="flex items-center justify-center w-10 h-10 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                Fizik Simülasyonları
                            </h1>
                            <p className="text-white/80 text-sm">
                                İnteraktif deneylerle fiziği keşfet
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {activeSimulation && activeSim ? (
                        /* Active Simulation View */
                        <motion.div
                            key="simulation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-neutral-900 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]"
                        >
                            {/* Simulation Header */}
                            <div
                                className="flex items-center justify-between p-4 border-b-[3px] border-black"
                                style={{ backgroundColor: activeSim.color }}
                            >
                                <div className="flex items-center gap-3">
                                    <activeSim.icon className="w-6 h-6" />
                                    <div>
                                        <h2 className="font-black text-lg uppercase">{activeSim.title}</h2>
                                        <p className="text-sm opacity-80">{activeSim.formula}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveSimulation(null)}
                                    className="px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-bold text-xs uppercase hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    Kapat
                                </button>
                            </div>

                            {/* Simulation Content */}
                            <activeSim.component />
                        </motion.div>
                    ) : (
                        /* Grid View */
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {simulations.map((sim, index) => (
                                <motion.button
                                    key={sim.id}
                                    onClick={() => setActiveSimulation(sim.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "group text-left p-0 border-[3px] border-black bg-neutral-900",
                                        "shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000]",
                                        "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                        "active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
                                        "transition-all duration-200"
                                    )}
                                >
                                    {/* Card Header */}
                                    <div
                                        className="flex items-center gap-3 p-4 border-b-[3px] border-black"
                                        style={{ backgroundColor: sim.color }}
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-white border-[2px] border-black">
                                            <sim.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-sm uppercase tracking-tight">
                                                {sim.title}
                                            </h3>
                                            <p className="font-mono text-xs opacity-70">{sim.formula}</p>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4">
                                        <p className="text-neutral-400 text-sm mb-4">
                                            {sim.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase group-hover:text-yellow-300">
                                            <Play className="w-4 h-4 fill-current" />
                                            Simülasyonu Başlat
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Section */}
                {!activeSimulation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 p-6 bg-neutral-900 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]"
                    >
                        <h3 className="font-black text-lg text-white uppercase mb-3">
                            📚 Simülasyonlar Hakkında
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Bu interaktif simülasyonlar, fizik kavramlarını görsel olarak anlamanıza yardımcı olmak için
                            tasarlanmıştır. Her simülasyonda parametreleri değiştirerek fizik yasalarının nasıl çalıştığını
                            gerçek zamanlı olarak gözlemleyebilirsiniz. Mobil cihazlarda dokunmatik kontroller desteklenir.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
