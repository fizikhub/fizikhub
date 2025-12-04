"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { BookOpen, MessageCircle, Users, TrendingUp } from "lucide-react";

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: duration * 1000 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("tr-TR").format(Math.floor(latest));
            }
        });
    }, [springValue]);

    return <span ref={ref}>0</span>;
}

export function InteractiveStats() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                    >
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Büyüyen Topluluk</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
                    >
                        Rakamlarla FizikHub
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Her gün binlerce kişi FizikHub'da bilimle buluşuyor
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat 1 - Users */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                <AnimatedCounter value={5000} />+
                            </div>
                            <div className="text-lg font-semibold text-foreground mb-2">Aktif Kullanıcı</div>
                            <p className="text-sm text-muted-foreground">
                                Her ay büyüyen topluluk
                            </p>
                        </div>
                    </motion.div>

                    {/* Stat 2 - Questions */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                <AnimatedCounter value={10000} />+
                            </div>
                            <div className="text-lg font-semibold text-foreground mb-2">Soru & Cevap</div>
                            <p className="text-sm text-muted-foreground">
                                Binlerce tartışma ve çözüm
                            </p>
                        </div>
                    </motion.div>

                    {/* Stat 3 - Articles */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                <AnimatedCounter value={500} />+
                            </div>
                            <div className="text-lg font-semibold text-foreground mb-2">Bilimsel Makale</div>
                            <p className="text-sm text-muted-foreground">
                                Sürekli güncellenen içerik
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
