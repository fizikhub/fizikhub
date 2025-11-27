"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Clock, CheckCircle2, MessageSquare } from "lucide-react";

const categories = [
    { value: "Tümü", label: "Tümü", icon: null },
    { value: "Kuantum Fiziği", label: "Kuantum", icon: null },
    { value: "Astrofizik", label: "Astrofizik", icon: null },
    { value: "Termodinamik", label: "Termodinamik", icon: null },
    { value: "Mekanik", label: "Mekanik", icon: null },
    { value: "Elektromanyetizma", label: "Elektromanyetizma", icon: null },
    { value: "Genel Görelilik", label: "Görelilik", icon: null },
    { value: "Parçacık Fiziği", label: "Parçacık", icon: null }
];

const filters = [
    { value: "popular", label: "Popüler", icon: Flame },
    { value: "newest", label: "En Yeni", icon: Clock },
    { value: "solved", label: "Çözülen", icon: CheckCircle2 },
    { value: "unanswered", label: "Cevaplanmamış", icon: MessageSquare }
];

export function MobileFilterTabs() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategory = searchParams.get("category") || "Tümü";
    const currentSort = searchParams.get("sort") || "newest";
    const currentFilter = searchParams.get("filter");

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === "Tümü") {
            params.delete("category");
        } else {
            params.set("category", category);
        }
        router.push(`/forum?${params.toString()}`);
    };

    const handleFilterChange = (filterValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filterValue === "popular" || filterValue === "newest") {
            params.set("sort", filterValue);
            params.delete("filter");
        } else {
            params.set("filter", filterValue);
        }

        router.push(`/forum?${params.toString()}`);
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Categories - Horizontal Scroll */}
            <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {categories.map((category) => (
                        <Button
                            key={category.value}
                            variant={currentCategory === category.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange(category.value)}
                            className={cn(
                                "whitespace-nowrap rounded-full",
                                currentCategory === category.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background/50 hover:bg-muted"
                            )}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Filters - Horizontal Scroll */}
            <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {filters.map((filter) => {
                        const isActive =
                            (filter.value === "popular" || filter.value === "newest")
                                ? currentSort === filter.value
                                : currentFilter === filter.value;

                        const Icon = filter.icon;

                        return (
                            <Button
                                key={filter.value}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleFilterChange(filter.value)}
                                className={cn(
                                    "whitespace-nowrap gap-2 rounded-full",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background/50 hover:bg-muted"
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {filter.label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
