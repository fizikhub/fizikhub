"use client";

import Link from "next/link";
import { PenTool, Star, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export function GoldenTicketCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="w-full max-w-4xl mx-auto my-8 md:my-16"
        >
            <Link
                href="/yazar"
                className="group block relative overflow-visible"
            >
                {/* Golden Ticket Container */}
                <div className="relative bg-[#FFC800] rounded-[1rem] border-[3px] md:border-[4px] border-black shadow-[8px_8px_0px_0px_#000] md:shadow-[12px_12px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 p-6 md:p-12">

                    {/* Decorative Perforations - Responsive Positioning */}
                    {/* Desktop: Left/Right */}
                    <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#27272a] rounded-full border-[4px] border-black" />
                    <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#27272a] rounded-full border-[4px] border-black" />

                    {/* Mobile: Top/Bottom/Sides small */}
                    <div className="md:hidden absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />
                    <div className="md:hidden absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#27272a] rounded-full border-[3px] border-black" />


                    {/* Ticket Stub Line (Mobile Only - Horizontal dashed line) */}
                    <div className="md:hidden absolute left-4 right-4 top-[65%] border-t-2 border-dashed border-black/30" />
                    {/* Ticket Stub Line (Desktop Only - Vertical dashed line) */}
                    <div className="hidden md:block absolute top-6 bottom-6 right-[30%] border-l-4 border-dashed border-black/20" />


                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left z-10 w-full relative">
                        <div className="inline-flex items-center gap-2 bg-black text-[#FFC800] px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black uppercase tracking-widest mb-3 md:mb-4 text-[10px] md:text-xs border-2 border-black">
                            <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-[#FFC800]" />
                            Yazar Bileti
                        </div>
                        <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-black leading-[0.9] mb-3 md:mb-4 uppercase drop-shadow-sm">
                            Altın Bilet.
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-black font-bold leading-relaxed max-w-lg mx-auto md:mx-0">
                            FizikHub bir topluluk dergisidir. Senin de anlatacak bilimsel bir hikayen varsa, sayfalarımız sana açık.
                        </p>
                    </div>

                    {/* Action Visual Section */}
                    <div className="flex-shrink-0 relative mt-4 md:mt-0 pt-4 md:pt-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full flex items-center justify-center border-[3px] md:border-[4px] border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group-hover:rotate-12 transition-transform duration-300">
                            <PenTool className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white text-black font-black text-[10px] md:text-xs uppercase px-3 py-1 border-2 border-black -rotate-12 shadow-[2px_2px_0px_0px_#000]">
                            Başvur
                        </div>

                        {/* Mobile "Ticket Number" */}
                        <div className="md:hidden absolute -left-16 bottom-10 -rotate-90 text-[10px] font-mono font-bold text-black/40 tracking-widest">
                            NO: 424242
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
