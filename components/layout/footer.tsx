"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Send, Rocket, Sparkles, Atom } from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const isChatPage = pathname?.match(/\/mesajlar\/.+/);
    const [isHovering, setIsHovering] = useState(false);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    if (isChatPage) return null;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 4000);
            setEmail("");
        }
    };

    return (
        <footer className="relative border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-[#050505]/95 backdrop-blur-md overflow-hidden mt-12 md:mt-0">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#FFC800]/5 to-transparent blur-[100px] opacity-20 dark:opacity-40" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 py-16 md:py-24">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand & Newsletter Section */}
                    <div className="col-span-1 md:col-span-12 xl:col-span-5 flex flex-col gap-8">
                        <div className="flex flex-col gap-4 max-w-sm">
                            <div className="w-fit transition-transform duration-500 hover:scale-[1.02]">
                                <DankLogo />
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                Evrenin kurallarını anlıyor, gerektiğinde esnetiyoruz. Türkiye'nin ilk ve tek bilimi ti'ye alan araştırma-geliştirme platformuna hoş geldin.
                            </p>
                        </div>

                        {/* Playful Newsletter */}
                        <div className="mt-4 max-w-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-widest" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>Kuantum Bülteni</h4>
                            </div>
                            <form onSubmit={handleSubscribe} className="relative group flex items-center">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative flex w-full">
                                    <input 
                                        type="email" 
                                        placeholder="E-posta adresin (belki)" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-300 dark:border-zinc-800 focus:border-[#FFD700] dark:focus:border-[#FFD700] rounded-l-lg px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100"
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-black dark:bg-white text-white dark:text-black px-5 rounded-r-lg font-bold text-sm hover:text-[#FFD700] dark:hover:text-[#FFD700] transition-colors flex items-center justify-center border-y border-r border-black dark:border-white"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                            {subscribed && (
                                <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                                    <Atom className="w-3 h-3 animate-spin duration-1000" /> Parçacıklar başarıyla yönlendirildi!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="col-span-1 md:col-span-12 xl:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                        
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider mb-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>Laboratuvar</h3>
                            <Link href="/makale" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Blog & Algı
                            </Link>
                            <Link href="/simulasyonlar" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Simülasyonlar
                            </Link>
                            <Link href="/deneysel" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Deneysel Alan
                            </Link>
                            <Link href="/sözlük" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Fizik Sözlüğü
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider mb-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>Topluluk</h3>
                            <Link href="/forum" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Forum & Soru
                            </Link>
                            <Link href="/liderlik" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Liderlik Tablosu
                            </Link>
                            <Link href="/rozetler" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Rozetler
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider mb-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>Ağ</h3>
                            <Link href="/kurallar" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Evren Kuralları
                            </Link>
                            <Link href="/hakkimizda" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Biz Kimiz?
                            </Link>
                            <Link href="/iletisim" className="group text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-[#FFD700]">›</span>
                                Sinyal Gönder
                            </Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-sm tracking-wider mb-2" style={{ fontFamily: "var(--font-outfit, sans-serif)" }}>Yasal</h3>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-500 hover:text-[#FFD700] transition-colors">Şartlar & Koşullar</Link>
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-500 hover:text-[#FFD700] transition-colors">Gizlilik</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-500 hover:text-[#FFD700] transition-colors">KVKK Metni</Link>
                            <Link href="/cerezler" className="text-sm text-zinc-500 hover:text-[#FFD700] transition-colors">Kuantum Çerezleri</Link>
                        </div>

                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent mt-16 mb-8" />

                {/* Bottom Copyright Line */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 px-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium tracking-wide text-center md:text-left">
                        &copy; {new Date().getFullYear()} FIZIKHUB. Tarafından kodlandı &#x1F47D;
                    </p>
                    
                    <div 
                        className="relative flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden group"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Uzay-zaman sürekliliği devrede.</span>
                        <div className={`relative z-10 transition-all duration-700 ease-in-out ${isHovering ? '-translate-y-6 translate-x-6 opacity-0' : 'translate-y-0 opacity-100'}`}>
                            <Rocket className="w-3 h-3 text-[#FFD700]" />
                        </div>
                        {isHovering && (
                             <span className="absolute inset-y-0 right-4 flex items-center text-[#FFD700] text-[10px] font-bold animate-pulse">
                                Yerçekimi hatası!
                             </span>
                        )}
                        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
