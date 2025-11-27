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
            <div className="relative max-w-md mx-auto mb-12">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Terim ara (örn: Entropi)..."
                    className="pl-10 h-12 text-lg bg-background/50 backdrop-blur border-primary/20 focus:border-primary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Terms Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                    {filteredTerms.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {item.term}
                                </h3>
                                <Badge variant="outline" className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                                    {item.category}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.definition}
                            </p>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
