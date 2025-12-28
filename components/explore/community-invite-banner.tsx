"use client";

import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

export function CommunityInviteBanner() {
    return (
        <div className="group bg-card border-2 border-border overflow-hidden hover:border-emerald-500/50 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px]">
            <div className="px-4 py-4 sm:px-5 sm:py-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                        <PenLine className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-black text-emerald-500 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/5">
                        KATKI_MODÜLÜ
                    </span>
                </div>

                {/* Content */}
                <h3 className="font-black text-base sm:text-lg text-foreground mb-1 uppercase tracking-tight">
                    Araştırmalarını Paylaş
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-mono">
                    &gt; Sadece veriyi tüketme. Analiz et, hipotez kur ve sonuçlarını yayınla.
                </p>

                {/* Action */}
                <Link href="/yazar/yeni" className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-emerald-500 transition-colors duration-200 text-xs font-black uppercase tracking-wider group/btn">
                    <span>Blog Oluştur</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
