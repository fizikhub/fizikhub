"use client";

import { cn } from "@/lib/utils";

interface CompactTabsProps {
    tabs: { id: string; label: string; count?: number }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function CompactTabs({ tabs, activeTab, onTabChange }: CompactTabsProps) {
    return (
        <div className="flex border-b-2 border-black bg-gray-100 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex-1 items-center justify-center py-3 px-4 min-w-[100px] text-xs font-black uppercase tracking-wide transition-all border-r-2 border-black last:border-r-0 relative",
                        activeTab === tab.id
                            ? "bg-black text-white"
                            : "bg-transparent text-gray-500 hover:bg-gray-200"
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={cn(
                            "ml-1.5 text-[9px] px-1 py-0.5 rounded",
                            activeTab === tab.id ? "bg-neo-vibrant-cyan text-black" : "bg-gray-300 text-black"
                        )}>
                            {tab.count}
                        </span>
                    )}
                    {activeTab === tab.id && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-neo-vibrant-cyan" />
                    )}
                </button>
            ))}
        </div>
    );
}
