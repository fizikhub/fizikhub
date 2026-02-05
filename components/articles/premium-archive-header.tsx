"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function PremiumArchiveHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const query = searchParams.get("search") || "";
        setSearchValue(query);
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set("search", searchValue);
        } else {
            params.delete("search");
        }
        router.push(`/makale?${params.toString()}`);
    };

    return (
        <section className="relative w-full pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
            {/* Academic Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-foreground/[0.03] to-transparent blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="h-px w-12 bg-foreground/20" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-foreground/40">Tahkikat & Mütalâa Arşivi</span>
                        <div className="h-px w-12 bg-foreground/20" />
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-medium text-foreground tracking-tight leading-none">
                        Bilim Arşivi
                    </h1>

                    <p className="text-lg sm:text-xl font-serif italic text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        Evrenin sırlarını derinlemesine inceleyen makaleler, kuramsal analizler ve bilimsel perspektifler koleksiyonu.
                    </p>
                </motion.div>

                {/* Search Bar - Minimalist Journal Style */}
                <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative max-w-xl mx-auto group"
                >
                    <div className="absolute inset-0 bg-foreground/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Makale, konu veya yazar ara..."
                        className="w-full bg-background border-b-2 border-foreground/10 py-4 px-6 pr-12 text-lg font-serif focus:outline-none focus:border-foreground/40 transition-all placeholder:text-foreground/20 placeholder:italic"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors p-2"
                    >
                        <Search className="w-6 h-6 stroke-[1.5px]" />
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
