"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BookOpen, MessageSquare, BookMarked, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const features = [
    {
        title: "Blog & Makaleler",
        description: "Fizik konularını makaraya sarmış şekilde okuyun",
        icon: BookOpen,
        href: "/blog",
        gradient: "from-blue-500 to-cyan-500",
        fun: "İlk makale: Kediler neden hep dört ayak üstüne düşer? 🐱",
        size: "large",
    },
    {
        title: "Forum",
        description: "Sorun, tartışın, öğrenin",
        icon: MessageSquare,
        href: "/forum",
        gradient: "from-purple-500 to-pink-500",
        fun: "Son soru: Zamanda yolculuk mümkün mü? 🕰️",
        size: "medium",
    },
    {
        title: "Fizik Sözlüğü",
        description: "Tüm fizik terimlerini kolayca öğrenin",
        icon: BookMarked,
        href: "/sozluk",
        gradient: "from-orange-500 to-yellow-500",
        fun: "Günün kelimesi: Kuantum Süperpozisyonu 🌀",
        size: "medium",
    },
    {
        title: "Aktif Topluluk",
        description: "Binlerce fizik tutkunu seni bekliyor",
        icon: Users,
        gradient: "from-green-500 to-emerald-500",
        stats: "1000+",
        size: "small",
    },
    {
        title: "Hızlı Yanıtlar",
        description: "Sorularına dakikalar içinde cevap al",
        icon: Zap,
        gradient: "from-red-500 to-orange-500",
        stats: "< 5dk",
        size: "small",
    },
];

export function BentoFeatures() {
    return (
        <section className="container px-4 md:px-6 py-20">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <FeatureCard key={feature.title} feature={feature} index={index} />
                ))}
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    const sizeClasses: Record<string, string> = {
        large: "md:col-span-2 md:row-span-2",
        medium: "md:col-span-1 md:row-span-2",
        small: "md:col-span-1 md:row-span-1",
    };

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`${sizeClasses[feature.size]} relative`}
        >
            <Card className="h-full p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 overflow-hidden group cursor-pointer">
                {/* Gradient Background on Hover */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <motion.div
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 md:p-4 mb-4 flex items-center justify-center`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <feature.icon className="w-full h-full text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-1">{feature.description}</p>

                    {/* Fun fact or stats */}
                    {feature.fun && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
                            className="text-sm text-primary italic mt-2"
                        >
                            {feature.fun}
                        </motion.p>
                    )}

                    {feature.stats && (
                        <div className="mt-auto">
                            <span className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                {feature.stats}
                            </span>
                        </div>
                    )}

                    {/* Hover Arrow */}
                    {feature.href && (
                        <motion.div
                            className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-primary">→</span>
                        </motion.div>
                    )}
                </div>
            </Card>
        </motion.div>
    );

    return feature.href ? (
        <Link href={feature.href} className="h-full">
            {content}
        </Link>
    ) : (
        content
    );
}
