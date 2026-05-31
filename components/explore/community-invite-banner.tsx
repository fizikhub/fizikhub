"use client";

import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";

export function CommunityInviteBanner() {
    return (
        <Link
            href="/yazar/rehber"
            aria-label="Araştırmanı paylaş ve FizikHub yazar rehberine git"
            className="group block relative overflow-hidden rounded-[8px] border-2 sm:border-[3px] border-black bg-black min-h-[108px] sm:min-h-[120px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >

            {/* HOLOGRAPHIC BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#86efac_10%,#3b82f6_50%,#000_90%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* GRID & NOISE TEXTURE */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:22px_22px]" />
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 h-full min-h-[108px] sm:min-h-[120px]">

                {/* LEFT: ICON + TEXT */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="shrink-0 w-12 h-12 rounded-[8px] bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <Microscope className="w-6 h-6 text-[#86efac] drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-normal drop-shadow-lg leading-[1.05] mb-1.5">
                            Araştırmanı <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] to-cyan-300">Paylaş</span>
                        </h3>
                        <p className="text-[12px] sm:text-sm font-semibold text-white/80 max-w-[290px] leading-snug">
                            Bilimsel topluluğa katıl. Analizlerini yayınla, tartış ve keşfet.
                        </p>
                    </div>
                </div>

                {/* RIGHT: BUTTON */}
                <span
                    className="shrink-0 hidden sm:flex min-h-11 items-center gap-2 px-5 py-2.5 bg-[#86efac] group-hover:bg-white text-black font-black uppercase text-xs tracking-wider rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all"
                >
                    <span>Katıl</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </span>

                {/* MOBILE BUTTON */}
                <span
                    className="shrink-0 sm:hidden w-11 h-11 bg-[#86efac] rounded-full flex items-center justify-center text-black border-2 border-transparent relative group-active:scale-95 transition-transform shadow-[0_0_15px_rgba(134,239,172,0.6)]"
                >
                    <ArrowRight className="w-5 h-5 stroke-[3px]" />
                </span>

            </div>
        </Link>
    );
}
