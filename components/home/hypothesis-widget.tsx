"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquarePlus, FlaskConical } from "lucide-react";
import Link from "next/link";

export function HypothesisWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-indigo-950/20 md:bg-gradient-to-r md:from-indigo-950/20 md:to-purple-900/20 p-6 backdrop-blur-sm"
        >
            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45">
                <FlaskConical size={150} className="text-indigo-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-300 uppercase tracking-wider">
                        <FlaskConical size={14} />
                        Haftanın Hipotezi
                    </span>
                    <span className="text-xs font-mono text-indigo-400/60">
                        #Deney42
                    </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black font-mono leading-tight mb-4 text-white">
                    "Işık hızında giden bir trende el feneri yakarsak ne olur?"
                </h3>

                <p className="text-indigo-200/80 text-sm md:text-base mb-6 leading-relaxed max-w-xl">
                    Einstein'ın özel görelilik teorisine göre ışık hızı sabittir, ancak referans sistemleri kafamızı karıştırıyor. Senin teorin ne?
                </p>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/forum/deney-42" // Ideally dynamic link
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    >
                        <MessageSquarePlus size={18} />
                        Teorini Yaz
                    </Link>
                    <Link
                        href="/forum"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-500/30 bg-transparent px-5 py-3 text-sm font-bold text-indigo-300 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/50"
                    >
                        Diğer Hipotezler
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
