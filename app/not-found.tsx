"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Rocket, Atom, MoveLeft } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

// --- Components ---

const StarField = () => {
    // Generate random stars on client-side only to avoid hydration mismatch
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full opacity-80"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

const Astronaut = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
    // Parallax effect for astronaut
    const x = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
    const y = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);
    const rotate = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);

    return (
        <motion.div
            style={{ x, y, rotate }}
            className="w-64 h-64 sm:w-96 sm:h-96 relative z-10"
            animate={{
                y: [0, -20, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {/* Backpack */}
                <path d="M40 70H160V140C160 162.091 142.091 180 120 180H80C57.9086 180 40 162.091 40 140V70Z" fill="#E4E4E5" stroke="black" strokeWidth="4" />
                {/* Helmet Outline */}
                <circle cx="100" cy="80" r="50" fill="white" stroke="black" strokeWidth="4" />
                {/* Visor */}
                <path d="M70 80C70 63.4315 83.4315 50 100 50C116.569 50 130 63.4315 130 80C130 96.5685 116.569 110 100 110C83.4315 110 70 96.5685 70 80Z" fill="#09090B" stroke="black" strokeWidth="4" />
                {/* Visor Reflection */}
                <path d="M110 65C110 65 120 70 120 80" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
                {/* Body Details */}
                <rect x="80" y="140" width="40" height="20" rx="4" fill="#FACC15" stroke="black" strokeWidth="3" />
                <path d="M60 140L60 180" stroke="black" strokeWidth="4" strokeLinecap="round" />
                <path d="M140 140L140 180" stroke="black" strokeWidth="4" strokeLinecap="round" />
                {/* Floating Wire (Tether) */}
                <path d="M100 180C100 180 100 220 140 240" stroke="#52525B" strokeWidth="3" strokeDasharray="8 8" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        </motion.div>
    );
};

// --- Main Page ---

export default function NotFound() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    return (
        <div
            className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-[#FACC15] selection:text-black"
            onMouseMove={handleMouseMove}
        >
            <StarField />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Decorative Planets */}
            <motion.div
                className="absolute top-20 right-20 text-[#06B6D4] opacity-20 hidden sm:block pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            >
                <Atom size={200} strokeWidth={0.5} />
            </motion.div>

            <motion.div
                className="absolute bottom-20 left-10 text-[#EC4899] opacity-20 hidden sm:block pointer-events-none"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <Rocket size={120} strokeWidth={1} />
            </motion.div>


            <div className="container px-4 relative z-10 flex flex-col items-center text-center">

                {/* 1. Glitchy 404 Header */}
                <div className="relative mb-8">
                    <h1 className="text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 relative select-none">
                        4
                        <span className="inline-block animate-[spin_10s_linear_infinite] mx-4">0</span>
                        4
                    </h1>

                    {/* Glitch Shadows (Decoration) */}
                    <div className="absolute inset-0 text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter text-[#06B6D4] opacity-50 blur-[2px] translate-x-1 translate-y-1 -z-10 animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter text-[#EC4899] opacity-50 blur-[2px] -translate-x-1 -translate-y-1 -z-20">
                        404
                    </div>
                </div>

                {/* 2. Interactive Astronaut */}
                <div className="-mt-32 mb-12">
                    <Astronaut mouseX={mouseX} mouseY={mouseY} />
                </div>

                {/* 3. Text Content (Neo-Brutalist Box) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#18181b] border-2 border-white p-8 max-w-2xl relative shadow-[8px_8px_0px_0px_#FACC15] group"
                >
                    {/* Decorative Corner Screws */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-zinc-500 rounded-full border border-black" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-zinc-500 rounded-full border border-black" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 bg-zinc-500 rounded-full border border-black" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-zinc-500 rounded-full border border-black" />

                    <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mb-4 tracking-tight">
                        HOUSTON, <span className="text-[#FACC15]">BİR SORUNUMUZ VAR!</span>
                    </h2>

                    <p className="text-zinc-400 font-mono text-base sm:text-lg mb-8 leading-relaxed">
                        Aradığın sayfa olay ufkunda kaybolmuş olabilir veya bir solucan deliğinden geçerek paralel evrene ışınlanmış olabilir.
                        <br /><br />
                        <span className="text-[#06B6D4]">Durum Raporu:</span> Hedef koordinatlar bulunamadı (Error 404).
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button className="w-full sm:w-auto h-14 px-8 bg-white text-black hover:bg-zinc-200 border-2 border-black rounded-none font-black text-lg shadow-[4px_4px_0px_0px_#06B6D4] hover:shadow-[2px_2px_0px_0px_#06B6D4] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wider gap-2">
                                <Home className="w-5 h-5" />
                                Ana Üsse Dön
                            </Button>
                        </Link>

                        <Link href="/forum">
                            <Button className="w-full sm:w-auto h-14 px-8 bg-[#18181b] text-white hover:bg-zinc-800 border-2 border-white rounded-none font-bold text-lg shadow-[4px_4px_0px_0px_#EC4899] hover:shadow-[2px_2px_0px_0px_#EC4899] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wider gap-2">
                                <MoveLeft className="w-5 h-5" />
                                Geri Git
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Footer Physics Joke */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-zinc-600 font-mono text-xs uppercase tracking-[0.2em] animate-pulse"
                >
                    "Enerji varken yok olmaz, sadece 404 olur." - Anonim Fizikçi
                </motion.p>

            </div>
        </div>
    );
}
