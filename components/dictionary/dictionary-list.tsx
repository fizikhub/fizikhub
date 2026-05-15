"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Dices } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DictionaryTerm } from "@/lib/api";
import Link from "next/link";
import { slugify } from "@/lib/slug";

interface DictionaryListProps {
    initialTerms: DictionaryTerm[];
}

export function DictionaryList({ initialTerms }: DictionaryListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTerms = initialTerms.filter((item) =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.term.localeCompare(b.term));

    return (
        <>
            {/* Search Input & Random Button - NEO STYLE */}
            <div className="mb-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
                <div className="relative group flex-grow">
                    <div className="absolute left-[6px] top-[6px] h-full w-full rounded-xl bg-black transition-all duration-200 group-focus-within:left-[2px] group-focus-within:top-[2px]"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-black sm:h-6 sm:w-6" />
                        <Input
                            placeholder="Terim ara (örn: Entropi)..."
                            className="h-14 w-full rounded-xl border-[3px] border-black bg-white pl-12 text-base font-bold transition-all placeholder:font-medium placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-100 dark:text-black sm:h-16 sm:pl-14 sm:text-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (initialTerms.length > 0) {
                            const randomIndex = Math.floor(Math.random() * initialTerms.length);
                            setSearchTerm(initialTerms[randomIndex].term);
                        }
                    }}
                    className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[#33EAA1] px-6 font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#20CA86] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:h-16"
                >
                    <Dices className="h-5 w-5 stroke-[2.5px]" />
                    Rastgele
                </button>
            </div>

            {/* Terms Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {filteredTerms.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group flex flex-col h-full"
                        >
                            <Link
                                href={`/sozluk/${slugify(item.term)}`}
                                className="relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-xl border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] dark:bg-zinc-900 sm:p-6"
                            >

                                {/* Header */}
                                <div className="relative z-10 mb-5 flex flex-col items-start gap-3">
                                    <h3 className="max-w-full break-words border-2 border-black bg-[#FFC800] px-2 py-1 text-xl font-black leading-tight text-black shadow-[2px_2px_0px_0px_#000] transition-transform origin-left -rotate-1 group-hover:rotate-0 sm:text-2xl">
                                        {item.term}
                                    </h3>
                                    <Badge variant="outline" className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                                        {item.category}
                                    </Badge>
                                </div>

                                {/* Content */}
                                <p className="relative z-10 flex-grow font-['Inter'] text-sm font-semibold leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                                    {item.definition}
                                </p>

                                {/* Decoration */}
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent dark:from-zinc-800 rounded-full z-0 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-block p-6 bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000]">
                        <p className="text-xl font-black text-black mb-2">Sonuç yok</p>
                        <p className="text-zinc-600 font-medium">Aradığın terimi bulamadık.</p>
                    </div>
                </div>
            )}
        </>
    );
}
