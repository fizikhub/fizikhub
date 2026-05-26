"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, Dices, Layers3, X } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DictionaryTerm } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";

interface DictionaryListProps {
    initialTerms: DictionaryTerm[];
}

const ALL_CATEGORIES = "Tümü";
const INITIAL_VISIBLE_COUNT = 36;
const VISIBLE_COUNT_STEP = 36;

function normalizeForSearch(value: string) {
    return value
        .toLocaleLowerCase("tr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function DictionaryList({ initialTerms }: DictionaryListProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [isRandomPending, startRandomTransition] = useTransition();
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const sortedTerms = useMemo(
        () => [...initialTerms].sort((a, b) => a.term.localeCompare(b.term, "tr")),
        [initialTerms],
    );

    const categories = useMemo(() => {
        const counts = new Map<string, number>();

        for (const term of sortedTerms) {
            if (!term.category) continue;
            counts.set(term.category, (counts.get(term.category) || 0) + 1);
        }

        return [
            { name: ALL_CATEGORIES, count: sortedTerms.length },
            ...Array.from(counts.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "tr")),
        ];
    }, [sortedTerms]);

    const filteredTerms = useMemo(() => {
        const normalizedSearchTerm = normalizeForSearch(deferredSearchTerm.trim());

        return sortedTerms.filter((item) => {
            const matchesCategory = activeCategory === ALL_CATEGORIES || item.category === activeCategory;
            if (!matchesCategory) return false;
            if (!normalizedSearchTerm) return true;

            return (
                normalizeForSearch(item.term).includes(normalizedSearchTerm) ||
                normalizeForSearch(item.definition).includes(normalizedSearchTerm) ||
                normalizeForSearch(item.category || "").includes(normalizedSearchTerm)
            );
        });
    }, [activeCategory, deferredSearchTerm, sortedTerms]);

    const visibleTerms = filteredTerms.slice(0, visibleCount);
    const hasMoreTerms = visibleCount < filteredTerms.length;

    useEffect(() => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    }, [activeCategory, deferredSearchTerm]);

    function openRandomTerm() {
        const pool = filteredTerms.length > 0 ? filteredTerms : sortedTerms;
        const randomTerm = pool[Math.floor(Math.random() * pool.length)];

        if (!randomTerm) return;

        startRandomTransition(() => {
            router.push(`/sozluk/${slugify(randomTerm.term)}`);
        });
    }

    return (
        <>
            <section className="mb-6 space-y-4" aria-label="Sözlük arama ve kategori filtreleri">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-600 dark:text-zinc-300">
                    <Layers3 className="h-4 w-4" />
                    Kategoriye göre ara
                </div>

                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                    {categories.map((category) => {
                        const isActive = category.name === activeCategory;

                        return (
                            <button
                                key={category.name}
                                type="button"
                                onClick={() => setActiveCategory(category.name)}
                                className={[
                                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-[3px] px-4 py-2 text-[11px] font-black uppercase transition-transform active:translate-x-0.5 active:translate-y-0.5",
                                    isActive
                                        ? "border-black bg-[#EAB308] text-black shadow-[3px_3px_0px_0px_#000]"
                                        : "border-black bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800",
                                ].join(" ")}
                                aria-pressed={isActive}
                            >
                                <span>{category.name}</span>
                                <span className="rounded-full border-2 border-black bg-white px-2 py-0.5 text-[10px] text-black">
                                    {category.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="mb-5 flex w-full flex-col gap-3 lg:flex-row">
                <div className="group relative flex-grow">
                    <div className="absolute left-[6px] top-[6px] h-full w-full rounded-xl bg-black transition-all duration-200 group-focus-within:left-[2px] group-focus-within:top-[2px]"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-black sm:h-6 sm:w-6" />
                        <Input
                            placeholder={activeCategory === ALL_CATEGORIES ? "Terim ara (örn: Entropi)..." : `${activeCategory} içinde ara...`}
                            className="h-14 w-full rounded-xl border-[3px] border-black bg-white pl-12 pr-12 text-base font-bold transition-all placeholder:font-medium placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-100 dark:text-black sm:h-16 sm:pl-14 sm:text-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-black transition-colors hover:bg-zinc-200"
                                aria-label="Aramayı temizle"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openRandomTerm}
                    disabled={isRandomPending || sortedTerms.length === 0}
                    className="flex h-14 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[#33EAA1] px-6 font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:bg-[#20CA86] disabled:cursor-wait disabled:opacity-70 sm:h-16"
                >
                    <Dices className="h-5 w-5 stroke-[2.5px]" />
                    {isRandomPending ? "Açılıyor" : "Rastgele"}
                </motion.button>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                <span>
                    {filteredTerms.length} sonuç
                    {activeCategory !== ALL_CATEGORIES ? ` · ${activeCategory}` : ""}
                </span>
                {(activeCategory !== ALL_CATEGORIES || searchTerm) && (
                    <button
                        type="button"
                        onClick={() => {
                            setActiveCategory(ALL_CATEGORIES);
                            setSearchTerm("");
                        }}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] dark:bg-zinc-900 dark:text-white"
                    >
                        <X className="h-4 w-4" />
                        Filtreyi temizle
                    </button>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {visibleTerms.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.18, delay: Math.min(index, 8) * 0.012 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex h-full flex-col"
                            style={{ contentVisibility: index > 8 ? 'auto' : 'visible', containIntrinsicSize: index > 8 ? 'auto 200px' : 'auto' }}
                        >
                            <Link
                                href={`/sozluk/${slugify(item.term)}`}
                                prefetch={index < 12}
                                className="relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] transition-colors hover:bg-neutral-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:min-h-[220px] sm:p-6"
                            >
                                <div className="relative z-10 mb-4 flex flex-col items-start gap-3">
                                    <h3 className="max-w-full break-words border-2 border-black bg-[#EAB308] px-2 py-1 text-xl font-black leading-tight text-black shadow-[2px_2px_0px_0px_#000] transition-transform origin-left -rotate-1 group-hover:rotate-0 sm:text-2xl">
                                        {item.term}
                                    </h3>
                                    <Badge variant="outline" className="rounded-full border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                                        {item.category}
                                    </Badge>
                                </div>

                                <p className="relative z-10 line-clamp-4 flex-grow font-['Inter'] text-sm font-semibold leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                                    {item.definition}
                                </p>

                                <span className="relative z-10 mt-4 inline-flex min-h-11 items-center self-start rounded-full border-2 border-black bg-white px-4 text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                                    Terimi aç
                                </span>

                                <div className="absolute -bottom-10 -right-10 z-0 h-24 w-24 rounded-full bg-gradient-to-br from-gray-100 to-transparent opacity-50 transition-transform duration-500 group-hover:scale-150 dark:from-zinc-800" />
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMoreTerms && (
                <div className="mt-7 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((count) => count + VISIBLE_COUNT_STEP)}
                        className="min-h-12 rounded-xl border-[3px] border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-0.5 dark:bg-zinc-900 dark:text-white"
                    >
                        Daha fazla terim göster
                    </button>
                </div>
            )}

            {filteredTerms.length === 0 && (
                <div className="py-16 text-center">
                    <div className="inline-block rounded-xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
                        <p className="mb-2 text-xl font-black text-black">Sonuç yok</p>
                        <p className="font-medium text-zinc-600">Aramayı genişletmeyi veya kategoriyi temizlemeyi dene.</p>
                    </div>
                </div>
            )}
        </>
    );
}
