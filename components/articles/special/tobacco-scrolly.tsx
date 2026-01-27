"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { Article } from "@/lib/api";
import { Tobacco3DScene } from "./tobacco-3d-scene";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Skull, Wind, FlaskConical } from "lucide-react";

interface TobaccoScrollyProps {
    article: Article;
    readingTime: string;
}

export function TobaccoScrolly({ article, readingTime }: TobaccoScrollyProps) {
    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <Tobacco3DScene>
                {/* HTML OVERLAYS SYNCHED WITH SCROLL */}
                <Scroll html style={{ width: '100vw', height: '100vh' }}>

                    {/* SCENE 1: TITLE (0% - 33%) */}
                    <section className="h-screen flex items-center justify-center relative pointer-events-none">
                        <div className="text-center px-4">
                            <span className="block mb-4 text-green-400 tracking-[0.5em] text-sm font-bold uppercase drop-shadow-md">Fizikhub 3D Experience</span>
                            <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter drop-shadow-2xl text-white">
                                TÜTÜN
                            </h1>
                            <p className="text-xl md:text-2xl text-green-100/90 font-serif italic max-w-2xl mx-auto drop-shadow-lg">
                                "Tanrıların dumanından, sanayi devriminin bacalarına..."
                            </p>
                        </div>
                    </section>

                    {/* SCENE 2: VOYAGE (33% - 66%) */}
                    <section className="h-screen flex items-center relative pointer-events-none" style={{ top: '100vh', position: 'absolute' }}>
                        <div className="container mx-auto px-6 grid md:grid-cols-2">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                                <div className="flex items-center gap-3 mb-4 text-blue-400">
                                    <Wind className="animate-pulse" />
                                    <h2 className="text-3xl font-bold">1492: Temas</h2>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    Kristof Kolomb, Bahamalar'a ayak bastığında, yerliler ona "kuru yapraklar" hediye etti.
                                    Bu yapraklar yorgunluğu alıyor, açlığı bastırıyordu.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SCENE 3: CHEMISTRY (66% - 100%) */}
                    <section className="h-screen flex items-center justify-center relative pointer-events-none" style={{ top: '200vh', position: 'absolute' }}>
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-10 rounded-3xl max-w-4xl mx-auto shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="p-6 bg-cyan-950/50 rounded-full">
                                    <FlaskConical size={64} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold mb-4 text-white">Nikotin: <span className="text-cyan-400">C₁₀H₁₄N₂</span></h2>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        Doğada bir böcek ilacı. Beyinde bir ödül mekanizması.
                                        Sadece 7 saniyede beyne ulaşan, dopamin salgılatan kusursuz bir tuzak.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SCENE 4: CONCLUSION (100%+) */}
                    <section className="h-screen flex flex-col items-center justify-center relative pointer-events-auto" style={{ top: '300vh', position: 'absolute', width: '100%' }}>
                        <div className="text-center max-w-3xl bg-black/80 p-12 rounded-3xl backdrop-blur-md border border-red-900/50">
                            <Skull className="w-24 h-24 text-red-600 mx-auto mb-8 animate-pulse" />
                            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">SONUÇ.</h2>
                            <p className="text-xl text-zinc-300 mb-12">
                                Fizikhub'da bilimi keşfetmeye devam et.
                            </p>
                            <ViewTransitionLink
                                href="/blog"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                            >
                                Diğer Makalelere Dön
                            </ViewTransitionLink>
                        </div>
                    </section>

                </Scroll>
            </Tobacco3DScene>
        </div>
    );
}
