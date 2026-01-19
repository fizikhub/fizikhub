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
                "gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full h-10 px-4 transition-all",
                className
            )}
            onClick={handleClick}
        >
            <MessageSquare className="h-5 w-5 stroke-[2.5px]" />
            <span className="font-bold hidden sm:inline">Cevapla</span>
        </Button>
    );
}
