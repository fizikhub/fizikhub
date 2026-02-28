"use client";

import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";

interface DateSeparatorProps {
    date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
    const d = new Date(date);

    let label: string;
    if (isToday(d)) {
        label = "Bugün";
    } else if (isYesterday(d)) {
        label = "Dün";
    } else {
        label = format(d, "d MMMM yyyy", { locale: tr });
    }

    return (
        <div className="flex items-center justify-center my-6 select-none">
            <div className="bg-zinc-800/60 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                    {label}
                </span>
            </div>
        </div>
    );
}
