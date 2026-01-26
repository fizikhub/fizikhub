"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, Search } from "lucide-react";
import { motion } from "framer-motion";

// --- Custom Character Component ---
const ConfusedScientist = () => {
    return (
        <svg viewBox="0 0 400 400" className="w-64 h-64 sm:w-96 sm:h-96 drop-shadow-2xl">
            <motion.g
                initial={{ y: 10 }}
                animate={{ y: -10 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
                {/* Hair (Wild & Messy) */}
                <path d="M120 100 C 100 80, 80 120, 60 100 C 40 80, 80 40, 100 50 C 120 20, 160 20, 180 40 C 220 20, 240 60, 260 40 C 280 20, 320 60, 300 100 C 280 140, 340 140, 320 180"
                    fill="#E4E4E5" stroke="#000" strokeWidth="4" />

                {/* Face */}
                <path d="M120 100 L120 250 Q200 300 280 250 L280 100 Z" fill="#FFDFC4" stroke="#000" strokeWidth="4" />

                {/* Eyes (Wide Open / Shocked) */}
                <circle cx="160" cy="160" r="30" fill="#FFF" stroke="#000" strokeWidth="3" />
                <circle cx="240" cy="160" r="30" fill="#FFF" stroke="#000" strokeWidth="3" />
                <circle cx="160" cy="160" r="5" fill="#000" />
                <circle cx="240" cy="160" r="5" fill="#000" />

                {/* Glasses (Askew) */}
                <path d="M110 160 L50 150" stroke="#000" strokeWidth="4" /> {/* Left Leg */}
                <path d="M290 160 L350 150" stroke="#000" strokeWidth="4" /> {/* Right Leg */}
                <circle cx="160" cy="160" r="35" fill="none" stroke="#000" strokeWidth="4" opacity="0.5" />
                <circle cx="240" cy="160" r="35" fill="none" stroke="#000" strokeWidth="4" opacity="0.5" />
                <path d="M195 160 L205 160" stroke="#000" strokeWidth="4" /> {/* Bridge */}

                {/* Mouth (O Shape - Oops) */}
                <ellipse cx="200" cy="220" rx="15" ry="25" fill="#000" />

                {/* Body / Lab Coat */}
                <path d="M100 280 L80 400 L320 400 L300 280 Z" fill="#FFF" stroke="#000" strokeWidth="4" />
                <path d="M200 280 L200 400" stroke="#000" strokeWidth="2" /> {/* Coat split */}

                {/* Bow Tie (Crooked) */}
                <path d="M180 290 L220 290 L230 270 L170 270 Z" fill="#F43F5E" stroke="#000" strokeWidth="3" transform="rotate(-15 200 280)" />

                {/* Hand Holding Beaker */}
                <circle cx="340" cy="300" r="20" fill="#FFDFC4" stroke="#000" strokeWidth="3" />
                <path d="M330 280 L330 240 L350 240 L350 280" fill="none" stroke="#000" strokeWidth="3" />
                <path d="M320 230 L360 230 L350 280 L330 280 Z" fill="#BFDBFE" stroke="#000" strokeWidth="3" opacity="0.8" />

                {/* Explosion / Smoke from Beaker */}
                <motion.path
                    d="M340 230 Q320 200 340 180 Q360 160 380 180 Q400 200 380 220"
                    fill="#52525B" opacity="0.5"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Question Marks */}
                <text x="50" y="80" fontSize="60" fill="#000" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-20 50 80)">?</text>
                <text x="350" y="80" fontSize="60" fill="#000" fontFamily="sans-serif" fontWeight="bold" transform="rotate(20 350 80)">?</text>
            </motion.g>
        </svg>
    );
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] text-black font-sans flex flex-col items-center justify-center p-4 selection:bg-[#FACC15]">

            {/* Main Content Card */}
            <div className="max-w-4xl w-full flex flex-col items-center text-center">

                {/* 1. Header Typography */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-6xl sm:text-9xl font-black tracking-tighter text-[#0F172A] relative">
                        HAYDAAA!
                        {/* 404 Stamp */}
                        <span className="absolute -top-4 -right-8 sm:-right-16 bg-[#EF4444] text-white text-lg sm:text-2xl font-bold px-3 py-1 rounded-lg rotate-[15deg] shadow-lg">
                            404
                        </span>
                    </h1>
                </motion.div>

                {/* 2. Character Illustration */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-8 sm:mb-12 relative"
                >
                    <div className="absolute inset-0 bg-blue-200/50 rounded-full blur-[100px] -z-10" />
                    <ConfusedScientist />
                </motion.div>

                {/* 3. Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6 max-w-2xl"
                >
                    <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 leading-tight">
                        Laboratuvarda işler biraz karıştı...
                    </h2>

                    <p className="text-lg sm:text-xl text-zinc-600 font-medium leading-relaxed px-4">
                        Dayı naptın? Aradığın sayfa ya
                        <span className="text-blue-600 font-bold mx-1">havaya uçtu</span>
                        ya da hiç var olmadı.
                        <br className="hidden sm:block" />
                        Deney tüplerini toplayıp güvenli bölgeye dönelim.
                    </p>

                    {/* 4. Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full h-14 px-10 bg-[#0F172A] text-white hover:bg-zinc-800 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                                <Home className="w-5 h-5" />
                                Ana Sayfaya Dön
                            </Button>
                        </Link>

                        <Link href="/makale" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-14 px-10 bg-white text-zinc-900 border-2 border-zinc-200 hover:bg-zinc-50 text-lg font-bold rounded-2xl flex items-center justify-center gap-3">
                                <Search className="w-5 h-5" />
                                Makalelere Bak
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-12">
                        <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
                            Error Code: 404_PAGE_EXPLODED
                        </p>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
