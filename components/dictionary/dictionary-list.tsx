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
            {/* Search Input */}
            <div className="relative max-w-xl mb-12">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-black dark:bg-white rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Terim ara (örn: Entropi)..."
                            className="pl-12 h-14 text-lg bg-background border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-muted-foreground/50 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Terms Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {filteredTerms.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="brutalist-card p-6 flex flex-col h-full rounded-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-2xl font-bold bg-primary/10 px-2 py-1 -ml-2 rounded w-fit">
                                    {item.term}
                                </h3>
                                <Badge variant="outline" className="border-2 border-black dark:border-white font-bold text-xs uppercase tracking-wider bg-secondary">
                                    {item.category}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed flex-grow">
                                {item.definition}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>Aradığın kelime henüz sözlüğümüze girmemiş. Belki de yeni bir keşif yaptın? 🤔</p>
                </div>
            )}
        </>
    );
}
