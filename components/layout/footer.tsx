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
                <div className="flex flex-col items-center gap-4 md:items-end">
                    <div className="flex gap-4">
                        <a href="https://instagram.com/fizikhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                        <a href="https://twitter.com/fizikhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground md:justify-end">
                        <Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link>
                        <Link href="/iletisim" className="hover:underline">İletişim</Link>
                        <Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link>
                        <Link href="/kullanim-sartlari" className="hover:underline">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
