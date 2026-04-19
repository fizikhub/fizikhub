"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="w-full bg-[#fcfcfc] dark:bg-[#0A0A0A] border-t border-zinc-200 dark:border-white/5 relative z-10 font-sans">
            <div className="container max-w-[1250px] mx-auto px-6 py-16 md:py-24">
                
                {/* Main Content Grid */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-10">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:max-w-[340px]">
                        <div className="w-fit mix-blend-difference dark:mix-blend-normal hover:scale-[1.02] transition-transform duration-500 origin-left">
                            <DankLogo />
                        </div>
                        <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                            Bilimi ti'ye alıyoruz ama ciddi şekilde. Türkiye'nin ilk ve tek punk-science araştırma ve geliştirme platformu.
                        </p>
                        <div className="flex items-center gap-2.5 mt-2 text-[12px] font-semibold tracking-wide text-zinc-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SİSTEMLER ÇEVRİMİÇİ
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-12 lg:w-[65%]">
                        {/* 1 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 uppercase tracking-widest" style={{ fontFamily: "var(--font-outfit)" }}>
                                LABORATUVAR
                            </h4>
                            <div className="flex flex-col gap-3 font-medium text-[14px]">
                                <FooterLink href="/makale">Kütüphane</FooterLink>
                                <FooterLink href="/simulasyonlar">Simülasyonlar</FooterLink>
                                <FooterLink href="/deneysel">Deneysel Alan</FooterLink>
                                <FooterLink href="/sözlük">Fizik Sözlüğü</FooterLink>
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 uppercase tracking-widest" style={{ fontFamily: "var(--font-outfit)" }}>
                                KOZMOS
                            </h4>
                            <div className="flex flex-col gap-3 font-medium text-[14px]">
                                <FooterLink href="/forum">Tartışma</FooterLink>
                                <FooterLink href="/siralamalar">Hiyerarşi</FooterLink>
                                <FooterLink href="/rozetler">Rozetler</FooterLink>
                            </div>
                        </div>

                        {/* 3 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 uppercase tracking-widest" style={{ fontFamily: "var(--font-outfit)" }}>
                                AĞ
                            </h4>
                            <div className="flex flex-col gap-3 font-medium text-[14px]">
                                <FooterLink href="/kurallar">Evren Yasaları</FooterLink>
                                <FooterLink href="/hakkimizda">Biz Kimiz?</FooterLink>
                                <FooterLink href="/iletisim">Sinyal Gönder</FooterLink>
                            </div>
                        </div>

                        {/* 4 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="font-bold text-[13px] text-zinc-900 dark:text-zinc-100 uppercase tracking-widest" style={{ fontFamily: "var(--font-outfit)" }}>
                                YASAL
                            </h4>
                            <div className="flex flex-col gap-3 font-medium text-[14px]">
                                <FooterLink href="/kvkk">K.V.K.K.</FooterLink>
                                <FooterLink href="/gizlilik-politikasi">Gizlilik</FooterLink>
                                <FooterLink href="/cerezler">Çerezler</FooterLink>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Subfooter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 mt-16 border-t border-zinc-200 dark:border-white/5">
                    <p className="text-[12px] text-zinc-500 font-medium">
                        &copy; 2026 FIZIKHUB INC. TÜM HAKLARI SAKLIDIR.
                    </p>
                    
                    {/* Very Dainty Small Brutalist Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FACC15] border-[1.5px] border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] group select-none cursor-default transform rotate-[-1deg] hover:rotate-0 transition-transform">
                        <Rocket className="w-3 h-3 text-black stroke-[2.5px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-black" style={{ fontFamily: "var(--font-outfit)" }}>
                            UZAY-ZAMAN DEVREDE
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="group relative w-fit text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors duration-300">
            {children}
            <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-zinc-300 dark:bg-zinc-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
        </Link>
    );
}
