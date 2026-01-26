"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FACC15] text-black font-sans flex flex-col items-center justify-center p-4 selection:bg-black selection:text-[#FACC15]">

            <div className="max-w-4xl w-full flex flex-col items-center text-center">

                {/* 1. Header (Bubble) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="mb-6 relative z-10"
                >
                    <div className="bg-white border-[4px] border-black px-8 sm:px-12 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                        <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tighter uppercase">
                            HAY AKSİ!
                        </h1>
                        {/* Speech Bubble Tail */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-t-[25px] border-t-white border-r-[20px] border-r-transparent z-10"></div>
                        <div className="absolute -bottom-[29px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-t-[29px] border-t-black border-r-[24px] border-r-transparent -z-10"></div>
                    </div>
                </motion.div>

                {/* 2. Generated Character Asset (v2 - High Quality) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full max-w-[400px] sm:max-w-[500px] aspect-square -my-4 z-0"
                >
                    <div className="relative w-full h-full">
                        {/* White Aura/Glow to separate fro yellow */}
                        <div className="absolute inset-4 bg-white/20 rounded-full blur-3xl scale-90"></div>
                        <Image
                            src="/404-scientist-v2.png"
                            alt="Censored Scientist holding 404 sign"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                </motion.div>

                {/* 3. Humorous Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6 max-w-xl relative z-10 bg-white border-[4px] border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <h2 className="text-2xl sm:text-3xl font-black text-black uppercase leading-tight">
                        Sanırım Yanlış Zamanda Geldin...
                    </h2>

                    <p className="text-lg sm:text-xl text-zinc-800 font-bold">
                        "Bu sayfa henüz giyinmemişti. Yakalandık!"
                        <br />
                        <span className="text-base font-medium text-zinc-600 mt-2 block">
                            Hemen çaktırmadan giyinmesine fırsat verelim ve ana sayfaya dönelim.
                        </span>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/" className="w-full">
                            <Button className="w-full h-14 px-6 bg-[#F43F5E] hover:bg-[#E11D48] text-white text-lg font-black rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                                <Home className="w-5 h-5" />
                                BİZİ BURADAN ÇIKAR
                            </Button>
                        </Link>
                        <Link href="/forum" className="w-full">
                            <Button className="w-full h-14 px-6 bg-black hover:bg-zinc-800 text-white text-lg font-black rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#94A3B8] hover:shadow-[2px_2px_0px_0px_#94A3B8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2">
                                <MoveLeft className="w-5 h-5" />
                                GERİ DÖN
                            </Button>
                        </Link>
                    </div>

                </motion.div>

            </div>
        </div>
    );
}
