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

                {/* 1. The Naked Scientist Asset (v7 - Rick Style) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                    className="relative w-full flex justify-center mb-6"
                >
                    <div className="relative w-[90vw] sm:w-[500px] aspect-square">
                        <Image
                            src="/404-naked-scientist.png"
                            alt="Rick-like Scientist caught changing"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                            sizes="(max-width: 768px) 90vw, 500px"
                        />
                    </div>
                </motion.div>

                {/* 2. Humorous Copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 max-w-lg mx-auto"
                >
                    <h1 className="text-4xl sm:text-6xl font-black text-[#FACC15] uppercase tracking-tighter leading-none skew-x-[-10deg]">
                        LAN! KAPIYI ÇALSANA!
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-300 font-medium leading-normal bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                        <strong className="text-white block mb-1">Olay Yeri İnceleme:</strong>
                        Sayfa giyinme odasındaydı. Adamcağız daha önlüğünü ilikleyemeden (ve çoraplarını eşleştiremeden) içeri daldın.
                        <br />
                        <span className="text-sm text-zinc-400 mt-2 block italic">
                            (Yanağındaki ruj izini ve yerdeki topuklu ayakkabıları görmemiş gibi yap, özel hayatı bizi ilgilendirmez.)
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
