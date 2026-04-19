"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";

// ═══════════════════════════════════════════════════════════════
// FOOTER v13 — TRUE MINIMAL
// Completely stripped down. No brutalism, no boxes, no noise.
// Pure typography, standard clean aesthetic, 100% professional.
// ═══════════════════════════════════════════════════════════════

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A]">
            <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="w-fit">
                            <DankLogo />
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
                            Türkiye'nin ilk ve tek bilimi ti'ye alan araştırma-geliştirme platformu. Bilim, teknoloji ve evrenin sınırlarında dolaşıyoruz.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider">Platform</h3>
                            <Link href="/makale" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Blog</Link>
                            <Link href="/simulasyonlar" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Simülasyonlar</Link>
                            <Link href="/sözlük" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Fizik Sözlüğü</Link>
                            <Link href="/hakkimizda" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Hakkımızda</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider">Destek & Yasal</h3>
                            <Link href="/iletisim" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">İletişim</Link>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Kullanım Şartları</Link>
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">Gizlilik Politikası</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FFC800] dark:hover:text-[#FFC800] transition-colors">KVKK Aydınlatma Metni</Link>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright Line */}
                <div className="mt-12 md:mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        &copy; 2026 Fizikhub. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>Uzay-zaman sürekliliği devrede.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
