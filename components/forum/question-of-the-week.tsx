"use client";

import { Atom, ArrowRight, FlaskConical, Microscope, Sparkles } from "lucide-react";
import Link from "next/link";

interface QuestionOfTheWeekProps {
    questionId?: number;
    questionSlug?: string;
}

export function QuestionOfTheWeek({ questionId, questionSlug }: QuestionOfTheWeekProps) {
    const questionTitle = "Işık hızıyla giden bir trende ileriye doğru fener tutarsak ışığın hızı ne olur?";
    const targetUrl = questionSlug
        ? `/forum/${questionSlug}`
        : questionId
            ? `/forum/${questionId}`
            : `/forum?q=${encodeURIComponent(questionTitle)}`;

    return (
        <section className="relative overflow-hidden rounded-[8px] border-2 border-black bg-[#EAB308] p-4 sm:p-6 shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000]">
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7)_0_1px,transparent_1.5px)] [background-size:18px_18px]"
            />

            <div className="relative z-10 mb-4 text-center">
                <p className="text-[12px] sm:text-sm font-black uppercase text-black">
                    Haftanın Sorusu
                </p>
            </div>

            <div className="relative z-10 overflow-hidden rounded-[8px] border-2 border-black bg-[#151519] p-4 sm:p-5 shadow-[3px_3px_0_0_rgba(0,0,0,0.45)]">
                <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#8b5cf6] via-[#EAB308] to-[#23A9FA]" />

                <div className="mt-3 inline-flex items-center gap-2 rounded-[6px] border-2 border-black bg-[#8b5cf6] px-3 py-1 text-white shadow-[2px_2px_0_0_#000]">
                    <FlaskConical className="h-4 w-4 stroke-[2.5px]" />
                    <span className="text-[11px] font-black uppercase">Deney #42</span>
                </div>

                <h3 className="mt-5 flex items-center gap-2 text-[21px] sm:text-2xl font-black uppercase leading-tight text-white">
                    <Sparkles className="h-5 w-5 shrink-0 fill-[#EAB308] text-[#EAB308]" />
                    Haftanın Hipotezi
                </h3>

                <div className="mt-4 rounded-[8px] border-2 border-white/10 bg-white/[0.06] p-4">
                    <p className="text-[22px] sm:text-3xl font-black leading-tight text-white">
                        "{questionTitle}"
                    </p>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-[8px] border-2 border-black bg-[#EAB308]/20 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] border-2 border-black bg-[#EAB308] text-black shadow-[2px_2px_0_0_#000]">
                        <Atom className="h-6 w-6 stroke-[2.5px]" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-white/60">Ödül</p>
                        <p className="text-sm sm:text-base font-black text-white">
                            En iyi teoriye <span className="text-[#a78bfa] underline decoration-2 underline-offset-2">Einstein Rozeti</span>
                        </p>
                    </div>
                </div>

                <Link
                    prefetch={false}
                    href={targetUrl}
                    className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[8px] border-2 border-black bg-black px-4 py-3 text-lg font-black uppercase text-white shadow-[3px_3px_0_0_rgba(255,255,255,0.55)] transition-all hover:bg-[#86efac] hover:text-black hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none"
                >
                    <Microscope className="h-5 w-5 stroke-[2.5px]" />
                    <span className="min-w-0">Analiz Başlat</span>
                    <ArrowRight className="ml-auto h-5 w-5 stroke-[3px]" />
                </Link>
            </div>
        </section>
    );

}
