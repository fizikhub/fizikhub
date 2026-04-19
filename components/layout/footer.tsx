"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="border-t border-zinc-200/50 dark:border-white/5 bg-white dark:bg-[#0A0A0A]">
            <div className="container max-w-[1250px] mx-auto px-4 md:px-8 py-16 lg:py-24">
                
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
                    
                    {/* Left: Brand Details */}
                    <div className="flex flex-col gap-6 lg:max-w-sm">
                        <div className="w-fit mix-blend-difference dark:mix-blend-normal">
                            <DankLogo />
                        </div>
                        <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                            Türkiye'nin ilk ve tek bilimi ti'ye alan araştırma-geliştirme platformu. Bilim, teknoloji ve evrenin sınırlarında dolaşıyoruz.
                        </p>
                        
                        <div className="flex items-center gap-1 mt-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-500/90 tracking-wide">Tüm sistemler çevrimiçi</span>
                        </div>
                    </div>

                    {/* Right: Grid Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 lg:w-3/5">
                        
                        <div className="flex flex-col gap-5">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px] tracking-widest uppercase">Laboratuvar</h3>
                            <div className="flex flex-col gap-3.5">
                                <Link href="/makale" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Kütüphane</Link>
                                <Link href="/simulasyonlar" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Simülasyonlar</Link>
                                <Link href="/deneysel" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Deneysel Alan</Link>
                                <Link href="/sözlük" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Fizik Sözlüğü</Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px] tracking-widest uppercase">Kozmos</h3>
                            <div className="flex flex-col gap-3.5">
                                <Link href="/forum" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Soru & Cevap</Link>
                                <Link href="/liderlik" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Skor Tablosu</Link>
                                <Link href="/rozetler" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Başarımlar</Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px] tracking-widest uppercase">Ağ</h3>
                            <div className="flex flex-col gap-3.5">
                                <Link href="/kurallar" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Evren Kuralları</Link>
                                <Link href="/hakkimizda" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Biz Kimiz?</Link>
                                <Link href="/iletisim" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Sinyal Gönder</Link>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px] tracking-widest uppercase">Protokol</h3>
                            <div className="flex flex-col gap-3.5">
                                <Link href="/kullanim-sartlari" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Şartlar</Link>
                                <Link href="/gizlilik-politikasi" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Gizlilik</Link>
                                <Link href="/kvkk" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">KVKK</Link>
                                <Link href="/cerezler" className="text-[14px] text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200">Çerezler</Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sub-footer Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-20 pt-8 border-t border-zinc-200/50 dark:border-white/5 gap-6">
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-500">
                        &copy; {new Date().getFullYear()} Fizikhub. Uzay-zaman sürekliliği koruma altında.
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <Link href="/rss" className="text-[13px] text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">RSS Bağlantısı</Link>
                        <Link href="/sitemap.xml" className="text-[13px] text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Yıldız Haritası</Link>
                        <a href="https://github.com/fizikhub" target="_blank" rel="noopener noreferrer" className="text-[13px] text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                            Açık Kaynak
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
