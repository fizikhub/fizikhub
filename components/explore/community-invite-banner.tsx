"use client";

import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";

export function CommunityInviteBanner() {
    return (
        <Link
            href="/yazar/rehber"
            className="group relative block overflow-hidden rounded-[8px] border-2 border-black bg-[#101014] min-h-[112px] sm:min-h-[126px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300"
        >

            {/* HOLOGRAPHIC BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_95%,rgba(134,239,172,0.78),transparent_38%),radial-gradient(circle_at_78%_10%,rgba(35,169,250,0.58),transparent_34%)] opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

            {/* GRID & NOISE TEXTURE */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] opacity-30 mix-blend-overlay" />
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-4 min-h-[112px] sm:min-h-[126px]">

                {/* LEFT: ICON + TEXT */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-[8px] bg-black/45 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <Microscope className="w-6 h-6 text-[#86efac] drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                    </div>

                    <div className="flex min-w-0 flex-col">
                        <h3 className="text-[18px] sm:text-2xl font-black uppercase text-white drop-shadow-lg leading-tight mb-1">
                            Araştırmanı <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] to-cyan-300">Paylaş</span>
                        </h3>
                        <p className="text-[12px] sm:text-sm font-semibold text-white/80 max-w-[320px] leading-snug">
                            Bilimsel topluluğa katıl. Analizlerini yayınla, tartış ve keşfet.
                        </p>
                    </div>
                </div>

                <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 bg-[#86efac] rounded-full flex items-center justify-center text-black border-2 border-black relative group-hover:bg-white transition-colors shadow-[0_0_18px_rgba(134,239,172,0.52)]">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px] group-hover:translate-x-0.5 transition-transform" />
                </div>

            </div>
        </Link>
    );
}
