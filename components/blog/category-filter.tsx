"use client";

import { Button } from "@/components/ui/button";
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
                <Button
                    variant={selectedCategory === "Tümü" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectCategory("Tümü")}
                    className={cn(
                        "rounded-full transition-all duration-300 whitespace-nowrap",
                        selectedCategory === "Tümü"
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            : "bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:text-primary hover:bg-background/80"
                    )}
                >
                    Tümü
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "rounded-full transition-all duration-300 whitespace-nowrap",
                            selectedCategory === category
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                                : "bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:text-primary hover:bg-background/80"
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    );
}
