"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { Zap, Send } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);

    if (isChatPage) return null;

    return (
        <footer className="w-full bg-[#fafafa] dark:bg-[#09090b] border-t-[3px] border-black dark:border-white/10 relative z-10 overflow-hidden font-sans">
            {/* NOISE OVERLAY FOR TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] z-0 mix-blend-multiply dark:mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10 container max-w-[1250px] mx-auto px-4 md:px-6 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row justify-between gap-16">
                    
                    {/* Left: Brand details and Newsletter block */}
                    <div className="flex flex-col gap-8 w-full lg:max-w-md">
                        <div className="flex flex-col gap-4">
                            <div className="w-fit hover:rotate-[-2deg] transition-transform duration-300 origin-left">
                                <DankLogo />
                            </div>
                            <p className="text-black dark:text-zinc-300 font-bold text-sm leading-relaxed max-w-[320px]">
                                Bilimi ti'ye alıyoruz ama ciddi şekilde. Türkiye'nin tek punk-science topluluğu.
                            </p>
                        </div>

                        {/* Heavy Neo-Brutalist Newsletter */}
                        <div className="p-5 border-[3px] border-black dark:border-zinc-700 bg-white dark:bg-[#121214] shadow-[6px_6px_0px_0px_#FACC15] dark:shadow-[6px_6px_0px_0px_#FACC15] transform rotate-[-1deg] transition-transform hover:rotate-0">
                            <h4 className="font-black text-black dark:text-white uppercase tracking-tight text-lg mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
                                BİZE KATIL
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="email" 
                                    placeholder="e-posta@evren.com" 
                                    className="w-full bg-neutral-100 dark:bg-black border-[3px] border-black dark:border-zinc-700 px-4 py-2.5 text-black dark:text-white font-bold outline-none focus:border-black dark:focus:border-[#FACC15] transition-colors placeholder:text-zinc-400"
                                />
                                <button className="flex items-center justify-center gap-2 bg-[#FACC15] text-black border-[3px] border-black dark:border-transparent px-5 py-2.5 font-black uppercase tracking-tight hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#fff] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all outline-none" style={{ fontFamily: "var(--font-outfit)" }}>
                                    <Send strokeWidth={3} className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Thick Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 w-full lg:w-3/5">
                        <div className="flex flex-col gap-6">
                            <h3 className="font-black text-black dark:text-white text-xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
                                LAB
                            </h3>
                            <div className="flex flex-col gap-3 font-bold text-[15px]">
                                <NavLink href="/makale">Kütüphane</NavLink>
                                <NavLink href="/simulasyonlar">Simülasyonlar</NavLink>
                                <NavLink href="/deneysel">Deneysel Alan</NavLink>
                                <NavLink href="/sözlük">Fizik Sözlüğü</NavLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="font-black text-black dark:text-white text-xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
                                LİG
                            </h3>
                            <div className="flex flex-col gap-3 font-bold text-[15px]">
                                <NavLink href="/forum">Tartışma</NavLink>
                                <NavLink href="/siralamalar">Hiyerarşi</NavLink>
                                <NavLink href="/rozetler">Rozetler</NavLink>
                                <NavLink href="/liderler">Nobel Adayları</NavLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="font-black text-black dark:text-white text-xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
                                AĞ
                            </h3>
                            <div className="flex flex-col gap-3 font-bold text-[15px]">
                                <NavLink href="/kurallar">Evren Yasaları</NavLink>
                                <NavLink href="/hakkimizda">Biz Kimiz?</NavLink>
                                <NavLink href="/iletisim">Sinyal Çak</NavLink>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="font-black text-black dark:text-white text-xl uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
                                PROTOKOL
                            </h3>
                            <div className="flex flex-col gap-3 font-bold text-[15px]">
                                <NavLink href="/kvkk">K.V.K.K.</NavLink>
                                <NavLink href="/gizlilik-politikasi">Gizlilik</NavLink>
                                <NavLink href="/sartlar">Anlaşma</NavLink>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Separator & Badges Line */}
                <div className="flex flex-col-reverse justify-center md:flex-row items-center md:justify-between mt-20 pt-8 border-t-[3px] border-black dark:border-white/10 gap-8">
                    
                    <p className="font-black text-sm text-black dark:text-zinc-500 uppercase tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                        &copy; 2026 FIZIKHUB INC. 
                    </p>

                    <div className="flex items-center gap-4">
                        {/* Interactive Status Sticker */}
                        <div className="group relative pointer-events-auto">
                            <div className="flex items-center gap-2 bg-[#FACC15] border-[3px] border-black dark:border-black px-4 py-1.5 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all transform rotate-2 hover:rotate-0 cursor-default">
                                <Zap className="w-5 h-5 text-black fill-black stroke-[2.5px] animate-pulse" />
                                <span className="font-black text-[12px] sm:text-[13px] text-black uppercase tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                                    UZAy-ZAMAN SÜREKLİLİĞİ DEVREDE
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="group relative w-fit block text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150">
            <span className="absolute inset-x-0 bottom-0 h-2 bg-[#FACC15] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200 z-0"></span>
            <span className="relative z-10 block mix-blend-difference dark:mix-blend-normal hover:translate-x-[2px] transition-transform">{children}</span>
        </Link>
    );
}
