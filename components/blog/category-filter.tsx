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
        <div className="flex flex-wrap gap-2">
            <Button
                variant={selectedCategory === "Tümü" ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory("Tümü")}
                className={cn(
                    "rounded-full transition-all duration-300",
                    selectedCategory === "Tümü"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:border-primary/50 hover:text-primary"
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
                        "rounded-full transition-all duration-300",
                        selectedCategory === category
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:border-primary/50 hover:text-primary"
                    )}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
