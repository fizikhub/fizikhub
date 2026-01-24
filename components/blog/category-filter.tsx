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
                        "px-4 py-2 text-sm font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border-[2px] rounded-lg shadow-[2px_2px_0px_0px_#000]",
                        selectedCategory === "Tümü"
                            ? "bg-neo-yellow text-black border-black"
                            : "bg-white text-black border-black hover:bg-black hover:text-white"
                    )}
                >
                    Tümü
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "px-4 py-2 text-sm font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border-[2px] rounded-lg shadow-[2px_2px_0px_0px_#000]",
                            selectedCategory === category
                                ? "bg-neo-yellow text-black border-black"
                                : "bg-white text-black border-black hover:bg-black hover:text-white"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

