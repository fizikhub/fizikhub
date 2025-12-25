"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

export function CommunityInviteBanner() {
    return (
        <div className="relative mb-8 md:mb-12 group">
            {/* Brutalist Hard Shadow Decoration */}
            <div className="absolute top-2 left-2 w-full h-full bg-black dark:bg-white border-2 border-black dark:border-white z-0" />

            <div className="relative z-10 bg-background border-2 border-black dark:border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:-translate-x-[2px] hover:-translate-y-[2px] transition-transform duration-200">

                {/* Decorative Corner Squares */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-black dark:bg-white" />
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />

                <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-6">

                    {/* Left Content */}
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 border border-black dark:border-white px-2 py-0.5 bg-amber-100/80 dark:bg-amber-900/30">
                            <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                                KATKI_MODÜLÜ
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-[0.9]">
                                ARAŞTIRMALARINI <span className="bg-emerald-500 text-white px-1">PAYLAŞ</span>
                            </h2>
                            <p className="text-muted-foreground font-mono text-[10px] md:text-xs leading-relaxed max-w-lg hidden sm:block">
                                {`> Sadece veriyi tüketme. Analiz et, hipotez kur ve sonuçlarını yayınla.`}
                            </p>
                        </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Link href="/makale/yeni" className="block w-full">
                            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-wider px-6 py-3 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-colors duration-200 group-hover:shadow-none text-xs md:text-sm">
                                <span>BLOG OLUŞTUR</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
