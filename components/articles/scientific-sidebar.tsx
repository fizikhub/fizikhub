"use client";

import { Share2, Bookmark, AlertCircle, Quote, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScientificSidebarProps {
    article: any;
    className?: string;
}

export function ScientificSidebar({ article, className }: ScientificSidebarProps) {
    return (
        <aside className={cn("hidden xl:block w-72 shrink-0 space-y-10", className)}>
            {/* Quick Actions Card */}
            <div className="p-6 bg-foreground/[0.03] border border-foreground/10 rounded-lg space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block">Actions</span>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center p-3 bg-background border border-foreground/10 rounded-md hover:border-foreground/30 transition-all group">
                        <Bookmark className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold uppercase">Save</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 bg-background border border-foreground/10 rounded-md hover:border-foreground/30 transition-all group">
                        <Share2 className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold uppercase">Share</span>
                    </button>
                </div>
                <button className="w-full py-3 bg-foreground text-background font-bold text-[10px] uppercase tracking-widest rounded-md hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                    <Quote className="w-3 h-3" /> Cite This Article
                </button>
            </div>

            {/* Scientific Keywords */}
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Index Keywords
                </span>
                <div className="flex flex-wrap gap-2">
                    {["Fizik", article.category || "Bilim", "Teorik", "Gözlem"].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-foreground/[0.05] border border-foreground/5 rounded text-[10px] font-medium hover:bg-foreground/[0.08] cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Similar Research Section */}
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" /> Related Research
                </span>
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <h4 className="text-sm font-display font-semibold leading-snug group-hover:underline decoration-foreground/30 underline-offset-4">
                                Kuantum Alan Teorisinde Yeni Yaklaşımlar ve Gözlemsel Sonuçlar
                            </h4>
                            <p className="text-[10px] font-mono text-foreground/40 mt-2">published 12.01.2026</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legal / DOI Disclaimer */}
            <div className="pt-8 border-t border-foreground/5">
                <div className="flex gap-3 text-red-500/60 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[9px] font-medium leading-relaxed italic">
                        All content is reviewed by FizikHub Editorial Board. Citations should follow the Harvard Research Style.
                    </p>
                </div>
            </div>
        </aside>
    );
}
