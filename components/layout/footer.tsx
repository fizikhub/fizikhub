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
        <footer className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-1">
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <DidYouKnow />
            <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-3 md:px-0">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-center text-sm font-medium text-muted-foreground md:text-left">
                        &copy; 2025 Fizikhub. <span className="opacity-70 font-normal">İzinsiz alıntı yapanı kara deliğe atarız.</span>
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 md:items-end">
                    <div className="flex gap-4">
                        <a
                            href="https://instagram.com/fizikhub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                        >
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                        <a
                            href="https://twitter.com/fizikhub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground/80 md:justify-end">
                        <Link href="/hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link>
                        <Link href="/gizlilik-politikasi" className="hover:text-primary transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim-sartlari" className="hover:text-primary transition-colors">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
