"use client";

import React, { useState } from "react";
import { Search, ArrowRight, ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";
import { m as motion } from "framer-motion";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const suggestedSearches = [
        "Kuantum Fiziği", "İzafiyet Teorisi", "Karadelikler", "James Webb", "Sicim Teorisi", "Yapay Zeka", "Evrenin Genişlemesi"
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-black selection:text-[#00F5D4] dark:selection:bg-white dark:selection:text-black">
            <div className="container mx-auto py-8 md:py-16 px-4 max-w-4xl">

                {/* Header Back Button */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground border-2 border-black/20 dark:border-white/20 px-3 py-1.5 rounded-lg hover:border-black dark:hover:border-white transition-all group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Geri Dön
                    </Link>
                </div>

                {/* Big Search Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-[#B18CFF] text-black border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] -rotate-2 mb-6">
                        <Search className="w-12 h-12 stroke-[3px]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground drop-shadow-sm mb-4">
                        Evreni Araştır
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground font-bold">
                        Makaleler, sorular, yazarlar ve daha fazlasını FizikHub derinliklerinde bul.
                    </p>
                </motion.div>

                {/* Search Input Box (Neo-Brutalist) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative max-w-2xl mx-auto group"
                >
                    <div className="absolute inset-0 bg-[#00F5D4] rounded-2xl transform translate-x-2 translate-y-2 border-[3px] border-black" />
                    <form onSubmit={(e) => { e.preventDefault(); }} className="relative bg-white dark:bg-zinc-900 border-[3px] border-black rounded-2xl flex items-center p-2 focus-within:-translate-y-1 focus-within:-translate-x-1 focus-within:shadow-[6px_6px_0px_#000] transition-all duration-200">
                        <div className="p-3 text-muted-foreground">
                            <Search className="w-6 h-6 stroke-[3px]" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Örn: Kuantum dolanıklık nedir?"
                            className="flex-1 bg-transparent border-none outline-none text-foreground font-bold text-lg px-2 placeholder:text-muted-foreground/50 h-12"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-sm border-2 border-black hover:bg-[#FFD100] hover:text-black transition-colors flex items-center gap-2 group/btn"
                        >
                            <span className="hidden sm:inline">Ara</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>

                {/* Tags / Suggested Items */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto mt-12"
                >
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b-2 border-black/10 dark:border-white/10 pb-2 mb-4">Önerilen Taramalar</h3>
                    <div className="flex flex-wrap gap-3">
                        {suggestedSearches.map((tag, i) => (
                            <button
                                key={i}
                                onClick={() => setQuery(tag)}
                                className="px-4 py-2 bg-card border-2 border-black dark:border-zinc-700 rounded-lg text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:bg-[#FFD100] hover:text-black dark:hover:bg-[#FFD100] dark:hover:text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Empty State / Coming Soon */}
                {query.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto mt-12 bg-card border-2 border-dashed border-black/20 dark:border-white/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] mb-4">
                            <SearchX className="w-8 h-8 text-muted-foreground stroke-[2px]" />
                        </div>
                        <h4 className="text-xl font-black uppercase">Sonuçlar Yükleniyor...</h4>
                        <p className="text-muted-foreground font-medium mt-2 max-w-md">
                            Arama algoritmamız şu anda kalibre ediliyor. "{query}" için evrenin her köşesini tarıyoruz. Çok yakında tüm sonuçları burada görebileceksin!
                        </p>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
