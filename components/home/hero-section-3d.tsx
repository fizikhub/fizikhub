"use client";

import { motion } from "framer-motion";
import { ArrowRight, Atom, Brain, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection3D() {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background border-b-2 border-border">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-6"
                    >
                        <div className="px-4 py-1.5 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                            Fizik & Bilim Platformu
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]"
                    >
                        BİLİMİ Tİ'YE ALIYORUZ
                        <br />
                        <span className="text-primary relative inline-block">
                            AMA CİDDİLİ
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-foreground" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                        {" "}ŞEKİLDE.
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
                    >
                        Sıkıcı ders kitaplarını bir kenara bırak.
                        <br className="hidden sm:block" />
                        Burada evrenin sırlarını eğlenerek çözüyoruz.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/blog" className="w-full sm:w-auto">
                            <div className="brutalist-button px-8 py-4 text-lg flex items-center justify-center gap-2 cursor-pointer">
                                <Atom className="w-6 h-6" />
                                KEŞFETMEYE BAŞLA
                            </div>
                        </Link>

                        <Link href="/forum" className="w-full sm:w-auto">
                            <div className="px-8 py-4 text-lg font-bold border-2 border-border bg-background hover:bg-muted transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                <Brain className="w-6 h-6" />
                                TARTIŞMALARA KATIL
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <ChevronDown className="w-10 h-10 text-muted-foreground" />
            </motion.div>
        </section>
    );
}
