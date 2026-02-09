"use client";

import { cn } from "@/lib/utils";

interface NanoTabsProps {
    tabs: { id: string; label: string; count: number }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function NanoTabs({ tabs, activeTab, onTabChange }: NanoTabsProps) {
    return (
        <div className="flex border-b-2 border-black bg-gray-50 h-8">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1 text-[10px] font-black uppercase border-r border-black/10 last:border-r-0 hover:bg-gray-100 transition-colors",
                        activeTab === tab.id ? "bg-black text-neo-vibrant-lime" : "text-gray-500"
                    )}
                >
                    {tab.label}
                    <span className={cn(
                        "px-1 rounded text-[8px]",
                        activeTab === tab.id ? "bg-neo-vibrant-lime text-black" : "bg-gray-200 text-gray-600"
                    )}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
