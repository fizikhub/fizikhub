"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MessageSquare, BookOpen, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchResult {
    title: string;
    description: string;
    href: string;
    icon: typeof FileText;
    category: "Sayfa" | "Forum" | "Blog";
}

const staticPages: SearchResult[] = [
    { title: "Ana Sayfa", description: "FizikHub ana sayfa", href: "/", icon: FileText, category: "Sayfa" },
    { title: "Forum", description: "Fizik soruları ve tartışmalar", href: "/forum", icon: MessageSquare, category: "Forum" },
    { title: "Blog", description: "Fizik makaleleri", href: "/blog", icon: FileText, category: "Blog" },
    { title: "Keşfet", description: "En iyi içerikleri keşfet", href: "/kesfet", icon: BookOpen, category: "Sayfa" },
    { title: "Sözlük", description: "Fizik terimleri sözlüğü", href: "/sozluk", icon: BookOpen, category: "Sayfa" },
    { title: "Testler", description: "Fizik testleri ve quizler", href: "/testler", icon: FileText, category: "Sayfa" },
    { title: "Sıralamalar", description: "Topluluk lider tablosu", href: "/siralamalar", icon: FileText, category: "Sayfa" },
];

export function CommandMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const filteredResults = query.trim() === ""
        ? staticPages
        : staticPages.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

    const handleSelect = useCallback((href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
    }, [router]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }

            if (!isOpen) return;

            if (e.key === "Escape") {
                setIsOpen(false);
                setQuery("");
                setSelectedIndex(0);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
            } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
                e.preventDefault();
                handleSelect(filteredResults[selectedIndex].href);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredResults, selectedIndex, handleSelect]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Command Menu */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999] px-4"
                    >
                        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                                <Search className="w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    placeholder="Ara..."
                                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 outline-none text-base"
                                    autoFocus
                                />
                                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-zinc-500">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {filteredResults.length === 0 ? (
                                    <div className="px-4 py-12 text-center text-zinc-500">
                                        Sonuç bulunamadı
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {filteredResults.map((result, index) => {
                                            const Icon = result.icon;
                                            return (
                                                <button
                                                    key={result.href}
                                                    onClick={() => handleSelect(result.href)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                                        index === selectedIndex
                                                            ? "bg-primary/20 text-white"
                                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{result.title}</div>
                                                        <div className="text-sm text-zinc-500 truncate">{result.description}</div>
                                                    </div>
                                                    <div className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">
                                                        {result.category}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded">↑↓</kbd> Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded">↵</kbd> Select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded">ESC</kbd> Close
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
