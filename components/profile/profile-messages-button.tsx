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
                className="rounded-full h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-sm transition-all hover:scale-105"
                title="Mesajlarım"
            >
                <MessageSquare className="h-5 w-5" />
            </Button>
        </Link>
    );
}
