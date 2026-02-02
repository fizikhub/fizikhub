"use client";

import React from "react";
import { FeedItem } from "./unified-feed";
import { NexusCard } from "./nexus-card";
import { cn } from "@/lib/utils";

interface NexusGridProps {
    items: FeedItem[];
    suggestedUsers: any[];
}

export function NexusGrid({ items, suggestedUsers }: NexusGridProps) {
    // We want to create an "organized chaos" look.
    // On desktop, we can use a repeating grid pattern or just basic responsive grid.
    // Ideally, 1st item is BIG (Featured).

    const featuredItem = items[0];
    const restItems = items.slice(1);

    return (
        <div className="w-full pb-24">

            {/* 1. Featured Section (Full Width on Mobile, large on Desktop) */}
            {featuredItem && (
                <div className="mb-6 lg:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* If it's an article, we might give it special 'Hero' treatment, 
                 but for now using a large card variant */}
                    <div className="aspect-[4/3] md:aspect-[21/9] w-full">
                        <NexusCard
                            type={featuredItem.type}
                            data={featuredItem.data}
                            className="h-full"
                            featured={true}
                            index={0}
                        />
                    </div>
                </div>
            )}

            {/* 2. The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
                {restItems.map((item, idx) => {
                    // Logic to make some items span 2 columns if they are distinct (e.g. index 3, 7, etc.)
                    // For now, let's keep it simple masonry-ish.

                    // Random-ish span logic based on index (deterministic)
                    const isWide = (idx % 7 === 0 && idx !== 0);

                    return (
                        <div
                            key={`${item.type}-${item.data.id}-${idx}`}
                            className={cn(
                                "min-h-[300px]",
                                isWide ? "md:col-span-2" : "col-span-1"
                            )}
                        >
                            <NexusCard
                                type={item.type}
                                data={item.data}
                                index={idx + 1}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
