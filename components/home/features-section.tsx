"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BookOpen, MessageCircle, Share2, Brain, Rocket, Atom } from "lucide-react";
import React, { useRef } from "react";

const features = [
    {
        title: "Öğren",
        description: "Fizik, uzay ve bilim dünyasından en güncel ve ilgi çekici makalelerle ufkunu genişlet.",
        icon: BookOpen,
        color: "text-blue-500",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Tartış",
        description: "Aklına takılan soruları sor, diğer bilim severlerle tartış ve yeni bakış açıları kazan.",
        icon: MessageCircle,
        color: "text-green-500",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        title: "Paylaş",
        description: "Kendi yazılarını yaz, toplulukla paylaş ve bilimin yayılmasına katkıda bulun.",
        icon: Share2,
        color: "text-purple-500",
        gradient: "from-purple-500/20 to-pink-500/20"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-muted/30 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                    >
                        <Brain className="w-4 h-4" />
                        <span>Neden FizikHub?</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Bilimin Kalbi Burada Atıyor
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg"
                    >
                        Sadece okumakla kalma, bilimin bir parçası ol. FizikHub sana keşfetmen için sonsuz bir evren sunuyor.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <TiltCard key={index} index={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TiltCard({ feature, index }: { feature: typeof features[0], index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative h-full"
        >
            <div
                style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                className="relative h-full bg-card border border-border/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 group overflow-hidden"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col items-center text-center h-full">
                    <div
                        style={{ transform: "translateZ(50px)" }}
                        className={`w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                        <feature.icon className="w-8 h-8" />
                    </div>

                    <h3
                        style={{ transform: "translateZ(25px)" }}
                        className="text-xl font-bold mb-4"
                    >
                        {feature.title}
                    </h3>

                    <p
                        style={{ transform: "translateZ(20px)" }}
                        className="text-muted-foreground leading-relaxed"
                    >
                        {feature.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
