"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const facts = [
    "Işık, Güneş'ten Dünya'ya yaklaşık 8 dakika 20 saniyede ulaşır.",
    "Evrendeki atomların %90'ından fazlası hidrojendir.",
    "Bir nötron yıldızından alınan bir çay kaşığı madde, Everest Dağı kadar ağırdır.",
    "Ses uzayda yayılmaz çünkü ses dalgalarının iletilmesi için bir ortama ihtiyacı vardır.",
    "Venüs, Güneş Sistemi'ndeki en sıcak gezegendir, Merkür'den bile daha sıcaktır.",
    "Samanyolu Galaksisi'nin merkezinde süper kütleli bir kara delik bulunur.",
    "Zaman, kütleçekimi arttıkça yavaşlar. Bu fenomene 'zaman genişlemesi' denir.",
    "Kuantum dolanıklığı sayesinde parçacıklar, aralarındaki mesafe ne olursa olsun birbirlerini anında etkileyebilirler.",
    "Evren sürekli genişlemektedir ve bu genişleme hızı giderek artmaktadır.",
    "Bir atomun %99.9999999'u boşluktur."
];

export function DailyFact() {
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCurrentFactIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <section className="py-16 bg-primary text-primary-foreground border-b-2 border-black dark:border-white">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 font-black mb-6 uppercase tracking-widest border-2 border-black dark:border-white px-4 py-1 bg-white text-black">
                        <Zap className="w-4 h-4 fill-black" />
                        <span>Gereksiz Bilgiler Ansiklopedisi</span>
                    </div>

                    <div className="relative min-h-[120px] flex items-center justify-center mb-8">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentFactIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl md:text-4xl font-black leading-tight"
                            >
                                "{facts[currentFactIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={nextFact}
                        className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors border-2 border-transparent hover:border-black"
                    >
                        BAŞKA BİR TANE DAHA
                    </button>
                </div>
            </div>
        </section>
    );
}
