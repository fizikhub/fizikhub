"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Sparkles, BookOpen, Quote, Star, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BookReviewGuideProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BookReviewGuide({ open, onOpenChange }: BookReviewGuideProps) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <BookOpen className="w-8 h-8 text-rose-400" />,
            title: "Hakimiyetini Konuştur",
            content: "Kitabı okudum bitti demekle olmaz. Derinine in, alt metinleri yakala. Yazar burada ne demek istemiş? Karakterin saç rengi neden mavid? Bize detay ver, analiz yap.",
            color: "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
        },
        {
            icon: <Star className="w-8 h-8 text-yellow-400" />,
            title: "Puanında Adaletli Ol",
            content: "Her şeye 10/10 verirsen kimse sana inanmaz. Sevmediğin yönlerini de söyle. 'Kitap güzeldi ama fontunu sevmedim' bile bir eleştiridir (belki biraz yüzeysel ama olsun).",
            color: "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400"
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-orange-400" />,
            title: "Spoiler Verme!",
            content: "Veya vereceksen adam gibi uyar. Kimse katilin uşak olduğunu en başta öğrenmek istemez. Sürprizi bozma, hevesi kursakta bırakma.",
            color: "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400"
        },
        {
            icon: <Quote className="w-8 h-8 text-indigo-400" />,
            title: "Alıntı Yap",
            content: "Kitaptan beni benden alan o cümleyi paylaş. 'Beni korkutan kötülerin zulmü değil, iyilerin sessizliğidir' gibi havalı bir söz varsa yapıştır gitsin.",
            color: "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
        },
        {
            icon: <Lightbulb className="w-8 h-8 text-emerald-400" />,
            title: "Duyguyu Geçir",
            content: "Bu kitap sana ne hissettirdi? Ağladın mı, güldün mü, duvara mı fırlattın? Robot değiliz, biraz duygu katalım işin içine.",
            color: "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] border-[3px] border-black bg-white dark:bg-[#27272a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-[8px] h-auto max-h-[85dvh] flex flex-col z-[150] gap-0">
                {/* NOISE TEXTURE */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                <div className="relative flex flex-col h-full sm:max-h-[90vh] z-10">
                    {/* Header - Sleek */}
                    <div className="px-5 py-4 border-b-[3px] border-black bg-[#f4f4f5] dark:bg-[#18181b] flex items-center justify-between shrink-0">
                        <div className="font-[family-name:var(--font-outfit)] text-lg sm:text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-black dark:text-zinc-50">
                            KİTAP KURDU REHBERİ
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="rounded-[8px] border-[3px] border-transparent hover:border-black hover:bg-white dark:hover:bg-zinc-800 text-black dark:text-zinc-100 transition-all w-9 h-9"
                        >
                            <X className="w-5 h-5 stroke-[3px]" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-transparent flex flex-col">
                        <div className="p-5 sm:p-10 flex-1 flex flex-col relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex flex-col items-center text-center space-y-4 sm:space-y-6"
                                >
                                    <div className={cn(
                                        "w-16 h-16 sm:w-24 sm:h-24 rounded-[8px] flex items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_#000] mb-2 sm:mb-4 bg-white dark:bg-[#18181b] transform",
                                    )}>
                                        <div className="scale-75 sm:scale-100 transform drop-shadow-md">
                                            {steps[step].icon}
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-outfit)] uppercase text-black dark:text-zinc-50 tracking-tight">
                                        {steps[step].title}
                                    </h2>

                                    <p className="text-sm sm:text-lg font-medium font-[family-name:var(--font-inter)] text-neutral-700 dark:text-zinc-300 leading-relaxed max-w-md">
                                        {steps[step].content}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Dots */}
                            <div className="flex justify-center gap-3 my-6 sm:my-8 z-20">
                                {steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setStep(i)}
                                        className={cn(
                                            "w-3 h-3 rounded-[4px] border-[2px] border-black transition-all duration-300",
                                            i === step ? "bg-[#FFC800] scale-125 shadow-[2px_2px_0px_0px_#000]" : "bg-white dark:bg-zinc-700 hover:bg-neutral-200 dark:hover:bg-zinc-500"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 left-0 right-0 bg-[#f4f4f5] dark:bg-[#18181b] border-t-[3px] border-black p-4 sm:p-5 mt-auto flex justify-between items-center z-20 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)]">
                            {step > 0 ? (
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(step - 1)}
                                    className="font-[family-name:var(--font-inter)] font-black border-[3px] border-transparent hover:border-black hover:bg-white dark:hover:bg-zinc-800 rounded-[8px] transition-all uppercase tracking-widest text-xs px-4 text-black dark:text-zinc-100"
                                >
                                    <span className="mr-2">{'<'}</span> GERİ
                                </Button>
                            ) : <div></div>}

                            <Button
                                onClick={() => {
                                    if (step < steps.length - 1) {
                                        setStep(step + 1);
                                    } else {
                                        onOpenChange(false);
                                    }
                                }}
                                className={cn(
                                    "h-10 px-8 font-[family-name:var(--font-inter)] font-black uppercase tracking-widest transition-all rounded-[8px]",
                                    step < steps.length - 1
                                        ? "bg-black dark:bg-[#27272a] text-white border-[3px] border-black dark:border-zinc-500"
                                        : "bg-rose-600 hover:bg-rose-500 text-white border-[3px] border-black",
                                    "shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                                )}
                            >
                                {step < steps.length - 1 ? "DEVAM" : "Anladım, Yazarım!"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
