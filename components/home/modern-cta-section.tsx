"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";

export function ModernCTASection() {
    const features = [
        "Sınırsız makale okuma",
        "Soru sorma ve cevaplama",
        "Toplulukla etkileşim",
        "Özel rozetler kazanma",
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-white"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">Ücretsiz Üyelik</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                            Bilim Yolculuğuna
                            <br />
                            <span className="text-white/80">Hemen Başla</span>
                        </h2>

                        <p className="text-xl text-white/80 mb-8 leading-relaxed">
                            Türkiye'nin en aktif bilim topluluğuna katıl, öğren ve paylaş.
                            Üyelik tamamen ücretsiz ve sınırsız.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3 text-lg"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span>{feature}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-purple-600 hover:bg-white/90 rounded-full h-14 px-8 text-base font-semibold shadow-xl group"
                                asChild
                            >
                                <Link href="/login">
                                    <Zap className="w-5 h-5 mr-2 fill-current" />
                                    Ücretsiz Başla
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 rounded-full h-14 px-8 text-base font-semibold"
                                asChild
                            >
                                <Link href="/hakkimizda">
                                    Daha Fazla Bilgi
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right - Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                            <div className="space-y-4">
                                {/* Mini stat cards */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="text-sm text-white/80 mb-1">Toplam Üye</div>
                                    <div className="text-3xl font-bold text-white">5,000+</div>
                                    <div className="text-xs text-white/60 mt-2">Bu ay +412 yeni üye</div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="text-sm text-white/80 mb-1">Aktif Tartışmalar</div>
                                    <div className="text-3xl font-bold text-white">10,000+</div>
                                    <div className="text-xs text-white/60 mt-2">Bugün +89 yeni soru</div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <div className="text-sm text-white/80 mb-1">Ortalama Cevap Süresi</div>
                                    <div className="text-3xl font-bold text-white">15 dk</div>
                                    <div className="text-xs text-white/60 mt-2">Topluluk hızlı cevaplıyor</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
