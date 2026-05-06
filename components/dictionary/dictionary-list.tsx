"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
            <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <Input
                    placeholder="Terim ara: entropi, karadelik, kuantum..."
                    className="h-12 rounded-lg border border-zinc-700 bg-zinc-950 pl-11 text-base font-semibold text-white placeholder:font-medium placeholder:text-zinc-500 focus-visible:border-[#FFC800] focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {filteredTerms.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.16, delay: Math.min(index, 8) * 0.01 }}
                            className="group flex flex-col h-full"
                        >
                            <Link
                                href={`/sozluk/${slugify(item.term)}`}
                                className="flex h-full min-h-[168px] flex-col rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 transition-colors hover:border-[#FFC800]/70 hover:bg-zinc-900 sm:p-5"
                            >
                                <div className="mb-3 flex flex-col items-start gap-2">
                                    <h3 className="max-w-full break-words text-lg font-black leading-tight text-white sm:text-xl">
                                        {item.term}
                                    </h3>
                                    <Badge variant="outline" className="rounded-md border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                                        {item.category}
                                    </Badge>
                                </div>

                                <p className="flex-grow font-['Inter'] text-sm font-medium leading-relaxed text-zinc-400 sm:text-[15px]">
                                    {item.definition}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredTerms.length === 0 && (
                <div className="py-16 text-center">
                    <div className="inline-block rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                        <p className="mb-2 text-lg font-black text-white">Sonuç yok</p>
                        <p className="text-sm font-medium text-zinc-400">Aradığın terimi bulamadık.</p>
                    </div>
                </div>
            )}
        </>
    );
}
