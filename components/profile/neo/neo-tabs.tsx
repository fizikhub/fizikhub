"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: React.ElementType;
    count?: number;
}

interface NeoTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function NeoTabs({ tabs, activeTab, onChange, className }: NeoTabsProps) {
    return (
        <div className={cn("flex w-full overflow-x-auto no-scrollbar gap-2 px-1 pb-1", className)}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-6 py-3 rounded-t-xl border-3 border-black border-b-0 transition-all min-w-max",
                            isActive
                                ? "bg-white z-10 -mb-[3px] pb-[15px]"
                                : "bg-neutral-200 hover:bg-neutral-100 mt-2"
                        )}
                    >
                        {tab.icon && <tab.icon className="w-4 h-4" />}
                        <span className="font-black uppercase tracking-tight text-sm">
                            {tab.label}
                        </span>
                        {tab.count !== undefined && (
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-bold border-2 border-black",
                                isActive ? "bg-[#facc15] text-black" : "bg-neutral-400 text-white"
                            )}>
                                {tab.count}
                            </span>
                        )}

                        {/* Shadow for depth */}
                        {isActive && (
                            <div className="absolute inset-x-0 -top-1 h-1 bg-white" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
