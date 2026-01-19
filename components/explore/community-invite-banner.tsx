"use client";

import Link from "next/link";
import { ArrowRight, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunityInviteBanner() {
    return (
        <div className="group relative overflow-hidden rounded-xl border-2 border-black bg-[#dcfce7] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">

            <div className="p-4 flex items-center gap-4">

                {/* Icon - Compact & Integrated */}
                <div className="shrink-0">
                    <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Microscope className="w-6 h-6 text-black" />
                    </div>
                </div>

                {/* Content - Direct & Punchy */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black uppercase tracking-tight text-black leading-none mb-1">
                        Araştırmalarını Paylaş
                    </h3>
                    <p className="text-xs font-bold text-black/80 leading-tight">
                        Sadece veri tüketme. Analiz et, hipotez kur ve sonuçlarını paylaş.
                    </p>
                </div>

                {/* Action - Compact Button */}
                <div className="shrink-0 hidden sm:block">
                    <Link
                        href="/yazar/yeni"
                        className={cn(
                            "flex items-center justify-center gap-2 h-10 px-5 rounded-lg transition-all",
                            "bg-black text-[#dcfce7] font-black uppercase tracking-wide text-xs",
                            "hover:bg-primary hover:text-black border-2 border-transparent hover:border-black"
                        )}
                    >
                        <span>Başla</span>
                        <ArrowRight className="w-3 h-3 stroke-[3px]" />
                    </Link>
                </div>

                {/* Mobile Arrow only */}
                <div className="shrink-0 sm:hidden">
                    <Link
                        href="/yazar/yeni"
                        className="w-10 h-10 bg-black text-[#dcfce7] rounded-lg flex items-center justify-center border-2 border-transparent hover:bg-primary hover:text-black hover:border-black transition-colors"
                    >
                        <ArrowRight className="w-5 h-5 stroke-[3px]" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
