"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContentTabsProps {
    tabs: { id: string; label: string; count?: number }[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export function ContentTabs({ tabs, activeTab, onTabChange, className }: ContentTabsProps) {
    return (
        <div className={cn("flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "relative px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-wide transition-all border-2 border-black whitespace-nowrap",
                        activeTab === tab.id
                            ? "bg-black text-white shadow-[4px_4px_0px_0px_#23A9FA] translate-x-[-2px] translate-y-[-2px]"
                            : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000]"
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={cn(
                            "ml-2 px-1.5 py-0.5 rounded text-[10px]",
                            activeTab === tab.id ? "bg-neo-vibrant-cyan text-black" : "bg-black text-white"
                        )}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
