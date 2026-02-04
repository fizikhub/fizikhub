"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DictionaryTerm } from "@/lib/api";

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
            {/* Search Input - NEO STYLE */}
            <div className="relative max-w-xl mb-12">
                <div className="relative group">
                    <div className="absolute top-[6px] left-[6px] w-full h-full bg-black rounded-xl transition-all duration-200 group-focus-within:top-[2px] group-focus-within:left-[2px]"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-black z-10" />
                        <Input
                            placeholder="Terim ara (örn: Entropi)..."
                            className="pl-14 h-16 text-lg sm:text-xl font-bold bg-white dark:bg-zinc-100 dark:text-black border-[3px] border-black rounded-xl transition-all placeholder:text-zinc-400 placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Terms Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                            <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-5 sm:p-6 relative overflow-hidden">

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <h3 className="text-xl sm:text-2xl font-black bg-[#FFC800] text-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] -rotate-1 group-hover:rotate-0 transition-transform origin-left">
                                        {item.term}
                                    </h3>
                                    <Badge variant="outline" className="border-2 border-black bg-white text-black font-bold text-[10px] uppercase tracking-wider shadow-sm">
                                        {item.category}
                                    </Badge>
                                </div>

                                {/* Content */}
                                <p className="text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed flex-grow font-['Inter'] relative z-10">
                                    {item.definition}
                                </p>

                                {/* Decoration */}
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent dark:from-zinc-800 rounded-full z-0 opacity-50 group-hover:scale-150 transition-transform duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-block p-6 bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000]">
                        <p className="text-xl font-black text-black mb-2">🤔 Hmm...</p>
                        <p className="text-zinc-600 font-medium">Aradığın terimi bulamadık.</p>
                    </div>
                </div>
            )}
        </>
    );
}
