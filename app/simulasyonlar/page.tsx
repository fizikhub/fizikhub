"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import { simulations } from "@/components/simulations/data";

export default function SimulasyonlarPage() {
    return (
        <div className="min-h-screen bg-[#1A1A1A] pb-20">
            {/* Header */}
            <div className="bg-[#3B82F6] border-b-[3px] border-black sticky top-0 z-50">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {simulations.map((sim, index) => (
                        <Link href={`/simulasyonlar/${sim.slug}`} key={sim.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "h-full flex flex-col border-[3px] border-black bg-neutral-900 overflow-hidden",
                                    "shadow-[6px_6px_0px_0px_#000] group-hover:shadow-[8px_8px_0px_0px_#000]",
                                    "group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]",
                                    "transition-all duration-200"
                                )}
                            >
                                {/* Card Header */}
                                <div
                                    className="flex items-center gap-3 p-4 border-b-[3px] border-black"
                                    style={{ backgroundColor: sim.color }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                                        <sim.icon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-black text-sm uppercase tracking-tight truncate pr-2 text-black">
                                                {sim.title}
                                            </h3>
                                            <span className="text-[10px] uppercase font-bold border border-black px-1.5 py-0.5 bg-white text-black">
                                                {sim.difficulty}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs opacity-80 text-black truncate">{sim.formula}</p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col relative">
                                    {/* Grid Background Pattern */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                                    />

                                    <p className="text-neutral-400 text-sm mb-6 leading-relaxed relative z-10">
                                        {sim.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between relative z-10">
                                        <div className="flex gap-2">
                                            {sim.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] text-neutral-500 font-mono bg-neutral-950 border border-neutral-800 px-2 py-1 rounded-sm">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-[#FFC800] font-bold text-xs uppercase group-hover:translate-x-1 transition-transform">
                                            Başlat
                                            <Play className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 p-8 bg-neutral-900 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Play className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-black text-xl text-white uppercase mb-4 border-b-2 border-[#3B82F6] inline-block pb-1">
                            📚 Simülasyonlar Hakkında
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                            Bu interaktif simülasyonlar, fizik kavramlarını görsel olarak anlamanıza yardımcı olmak için
                            tasarlanmıştır. Her simülasyonda parametreleri değiştirerek fizik yasalarının nasıl çalıştığını
                            gerçek zamanlı olarak gözlemleyebilirsiniz.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
