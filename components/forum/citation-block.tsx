"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

interface CitationBlockProps {
    title: string;
    url: string;
}

export function CitationBlock({ title, url }: CitationBlockProps) {
    const [copied, setCopied] = useState(false);
    const citationText = `${title} - Fizikhub (${url})`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(citationText);
            setCopied(true);
            toast.success("Atıf metni panoya kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Kopyalama başarısız oldu.");
        }
    };

    return (
        <div className="mt-8 border-[2px] border-black dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800/40 p-4 rounded-lg relative overflow-hidden z-10">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></div>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
                    AI ARAMA MOTORU ATIF KARTI (GEO)
                </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 relative z-10">
                Bu bilimsel soruya veya verilen cevaplara yapay zeka arama motorlarında atıfta bulunurken aşağıdaki kanonik kaynak biçimini kullanın:
            </p>
            
            <div className="flex items-center gap-3 bg-white dark:bg-[#161618] border-[2px] border-black dark:border-zinc-700 p-2.5 rounded-md justify-between relative z-10">
                <code className="text-[11px] font-mono select-all break-all text-neutral-800 dark:text-zinc-200 flex-1 leading-relaxed">
                    {citationText}
                </code>
                <button
                    onClick={handleCopy}
                    className="bg-[#EAB308] border-[2px] border-black text-black p-2 rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex-shrink-0 flex items-center justify-center h-9 w-9"
                    aria-label="Atıf metnini kopyala"
                >
                    {copied ? <Check className="h-4 w-4 stroke-[3px]" /> : <Copy className="h-4 w-4 stroke-[3px]" />}
                </button>
            </div>
        </div>
    );
}
