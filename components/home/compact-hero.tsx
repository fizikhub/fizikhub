"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NeoHero() {
    return (
        <section className="relative w-full py-12 md:py-20 overflow-hidden">
            {/* Background Elements - Subtle Grid/Noise controlled via parent/global layout often, but can add here */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/40 via-transparent to-transparent" />

            <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">

                {/* Badge / Sticker */}
                <motion.div
                    initial={{ opacity: 0, y: -20, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow-400 px-4 py-1.5 text-sm font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:rotate-0 transition-transform"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Günlük Bilim Dozu</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight md:leading-[1.1] mb-6 max-w-4xl"
                >
                    BİLİMİ <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Tİ'YE</span> ALIYORUZ
                    <br />
                    <span className="relative inline-block mt-2">
                        <span className="relative z-10">AMA CİDDİLİ.</span>
                        <svg
                            className="absolute -bottom-2 left-0 w-full h-3 text-yellow-500 -z-10"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                        </svg>
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
                >
                    Evrenin sırlarını çözmeye çalışanların, kahve eşliğinde kuantum fiziği tartıştığı,
                    bazen de sadece boş yaptığı o tuhaf ama harika yerdesin.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Button
                        size="lg"
                        className="h-14 px-8 text-lg font-bold border-2 border-black bg-white text-black hover:bg-neutral-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-[2px_2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        Keşfetmeye Başla
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 text-lg font-bold border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                    >
                        Topluluğa Katıl
                    </Button>
                </motion.div>

                {/* Floating Elements / Decor */}
                <div className="absolute top-10 left-10 md:left-20 animate-float-slow hidden lg:block opacity-60">
                    <Zap className="w-12 h-12 text-yellow-400 rotate-12" />
                </div>
                <div className="absolute bottom-10 right-10 md:right-20 animate-float-delayed hidden lg:block opacity-60">
                    <div className="w-8 h-8 rounded-full border-2 border-purple-500 bg-transparent" />
                </div>

            </div>
        </section>
    );
}
