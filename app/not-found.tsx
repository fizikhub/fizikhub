"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft, EyeOff } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        // BG Color: RGB(41,41,41) => Hex #292929
        // NO texture/noise ("pütürcükler olmasın")
        <div className="min-h-screen bg-[#292929] text-white font-sans flex flex-col items-center justify-center p-0 sm:p-4 selection:bg-[#FF0055] selection:text-white overflow-hidden relative">

            {/* 
                V9: FINAL POLISH - COMPACT DISCO (Manual Overwrite)
                - 404 with Disco Ball '0' behind Rick
                - Compact Mobile Layout
                - No Cutoffs
            */}
            <div className="w-full max-w-2xl flex flex-col items-center text-center relative z-10 pt-10 sm:pt-0">

                <div className="relative w-full flex justify-center items-center">

                    {/* 404 BEHIND RICK */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] flex justify-center items-center gap-2 sm:gap-8 -z-10 select-none opacity-90">
                        {/* '4' */}
                        <div className="text-[180px] sm:text-[250px] font-black italic text-transparent stroke-[4px] stroke-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.6)]" style={{ WebkitTextStroke: '4px #ff00ff' }}>
                            4
                        </div>

                        {/* '0' -> DISCO BALL */}
                        <div className="relative w-32 h-32 sm:w-48 sm:h-48 shrink-0">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.8)] border-4 border-gray-400 relative"
                            >
                                {/* Mirrors */}
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="absolute inset-0 border border-gray-500/30 rounded-full" style={{ transform: `rotate(${i * 30}deg) scaleX(0.6)` }} />
                                ))}
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="absolute inset-0 border-t border-gray-500/30" style={{ top: `${i * 16}%` }} />
                                ))}
                            </motion.div>
                            {/* Sparkles on Disco Ball */}
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.6)] mix-blend-overlay"
                            />
                        </div>

                        {/* '4' */}
                        <div className="text-[180px] sm:text-[250px] font-black italic text-transparent stroke-[4px] stroke-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.6)]" style={{ WebkitTextStroke: '4px #ff00ff' }}>
                            4
                        </div>
                    </div>

                    {/* RICK ASSET (Optimized Position) */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                        className="relative z-10 mt-8 mb-[-40px] sm:mb-[-60px]" // Negative margin to pull text card up
                    >
                        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
                            <Image
                                src="/404-rick-scientist-transparent.png"
                                alt="Rick-like Scientist"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                                sizes="(max-width: 768px) 300px, 500px"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* COMPACT TEXT CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-20 w-[90%] sm:w-full max-w-lg mx-auto bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                >
                    <div className="space-y-2 mb-6">
                        <div className="inline-block bg-[#FACC15] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-1">
                            Hata Kodu: 404
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                            DENEY HATASI: <span className="text-[#ff00ff] block sm:inline">PARALEL EVREN SAPMASI</span>
                        </h1>
                    </div>

                    <div className="text-left bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                        <strong className="text-[#FACC15] flex items-center gap-2 mb-2 text-sm uppercase tracking-wide">
                            <EyeOff className="w-4 h-4" />
                            Kuantum Çökmesi Tespit Edildi
                        </strong>
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                            Gözlemci etkisiyle bu sayfanın dalga fonksiyonunu çökerttin, ama beklendiği gibi maddeleşmedi. Belki de bir solucan deliğinden yanlış koordinata düştün.
                        </p>
                        <p className="text-xs text-zinc-500 mt-3 pt-3 border-t border-white/5 italic">
                            (Bu esnada laboratuvar güvenliği ihlal edilmiş olabilir. Lütfen yerdeki yüksek topuklu ayakkabılara basmadan sessizce uzaklaş.)
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/" className="flex-1">
                            <Button className="w-full h-12 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base uppercase tracking-tight">
                                <Home className="w-4 h-4 mr-2" />
                                Ana Sayfaya Işınlan
                            </Button>
                        </Link>
                        <Link href="/forum" className="flex-1">
                            <Button variant="outline" className="w-full h-12 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold rounded-lg hover:border-white transition-all text-sm sm:text-base">
                                <MoveLeft className="w-4 h-4 mr-2" />
                                Geri Dön
                            </Button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
