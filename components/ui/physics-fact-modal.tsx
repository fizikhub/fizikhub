"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
    {
        title: "Evrenin Dokusu",
        fact: "Uzay tamamen boş değildir. Vakum enerjisi adını verdiğimiz, sürekli var olup yok olan sanal parçacıklarla doludur."
    },
    {
        title: "Zamanın Göreceliliği",
        fact: "Yerçekimi ne kadar güçlüyse, zaman o kadar yavaş akar. Dünya'nın merkezindeki bir saat, yüzeydekinden daha yavaş çalışır."
    },
    {
        title: "Kuantum Dolanıklık",
        fact: "İki parçacık birbirine dolanıksa, aralarındaki mesafe ne olursa olsun, birine yapılan işlem diğerini anında etkiler. Einstein buna 'uzaktan hayaletimsi etki' demiştir."
    },
    {
        title: "Karanlık Madde",
        fact: "Evrenin kütlesinin yaklaşık %85'i karanlık maddeden oluşur. Ancak ışıkla etkileşime girmediği için onu doğrudan göremiyoruz, sadece kütleçekimsel etkisini hissedebiliyoruz."
    },
    {
        title: "Termodinamiğin 2. Yasası",
        fact: "Evrendeki düzensizlik (entropi) her zaman artma eğilimindedir. Kırılmış bir bardağı eski haline döndürmek bu yüzden imkansızdır; evren düzeni sevmez."
    },
    {
        title: "Işık Hızı Aşılamaz",
        fact: "Işık hızı saniyede yaklaşık 300.000 kilometredir. Bu sadece ışığın hızı değil, evrendeki 'nedenselliğin' yani bir olayın diğerini etkileyebileceği maksimum hızdır."
    },
    {
        title: "Planck Uzunluğu",
        fact: "Evrende fiziksel olarak anlam ifade eden en küçük uzunluk birimidir. Bunun altındaki boyutlarda, bildiğimiz uzay ve zaman kavramları tamamen çöker."
    },
    {
        title: "Kozmik Yağmur",
        fact: "Şu an oturduğunuz yerde saniyede milyonlarca atom altı parçacık (nötrinolar ve müonlar) vücudunuzu delip geçiyor ama siz hiçbir şey hissetmiyorsunuz!"
    },
    {
        title: "Antimadde",
        fact: "Madde ve antimadde çarpıştığında %100 oranında enerjiye dönüşür. Evrendeki en verimli enerji üretme yöntemi budur, ancak üretmesi çok pahalıdır."
    },
    {
        title: "Schrödinger'in Kedisi",
        fact: "Kuantum mekaniğinde gözlem yapılana kadar bir parçacık tüm ihtimalleri aynı anda yaşar. Gözlem, evreni (veya kedinin kaderini) tek bir gerçeğe çökertir."
    }
];

interface PhysicsFactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PhysicsFactModal({ open, onOpenChange }: PhysicsFactModalProps) {
    const [currentFact, setCurrentFact] = useState(FACTS[0]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (open) {
            const randomIndex = Math.floor(Math.random() * FACTS.length);
            setCurrentFact(FACTS[randomIndex]);
        }
    }, [open]);

    if (!isClient) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white dark:bg-[#18181b] p-0 overflow-hidden rounded-xl gap-0">
                <div className="bg-[#FACC15] w-full p-5 border-b-[4px] border-black flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Zap className="w-6 h-6 text-black fill-black" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase text-black m-0 tracking-tight">Günün Hap Bilgisi</DialogTitle>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {open && (
                        <motion.div
                            key={currentFact.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-6 md:p-8 flex flex-col gap-4"
                        >
                            <h3 className="text-xl md:text-2xl font-black uppercase dark:text-white flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-[#FACC15] shrink-0" />
                                {currentFact.title}
                            </h3>
                            <DialogDescription className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                                {currentFact.fact}
                            </DialogDescription>

                            <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="w-full bg-black text-white hover:bg-zinc-800 font-bold uppercase py-3 rounded-lg border-2 border-black transition-colors"
                                >
                                    Anladım
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
