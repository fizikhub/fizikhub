"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function ProfileMessagesButton() {
    return (
        <Link href="/mesajlar">
            <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full font-bold h-10 px-4 bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80 transition-all shadow-sm"
            >
                <MessageSquare className="w-4 h-4" />
                <span>Mesajlar</span>
            </Button>
        </Link>
    );
}
