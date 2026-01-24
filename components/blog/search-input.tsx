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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black transition-colors" />
            <input
                type="text"
                placeholder="Makale, konu veya yazar ara..."
                className="peer w-full pl-12 pr-4 py-3.5 bg-white border-[3px] border-black rounded-xl text-black placeholder:text-black/50 focus:shadow-[4px_4px_0px_0px_#000] focus:outline-none transition-all duration-200 shadow-none"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("search")?.toString()}
            />
        </div>
    );
}
