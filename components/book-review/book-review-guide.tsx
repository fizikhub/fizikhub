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
            <DialogContent className="max-w-2xl bg-background p-0 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] dark:shadow-[8px_8px_0px_0px_rgba(220,38,38,0.4)] sm:rounded-2xl overflow-hidden focus:outline-none">

                {/* Header */}
                <div className="bg-muted/30 p-4 flex justify-between items-center border-b-2 border-foreground/10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-foreground/20" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">Kitap Kurdu Rehberi</span>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-10 min-h-[350px] sm:min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 dark:bg-rose-900/20 rounded-full blur-[80px] -z-10 -translate-x-1/2 -translate-y-1/2" />

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
                                "w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-colors mb-2 sm:mb-4 transform",
                                steps[step].color
                            )}>
                                {/* Resize icon on mobile */}
                                <div className="scale-75 sm:scale-100 transform">
                                    {steps[step].icon}
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black font-heading text-foreground tracking-tight">
                                {steps[step].title}
                            </h2>

                            <p className="text-sm sm:text-lg font-medium text-muted-foreground/90 leading-relaxed max-w-md">
                                {steps[step].content}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 my-6 sm:my-8">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={cn(
                                    "w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-foreground/20 transition-all duration-300",
                                    i === step ? "bg-rose-600 scale-125 shadow-lg shadow-rose-600/30" : "bg-muted hover:bg-rose-300"
                                )}
                            />
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-dashed border-foreground/20 w-full">
                        {step > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                className="w-full sm:w-auto border-2 border-foreground/10 font-bold hover:bg-muted"
                            >
                                Geri
                            </Button>
                        )}

                        <Button
                            onClick={() => {
                                if (step < steps.length - 1) {
                                    setStep(step + 1);
                                } else {
                                    onOpenChange(false);
                                }
                            }}
                            className="w-full sm:w-auto bg-rose-600 text-white hover:bg-rose-700 font-black uppercase tracking-wide border-2 border-rose-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            {step < steps.length - 1 ? "Devam" : "Anladım, Yazarım!"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
