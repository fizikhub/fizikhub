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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black transition-colors" />
            <input
                type="text"
                placeholder="Makale, konu veya yazar ara..."
                className="peer w-full pl-10 pr-3 py-2.5 bg-white border-[2px] border-black rounded-lg text-sm text-black placeholder:text-black/50 focus:shadow-[3px_3px_0px_0px_#000] focus:outline-none transition-all duration-200 shadow-none"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
            />
        </div>
    );
}
