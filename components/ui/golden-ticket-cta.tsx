"use client";

import Link from "next/link";
import { PenTool, Star, Ticket, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function GoldenTicketCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            whileHover={{ rotate: 0, scale: 1.01 }}
            className="w-full max-w-4xl mx-auto my-6 md:my-12 px-4 md:px-0"
        >
            <Link
                href="/yazar"
                className="group block relative"
            >
                {/* Golden Ticket Container */}
                <div className="relative bg-[#FFC800] rounded-xl border-[3px] border-black shadow-[6px_6px_0px_0px_#000] md:shadow-[10px_10px_0px_0px_#000] flex flex-col md:flex-row shadow-sm overflow-hidden">

                    {/* PAPER TEXTURE OVERLAY */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Left/Top Section (Main Content) */}
                    <div className="flex-1 p-5 md:p-8 flex flex-col justify-center relative z-10">
                        {/* Ticket Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="inline-flex items-center gap-1.5 bg-black/90 text-[#FFC800] px-2.5 py-1 rounded-md font-black uppercase tracking-widest text-[10px] md:text-[11px] border border-black/10">
                                <Star className="w-3 h-3 fill-[#FFC800]" />
                                Yazar Bileti
                            </div>
                            <span className="md:hidden font-mono font-bold text-[10px] text-black/40 tracking-widest">NO: 42</span>
                        </div>

                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-black leading-[0.9] mb-3 uppercase tracking-tight drop-shadow-sm">
                            Altın Bilet.
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-black/90 font-bold leading-snug max-w-lg">
                            FizikHub bir topluluk dergisidir. Senin de anlatacak bilimsel bir hikayen varsa, sayfalarımız sana açık.
                        </p>
                    </div>

                    {/* Divider (Dashed Line) */}
                    {/* Mobile: Horizontal */}
                    <div className="md:hidden relative w-full h-0 border-t-2 border-dashed border-black/20 my-0">
                        <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />
                        <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />
                    </div>

                    {/* Desktop: Vertical */}
                    <div className="hidden md:block relative w-0 border-l-[3px] border-dashed border-black/20 my-4">
                        <div className="absolute -left-3 -top-7 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />
                        <div className="absolute -left-3 -bottom-7 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />
                    </div>


                    {/* Right/Bottom Section (Action Stub) */}
                    <div className="bg-[#FFD633] md:bg-transparent p-4 md:p-8 flex items-center justify-between md:justify-center md:flex-col gap-4 relative md:w-48">
                        {/* Mobile: Stub content left */}
                        <div className="md:hidden flex flex-col">
                            <span className="font-black text-xs uppercase text-black/60 mb-0.5">Sınırlı Kontenjan</span>
                            <span className="font-black text-sm text-black flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Hemen Katıl
                            </span>
                        </div>

                        {/* Button/Icon */}
                        <div className="relative group-hover:scale-110 transition-transform duration-300 ease-spring">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center border-[3px] border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
                                <PenTool className="w-5 h-5 md:w-7 md:h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 md:-bottom-3 bg-white text-black font-black text-[10px] uppercase px-2 py-0.5 border-2 border-black -rotate-12 shadow-[2px_2px_0px_0px_#000] whitespace-nowrap">
                                Başvur
                            </div>
                        </div>

                        {/* Desktop: Stub text */}
                        <div className="hidden md:flex flex-col items-center text-center mt-4 space-y-1">
                            <span className="font-mono font-bold text-xs text-black/40 tracking-widest -rotate-90 absolute right-4 top-1/2 -translate-y-1/2 origin-center w-32">NO: 849201</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
