"use client";

import { Rocket, Github, Twitter, Instagram } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");

    if (isMessagesPage) return null;

    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DidYouKnow />
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Rocket className="h-6 w-6 text-primary" />
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; 2025 Fizikhub. İzinsiz alıntı yapanı kara deliğe atarız.
                    </p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Instagram</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a>
                </div>
            </div>
        </footer>
    )
}
