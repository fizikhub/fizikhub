"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function NexusHero() {
    return (
        <div className="w-full mb-8 pt-4 pb-2">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">

                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="p-1 px-3 rounded-full border-2 border-black bg-[#CCFF00] text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] dark:border-white dark:shadow-[2px_2px_0px_0px_#fff] dark:text-black">
                            Günün Keşfi
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">03 Şubat 2026</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase leading-[0.9]"
                    >
                        Bilgi <br className="hidden md:block" />
                        <span className="text-primary transparent-text-outline">Nexus'una</span> <br className="md:hidden" />
                        Hoşgeldin.
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full md:w-auto"
                >
                    <Link href="/explore">
                        <button className="w-full md:w-auto neo-button-primary h-14 text-lg px-8 gap-2 group">
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Keşfe Başla
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
