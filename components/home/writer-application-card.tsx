"use client";

import { motion } from "framer-motion";
import { PenTool, Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function WriterApplicationCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background p-6 md:p-8"
        >
            {/* Background Decorations */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
                {/* Icon / Mascot Area */}
                <div className="relative">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
                        <PenTool className="w-10 h-10 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg rotate-12">
                        <Coffee className="w-5 h-5 text-orange-500" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                            Kalemin Kılıçtan Keskin mi? ✍️
                        </h3>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            "Menemen soğanlı mı olur soğansız mı?" sorusuna bilimsel bir yaklaşımın varsa ve bildiklerini anlatırken araya soğuk espriler sokuşturmayı seviyorsan...
                            <span className="block mt-2 font-bold text-amber-600 dark:text-amber-400">
                                Seni YAZAR kadromuzda görmek isteriz!
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <Link href="/basvuru/yazar" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold border-0 shadow-lg shadow-amber-900/20 group/btn">
                                Başvuru Formuna Işınlan
                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <p className="text-xs text-muted-foreground italic">
                            *Formda menemen sorusu var, ciddiyiz.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
