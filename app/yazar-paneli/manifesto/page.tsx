import { BookOpen, Sparkles, Quote, Target, ShieldCheck, PenTool, AlertTriangle, ChevronDown, CheckCircle2, Lightbulb, FileText, Bot } from "lucide-react";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-yellow-400 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-black" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter uppercase italic">FizikHub Yazar Manifestosu</h1>
                    <p className="text-xl font-bold text-muted-foreground max-w-2xl mx-auto uppercase tracking-widest">
                        Bilimi "Bizden Biri" Gibi Anlatma Rehberi
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Intro Section */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <Quote className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Bilim İletişiminin "Bizden Biri" Hali</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-4 text-lg font-medium">
                            <p>
                                İnsanlık tarihi tek bir sorunun etrafında örülen devasa bir halıdır: <strong>"Bu dünya nasıl çalışıyor?"</strong> Gökyüzündeki yıldızların hareketinden, hücrenin derinliklerindeki katlanmalara kadar her şey merakımızın bir parçası... Fakat zamanla bilim; içine kapalı, steril, yüksek duvarları olan bir laboratuvara dönüştü.
                            </p>
                            <p>
                                FizikHub tam da bu kopukluğu gidermek, o fildişi kulelerin kapılarını ardına kadar açmak ve bilimi ait olduğu yere, yani sokağın sıcaklığına geri döndürmek için doğdu. Bizim için "Bilim İletişimi" sadece bilgi aktarmak değil; o bilgiyi bir hikayeye, tutkuya ve toplumsal bilince dönüştürme sanatıdır.
                            </p>
                        </div>
                    </section>

                    {/* Section 1: Bizden Biri Olmak */}
                    <section className="bg-yellow-400 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                                <Target className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">"Bizden biri" gibi anlatmak ne demek?</h2>
                        </div>
                        <div className="grid gap-6">
                            <div className="bg-white p-6 border-[3px] border-black rounded-lg">
                                <h3 className="text-xl font-black uppercase mb-2 text-black">1. Samimiyet</h3>
                                <p className="text-black font-medium leading-relaxed">
                                    Bilimi hayatın içinden örneklerle anlatmaktır. Bir karadeliği anlatırken mutfak lavabosundan, bir genetik mutasyonu anlatırken matbaa hatasından ilham alabilmektir.
                                </p>
                            </div>
                            <div className="bg-white p-6 border-[3px] border-black rounded-lg">
                                <h3 className="text-xl font-black uppercase mb-2 text-black">2. Berraklık</h3>
                                <p className="text-black font-medium leading-relaxed">
                                    Karmaşıklığın ardındaki sadeliği bulup çıkarmaktır. "Anlaşılmayan" bir konu, sadece "yeterince iyi anlatılmamış" bir konudur.
                                </p>
                            </div>
                            <div className="bg-white p-6 border-[3px] border-black rounded-lg">
                                <h3 className="text-xl font-black uppercase mb-2 text-black">3. Tutku</h3>
                                <p className="text-black font-medium leading-relaxed">
                                    Bilginin sadece "ne" olduğuyla değil, "neden" önemli olduğuyla ilgilenmektir.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: 5 Altın Kural */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Bilim Anlatıcılığında 5 Altın Kural</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Jargon Kullanma", desc: "Ancak kullanman gerekiyorsa hemen yanında günlük dilden bir karşılık ver." },
                                { title: "Günlük Hayat Benzetmesi", desc: "Mutlaka okuyucunun eline dokunabileceği, mutfağında bulabileceği bir benzetme yap." },
                                { title: "Hikaye Anlat", desc: "Sadece kuru veri verme; o verinin keşif yolculuğundaki heyecanı paylaş." },
                                { title: "Pratik Değer", desc: "'Peki bu benim ne işime yarar?' sorusuna metnin bir yerinde mutlaka cevap ver." },
                                { title: "Görsele Başvur", desc: "Kelimelerin yorulduğu yerde simülasyonların veya görsellerin gücünü kullan." }
                            ].map((rule, i) => (
                                <div key={i} className="flex gap-4 p-4 border-2 border-black rounded-lg bg-zinc-50 dark:bg-zinc-800">
                                    <span className="text-2xl font-black text-blue-500">{i + 1}.</span>
                                    <div>
                                        <h4 className="font-black uppercase text-lg text-black dark:text-white">{rule.title}</h4>
                                        <p className="font-medium text-muted-foreground">{rule.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Başlık Mimarisi */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-pink-500/10 border-2 border-pink-500 flex items-center justify-center">
                                <PenTool className="w-6 h-6 text-pink-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Başlık ve Alt Başlık Mimarisi</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-pink-500">Popüler Kültür Köprüsü</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Bilimi okuyucunun sevdiği bir popüler figür veya konseptle paketleyin.</p>
                                <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-900 dark:text-pink-300 text-sm p-3 rounded border-2 border-pink-200 dark:border-pink-800 font-bold italic">
                                    Örn: "Influencer Değil, İnfluenza: Virüslerin 'Viral' Olma Stratejileri"
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-blue-500">Ters Köşe Paradoksu</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Bilişsel çelişki yaratın. İmkansız görünen iddialarla merak uyandırın.</p>
                                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 text-sm p-3 rounded border-2 border-blue-200 dark:border-blue-800 font-bold italic">
                                    Örn: "Bakarsan Dağılırım: Kuantum Dünyasının Utangaç Parçacıkları"
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-emerald-500">Somutlaştırma</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Soyut kavramları günlük rutinle veya nesnelerle eşleştirin.</p>
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300 text-sm p-3 rounded border-2 border-emerald-200 dark:border-emerald-800 font-bold italic">
                                    Örn: "Hücrenin Yazım Hatası: Genetik Mutasyonlar Neden Kötü Değildir?"
                                </div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-amber-500">Oyunlaştırma</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Okuyucuyu senaryonun içine çekin. Gözlem ve deneye davet edin.</p>
                                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 text-sm p-3 rounded border-2 border-amber-200 dark:border-amber-800 font-bold italic">
                                    Örn: "Karadeliğe Düşseniz Noodle Olur Musunuz?"
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Anayasamız */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Anayasamız: Değiştirilemez Kurallar</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-5 bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <p className="text-lg font-bold text-black dark:text-white">
                                    "Ben öyle duydum" dediğiniz hiçbir yer olamaz. Her iddianızın arkasında bir <strong>DOI linki</strong> veya sağlam bir kaynakça kalesi yükselmelidir.
                                </p>
                            </div>
                            <div className="flex gap-4 p-5 bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                                <p className="text-lg font-bold text-black dark:text-white">
                                    Görselleriniz mutlaka <strong>Public Domain</strong> veya <strong>Creative Commons (CC)</strong> olmalıdır. Altlarında "Görsel: Sanatçı/Kurum/Lisans" atıfı bulunmalıdır.
                                </p>
                            </div>
                            <div className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-800 border-l-8 border-black dark:border-white rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 mt-2 shrink-0" />
                                <p className="text-lg font-bold text-black dark:text-white">
                                    Cümleleri kısa tutun. Eğer cümleniz üç satırı geçiyorsa, onu nokta ile ikiye bölün. Aktif ses kullanın ("Gözlemledik", "Bulduk").
                                </p>
                            </div>
                            <div className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-800 border-l-8 border-black dark:border-white rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 mt-2 shrink-0" />
                                <p className="text-lg font-bold text-black dark:text-white">
                                    <strong>De/Da</strong> ve <strong>Ki</strong> yazımına dikkat edin. En büyük prestij kaybı imla hatalarıdır. Sayı birim arasına boşluk koyun (Örn: 180 °C).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="bg-black text-white p-10 rounded-2xl border-[4px] border-yellow-400 relative overflow-hidden text-center shadow-[12px_12px_0px_0px_#facc15]">
                        <PenTool className="absolute -bottom-6 -right-6 w-48 h-48 text-white opacity-5" />
                        <h2 className="text-4xl font-black uppercase tracking-widest text-yellow-500 mb-4 italic">Sıra Sende!</h2>
                        <div className="max-w-2xl mx-auto space-y-6">
                            <p className="text-xl font-medium leading-relaxed opacity-90">
                                FizikHub'da biz bilgiyi sadece taşımıyor, merakı ateşliyoruz. Bilim soğuk olabilir, ama onu anlatan yürekler sıcak olduğu sürece o bilgi her kalbe ulaşacaktır. Kendi sesini bul, mizahını bilimin içine gizle ve en önemlisi; yazdığın her satırdan önce kendine o soruyu sor:
                            </p>
                            <div className="bg-yellow-400 text-black py-4 px-8 rounded-full inline-block font-black text-2xl uppercase tracking-tighter transform -rotate-2">
                                "Bunu arkadaşıma anlatsam heyecanlanır mıydı?"
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
