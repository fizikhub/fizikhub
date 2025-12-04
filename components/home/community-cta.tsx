"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

export function CommunityCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl">
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />

                        <div className="relative p-8 sm:p-12 md:p-16 text-center space-y-8">
                            {/* Icon Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 rotate-3 hover:rotate-6 transition-transform duration-300"
                            >
                                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </motion.div>

                            <div className="space-y-4">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                                >
                                    Bilim Topluluğuna <br className="hidden sm:block" />
                                    <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Sen de Katıl</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg text-muted-foreground max-w-2xl mx-auto"
                                >
                                    Binlerce bilim severle tanış, sorularını sor ve tartışmalara katıl.
                                    FizikHub ile öğrenmenin sınırı yok.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <Button size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20" asChild>
                                    <Link href="/login">
                                        <Zap className="w-4 h-4 fill-current" />
                                        Hemen Üye Ol
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8 text-base gap-2 bg-transparent border-white/10 hover:bg-white/5" asChild>
                                    <Link href="/hakkimizda">
                                        Daha Fazla Bilgi
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Stats */}
                            <div className="pt-8 grid grid-cols-3 gap-4 sm:gap-8 border-t border-white/5 mt-8">
                                <StatItem label="Aktif Üye" value="5K+" delay={0.3} />
                                <StatItem label="Soru & Cevap" value="10K+" delay={0.4} />
                                <StatItem label="Makale" value="500+" delay={0.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatItem({ label, value, delay }: { label: string, value: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="text-center"
        >
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-1">
                {value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
}
