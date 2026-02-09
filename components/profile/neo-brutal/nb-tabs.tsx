"use client";

import { cn } from "@/lib/utils";

interface NBTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: { id: string; label: string }[];
}

export function NBTabs({ activeTab, setActiveTab, tabs }: NBTabsProps) {
    return (
        <div className="flex border-4 border-black mb-6 shadow-[4px_4px_0_#000]">
            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "flex-1 py-3 font-black uppercase text-sm transition-all border-r-4 border-black last:border-r-0",
                        activeTab === tab.id
                            ? "bg-black text-white"
                            : "bg-white text-black hover:bg-gray-100"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
