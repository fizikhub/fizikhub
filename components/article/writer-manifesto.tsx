"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, BookOpen, Quote, Target, AlertTriangle, ShieldCheck, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function WriterManifesto() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full mb-6 bg-white dark:bg-[#121212] border-[3px] border-black rounded-[12px] shadow-[4px_4px_0px_#000] overflow-hidden transition-all duration-300">
            {/* Header / Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-5 bg-yellow-400 hover:bg-yellow-500 transition-colors text-black text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black flex items-center justify-center rounded-lg shadow-[2px_2px_0px_rgba(255,255,255,0.3)]">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg sm:text-xl uppercase tracking-tighter">FizikHub Yazım Manifestosu</h2>
                        <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">Yazarlar için kılavuz</p>
                    </div>
                </div>
                <div className={cn(
                    "w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white transition-transform duration-300 shadow-[2px_2px_0px_#000]",
                    isOpen && "rotate-180 bg-black text-white"
                )}>
                    <ChevronDown className="w-5 h-5 stroke-[3]" />
                </div>
            </button>

            {/* Content Area */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 sm:p-8 border-t-[3px] border-black space-y-8 text-black dark:text-zinc-200 font-medium">

                            {/* Intro */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Quote className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <h3 className="font-black text-lg uppercase tracking-tight">Bilim İletişiminin "Bizden Biri" Hali</h3>
                                </div>
                                <p className="leading-relaxed">
                                    İnsanlık tarihi tek bir sorunun etrafında örülen devasa bir halıdır: <b>"Bu dünya nasıl çalışıyor?"</b> Gökyüzündeki yıldızların hareketinden, hücrenin derinliklerindeki katlanmalara kadar her şey merakımızın bir parçası... Fakat zamanla bilim; içine kapalı, steril, yüksek duvarları olan bir laboratuvara dönüştü.
                                </p>
                                <p className="leading-relaxed">
                                    FizikHub tam da bu kopukluğu gidermek, o fildişi kulelerin kapılarını ardına kadar açmak ve bilimi ait olduğu yere, yani sokağın sıcaklığına geri döndürmek için doğdu. Bizim için "Bilim İletişimi" sadece bilgi aktarmak değil; o bilgiyi bir hikayeye, tutkuya ve toplumsal bilince dönüştürme sanatıdır.
                                </p>
                            </section>

                            {/* Section 1 */}
                            <section className="bg-zinc-50 dark:bg-zinc-900 border-l-[4px] border-yellow-500 p-4 rounded-r-lg">
                                <h4 className="font-black text-md uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-yellow-500" />
                                    "Bizden biri" gibi anlatmak ne demek?
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="font-black text-yellow-500">1.</span>
                                        <div>
                                            <strong className="text-black dark:text-white uppercase text-sm tracking-wider">Samimiyet:</strong>
                                            <span className="block text-sm mt-1 opacity-90">Bilimi hayatın içinden örneklerle anlatmaktır. Bir karadeliği anlatırken mutfak lavabosundan, bir genetik mutasyonu anlatırken matbaa hatasından ilham alabilmektir.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-black text-yellow-500">2.</span>
                                        <div>
                                            <strong className="text-black dark:text-white uppercase text-sm tracking-wider">Berraklık:</strong>
                                            <span className="block text-sm mt-1 opacity-90">Karmaşıklığın ardındaki sadeliği bulup çıkarmaktır. "Anlaşılmayan" bir konu, sadece "yeterince iyi anlatılmamış" bir konudur.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-black text-yellow-500">3.</span>
                                        <div>
                                            <strong className="text-black dark:text-white uppercase text-sm tracking-wider">Tutku:</strong>
                                            <span className="block text-sm mt-1 opacity-90">Bilginin sadece "ne" olduğuyla değil, "neden" önemli olduğuyla ilgilenmektir.</span>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            {/* Section 2 */}
                            <section className="space-y-4">
                                <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                    Başlık ve Alt Başlık Mimarisi
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-[#18181b] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_#000]">
                                        <h5 className="font-bold uppercase text-sm mb-1 text-black dark:text-white">Popüler Kültür Köprüsü</h5>
                                        <p className="text-xs opacity-80 mb-2">Bilimi okuyucunun sevdiği bir popüler figür veya konseptle paketleyin.</p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs p-2 rounded border border-yellow-200 dark:border-yellow-800 font-bold">
                                            Örn: "Influencer Değil, İnfluenza: Virüslerin 'Viral' Olma Stratejileri"
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#18181b] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_#000]">
                                        <h5 className="font-bold uppercase text-sm mb-1 text-black dark:text-white">Ters Köşe Paradoksu</h5>
                                        <p className="text-xs opacity-80 mb-2">Bilişsel çelişki yaratın. İmkansız görünen iddialarla merak uyandırın.</p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs p-2 rounded border border-yellow-200 dark:border-yellow-800 font-bold">
                                            Örn: "Bakarsan Dağılırım: Kuantum Dünyasının Utangaç Parçacıkları"
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#18181b] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_#000]">
                                        <h5 className="font-bold uppercase text-sm mb-1 text-black dark:text-white">Somutlaştırma</h5>
                                        <p className="text-xs opacity-80 mb-2">Soyut kavramları günlük rutinle veya nesnelerle eşleştirin.</p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs p-2 rounded border border-yellow-200 dark:border-yellow-800 font-bold">
                                            Örn: "Hücrenin Yazım Hatası: Genetik Mutasyonlar Neden Kötü Değildir?"
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#18181b] border-2 border-black p-4 rounded-xl shadow-[2px_2px_0px_#000]">
                                        <h5 className="font-bold uppercase text-sm mb-1 text-black dark:text-white">Meydan Okuma Oyunlaştırma</h5>
                                        <p className="text-xs opacity-80 mb-2">Okuyucuyu senaryonun içine çekin. Gözlem ve deneye davet edin.</p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs p-2 rounded border border-yellow-200 dark:border-yellow-800 font-bold">
                                            Örn: "Karadeliğe Düşseniz Noodle Olur Musunuz?"
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Rules */}
                            <section className="space-y-4">
                                <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    Altın Kurallar
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <li className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span className="text-sm">"Ben öyle duydum" dediğiniz hiçbir yer olamaz. Her iddianızın arkasında bir <b>DOI linki</b> veya sağlam bir kaynakça kalesi yükselmelidir.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span className="text-sm">Görselleriniz mutlaka <b>Public Domain</b> veya <b>Creative Commons (CC)</b> olmalıdır. Altlarında "Görsel: Sanatçı/Kurum/Lisans" atıfı bulunmalıdır.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                        <span className="text-sm">Cümleleri kısa tutun. Eğer cümleniz üç satırı geçiyorsa, onu nokta ile ikiye bölün. Aktif ses kullanın ("Gözlemledik").</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                        <span className="text-sm"><b>De/Da</b> ve <b>Ki</b> yazımına dikkat edin. En büyük prestij kaybı imla hatalarıdır. Sayı birim arasına boşluk koyun (Örn: 180 °C).</span>
                                    </li>
                                </ul>
                            </section>

                            {/* Conclusion */}
                            <div className="bg-black text-white p-5 rounded-xl text-center border-2 border-yellow-500 relative overflow-hidden">
                                <PenTool className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-10" />
                                <h4 className="font-black text-xl uppercase tracking-widest text-yellow-500 mb-2">Sıra Sende!</h4>
                                <p className="text-sm opacity-90 max-w-xl mx-auto">
                                    FizikHub'da biz bilgiyi sadece taşımıyor, merakı ateşliyoruz. Bilim soğuk olabilir, ama onu anlatan yürekler sıcak olduğu sürece o bilgi her kalbe ulaşacaktır. Kendi sesini bul, mizahını bilimin içine gizle ve en önemlisi; yazdığın her satırdan önce kendine o soruyu sor: <br /><br />
                                    <b>"Bunu arkadaşıma anlatsam heyecanlanır mıydı?"</b>
                                </p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
