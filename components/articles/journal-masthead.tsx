"use client";

import { cn } from "@/lib/utils";
import { Search, Terminal, Activity, Globe, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function JournalMasthead() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState("SYNCING...");

    useEffect(() => {
        const timeout = setTimeout(() => setStatus("SYSTEM_STABLE"), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) params.set("search", searchValue);
        else params.delete("search");
        router.push(`/makale?${params.toString()}`);
    };

    return (
        <header className="relative w-full bg-[#FAF9F6] dark:bg-zinc-950 border-b-[3px] border-black overflow-hidden selection:bg-[#FFC800]">
            {/* Technical Metadata Bar */}
            <div className="border-b-[1px] border-black/10 py-2 px-4 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/20">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        STATUS: <span className="text-emerald-500">{status}</span>
                    </span>
                    <span className="hidden md:inline">LOC: 41.0082° N, 28.9784° E (IST)</span>
                    <span className="hidden md:inline">ENGINE: ANTIGRAVITY_v4.0</span>
                </div>
                <div className="flex items-center gap-4">
                    <Globe className="w-3 h-3" />
                    <span>HTTPS://FIZIKHUB.COM/ARCHIVE</span>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-12 md:py-20 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    {/* Masthead Title */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Database className="w-3 h-3" /> Technical Repository
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-head text-black dark:text-white leading-[0.8] tracking-tighter uppercase italic">
                            TAHKİKAT<br />
                            <span className="text-[#FFC800] stroke-black stroke-2">ARŞİVİ</span>
                        </h1>
                        <p className="font-serif italic text-lg text-black/60 dark:text-white/40 max-w-sm border-l-2 border-black/10 pl-4 py-1">
                            "Evrenin matematiksel dokusuna dair derinlemesine teknik incelemeler ve analitik dökümantasyonlar."
                        </p>
                    </div>

                    {/* Terminal Style Search Bar */}
                    <div className="w-full md:w-96 space-y-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/40">
                            <Terminal className="w-4 h-4" />
                            <span>Run_Search_Command:</span>
                        </div>
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="QUERY_STRING..."
                                className="w-full bg-white dark:bg-zinc-900 border-[3px] border-black px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider placeholder:text-black/20 focus:outline-none shadow-neo-sm group-hover:shadow-neo transition-all"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#FFC800] border-2 border-transparent hover:border-black transition-all">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Background Blueprint Grid Line */}
            <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[linear-gradient(90deg,transparent_95%,rgba(0,0,0,0.05)_95%),linear-gradient(rgba(0,0,0,0.05)_5%,transparent_5%)] bg-[size:40px_40px] -z-10 pointer-events-none" />
        </header>
    );
}
