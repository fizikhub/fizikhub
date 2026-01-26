"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        // BG Color: RGB(41,41,41) => Hex #292929
        <div className="min-h-screen bg-[#292929] text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-[#FACC15] selection:text-black overflow-hidden relative">

            <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">

                {/* 1. The Naked Scientist Asset */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative w-full flex justify-center mb-6"
                >
                    <div className="relative w-[85vw] sm:w-[500px] aspect-square">
                        <Image
                            src="/404-naked-scientist.png"
                            alt="Naked Scientist holding 404 sign"
                            fill
                            className="object-contain"
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
                    <h1 className="text-3xl sm:text-5xl font-black text-[#FACC15] uppercase tracking-tighter leading-none">
                        HOOP! MÜSAİT DEĞİLİM!
                    </h1>

                    <p className="text-lg sm:text-xl text-zinc-300 font-medium leading-normal">
                        Dostum, kapıyı çalmadan girmesene! <br />
                        Sayfa giyinmeye çalışıyordu.
                        <span className="block mt-2 text-zinc-400 text-base">
                            Tam üstünü başını (daha doğrusu hatayı) giyiyordu ki bastın burayı.
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
                        <Button className="w-full h-14 px-8 bg-[#FACC15] hover:bg-[#EAB308] text-black text-lg font-black rounded-xl shadow-[0_4px_0_#9d7e05] hover:translate-y-[2px] hover:shadow-[0_2px_0_#9d7e05] transition-all flex items-center justify-center gap-2 uppercase">
                            <Home className="w-5 h-5" />
                            Gözümü Kapattım, Eve Dön
                        </Button>
                    </Link>
                    <Link href="/forum" className="w-full sm:w-auto">
                        <Button variant="ghost" className="w-full h-14 px-8 text-zinc-400 hover:text-white hover:bg-white/10 text-lg font-bold rounded-xl flex items-center justify-center gap-2">
                            <MoveLeft className="w-5 h-5" />
                            Geri Çekil
                        </Button>
                    </Link>
                </motion.div>

            </div>

            {/* Background Noise/Texture Overlay (Optional, for "Adam gibi bişey") */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
        </div>
    );
}
