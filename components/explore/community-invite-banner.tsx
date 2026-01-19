"use client";

import Link from "next/link";
import { ArrowRight, Microscope, Atom, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunityInviteBanner() {
    return (
        <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card/50 hover:bg-card/80 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">

            {/* Background Gradient Effect - Soft & Premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">

                {/* Visual Icon Section */}
                <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                        <Microscope className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-500/30 animate-pulse">
                            <Atom className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                            BİLİM ÜRET
                        </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                        Araştırmalarını Paylaş
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                        Sadece veri tüketme. <span className="text-foreground font-bold">Analiz et</span>, <span className="text-foreground font-bold">hipotez kur</span> ve sonuçlarını toplulukla paylaş.
                    </p>
                </div>

                {/* Action Button */}
                <div className="shrink-0 w-full md:w-auto">
                    <Link
                        href="/yazar/yeni"
                        className={cn(
                            "flex items-center justify-center gap-2 w-full md:w-auto px-6 py-4 rounded-xl transition-all duration-300",
                            "bg-primary text-primary-foreground font-black uppercase tracking-wide text-sm",
                            "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                            "border-2 border-transparent hover:border-current"
                        )}
                    >
                        <span>Başla</span>
                        <ArrowRight className="w-4 h-4 stroke-[3px]" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
