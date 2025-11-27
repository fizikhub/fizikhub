"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const facts = [
    "Bir nötron yıldızının bir çay kaşığı kadarı, Everest Dağı kadar ağırdır.",
    "Venüs'te bir gün, bir yıldan daha uzundur.",
    "Uzay aslında tamamen sessizdir, çünkü sesin yayılacağı bir ortam yoktur.",
    "Güneş sistemindeki kütlenin %99.86'sı Güneş'tedir.",
    "Satürn'ün halkaları o kadar incedir ki, oranlarsak bir kağıttan bile incedir.",
    "Işık Güneş'ten Dünya'ya 8 dakikada gelir, ama Güneş'in çekirdeğinden yüzeyine çıkması binlerce yıl sürer.",
    "Evrendeki yıldız sayısı, Dünya'daki tüm kumsallardaki kum tanesi sayısından fazladır.",
    "Bir kara deliğin olay ufkuna yaklaşırsanız, zaman sizin için yavaşlar.",
    "Tardigradlar uzay boşluğunda bile hayatta kalabilen mikroskobik canlılardır.",
    "Jüpiter o kadar büyüktür ki, içine 1300 tane Dünya sığabilir."
];

export function DidYouKnow() {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Random start
        setIndex(Math.floor(Math.random() * facts.length));
    }, []);

    const nextFact = () => {
        setIndex((prev) => (prev + 1) % facts.length);
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-md mx-auto my-8 px-4">
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                    <Lightbulb className="h-5 w-5 text-yellow-500 animate-pulse" />
                    <span>Biliyor muydun?</span>
                </div>

                <div className="h-32 flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-lg text-center font-medium leading-relaxed"
                        >
                            "{facts[index]}"
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="mt-4 flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextFact}
                        className="text-muted-foreground hover:text-primary gap-2"
                    >
                        <RefreshCw className="h-4 w-4" /> Başka Ver
                    </Button>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            </Card>
        </div>
    );
}
