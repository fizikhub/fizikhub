"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        replace(`/blog?${params.toString()}`);
    }, 500);

    return (
        <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
                type="text"
                placeholder="Makale, konu veya yazar ara..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/[0.07] focus:outline-none transition-all duration-300"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
            />
        </div>
    );
}
