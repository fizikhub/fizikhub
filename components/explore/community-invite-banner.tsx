"use client";

import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunityInviteBanner() {
    return (
        <div className="group relative overflow-hidden rounded-2xl border-[3px] border-black bg-black min-h-[120px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300">

            {/* HOLOGRAPHIC BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#86efac_10%,#3b82f6_50%,#000_90%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* GRID & NOISE TEXTURE */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 mix-blend-overlay bg-repeat" />
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 p-5 flex items-center justify-between gap-4 h-full">

                {/* LEFT: ICON + TEXT */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Microscope className="w-6 h-6 text-[#86efac] drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide drop-shadow-lg leading-none mb-1.5">
                            Araştırmanı <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] to-cyan-300">Paylaş</span>
                        </h3>
                        <p className="text-[11px] sm:text-xs font-medium text-white/80 max-w-[280px] leading-tight">
                            Bilimsel topluluğa katıl. Analizlerini yayınla, tartış ve keşfet.
                        </p>
                    </div>
                </div>

                {/* RIGHT: BUTTON */}
                <Link
                    href="/yazar/rehber"
                    className="shrink-0 hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#86efac] hover:bg-white text-black font-black uppercase text-xs tracking-wider rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    <span>Katıl</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </Link>

                {/* MOBILE BUTTON */}
                <Link
                    href="/yazar/rehber"
                    className="shrink-0 sm:hidden w-10 h-10 bg-[#86efac] rounded-full flex items-center justify-center text-black border-2 border-transparent relative hover:scale-110 transition-transform shadow-[0_0_15px_rgba(134,239,172,0.6)]"
                >
                    <ArrowRight className="w-5 h-5 stroke-[3px]" />
                </Link>

            </div>
        </div>
    );
}
