"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateQuestionDialog } from "./create-question-dialog";

export function ForumHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";

    const categories = [
        "Tümü",
        "Fizik",
        "Kuantum",
        "Astrofizik",
        "Mekanik",
        "Termodinamik",
        "Biyoloji",
        "Kimya",
        "Matematik",
        "Edebiyat",
        "Felsefe",
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery.trim()) {
            params.set("q", searchQuery);
        } else {
            params.delete("q");
        }

        router.push(`/forum?${params.toString()}`);
    };

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "Tümü") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`/forum?${params.toString()}`);
    };

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        router.push(`/forum?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Hero & Search Section */}
            <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background border border-white/10 shadow-xl sm:shadow-2xl shadow-primary/5 p-6 sm:p-8 md:p-12 text-center">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-8">
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Bilim Topluluğu
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                            Merak ettiklerini sor, tartışmalara katıl ve bilimin derinliklerini keşfet.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="relative group max-w-lg mx-auto w-full">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Merak ettiğin konuyu ara..."
                                className="pl-10 sm:pl-12 pr-20 sm:pr-24 h-11 sm:h-14 rounded-full bg-background/80 backdrop-blur-xl border-white/10 shadow-lg text-sm sm:text-base md:text-lg focus:ring-2 focus:ring-primary/20 transition-all w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute right-1.5 sm:right-2">
                                <Button size="sm" type="submit" className="rounded-full px-3 sm:px-4 md:px-6 h-8 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 text-xs sm:text-sm">
                                    Ara
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Categories & Actions Bar */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between sticky top-[60px] sm:top-[72px] z-30 py-2 -mx-4 px-4 md:mx-0 md:px-0 bg-background/95 backdrop-blur-xl border-b md:border-none border-border/40 md:bg-transparent md:backdrop-blur-none md:static">
                {/* Categories - Horizontal Scroll */}
                <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-1.5 sm:gap-2 min-w-max p-0.5 sm:p-1">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`
                                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border whitespace-nowrap
                                    ${currentCategory === category
                                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                        : "bg-card/50 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-primary/20 hover:shadow-md"
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end">
                    <div className="flex bg-card/50 p-0.5 sm:p-1 rounded-full border border-border/50 backdrop-blur-sm shadow-sm">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentSort === "newest" ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Yeni
                        </button>
                        <button
                            onClick={() => handleSortChange("popular")}
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${currentSort === "popular" ? "bg-background shadow-sm text-foreground ring-1 ring-black/5" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Popüler
                        </button>
                    </div>

                    <div className="h-6 sm:h-8 w-px bg-border/50 mx-0.5 sm:mx-1 hidden md:block" />

                    <div className="relative z-10">
                        <CreateQuestionDialog />
                    </div>
                </div>
            </div>
        </div>
    );
}
