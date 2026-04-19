"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";

const TapeBanner = () => {
    // The animated marquee tape
    return (
        <div className="w-full bg-[#FACC15] text-black border-t border-b-[3px] border-black flex overflow-hidden whitespace-nowrap cursor-default select-none relative z-20 py-3">
            <div className="animate-marquee font-black uppercase tracking-widest text-sm md:text-base" style={{ minWidth: "200%", fontFamily: "var(--font-outfit)" }}>
                {Array(20).fill("BİLİMİ Tİ'YE ALIYORUZ AMA CİDDİLİ ŞEKİLDE • E=mc² • ΔS ≥ 0 • ").join("")}
            </div>
        </div>
    );
};

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="w-full bg-[#fdfdfd] dark:bg-[#09090b] relative z-10 font-sans mt-12">
            
            {/* 1. FAT YELLOW TAPE BANNER */}
            <TapeBanner />

            {/* 2. PUNK-SCIENCE HEAVY GRID */}
            <div className="container max-w-[1300px] mx-auto px-6 py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-12">
                    
                    {/* LEFT BRANDING: NO MOUSE-TRAPS, JUST PURE WEIGHT */}
                    <div className="flex flex-col gap-10 lg:w-1/3">
                        <div className="w-fit mix-blend-difference dark:mix-blend-normal transform scale-[1.15] md:scale-125 origin-left">
                            <DankLogo />
                        </div>
                        
                        <p className="text-lg md:text-xl font-black leading-snug text-black dark:text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                            Türkiye'nin <span className="text-[#FACC15]">Punk-Science</span> topluluğu.
                            <br />
                            <span className="opacity-50 dark:opacity-30">Kozmosun dilini çözüyoruz.</span>
                        </p>
                        
                        <div className="flex items-center gap-3 mt-4">
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-black dark:border-transparent"></span>
                            </span>
                            <span className="font-black text-sm md:text-base uppercase tracking-widest text-black dark:text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                                SİSTEMLER ÇEVRİMİÇİ
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: MASSIVE IN-YOUR-FACE LINKS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-16 lg:w-[60%]">
                        <div className="flex flex-col gap-8">
                            <h4 className="font-black text-sm text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-outfit)" }}>
                                // LABORATUVAR
                            </h4>
                            <div className="flex flex-col gap-4">
                                <FooterLink href="/makale">Kütüphane</FooterLink>
                                <FooterLink href="/simulasyonlar">Simülasyonlar</FooterLink>
                                <FooterLink href="/sözlük">Fizik Sözlüğü</FooterLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <h4 className="font-black text-sm text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-outfit)" }}>
                                // KOZMOS
                            </h4>
                            <div className="flex flex-col gap-4">
                                <FooterLink href="/forum">Tartışma</FooterLink>
                                <FooterLink href="/siralamalar">Hiyerarşi</FooterLink>
                                <FooterLink href="/rozetler">Rozetler</FooterLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <h4 className="font-black text-sm text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-outfit)" }}>
                                // SİNYAL AĞI
                            </h4>
                            <div className="flex flex-col gap-4">
                                <FooterLink href="/iletisim">Sinyal Gönder</FooterLink>
                                <FooterLink href="/hakkimizda">Biz Kimiz?</FooterLink>
                                <FooterLink href="/kurallar">Yıldız Yasaları</FooterLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <h4 className="font-black text-sm text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-outfit)" }}>
                                // PROTOKOL
                            </h4>
                            <div className="flex flex-col gap-4">
                                <FooterLink href="/kvkk">K.V.K.K.</FooterLink>
                                <FooterLink href="/gizlilik-politikasi">Gizlilik</FooterLink>
                                <FooterLink href="/sartlar">Çerezler</FooterLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM CLOSER STICKER */}
                <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-10 mt-28 pt-10 border-t-[3px] border-black dark:border-white/10">
                    <p className="font-black text-sm md:text-base tracking-widest uppercase text-black dark:text-zinc-500" style={{ fontFamily: "var(--font-outfit)" }}>
                        &copy; 2026 FIZIKHUB INC.
                    </p>

                    {/* Massive Bold "POPÜLER BİLİM" Sticker */}
                    <div className="flex items-center gap-2.5 bg-[#FACC15] text-black border-[3px] border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transform hover:rotate-[-2deg] transition-transform select-none cursor-default group">
                        <Rocket className="w-5 h-5 stroke-[2.5px] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        <span className="font-black text-sm md:text-[15px] tracking-widest uppercase" style={{ fontFamily: "var(--font-outfit)" }}>
                            UZAy-ZAMAN DEVREDE
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="group relative w-fit font-black text-2xl md:text-[32px] text-black dark:text-white uppercase tracking-tight transition-transform hover:translate-x-2 block"
            style={{ fontFamily: "var(--font-outfit)" }}
        >
            <span className="relative z-10">{children}</span>
            {/* The punk massive yellow highlight block from behind */}
            <span className="absolute left-0 bottom-[10%] w-[105%] h-[35%] bg-[#FACC15] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-[-1]"></span>
        </Link>
    );
}
