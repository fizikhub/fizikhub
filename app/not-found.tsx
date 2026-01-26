"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, TriangleAlert, Frown, Ban } from "lucide-react";
import { motion } from "framer-motion";

// Infinite Marquee Component
const Marquee = ({ text, direction = "left", className }: { text: string; direction?: "left" | "right"; className?: string }) => {
    return (
        <div className={`flex overflow-hidden whitespace-nowrap py-3 ${className}`}>
            <motion.div
                className="flex gap-4 text-4xl font-black uppercase tracking-tighter"
                animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="mx-4">{text}</span>
                ))}
            </motion.div>
        </div>
    );
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FACC15] text-black overflow-hidden relative font-sans selection:bg-black selection:text-[#FACC15] flex flex-col">

            {/* 1. Background Chaos */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "30px 30px" }} className="w-full h-full" />
            </div>

            {/* 2. Marquee Barriers */}
            <div className="relative z-10 w-full bg-black text-[#FACC15] rotate-[-2deg] scale-110 shadow-xl border-y-4 border-white mt-10 sm:mt-0">
                <Marquee text="HATALI YOL // GERİ DÖN // BURASI ÇIKMAZ SOKAK //" direction="left" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4">

                {/* 3. Main Warning Box */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border-[5px] border-black p-8 sm:p-12 max-w-2xl w-full shadow-[15px_15px_0px_0px_#000] relative group hover:shadow-[20px_20px_0px_0px_#000] transition-shadow duration-300"
                >
                    {/* Floating "Error" Icons */}
                    <motion.div
                        className="absolute -top-12 -left-8 text-black"
                        animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <TriangleAlert size={80} fill="#FACC15" strokeWidth={2.5} />
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-10 -right-8 text-black sm:block hidden"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Ban size={100} fill="#F43F5E" strokeWidth={2.5} />
                    </motion.div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            className="text-[8rem] sm:text-[12rem] font-black leading-[0.8] tracking-tighter text-black relative select-none"
                            animate={{
                                x: [2, -2, 4, -4, 2],
                                color: ["#000", "#333", "#000"]
                            }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            404
                            <span className="text-[2rem] sm:text-[3rem] absolute top-0 right-10 rotate-[20deg] bg-[#F43F5E] text-white px-2 py-1 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] animate-bounce">
                                PATLADIK
                            </span>
                        </motion.h1>
                        <h2 className="text-3xl sm:text-5xl font-black uppercase mt-4 bg-black text-white inline-block px-4 py-1 transform -skew-x-6">
                            HOOPP HEMŞERİM!
                        </h2>
                    </div>

                    {/* Copy */}
                    <p className="text-xl sm:text-2xl font-bold text-black border-l-4 border-black pl-4 mb-8 leading-tight">
                        Dayı naptın ya? Aradığın sayfa buralarda yok.
                        <br />
                        <span className="text-zinc-500 font-medium text-lg mt-2 block">
                            Link kırık olabilir, yanlış yazmış olabilirsin, ya da adminler sayfayı uçurmuş olabilir. Burası tekin değil, hemen kaç.
                        </span>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/" className="w-full">
                            <Button className="w-full h-16 bg-[#F43F5E] text-white hover:bg-[#E11D48] text-xl font-black border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase flex items-center justify-center gap-3 group">
                                <Home className="w-6 h-6 group-hover:animate-pulse" />
                                ANA SAYFAYA TÜYLE
                            </Button>
                        </Link>

                        <Link href="/forum" className="w-full">
                            <Button className="w-full h-16 bg-black text-white hover:bg-zinc-800 text-xl font-black border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#94A3B8] hover:shadow-[2px_2px_0px_0px_#94A3B8] hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase flex items-center justify-center gap-3">
                                <MoveLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                                GERİ BAS
                            </Button>
                        </Link>
                    </div>

                </motion.div>
            </div>

            {/* 4. Bottom Marquee Chaos */}
            <div className="relative z-10 w-full bg-[#F43F5E] text-white rotate-[1deg] scale-110 shadow-xl border-y-4 border-black mb-10 sm:mb-0">
                <Marquee text="SAYFA BULUNAMADI // ERROR 404 // DAYI YANLIŞ GELDİN //" direction="right" />
            </div>

            {/* Random Floating Emoji */}
            <motion.div
                className="absolute top-1/4 right-[10%] text-6xl pointer-events-none hidden sm:block"
                animate={{ y: [0, -50, 0], rotate: [0, 20, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                🤯
            </motion.div>
            <motion.div
                className="absolute bottom-1/4 left-[5%] text-6xl pointer-events-none hidden sm:block"
                animate={{ y: [0, -50, 0], rotate: [0, -20, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
                💣
            </motion.div>

        </div>
    );
}
