"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#18181b] text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-[#FACC15] selection:text-black overflow-hidden">

            <div className="max-w-4xl w-full flex flex-col items-center text-center">

                {/* 1. Header (Bubble) - Dark Theme Adapted */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="mb-8 relative z-10 w-full flex justify-center"
                >
                    <div className="bg-white text-black px-6 sm:px-12 py-4 rounded-full relative shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase whitespace-nowrap">
                            HAY AKSİ!
                        </h1>
                        {/* Speech Bubble Tail */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-white border-r-[15px] border-r-transparent"></div>
                    </div>
                </motion.div>

                {/* 2. Generated Character Asset (Sticker Style) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full flex justify-center py-2"
                >
                    <div className="relative w-[80vw] sm:w-[500px] aspect-square">
                        <Image
                            src="/404-scientist-sticker.png"
                            alt="Censored Scientist holding 404 sign"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                            sizes="(max-width: 768px) 90vw, 500px"
                        />
                    </div>
                </motion.div>

                {/* 3. Humorous Copy - Dark Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6 max-w-xl relative z-10 p-4"
                >
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight">
                        Sanırım Yanlış Zamanda Geldin...
                    </h2>

                    <p className="text-lg sm:text-xl text-zinc-400 font-medium">
                        Bu sayfa henüz giyinmemişti. Yakalandık!
                        <br />
                        <span className="text-base text-zinc-500 mt-2 block">
                            Hemen çaktırmadan giyinmesine fırsat verelim ve ana sayfaya dönelim.
                        </span>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full h-14 px-8 bg-[#FACC15] hover:bg-[#EAB308] text-black text-lg font-black rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                <Home className="w-5 h-5" />
                                BİZİ BURADAN ÇIKAR
                            </Button>
                        </Link>
                        <Link href="/forum" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-14 px-8 border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent text-lg font-bold rounded-xl flex items-center justify-center gap-2">
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
