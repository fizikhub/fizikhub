"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollToAnswerButtonProps {
    className?: string;
}

export function ScrollToAnswerButton({ className }: ScrollToAnswerButtonProps) {
    return (
        <Button
            onClick={() => {
                document.getElementById('answer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={cn("w-full sm:w-auto px-6 py-3 border-2 border-primary hover:border-primary/80 active:scale-95 transition-all font-bold text-base", className)}
        >
            📝 Cevap Yaz
        </Button>
    );
}
