"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, TrendingUp, Users, Sparkles } from "lucide-react";

export function HeroBento() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

            <div className="container mx-auto relative z-10">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

                    {/* Main Hero - Large */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 sm:p-12 flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Türkiye'nin Bilim Platformu</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                            <span className="block text-foreground">Bilimin</span>
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Geleceğini
                            </span>
                            <span className="block text-foreground">Keşfet</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                            Fizik, uzay ve bilimin her alanında öğren, tartış ve paylaş.
                            Türkiye'nin en aktif bilim topluluğuna katıl.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="rounded-full h-14 px-8 text-base group" asChild>
                                <Link href="/blog">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Keşfetmeye Başla
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-2" asChild>
                                <Link href="/forum">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Foruma Katıl
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats Grid - Right Side */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-6">
                        {/* Stat Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="col-span-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 hover:scale-105 transition-transform duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="text-4xl font-bold mb-2">5,000+</div>
                                    <div className="text-sm text-muted-foreground">Aktif Üye</div>
                                </div>
                                <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    +24%
                                </div>
                            </div>
                        </motion.div>

                        {/* Stat Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 hover:scale-105 transition-transform duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                                <MessageCircle className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="text-3xl font-bold mb-1">10K+</div>
                            <div className="text-xs text-muted-foreground">Soru & Cevap</div>
                        </motion.div>

                        {/* Stat Card 3 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 hover:scale-105 transition-transform duration-300"
                        >
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                                <BookOpen className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold mb-1">500+</div>
                            <div className="text-xs text-muted-foreground">Makale</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
