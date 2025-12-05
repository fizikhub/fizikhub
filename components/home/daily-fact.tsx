"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";
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
        // Random start
        setCurrentFactIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <section className="py-12 bg-primary/5 border-y border-primary/10">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-wider text-sm">
                        <Lightbulb className="w-4 h-4" />
                        <span>Bunları Biliyor Muydun?</span>
                    </div>

                    <div className="relative min-h-[100px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentFactIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-xl md:text-3xl font-medium font-heading leading-snug"
                            >
                                "{facts[currentFactIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextFact}
                            className="text-muted-foreground hover:text-primary gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Yeni Bilgi
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
