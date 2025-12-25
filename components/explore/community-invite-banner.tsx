"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

export function CommunityInviteBanner() {
    return (
        <div className="relative mb-8 md:mb-12 group">
            {/* Brutalist Hard Shadow Decoration */}
            <div className="absolute top-2 left-2 w-full h-full bg-black dark:bg-white border-2 border-black dark:border-white z-0" />

            <div className="relative z-10 bg-background border-2 border-black dark:border-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-transform duration-200">

                {/* Decorative Corner Squares */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-black dark:bg-white" />

                {/* Left Content */}
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 border border-black dark:border-white px-2 py-1 bg-amber-100/80 dark:bg-amber-900/30">
                        <div className="w-2 h-2 bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                            KATKI_MODÜLÜ
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-[0.9]">
                            ARAŞTIRMALARINI <span className="bg-emerald-500 text-white px-1">PAYLAŞ</span>
                        </h2>
                        <p className="text-muted-foreground font-mono text-xs md:text-sm leading-relaxed max-w-lg">
                            {`> Sadece veriyi tüketme. Analiz et, hipotez kur ve sonuçlarını yayınla.`}
                            <br />
                            {`> Bilimsel tartışmalara yön ver.`}
                        </p>
                    </div>
                </div>

                {/* Right Action */}
                <div className="flex-shrink-0 w-full md:w-auto">
                    <Link href="/makale/yeni" className="block w-full">
                        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-wider px-8 py-4 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-colors duration-200 group-hover:shadow-none">
                            <span>BLOG OLUŞTUR</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
