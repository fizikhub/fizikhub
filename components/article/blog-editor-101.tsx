"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Sparkles, Zap, Image as ImageIcon, AlignLeft, Hash, Save, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BlogEditor101Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    onDontShowAgain: (userId: string) => void;
}

export function BlogEditor101({ open, onOpenChange, userId, onDontShowAgain }: BlogEditor101Props) {
    const [step, setStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleClose = () => {
        if (dontShowAgain) {
            onDontShowAgain(userId);
        }
        onOpenChange(false);
    };

    const steps = [
        {
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            title: "Hoş Geldin Şampiyon!",
            content: "Demek bildiklerini döktürmeye karar verdin? Harika. Burası senin bilimsel arenan. Sıkıcı akademik makalelerden gına geldi, bize senin o eşsiz, hafif çatlak, bol meraklı kafandakiler lazım.",
            color: "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400"
        },
        {
            icon: <ImageIcon className="w-8 h-8 text-purple-400" />,
            title: "Kuru Kuru Gitmez",
            content: "Sadece metin dayayıp geçme, okuyanların gözü kanamasın. Araya şekilli şukullu görseller at, bir kapak fotoğrafı seç ki vitrin güzel dursun. Görsellik her şeydir (neredeyse).",
            color: "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400"
        },
        {
            icon: <AlignLeft className="w-8 h-8 text-blue-400" />,
            title: "Özet Geç, Adamı Hasta Etme",
            content: "İnsanların dikkat süresi lepistes balığı ile yarışıyor. O yüzden 'Özet' kısmına öyle bir giriş yap ki, okumayan pişman olsun. Tık tuzağı yapma ama merak da ettir yani.",
            color: "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
        },
        {
            icon: <Zap className="w-8 h-8 text-red-400" />,
            title: "Doğal Ol, Robot Olma",
            content: "Yapay zeka gibi yazacaksan hiç yazma, onu biz de yapıyoruz. Bize SEN lazımsın. Espri yap, araya parantez içi yorumlar sıkıştır, kendi sesini bul. Bilim ciddi iştir ama somurtarak yapılmak zorunda değil.",
            color: "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400"
        },
        {
            icon: <Trophy className="w-8 h-8 text-emerald-400" />,
            title: "Sahne Senin!",
            content: "Hadi bakalım, klavyene kuvvet. Yanlış yapmaktan korkma, 'Taslak' butonu senin en iyi dostun. Yaz, çiz, sil, tekrar yaz. Mükemmel olana kadar buradayız. Göster kendini!",
            color: "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background p-0 border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] sm:rounded-2xl overflow-hidden focus:outline-none">

                {/* Header */}
                <div className="bg-muted/30 p-4 flex justify-between items-center border-b-2 border-foreground/10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 border border-foreground/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500 border border-foreground/20" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs text-muted-foreground">Blog Yazarlığı 101</span>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 dark:bg-slate-900 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />

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
                                "w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-colors mb-4 transform rotate-3",
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
                                    i === step ? "bg-foreground scale-110" : "bg-muted"
                                )}
                            />
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-dashed border-foreground/20 pt-6">
                        <div
                            className="flex items-center gap-2 cursor-pointer group select-none"
                            onClick={() => setDontShowAgain(!dontShowAgain)}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded border-2 border-muted-foreground flex items-center justify-center transition-all",
                                dontShowAgain ? "bg-foreground border-foreground" : "bg-transparent"
                            )}>
                                {dontShowAgain && <Sparkles className="w-3 h-3 text-background" />}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                                Bunu bir daha gösterme
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {step > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 sm:flex-none border-2 border-foreground/10 font-bold"
                                >
                                    Geri
                                </Button>
                            )}

                            <Button
                                onClick={() => {
                                    if (step < steps.length - 1) {
                                        setStep(step + 1);
                                    } else {
                                        handleClose();
                                    }
                                }}
                                className="flex-1 sm:flex-none bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-wide border-2 border-transparent hover:border-foreground/10"
                            >
                                {step < steps.length - 1 ? "Devam" : "Başlıyoruz 🚀"}
                            </Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
