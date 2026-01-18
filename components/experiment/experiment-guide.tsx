"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Sparkles, FlaskConical, Zap, Microscope, ClipboardList, Beaker, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ExperimentGuideProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExperimentGuide({ open, onOpenChange }: ExperimentGuideProps) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Microscope className="w-8 h-8 text-green-400" />,
            title: "Bilimsel Merak",
            content: "Her şey 'Neden?' sorusuyla başlar. Elmayı daldan düşürürken 'Niye aşağı düştü?' demeseydik hala tepemizde elma bekliyor olurduk. Deneyinin amacını net belirle.",
            color: "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400"
        },
        {
            icon: <ShieldAlert className="w-8 h-8 text-red-400" />,
            title: "Kaşlarına Sahip Çık",
            content: "Deney yaparken patlama riski varsa (ki en eğlencelisi budur) dikkatli ol. Önce güvenlik! Lab önlüğü yoksa eski bir tişört de iş görür ama anneni kızdırma.",
            color: "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
        },
        {
            icon: <ClipboardList className="w-8 h-8 text-blue-400" />,
            title: "Eksik Malzeme Olmasın",
            content: "Deneyin ortasında 'Aaa karbonat bitmiş' demek karizmayı çizer. Malzemelerini baştan listele. Gerekirse mutfaktaki her şeyi çal, ama not almayı unutma.",
            color: "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "Adım Adım Eureka!",
            content: "Yapılış aşamalarını öyle bir anlat ki, ilkokul terk birisi bile (tamam o kadar değil) yapabilsin. Fotoğraf veya video eklemek deneyin güvenilirliğini %1000 artırır.",
            color: "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400"
        },
        {
            icon: <Beaker className="w-8 h-8 text-emerald-400" />,
            title: "Gözlem ve Sonuç",
            content: "Ne bekliyordun, ne oldu? Eğer her şey ters gittiyse o da bir sonuçtur! Hatta bazen en büyük keşifler hatalardan çıkar. Dürüst ol, gözlemini paylaş.",
            color: "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background p-0 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] dark:shadow-[8px_8px_0px_0px_rgba(22,163,74,0.4)] sm:rounded-2xl overflow-hidden focus:outline-none">

                {/* Header */}
                <div className="bg-muted/30 p-4 flex justify-between items-center border-b-2 border-foreground/10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-foreground/20" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">Genç Bilim İnsanı Rehberi</span>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 dark:bg-green-900/20 rounded-full blur-[80px] -z-10 -translate-x-1/2 -translate-y-1/2" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center text-center space-y-6"
                        >
                            <div className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-colors mb-4 transform",
                                steps[step].color
                            )}>
                                {steps[step].icon}
                            </div>

                            <h2 className="text-3xl font-black font-heading text-foreground tracking-tight">
                                {steps[step].title}
                            </h2>

                            <p className="text-lg font-medium text-muted-foreground/90 leading-relaxed max-w-md">
                                {steps[step].content}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 my-8">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setStep(i)}
                                className={cn(
                                    "w-3 h-3 rounded-full border border-foreground/20 transition-all duration-300",
                                    i === step ? "bg-green-600 scale-125 shadow-lg shadow-green-600/30" : "bg-muted hover:bg-green-300"
                                )}
                            />
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-dashed border-foreground/20">
                        {step > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                className="border-2 border-foreground/10 font-bold hover:bg-muted"
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
                            className="bg-green-600 text-white hover:bg-green-700 font-black uppercase tracking-wide border-2 border-green-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            {step < steps.length - 1 ? "Devam" : "Deneye Başla! 🧪"}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
