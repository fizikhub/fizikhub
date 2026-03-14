"use client";

import { AlertTriangle, BookOpen, Fingerprint, ShieldCheck, Microscope, Orbit, Link as LinkIcon, AlertOctagon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/30">
            <div className="container max-w-4xl mx-auto px-4">
                
                {/* Header Section */}
                <div className="mb-12 border-b-4 border-black dark:border-zinc-800 pb-8 relative">
                    <div className="absolute -top-10 -left-6 opacity-5 dark:opacity-10 pointer-events-none">
                        <Orbit className="w-64 h-64 animate-spin-slow" />
                    </div>
                    
                    <div className="flex gap-4 items-center mb-6">
                        <Link href="/yazar-paneli">
                            <Button variant="outline" className="font-bold border-2 border-black dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                ← Panele Dön
                            </Button>
                        </Link>
                        <span className="text-primary font-black tracking-widest text-sm uppercase bg-primary/10 px-3 py-1 border border-primary/20 rounded-md">
                            Gizlilik Derecesi: Halka Açık
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                        Bilim İletişiminin<br />
                        <span className="text-primary">"Bizden Biri"</span><br />
                        Hali
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl border-l-4 border-primary pl-4">
                        FizikHub Yazım Manifestosu: Fildişi kulelerden sokağın entropisine uzanan, bilginin evrimsel serüveni.
                    </p>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
                    
                    {/* Intro */}
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 mb-12">
                        <h2 className="flex items-center gap-3 mt-0 mb-4 border-b-2 border-transparent">
                            <Microscope className="w-8 h-8 text-indigo-500" />
                            Giriş: Merakın Evrensel Kodları
                        </h2>
                        <p>
                            İnsanlık tarihi, temelde tek bir büyük patlamanın entropik yankılarından ibarettir: <strong>"Bu evrenin mekaniği nasıl işliyor?"</strong> Gökyüzündeki yıldızların nükleer füzyonundan, hücre zarlarındaki iyon pompalarının milisaniyelik dansına kadar her fenomen, bu bitmek bilmeyen merak dizgesinin birer fraktalıdır. Ancak asırlar boyunca bilim, kendi ekosistemine izole olmuş, yüksek aktivasyon enerjisi gerektiren steril laboratuvar duvarları ardına hapsedilmiştir. Formüllerin soğuk metalik yüzeyi, Latince nomenklatürün ağırlığı ve p-değerlerinin gölgesinde saklanan kümülatif bilgi hazinesi; asıl sahibi olan "toplumla" rezonansa girmeyi unutmuştur.
                        </p>
                        <p>
                            FizikHub; bilimin bu yüksek enerjili duvarlarını kuantum tünelleme edasıyla aşmak, kapalı sistemleri dışarıya açarak entropiyi (ve böylece bilgiyi) tüm topluma yaymak için bir katalizördür. Bizler için <em>bilim iletişimi</em>, verileri monolog halinde kopyalamak değil; termodinamiğin acımasız yasalarını veya DNA dizilimindeki zarafeti sokaktaki insanın kahve masasına bir <strong>tutku</strong> olarak aktarabilme senfonisidir.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <h2 className="text-primary flex items-center gap-3">
                        <Fingerprint className="w-8 h-8" />
                        "Bizden Biri" Olmanın Biyomekaniği
                    </h2>
                    <p>
                        "Bizden biri" frekansında anlatmak, bilginin rezolüsyonunu düşürmek değil, frekansını <strong>toplumun anlayış spektrumuna ayarlamaktır (modülasyon).</strong> O mesafeli, didaktik dili; beynin ödül mekanizmasını (dopamin reseptörlerini) tetikleyecek samimi bir kurguyla sentezliyoruz. Yazarımız, sadece verileri raporlayan bir spektrometre değil; bir bulguyu keşfetmenin o otonom sınır tanımayan heyecanını dostuna fısıldayan bir rezonatördür. Üç temel katalizörümüz vardır:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                        <div className="bg-background border-2 border-black dark:border-zinc-800 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1">
                            <h3 className="text-xl font-black mb-2 text-rose-500">I. Samimiyet</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Karadeliğin ufkunu batık bir geminin girdabıyla, genotopik bir mutasyonu bir kod satırındaki "typo" ile özdeşleştirin. Okuyucu, bir makineyle değil, yaşayan, soluyan bir korteksle iletişimde olduğunu hissetmeli.
                            </p>
                        </div>
                        <div className="bg-background border-2 border-black dark:border-zinc-800 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1">
                            <h3 className="text-xl font-black mb-2 text-emerald-500">II. Berraklık</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Karmaşıklıktaki sinyali gürültüden (noise) ayırmak. Sicim kuramını veya epigenetik mekanizmaları bile doğru izomorfizmlerle kavranabilir kılmak. "Anlaşılmayan" konu yoktur, "izolasyonu kırılamamış" yazar vardır.
                            </p>
                        </div>
                        <div className="bg-background border-2 border-black dark:border-zinc-800 p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1">
                            <h3 className="text-xl font-black mb-2 text-blue-500">III. Tutku</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Fenomenin "ne" olduğundan ziyade ekosistemde "neden" var olduğu. Yazarın o konuya dair oksitosini ve adrenalini, okuyucunun sinapslarında çakacak yegâne kıvılcımdır.
                            </p>
                        </div>
                    </div>

                    {/* Section 2 - Academic Rigor */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-red-500">
                        <ShieldCheck className="w-8 h-8" />
                        Akademik Titizlik: Metodolojinin Sarsılmaz İskeleti
                    </h2>
                    <p>
                        Samimi dil kullanmak; verileri çarpıtmak veya literatürü ezmek demek değildir. Aksine, popülerleştirilmiş bilimin omurgasını taşıyan şey onun <strong>matematiksel ve ampirik dayanaklarıdır.</strong> Dezenformasyonun viral bir pandemi gibi yayıldığı bu çağda, FizikHub’ın tek aşısı "kaynakça denetimidir." 
                    </p>
                    <blockquote className="border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 p-4 text-red-900 dark:text-red-200 font-bold italic rounded-r-lg my-6">
                        "Referanssız bir fenomolojik iddia, sadece süslü bir peri masalıdır. Arkasında DOI gölgesi olmayan her bilgi şüphelidir."
                    </blockquote>
                    
                    <ul className="list-none pl-0">
                        <li className="flex gap-3 mb-4">
                            <LinkIcon className="w-6 h-6 text-zinc-500 mt-1 flex-shrink-0" />
                            <div>
                                <strong>DOI ve Hiperlink Disiplini:</strong> Kaynakça göstermek sadece sonda verilen bir liste değil; dijital dünyanın kalıcı parmak izlerini (DOI) kullanarak metnin genetiğine şeffaflık aşılamaktır. Güvenilir veri tabanlarındaki (NCBI, Nature, IEEE Xplore, arXiv) referanslar, anlatımımızın kırılmaz çeliğidir.
                            </div>
                        </li>
                        <li className="flex gap-3 mb-4">
                            <AlertOctagon className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                            <div>
                                <strong>Kelime Arkası Linkleme:</strong> Metnin akış dinamiğini bozmadan, okuyucunun merakını dindirecek orijinal paper linklerini doğrudan spesifik terimlerin altına gömün. Okuma deneyimini pürüzsüz ama teknik açıdan kurşungeçirmez yapmalıyız.
                            </div>
                        </li>
                    </ul>

                    {/* Section 3 - Visuals */}
                    <div className="bg-zinc-900 text-white p-8 md:p-10 rounded-3xl mt-12 relative overflow-hidden">
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                        
                        <h2 className="text-white mt-0 border-none relative z-10 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-primary" /> 
                            Görsel Estetik ve Telif Etiği
                        </h2>
                        <div className="relative z-10">
                            <p className="text-zinc-300">
                                Nöral ağlarımız görselleri metinden çok daha hızlı işler. FizikHub, bilimin o görsel şölenine en estetik şekilde sahip çıkar. Lakin bu görsellik "kopyala-yapıştır" tembelliğine veya izinsiz kullanıma dönüştüğünde, etik ihlal kaçınılmazdır. Emek hırsızlığı, akademik sahtekarlıkla (plagiarism) eşdeğer spektrumdadır.
                            </p>
                            
                            <div className="bg-black/50 border border-zinc-700/50 p-5 rounded-lg mt-6">
                                <h4 className="text-lg font-bold text-emerald-400 mt-0 mb-3">Güvenli Limanlarımız:</h4>
                                <ul className="text-sm text-zinc-300 space-y-2 mb-0">
                                    <li><strong className="text-white">Public Domain (Kamu Malı):</strong> Telif süresi dolmuş veya bağışlanmış (Örn: NASA Hubble arşivi, CERN Atlas datasnapleri).</li>
                                    <li><strong className="text-white">Creative Commons (CC-BY):</strong> Yaratıcısına akademik bir disiplinle atıf yapma koşuluyla kullanılabilen, lisanslı havuzlar.</li>
                                </ul>
                                <div className="mt-4 pt-4 border-t border-zinc-700/50">
                                    <span className="font-mono text-xs text-zinc-500 block mb-1">Zorunlu Görsel Atıf Sentaksı:</span>
                                    <code className="bg-zinc-800 text-primary px-2 py-1 rounded">Görsel: [Sanatçı/Araştırmacı Adı] / [Kurum: Örn. ESA] / [Lisans Türü: CC-BY]</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CheckList */}
                    <h2 className="mt-16">Otokontrol ve Son Kalibrasyon (Yayından Önceki 5 Test)</h2>
                    <p>
                        Bir FizikHub yazarı, taslağını sisteme itmeden (commit) önce, şu mikroskobik incelemeyi kendi metni üzerinde soğukkanlılıkla gerçekleştirmek zorundadır:
                    </p>
                    
                    <div className="space-y-4 not-prose">
                        {[
                            { question: "1. Terminolojik Filtrasyon:", desc: "Bu metni tıp okumayan veya mühendis olmayan, kafedeki bir lise arkadaşıma anlatsam 'Apostozis ne abi?' diyerek kopar mıydı? En komplike kavramı bile günlük bir metaforla köprüledin mi?" },
                            { question: "2. Kaynakça Zırhı:", desc: "Metinde 'Bu böyle bulundu' dediğin her spesifik datanın yanında bir DOI çapası duruyor mu? Fikrin, senin mi yoksa başkasının ampirik verisi mi?" },
                            { question: "3. Telif Güvenliği:", desc: "Kullandığın diyagramlar lisans koruması altında m? Telif radarına yakalanacak pikselleri arındırıp Public Domain veya CC havuzlarına sadık kaldın mı?" },
                            { question: "4. Aksiyon Potansiyeli (Kanca):", desc: "İlk paragrafın tetiği çekip, okuyucunun dopamin reseptörünü 'Bunu okumazsam eksik kalırım' hissiyle aktive etti mi?" },
                            { question: "5. 'Aha!' Anı (Evreka):", desc: "Okuyucu son cümleyi bitirdiğinde, dünyaya olan bakış açısında nanometrik düzeyde bile olsa bir paradigma kayması, bir uyanış yaşattın mı?" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 border-l-4 border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-r-lg">
                                <div className="text-xl font-black text-zinc-300 dark:text-zinc-700">{i + 1}</div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{item.question}</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 m-0">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Outro */}
                    <hr className="border-black dark:border-zinc-800 border-2 mt-16 mb-8" />
                    <div className="text-center max-w-2xl mx-auto">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-primary opacity-80" />
                        <h3 className="font-black text-2xl mb-4">Bir Sorumluluk Reddi Değil, Bir Yemin</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                            Laboratuvar tezgahlarında dirsek çürütülerek ulaşılan o saf veriler, birileri onları toplumun kalbine indirene dek karanlıkta kalmaya mahkumdur. Biz o karanlığı yırtan kuantum dalgalarıyız. Söylenen her söz, paylaşılan her görsel FizikHub standartlarının anayasasına sadık kalmalıdır. Unutmayın, bu sisteme atılan her imza, bilimi sokağa taşıyan büyük evrimin bir kod satırıdır.
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}
