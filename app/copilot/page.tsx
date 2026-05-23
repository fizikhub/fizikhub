import type { Metadata } from "next";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { PhysicsCopilot } from "@/components/ai/physics-copilot";

export const metadata: Metadata = {
    title: "Fizik Copilotu: Yapay Zeka Fizik Öğretmeni | FizikHub",
    description: "Fizikhub Fizik Copilotu ile kuantum mekaniği, görelilik teorisi, termodinamik ve klasik fizik konularını keşfedin. Yapay zeka ile fizik formüllerini ve karmaşık problemleri adım adım öğrenin.",
    keywords: ["fizik yapay zeka", "fizik asistanı", "kuantum yapay zeka", "fizik problem çözücü", "fizik öğretmeni ai", "gemini fizik", "fizikhub copilot"],
    alternates: {
        canonical: "https://www.fizikhub.com/copilot",
    },
};

export default function CopilotPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#18181b] text-black dark:text-zinc-50 pb-24 font-sans selection:bg-[#FFC800] selection:text-black relative">
            
            {/* Page Header (Aligned with Simülasyon Merkezi) */}
            <div className="sticky top-0 z-40 bg-neutral-50/95 dark:bg-[#18181b]/95 backdrop-blur-md border-b-[3px] border-black">
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <span className="flex items-center justify-center w-10 h-10 bg-white dark:bg-[#27272a] border-[3px] border-black hover:bg-[#FFBD2E] dark:hover:bg-[#FFBD2E] hover:text-black transition-colors rounded-lg group cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus:outline-none">
                                <ArrowLeft className="w-5 h-5 transition-colors stroke-[2.5px]" />
                            </span>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-outfit)] font-black text-black dark:text-zinc-50 uppercase tracking-tighter leading-none flex items-center gap-2">
                                Fizik Copilotu <Sparkles className="h-6 w-6 text-emerald-500 stroke-[2.5px] animate-pulse" />
                            </h1>
                            <p className="text-neutral-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Yapay Zeka Fizik Öğretmeni ve Bilim Asistanı
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Copilot Layout */}
            <main className="max-w-[1400px] mx-auto px-4 py-8 md:py-12 relative z-10">
                <PhysicsCopilot />
            </main>

        </div>
    );
}
