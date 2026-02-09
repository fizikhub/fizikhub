"use client";

import { cn } from "@/lib/utils";

interface NITabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: { id: string; label: string }[];
}

export function NITabs({ activeTab, setActiveTab, tabs }: NITabsProps) {
    return (
        <div className="flex gap-2 mb-4 px-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition-all border-2 border-black",
                        activeTab === tab.id
                            ? "bg-neo-vibrant-pink text-black shadow-[2px_2px_0_#000]"
                            : "bg-white text-black hover:bg-gray-50"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
