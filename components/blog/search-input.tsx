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
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 peer-focus:text-amber-500 transition-colors" />
            <input
                type="text"
                placeholder="Makale, konu veya yazar ara..."
                className="peer w-full pl-12 pr-4 py-3.5 bg-background border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)] focus:outline-none transition-all duration-300"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
            />
        </div>
    );
}
