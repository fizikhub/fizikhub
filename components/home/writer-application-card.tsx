"use client";

import { motion } from "framer-motion";
import { PenTool, Feather, ArrowRight, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WriterApplicationCard() {
    return (
        <Link href="/basvuru/yazar" className="block w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl bg-[#fffcf5] dark:bg-[#1a1816] border border-stone-200 dark:border-stone-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500"
            >
                {/* Decorative Background Elements - Soft, Abstract, Not Neon */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-orange-200/50 dark:group-hover:bg-orange-900/20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/50 dark:bg-amber-900/10 rounded-full blur-3xl -ml-24 -mb-24 transition-all duration-700 group-hover:bg-amber-200/50 dark:group-hover:bg-amber-900/20" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Visual Mascot Area */}
                    <div className="relative shrink-0">
                        {/* Main Icon Container */}
                        <div className="w-24 h-24 bg-white dark:bg-[#252220] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-stone-100 dark:border-stone-800 flex items-center justify-center relative rotate-3 group-hover:rotate-6 transition-transform duration-500">
                            <Feather className="w-10 h-10 text-orange-600 dark:text-orange-500" strokeWidth={1.5} />

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-3 -right-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                            >
                                PRO
                            </motion.div>
                        </div>

                        {/* Secondary Elements */}
                        <div className="absolute -bottom-4 -left-4 bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500 delay-75">
                            <Coffee className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                        </div>
                        <div className="absolute -top-2 -left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-heading">
                                Yazar Kadrosuna Katıl
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg leading-relaxed font-medium">
                                Bilim tutkunu musun? Kelimelerle aran iyi mi? <br className="hidden md:block" />
                                Fizikhub ailesinin bir parçası ol ve binlerce okura ulaş.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all duration-300 group/btn">
                                <span>Başvuru Formun Hazır</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>

                            <span className="text-xs font-serif italic text-stone-400 dark:text-stone-500">
                                *Sadece ciddi bilimseverler için.
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
