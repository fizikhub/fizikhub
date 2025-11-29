"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function ProfileMessagesButton() {
    return (
        <Link href="/mesajlar">
            <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-10 w-10 bg-background/60 backdrop-blur-md border border-border/50 hover:bg-background/80 text-foreground shadow-sm transition-all hover:scale-105"
                title="Mesajlarım"
            >
                <MessageSquare className="h-5 w-5" />
            </Button>
        </Link>
    );
}
