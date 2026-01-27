"use client";

import { cn } from "@/lib/utils";

interface Tab {
    value: string;
    label: string;
}

interface SocialTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SocialTabs({ tabs, activeTab, onChange, className }: SocialTabsProps) {
    return (
        <div className={cn("flex w-full overflow-x-auto no-scrollbar border-b border-neutral-200 dark:border-neutral-800", className)}>
            {tabs.map((tab) => {
                const isActive = tab.value === activeTab;
                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "flex-1 min-w-[80px] h-[52px] flex items-center justify-center relative hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors px-4",
                        )}
                    >
                        <span className={cn(
                            "text-sm sm:text-base font-bold transition-colors",
                            isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {tab.label}
                        </span>

                        {isActive && (
                            <div className="absolute bottom-0 h-1 w-16 bg-[#facc15] rounded-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
