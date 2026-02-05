"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { cn } from "@/lib/utils";
import { simulations } from "@/components/simulations/data";

export default function SimulasyonlarPage() {
    return (
        <div className="min-h-screen bg-background pb-20 font-[family-name:var(--font-outfit)]">
            {/* Header */}
            <div className="bg-[#4169E1] border-b-[3px] border-black sticky top-0 z-50 shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-6xl mx-auto px-4 py-3.5 relative z-10">
                    <div className="flex items-center gap-4">
                        <ViewTransitionLink href="/">
                            <div className="flex items-center justify-center w-10 h-10 bg-[#FFC800] border-[2px] border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                                <ArrowLeft className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                            </div>
                        </ViewTransitionLink>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic">
                                Fizik Simülasyonları
                            </h1>
                            <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">
                                İnteraktif deneylerle fiziği keşfet
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {simulations.map((sim, index) => (
                        <Link href={`/simulasyonlar/${sim.slug}`} key={sim.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "h-full flex flex-col border-[2px] border-black bg-zinc-950 overflow-hidden relative",
                                    "shadow-[8px_8px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#4169E1]",
                                    "group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                                    "transition-all duration-300 rounded-2xl"
                                )}
                            >
                                {/* Card Header */}
                                <div
                                    className="flex items-center gap-4 p-5 border-b-[2px] border-black"
                                    style={{ backgroundColor: sim.color }}
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-white border-[2px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-xl">
                                        <sim.icon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="font-black text-xs sm:text-sm uppercase tracking-tight truncate text-black drop-shadow-sm">
                                                {sim.title}
                                            </h3>
                                            <span className="shrink-0 text-[8px] sm:text-[9px] uppercase font-black border-2 border-black px-2 py-0.5 bg-white text-black rounded-lg shadow-[2px_2px_0px_#000]">
                                                {sim.difficulty}
                                            </span>
                                        </div>
                                        <p className="font-mono text-[10px] sm:text-xs font-bold opacity-60 text-black truncate italic">{sim.formula}</p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col relative bg-gradient-to-br from-zinc-950 to-zinc-900">
                                    <p className="text-zinc-400 text-xs sm:text-sm mb-8 leading-relaxed font-medium">
                                        {sim.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {sim.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[9px] text-[#4169E1] font-black uppercase tracking-widest bg-[#4169E1]/10 border border-[#4169E1]/20 px-2 py-1 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-[#FFC800] font-black text-[10px] sm:text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                            BAŞLAT
                                            <div className="w-6 h-6 flex items-center justify-center bg-[#FFC800] text-black rounded-full border border-black shadow-[2px_2px_0px_#000]">
                                                <Play className="w-3 h-3 fill-current" />
                                            </div>
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
                    className="mt-16 p-8 sm:p-12 bg-zinc-950 border-[2px] border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden group/info"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/info:opacity-[0.05] transition-opacity">
                        <Play className="w-48 h-48 text-white rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-8 bg-[#4169E1] rounded-full" />
                            <h3 className="font-black text-xl sm:text-2xl text-white uppercase tracking-tighter italic">
                                Simülasyonlar Hakkında
                            </h3>
                        </div>
                        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
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
