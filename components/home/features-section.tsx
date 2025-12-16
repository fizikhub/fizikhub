"use client";

import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Share2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "ÖĞREN",
        description: "Ders kitaplarında bulamayacağın, 'bunu bilip de ne yapacağım' diyeceğin ama yine de okumadan duramayacağın her şey.",
        icon: BookOpen,
        number: "01"
    },
    {
        title: "TARTIŞ",
        description: "En saçma soruların bile mantıklı bir cevabı olabilir. Ya da yoktur, gelip birlikte bakalım. Yargılamak yok, bilim var.",
        icon: MessageCircle,
        number: "02"
    },
    {
        title: "PAYLAŞ",
        description: "İçindeki Einstein'ı serbest bırak. Bildiklerini anlat, belki bir gün senin teorin de birilerinin sınav sorusu olur.",
        icon: Share2,
        number: "03"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background border-b-2 border-border relative">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="h-full p-8 border-2 border-border hover:border-black dark:hover:border-white transition-all duration-300 bg-card relative overflow-hidden hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-foreground select-none">
                                    {feature.number}
                                </div>

                                <div className="w-12 h-12 flex items-center justify-center mb-6 border-2 border-black dark:border-white bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-transform duration-300 group-hover:scale-110">
                                    <feature.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
