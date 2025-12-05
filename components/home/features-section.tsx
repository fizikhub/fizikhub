"use client";

import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Share2, Brain, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Öğren",
        description: "Fizik, uzay ve bilim dünyasından en güncel ve ilgi çekici makalelerle ufkunu genişlet.",
        icon: BookOpen,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "Tartış",
        description: "Aklına takılan soruları sor, diğer bilim severlerle tartış ve yeni bakış açıları kazan.",
        icon: MessageCircle,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20"
    },
    {
        title: "Paylaş",
        description: "Kendi yazılarını yaz, toplulukla paylaş ve bilimin yayılmasına katkıda bulun.",
        icon: Share2,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                    >
                        <Brain className="w-4 h-4" />
                        <span>Neden FizikHub?</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading"
                    >
                        Bilimin Kalbi Burada Atıyor
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg leading-relaxed"
                    >
                        Sadece okumakla kalma, bilimin bir parçası ol. FizikHub sana keşfetmen için sonsuz bir evren sunuyor.
                    </motion.p>
                </div>

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
                            <div className={cn(
                                "h-full p-8 rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                                feature.border
                            )}>
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
                                    feature.bg,
                                    feature.color
                                )}>
                                    <feature.icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 font-heading group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground leading-relaxed">
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
