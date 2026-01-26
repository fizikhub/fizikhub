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
        <div className="min-h-screen bg-[#292929] text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-[#FF0055] selection:text-white overflow-hidden relative">

            {/* 
                V8: PAVYON / DISCO THEME
                - Spinning Disco Ball
                - Neon Marquee Lights
                - 404 Behind Character
            */}
            <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10 -mt-20 sm:mt-0">

                {/* DISCO BALL */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-20 w-24 h-24">
                    <div className="w-2 bg-gradient-to-b from-gray-600 to-gray-400 h-24 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.8)] border-2 border-gray-400 relative"
                    >
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="absolute inset-0 border border-gray-400/30 rounded-full" style={{ transform: `rotate(${i * 36}deg) scaleX(0.5)` }} />
                        ))}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="absolute inset-0 border-t border-gray-400/30" style={{ top: `${i * 20}%` }} />
                        ))}
                    </motion.div>
                </div>

                {/* LIGHTS (PAVYON STYLE) */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.15),transparent_70%)] animate-pulse" />

                {/* Neon 404 Background (BEHIND RICK) */}
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10 pointer-events-none select-none">
                    <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_50px_rgba(255,0,255,0.8)] opacity-80">
                        <defs>
                            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Disco Lights around 404 */}
                        {[...Array(12)].map((_, i) => (
                            <circle key={i} r="3" fill={i % 2 === 0 ? "#FACC15" : "#ff00ff"} className="animate-pulse">
                                <animateMotion dur="6s" repeatCount="indefinite" path="M50,100 a150,50 0 1,0 300,0 a150,50 0 1,0 -300,0" begin={`${i * 0.5}s`} />
                            </circle>
                        ))}

                        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
                            className="text-[160px] font-black fill-transparent stroke-[4px] stroke-[#ff00ff]"
                            style={{ filter: "url(#neon-glow)" }}
                        >
                            404
                        </text>
                        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
                            className="text-[160px] font-black fill-[#ff00ff]/20 stroke-none blur-sm"
                        >
                            404
                        </text>
                    </svg>
                </div>

                {/* 1. The Naked Scientist Asset (v7 - Rick Style) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                    className="relative w-full flex justify-center mb-0 z-10" // Reduced bottom margin
                >
                    <div className="relative w-[85vw] sm:w-[500px] aspect-square">
                        <Image
                            src="/404-rick-scientist-transparent.png"
                            alt="Rick-like Scientist caught changing"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                            sizes="(max-width: 768px) 90vw, 500px"
                        />
                    </div>
                </motion.div>

                {/* 2. Humorous Code Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 max-w-lg mx-auto relative z-20 -mt-10 sm:-mt-12" // Negative top margin to pull text up overlapping with image feet
                >
                    <h1 className="text-3xl sm:text-5xl font-black text-[#FACC15] uppercase tracking-tighter leading-none skew-x-[-10deg]">
                        DENEY HATASI: <br />
                        <span className="text-[#ff00ff]">PARALEL EVREN SAPMASI</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-300 font-medium leading-normal bg-black/50 p-6 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
                        <strong className="text-[#ff00ff] block mb-2 text-xl">⚠️ Kuantum Çökmesi Tespit Edildi</strong>
                        Gözlemci etkisiyle bu sayfanın dalga fonksiyonunu çökerttin, ama beklendiği gibi maddeleşmedi. Belki de bir solucan deliğinden yanlış koordinata düştün.
                        <br />
                        <span className="text-sm text-zinc-500 mt-4 block italic border-t border-white/10 pt-2">
                            (Bu esnada laboratuvar güvenliği ihlal edilmiş olabilir. Lütfen yerdeki yüksek topuklu ayakkabılara basmadan sessizce uzaklaş.)
                        </span>
                    </p>
                </motion.div>

                {/* 3. Navigation Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full h-14 px-8 bg-[#FACC15] hover:bg-[#EAB308] text-black text-lg font-black rounded-xl shadow-[6px_6px_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_black] transition-all flex items-center justify-center gap-2 uppercase">
                            <EyeOff className="w-5 h-5" />
                            Görmedim Say, Eve Dön
                        </Button>
                    </Link>
                    <Link href="/forum" className="w-full sm:w-auto">
                        <Button variant="ghost" className="w-full h-14 px-8 text-zinc-400 hover:text-white hover:bg-white/10 text-lg font-bold rounded-xl flex items-center justify-center gap-2">
                            <MoveLeft className="w-5 h-5" />
                            Geri Geri Çık
                        </Button>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
