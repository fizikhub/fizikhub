"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Atom,
    BookOpen,
    BrainCircuit,
    FileText,
    Loader2,
    MessageCircle,
    Search,
    SearchX,
    User,
} from "lucide-react";
import { m as motion } from "framer-motion";
import { searchGlobal, type SearchResult, type SearchResultType } from "@/app/search/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const suggestedSearches = [
    "Kuantum Fiziği",
    "İzafiyet Teorisi",
    "Karadelikler",
    "Entropi",
    "Atış hareketi",
    "Optik",
    "AYT fizik",
];

const typeLabels: Record<SearchResultType, string> = {
    article: "Makale",
    question: "Forum",
    user: "Kullanıcı",
    dictionary: "Sözlük",
    quiz: "Test",
    simulation: "Simülasyon",
};

const typeStyles: Record<SearchResultType, string> = {
    article: "bg-[#23A9FA] text-black",
    question: "bg-[#FFBD2E] text-black",
    user: "bg-[#28D17C] text-black",
    dictionary: "bg-[#B18CFF] text-black",
    quiz: "bg-[#FF6B6B] text-black",
    simulation: "bg-[#00F5D4] text-black",
};

function ResultIcon({ type }: { type: SearchResultType }) {
    const className = "h-5 w-5 stroke-[3px]";

    if (type === "article") return <FileText className={className} />;
    if (type === "question") return <MessageCircle className={className} />;
    if (type === "user") return <User className={className} />;
    if (type === "dictionary") return <BookOpen className={className} />;
    if (type === "quiz") return <BrainCircuit className={className} />;
    return <Atom className={className} />;
}

function getInitialQuery() {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("q") || "";
}

export default function SearchPage() {
    const [query, setQuery] = useState(getInitialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    const trimmedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);

    useEffect(() => {
        let ignore = false;

        if (trimmedQuery.length < 2) {
            queueMicrotask(() => {
                if (ignore) return;
                setResults([]);
                setLoading(false);
                setHasSearched(false);
            });
            return;
        }

        queueMicrotask(() => {
            if (ignore) return;
            setLoading(true);
            setHasSearched(true);
        });

        searchGlobal(trimmedQuery)
            .then((data) => {
                if (!ignore) setResults(data);
            })
            .catch((error) => {
                console.error("Search failed:", error);
                if (!ignore) setResults([]);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [trimmedQuery]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanQuery = query.trim();
        const nextUrl = cleanQuery ? `/ara?q=${encodeURIComponent(cleanQuery)}` : "/ara";
        window.history.replaceState(null, "", nextUrl);
    }

    return (
        <div className="min-h-screen bg-background selection:bg-black selection:text-[#00F5D4] dark:selection:bg-white dark:selection:text-black">
            <div className="container mx-auto py-8 md:py-14 px-4 max-w-5xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground border-2 border-black/20 dark:border-white/20 px-3 py-1.5 rounded-lg hover:border-black dark:hover:border-white transition-all group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Geri Dön
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-[#B18CFF] text-black border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] -rotate-2 mb-6">
                        <Search className="w-12 h-12 stroke-[3px]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground drop-shadow-sm mb-4">
                        Evreni Araştır
                    </h1>
                    <p className="text-sm md:text-lg text-muted-foreground font-bold">
                        Makaleler, forum soruları, kullanıcılar, sözlük, testler ve simülasyonlar tek yerde.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative max-w-3xl mx-auto group"
                >
                    <div className="absolute inset-0 bg-[#00F5D4] rounded-2xl transform translate-x-2 translate-y-2 border-[3px] border-black" />
                    <form
                        onSubmit={handleSubmit}
                        className="relative bg-white dark:bg-zinc-900 border-[3px] border-black rounded-2xl flex items-center p-2 focus-within:-translate-y-1 focus-within:-translate-x-1 focus-within:shadow-[6px_6px_0px_#000] transition-all duration-200"
                    >
                        <div className="p-3 text-muted-foreground">
                            {loading ? (
                                <Loader2 className="w-6 h-6 stroke-[3px] animate-spin" />
                            ) : (
                                <Search className="w-6 h-6 stroke-[3px]" />
                            )}
                        </div>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Örn: Kuantum dolanıklık nedir?"
                            className="flex-1 bg-transparent border-none outline-none text-foreground font-bold text-base sm:text-lg px-2 placeholder:text-muted-foreground/50 h-12 min-w-0"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-5 sm:px-6 py-3 rounded-xl font-black uppercase text-sm border-2 border-black hover:bg-[#FFD100] hover:text-black transition-colors flex items-center gap-2 group/btn"
                        >
                            <span className="hidden sm:inline">Ara</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto mt-8"
                >
                    <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b-2 border-black/10 dark:border-white/10 pb-2 mb-4">
                        Önerilen Taramalar
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {suggestedSearches.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="px-4 py-2 bg-card border-2 border-black dark:border-zinc-700 rounded-lg text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:bg-[#FFD100] hover:text-black dark:hover:bg-[#FFD100] dark:hover:text-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <section className="max-w-3xl mx-auto mt-10" aria-live="polite">
                    {results.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                    {results.length} sonuç
                                </h2>
                                <span className="text-xs font-bold text-muted-foreground truncate">
                                    {trimmedQuery}
                                </span>
                            </div>

                            {results.map((result) => (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.url}
                                    className="group block rounded-xl border-[3px] border-black bg-card p-4 sm:p-5 shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
                                >
                                    <article className="flex gap-4">
                                        <div
                                            className={cn(
                                                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-black shadow-[2px_2px_0px_#000]",
                                                typeStyles[result.type]
                                            )}
                                        >
                                            <ResultIcon type={result.type} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {typeLabels[result.type]}
                                                </span>
                                                {result.category && (
                                                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                        {result.category}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                                                {result.title}
                                            </h3>
                                            {result.description && (
                                                <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground line-clamp-2">
                                                    {result.description}
                                                </p>
                                            )}
                                        </div>
                                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {hasSearched && !loading && results.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border-2 border-dashed border-black/20 dark:border-white/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
                        >
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] mb-4">
                                <SearchX className="w-8 h-8 text-muted-foreground stroke-[2px]" />
                            </div>
                            <h2 className="text-xl font-black uppercase">Sonuç bulunamadı</h2>
                            <p className="text-muted-foreground font-medium mt-2 max-w-md">
                                Daha kısa bir kavram, farklı yazım ya da fizik alanı adıyla tekrar dene.
                            </p>
                        </motion.div>
                    )}
                </section>
            </div>
        </div>
    );
}
