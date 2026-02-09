"use client";

import { cn } from "@/lib/utils";

interface BrutalistTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: { id: string; label: string }[];
}

export function BrutalistTabs({ activeTab, setActiveTab, tabs }: BrutalistTabsProps) {
    return (
        <div className="flex gap-2 mb-5">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition-all border-[3px] border-black",
                        activeTab === tab.id
                            ? "bg-[#f472b6] text-black shadow-[3px_3px_0_#000]"  // Pink active
                            : "bg-white text-black hover:bg-gray-50"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
