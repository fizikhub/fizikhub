"use client";

import { Rocket, Github, Twitter, Instagram, Atom, Orbit, Disc } from "lucide-react"
import Link from "next/link";
import { DidYouKnow } from "@/components/ui/did-you-know";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");

    if (isMessagesPage) return null;

    return (
        <footer className="relative bg-black pt-1 overflow-hidden">
            {/* Event Horizon Warning Line */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-20 flex items-center justify-center overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-[10px] font-black text-primary uppercase tracking-[0.5em]">
                    DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ // DİKKAT // OLAY UFKUNA YAKLAŞILIYOR // TEKİLLİK TESPİT EDİLDİ
                </div>
            </div>

            {/* Black Hole Background Effect */}
            <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none opacity-30">
                <div className="absolute inset-0 rounded-full bg-primary blur-[100px] animate-pulse" />
                <div className="absolute inset-10 rounded-full bg-black blur-[50px]" />
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-20 rounded-full border border-primary/10 animate-[spin_15s_linear_infinite_reverse]" />
            </div>

            <DidYouKnow />

            <div className="container relative z-10 flex flex-col items-center justify-between gap-10 py-16 md:py-20">

                {/* Center Singularity Brand */}
                <div className="flex flex-col items-center gap-4 text-center group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative p-4 bg-black border border-primary/20 rounded-full group-hover:border-primary transition-colors duration-500">
                            <Atom className="h-8 w-8 text-primary animate-[spin_10s_linear_infinite]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tighter text-white">FİZİKHUB</h2>
                        <p className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">
                            EVRENİN KODLARINI ÇÖZÜYORUZ
                        </p>
                    </div>
                </div>

                {/* Technical Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left w-full max-w-4xl border-t border-white/10 pt-8">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Keşif Modülü</h4>
                        <Link href="/kesfet" className="text-sm text-muted-foreground hover:text-primary transition-colors">Keşfet</Link>
                        <Link href="/testler" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testler</Link>
                        <Link href="/sozluk" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sözlük</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Topluluk</h4>
                        <Link href="/forum" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forum</Link>
                        <Link href="/siralamalar" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sıralamalar</Link>
                        <Link href="/yazar" className="text-sm text-muted-foreground hover:text-primary transition-colors">Yazarlar</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Kurumsal</h4>
                        <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
                        <Link href="/iletisim" className="text-sm text-muted-foreground hover:text-primary transition-colors">İletişim</Link>
                        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Protokoller</h4>
                        <Link href="/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gizlilik</Link>
                        <Link href="/kullanim-sartlari" className="text-sm text-muted-foreground hover:text-primary transition-colors">Şartlar</Link>
                        <Link href="/kvkk" className="text-sm text-muted-foreground hover:text-primary transition-colors">KVKK</Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-white/10 pt-8 gap-6">
                    <p className="text-xs font-mono text-muted-foreground text-center md:text-left">
                        &copy; 2025 FİZİKHUB // TÜM HAKLARI SAKLIDIR.
                        <br />
                        <span className="text-primary/60">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                    </p>

                    <div className="flex gap-4">
                        <a
                            href="https://instagram.com/fizikhub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20"
                        >
                            <Instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </a>
                        <a
                            href="https://twitter.com/fizikhub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20"
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a
                            href="https://github.com/fizikhub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-primary/20"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">Github</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
