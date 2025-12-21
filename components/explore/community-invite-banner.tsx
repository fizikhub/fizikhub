"use client";

import Link from "next/link";
import { PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityInviteBanner() {
    return (
        <div className="relative overflow-hidden mb-8 md:mb-12">
            {/* Background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 rounded-2xl" />

            <div className="relative border-2 border-dashed border-emerald-500/30 rounded-2xl p-6 md:p-8 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Text Content */}
                    <div className="space-y-3 max-w-xl">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Topluluk Blogu
                            </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                            Senin de anlatacak bir hikayen var mı?
                        </h2>

                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            Burası senin alanın. Öğrendiklerini, merak ettiklerini veya keşfettiklerini
                            topluluğumuzla paylaş. Her ses önemli, her yazı değerli.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="flex-shrink-0">
                        <Link href="/makale/yeni">
                            <Button
                                size="lg"
                                className="w-full md:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                            >
                                <PenLine className="w-4 h-4" />
                                Yazını Paylaş
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
