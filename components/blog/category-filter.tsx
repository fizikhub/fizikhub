"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    return (
        <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            <div className="flex flex-nowrap md:flex-wrap gap-2 px-4 md:px-0 min-w-max md:min-w-0">
                <button
                    onClick={() => onSelectCategory("Tümü")}
                    className={cn(
                        "px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border-2",
                        selectedCategory === "Tümü"
                            ? "bg-amber-500 text-black border-amber-500"
                            : "bg-transparent text-white/70 border-white/20 hover:border-amber-500/50 hover:text-white"
                    )}
                >
                    Tümü
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border-2",
                            selectedCategory === category
                                ? "bg-amber-500 text-black border-amber-500"
                                : "bg-transparent text-white/70 border-white/20 hover:border-amber-500/50 hover:text-white"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

