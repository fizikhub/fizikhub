"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, TriangleAlert, Atom, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Infinite Marquee Component
const Marquee = ({ text, direction = "left", className }: { text: string; direction?: "left" | "right"; className?: string }) => {
    return (
        <div className={`flex overflow-hidden whitespace-nowrap py-3 ${className}`}>
            <motion.div
                className="flex gap-4 text-2xl sm:text-4xl font-black uppercase tracking-tighter"
                animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className="mx-4">{text}</span>
                ))}
            </motion.div>
        </div>
    );
};

// Floating Formula Component
const FloatingFormula = ({ text, x, y, delay, rotate }: any) => (
    <motion.div
        className="absolute text-black/10 font-serif font-bold pointer-events-none select-none z-0"
        initial={{ x, y, opacity: 0 }}
        animate={{
            y: [y, y - 20, y],
            rotate: [rotate - 5, rotate + 5, rotate - 5],
            opacity: 1
        }}
        transition={{ duration: 5, repeat: Infinity, delay: delay, ease: "easeInOut" }}
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
    >
        {text}
    </motion.div>
);

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FACC15] text-black overflow-hidden relative font-sans selection:bg-black selection:text-[#FACC15] flex flex-col">

            {/* 1. Scientific Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                {/* Horizontal Lines */}
                <div style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px)", backgroundSize: "100% 40px" }} className="w-full h-full absolute inset-0" />
                {/* Vertical Lines */}
                <div style={{ backgroundImage: "linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 100%" }} className="w-full h-full absolute inset-0" />
            </div>

            {/* Floating Physics Formulas */}
            <FloatingFormula text="E = mc²" x="10%" y={100} delay={0} rotate={-10} />
            <FloatingFormula text="F = ma" x="80%" y={150} delay={1} rotate={10} />
            <FloatingFormula text="ΔS ≥ 0" x="20%" y={500} delay={2} rotate={-5} />
            <FloatingFormula text="iℏ∂ψ/∂t = Ĥψ" x="70%" y={600} delay={3} rotate={5} />

            {/* 2. Marquee Barriers */}
            <div className="relative z-10 w-full bg-black text-[#FACC15] -rotate-1 shadow-xl border-y-4 border-white mt-16 sm:mt-0">
                <Marquee text="DENEY PATLADI // 404 ERROR // FİZİK KURALLARINA AYKIRI //" direction="left" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4 w-full max-w-7xl mx-auto">

                {/* 3. Main Warning Box */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white border-[4px] sm:border-[5px] border-black p-6 sm:p-12 w-full max-w-3xl shadow-[8px_8px_0px_0px_#000] sm:shadow-[15px_15px_0px_0px_#000] relative group transition-all duration-300 mx-4"
                >
                    {/* Decorative Lab Elements */}
                    <div className="absolute -top-6 -right-6 bg-black text-[#FACC15] p-3 border-4 border-white shadow-lg animate-bounce hidden sm:block">
                        <Atom size={40} strokeWidth={3} />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8 relative">
                        {/* Huge 404 */}
                        <div className="relative inline-block">
                            <h1 className="text-[6rem] sm:text-[10rem] md:text-[12rem] font-black leading-[0.8] tracking-tighter text-black relative select-none z-10">
                                404
                            </h1>
                            {/* Glitch Effect Behind */}
                            <h1 className="text-[6rem] sm:text-[10rem] md:text-[12rem] font-black leading-[0.8] tracking-tighter text-[#F43F5E] absolute top-1 left-1 select-none -z-10 opacity-70 animate-pulse">
                                404
                            </h1>
                        </div>

                        {/* Slang Badge */}
                        <div className="absolute top-0 right-[-10px] sm:right-10 rotate-[15deg] bg-[#F43F5E] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] z-20">
                            <span className="text-lg sm:text-3xl font-black uppercase flex items-center gap-2">
                                <Zap className="fill-white w-4 h-4 sm:w-6 sm:h-6" />
                                PATLADIK
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl sm:text-4xl font-black uppercase bg-black text-white inline-block px-4 py-2 transform -skew-x-6 border-2 border-transparent">
                            HOOPP HEMŞERİM!
                        </h2>
                    </div>

                    {/* Copy */}
                    <div className="text-lg sm:text-2xl font-bold text-black border-l-[6px] border-black pl-4 sm:pl-6 mb-8 text-left leading-normal">
                        <p className="mb-2">Dayı naptın ya? Kuantum tünelleme yapayım derken boşluğa düştün.</p>
                        <p className="text-base sm:text-lg text-zinc-600 font-medium">
                            Link kırık olabilir, yanlış yazmış olabilirsin ya da Heisenberg Belirsizlik İlkesi yüzünden sayfa hem var hem yok.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/" className="w-full">
                            <Button className="w-full h-14 sm:h-16 bg-[#F43F5E] text-white hover:bg-[#E11D48] text-lg sm:text-xl font-black border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase flex items-center justify-center gap-2 group">
                                <Home className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
                                ANA SAYFAYA TÜYLE
                            </Button>
                        </Link>

                        <Link href="/forum" className="w-full">
                            <Button className="w-full h-14 sm:h-16 bg-black text-white hover:bg-zinc-800 text-lg sm:text-xl font-black border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#94A3B8] hover:shadow-[2px_2px_0px_0px_#94A3B8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase flex items-center justify-center gap-2">
                                <MoveLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
                                GERİ BAS
                            </Button>
                        </Link>
                    </div>

                </motion.div>
            </div>

            {/* 4. Bottom Marquee Chaos */}
            <div className="relative z-10 w-full bg-[#F43F5E] text-white rotate-1 shadow-xl border-y-4 border-black mb-8 sm:mb-0">
                <Marquee text="SAYFA BULUNAMADI // HOUSTON PROBLEM VAR // DAYI YANLIŞ GELDİN //" direction="right" />
            </div>

        </div>
    );
}
