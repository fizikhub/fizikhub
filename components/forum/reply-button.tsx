"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyButtonProps {
    className?: string;
}

export function ReplyButton({ className }: ReplyButtonProps) {
    const handleClick = () => {
        const formElement = document.getElementById('answer-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "gap-1.5 h-9 px-3 rounded-lg border-[2px] border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-zinc-300 font-bold text-xs uppercase tracking-wider",
                "shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.08)]",
                "hover:bg-[#FFBD2E] hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] transition-all",
                className
            )}
            onClick={handleClick}
        >
            <MessageSquare className="h-3.5 w-3.5 stroke-[2.5px]" />
            <span className="hidden sm:inline">Cevapla</span>
        </Button>
    );
}
