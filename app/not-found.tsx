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

            <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">

                {/* Neon 404 Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 pointer-events-none opacity-50 select-none">
                    <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(255,0,255,0.6)]">
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                            className="text-[180px] font-black fill-none stroke-[3px] stroke-[#ff00ff] animate-pulse"
                            style={{ filter: "url(#glow)" }}
                        >
                            404
                        </text>
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                            className="text-[180px] font-black fill-[#ff00ff] opacity-20 blur-xl"
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
                    className="relative w-full flex justify-center mb-6"
                >
                    <div className="relative w-[90vw] sm:w-[500px] aspect-square">
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
                    className="space-y-4 max-w-lg mx-auto"
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
