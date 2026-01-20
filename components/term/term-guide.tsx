"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, BookType, Scale, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TermGuideProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TermGuide({ open, onOpenChange }: TermGuideProps) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <BookType className="w-8 h-8 text-blue-400" />,
            title: "Kısa ve Öz Ol",
            content: "Terimler sözlük gibidir. Destan yazma, net ol. Bir kavramı en kısa ve anlaşılır yoldan nasıl anlatırsın? Hedef bu.",
            color: "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-cyan-400" />,
            title: "Doğru Kaynak",
            content: "Bilim şakaya gelmez. Tanımdan emin değilsen paylaşma. Kulaktan dolma bilgilerle değil, gerçek bilimsel verilerle gel.",
            color: "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400"
        },
        {
            icon: <Scale className="w-8 h-8 text-sky-400" />,
            title: "Örnek Ver",
            content: "Kuru kuru tanım akılda kalmaz. 'Hız nedir?' dediğinde bir yarış arabası örneği ver. Hayattan örnekler her zaman kazanır.",
            color: "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400"
        },
        {
            icon: <MessageSquareQuote className="w-8 h-8 text-indigo-400" />,
            title: "Kendi Cümlelerinle",
            content: "Wikipedia'yı kopyalayıp yapıştırma. Okuduğunu anla, sindir ve kendi cümlelerinle anlat. Özgünlük bu işin sırrı.",
            color: "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background p-0 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] dark:shadow-[8px_8px_0px_0px_rgba(59,130,246,0.4)] sm:rounded-2xl overflow-hidden focus:outline-none">

                {/* Header */}
                <div className="bg-muted/30 p-4 flex justify-between items-center border-b-2 border-foreground/10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-cyan-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-sky-500 border border-foreground/20" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">Terim Paylaşım Rehberi</span>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-10 min-h-[350px] sm:min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[80px] -z-10 -translate-x-1/2 -translate-y-1/2" />

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
                                    i === step ? "bg-blue-600 scale-125 shadow-lg shadow-blue-600/30" : "bg-muted hover:bg-blue-300"
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
                            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-black uppercase tracking-wide border-2 border-blue-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            {step < steps.length - 1 ? "Devam" : "Anladım, Paylaş!"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
