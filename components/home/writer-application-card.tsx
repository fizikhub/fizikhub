"use client";

import { ArrowRight, PenLine } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function WriterApplicationCard() {
    return (
        <Link href="/basvuru/yazar" className="block w-full group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border-2 border-foreground bg-background p-6 md:p-8 transition-all duration-300">

                {/* Hover Fill Effect */}
                <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                    <div className="space-y-4 max-w-lg">
                        <div className="w-12 h-12 rounded-full border-2 border-foreground group-hover:border-background flex items-center justify-center transition-colors duration-500 bg-background group-hover:bg-foreground">
                            <PenLine className="w-6 h-6 text-foreground group-hover:text-background transition-colors duration-500" />
                        </div>

                        <div>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground group-hover:text-background transition-colors duration-500">
                                YAZAR KADROSU
                            </h3>
                            <p className="text-muted-foreground group-hover:text-background/80 font-medium text-base md:text-lg mt-2 transition-colors duration-500 leading-relaxed">
                                Bilim ve teknoloji tutkunu musun? Kelimelerin gücüne inanıyor musun? <br className="hidden lg:block" />
                                Aramıza katıl, binlerce kişiye sesini duyur.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-500">
                        <span className="text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-background transition-colors duration-500 hidden sm:block">
                            Başvur
                        </span>
                        <div className="w-12 h-12 rounded-full bg-foreground group-hover:bg-background flex items-center justify-center transition-colors duration-500">
                            <ArrowRight className="w-6 h-6 text-background group-hover:text-foreground transition-colors duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
