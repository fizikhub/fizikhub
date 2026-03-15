"use client";

import { AlertTriangle, BookOpen, Fingerprint, ShieldCheck, Microscope, Orbit, Link as LinkIcon, AlertOctagon, ImageIcon, Heading, PenTool, FileText, CheckCircle2, ExternalLink, Lightbulb, Target, Search, Eye, Zap, BookMarked } from "lucide-react";
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
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                        FizikHub<br />
                        <span className="text-primary">Yazar Rehberi</span><br />
                        v2.0
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl border-l-4 border-primary pl-4">
                        Bilimi toplumsallaştıran, kusursuz ve profesyonel bilim anlatıcılığı için A'dan Z'ye kapsamlı rehber.
                    </p>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-li:text-lg">
                    
                    {/* Table of Contents */}
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 mb-12 not-prose">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                            <BookMarked className="w-6 h-6 text-primary" />
                            İçindekiler
                        </h2>
                        <ol className="space-y-2 text-sm">
                            {[
                                "Bilim Anlatıcılığının Önemi",
                                "Profesyonel Başlık Oluşturma Sanatı",
                                "İçerik Yazma Kuralları",
                                "Kaynak & Referans Standartları",
                                "Görsel Seçimi ve Telif Etiği",
                                "Makale Editörü: Teknik Rehber",
                                "AI İnceleme Süreci",
                                "Otokontrol ve Yayın Öncesi Checklist",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                    <span className="text-primary font-black text-lg w-8 text-center">{i + 1}</span>
                                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{item}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* ── SECTION 1: Bilim Anlatıcılığının Önemi ── */}
                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 mb-12">
                        <h2 className="flex items-center gap-3 mt-0 mb-4 border-b-2 border-transparent">
                            <Microscope className="w-8 h-8 text-indigo-500" />
                            1. Bilim Anlatıcılığının Önemi
                        </h2>
                        <p>
                            İnsanlık tarihi, temelde tek bir büyük patlamanın entropik yankılarından ibarettir: <strong>"Bu evrenin mekaniği nasıl işliyor?"</strong> Gökyüzündeki yıldızların nükleer füzyonundan, hücre zarlarındaki iyon pompalarının milisaniyelik dansına kadar her fenomen, bu bitmek bilmeyen merak dizgesinin birer fraktalıdır. Ancak asırlar boyunca bilim, kendi ekosistemine izole olmuş, yüksek aktivasyon enerjisi gerektiren steril laboratuvar duvarları ardına hapsedilmiştir.
                        </p>
                        <p>
                            FizikHub; bilimin bu yüksek enerjili duvarlarını kuantum tünelleme edasıyla aşmak, kapalı sistemleri dışarıya açarak entropiyi (ve böylece bilgiyi) tüm topluma yaymak için bir katalizördür. Bizler için <em>bilim iletişimi</em>, verileri monolog halinde kopyalamak değil; termodinamiğin acımasız yasalarını veya DNA dizilimindeki zarafeti sokaktaki insanın kahve masasına bir <strong>tutku</strong> olarak aktarabilme senfonisidir.
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
                    </div>

                    {/* ── SECTION 2: Profesyonel Başlık Oluşturma ── */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-amber-500">
                        <Heading className="w-8 h-8" />
                        2. Profesyonel Başlık Oluşturma Sanatı
                    </h2>
                    <p>
                        Başlık, makalenizin kapısıdır. Kötü bir başlık, harika bir içeriği gölgeler. İyi bir başlık ise okuyucunun dopamin reseptörlerini tetikler ve "bunu okumazsam eksik kalırım" hissini uyandırır.
                    </p>

                    <div className="space-y-4 not-prose my-8">
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-500/30 p-5 rounded-xl">
                            <h4 className="font-black text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> DOĞRU Başlık Örnekleri
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> "Karadelikler Neden Gerçekten Kara Değildir? — Hawking Radyasyonunun Perde Arkası"</li>
                                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> "Schrödinger'in Kedisi Aslında Ne Anlatıyor? Kuantum Süperpozisyonun 5 Dakikalık Özeti"</li>
                                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> "E=mc² Dediğimizde Tam Olarak Ne Kastediyoruz?"</li>
                                <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> "CERN'deki Son Deney: Higgs Bozonu Hakkında Bilmediğiniz 3 Gerçek"</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-500/30 p-5 rounded-xl">
                            <h4 className="font-black text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> YANLIŞ Başlık Örnekleri
                            </h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> "Karadelikler" <span className="text-muted-foreground italic">— Çok genel, merak uyandırmaz</span></li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> "Kuantum Fiziği Saçmalıktır!!!" <span className="text-muted-foreground italic">— Sansasyonel, bilim dışı</span></li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> "Fizik Yazım #42" <span className="text-muted-foreground italic">— Anlamsız numaralama</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="not-prose bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 mb-8">
                        <h4 className="font-black text-sm uppercase tracking-wider mb-3 text-muted-foreground">Başlık Formülleri</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3 items-start">
                                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div><strong>Merak Kapanı:</strong> "[Fenomen] Neden [Beklenmedik Sonuç]? — [Alt Başlık]"</div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Search className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div><strong>Soru Formatı:</strong> "[Bilimsel Kavram] Dediğimizde Tam Olarak Ne Kastediyoruz?"</div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div><strong>Sayısal Liste:</strong> "[Güncel Keşif] Hakkında Bilmediğiniz [X] Gerçek"</div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div><strong>Perde Arkası:</strong> "[Bilimsel Olay]'ın Perde Arkası: [Merak Uyandıran Detay]"</div>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 3: İçerik Yazma Kuralları ── */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-blue-500">
                        <PenTool className="w-8 h-8" />
                        3. İçerik Yazma Kuralları
                    </h2>

                    <div className="space-y-6 not-prose my-8">
                        {[
                            {
                                title: "Giriş Paragrafı: İlk 3 Saniyede Yakala",
                                desc: "İlk paragraf, makalenin tüm kaderini belirler. Okuyucu ilk 3 saniyede devam edip etmeyeceğine karar verir. Doğrudan şaşırtıcı bir gerçek, istatistik veya soruyla başlayın. Asla 'Bu makalede XY'den bahsedeceğim' demeyin.",
                                example: "\"Her saniye 4 milyon ton hidrojen, güneşin çekirdeğinde helyuma dönüşür. Bu cümleyi okuduğunuz sürede, güneş tam 16 milyon ton kütle kaybetti. Peki bu kaybolan kütle nereye gidiyor?\"",
                                icon: <Zap className="w-6 h-6 text-amber-500" />
                            },
                            {
                                title: "Analoji ve Metafor Kullanımı",
                                desc: "Teknik terimleri ilk kullandığınızda günlük hayattan bir analojiyle açıklayın. Okuyucunun zihninde görsel bir model oluşturun. Ama asla analojinin sınırlarını belirtmeyi ihmal etmeyin.",
                                example: "\"Kuantum süperpozisyon, bir paranın havada dönerken hem yazı hem tura olması gibidir — ama dikkat: para gerçekten ikisi birdendir, sadece 'bilmediğimiz' bir durum değil.\"",
                                icon: <Lightbulb className="w-6 h-6 text-amber-500" />
                            },
                            {
                                title: "Paragraf Yapısı ve Akış",
                                desc: "Her paragraf tek bir fikri işlesin. Paragraflar 3-5 cümle arasında olmalı. Uzun paragraflar okuyucuyu bunaltır, kısa paragraflar ise derinlikten yoksun kalır. Her bölüm arasında mantıksal bir köprü kurun.",
                                example: "Kötü: 10 cümlelik dev paragraf. İyi: Her bir iddianın kendi paragrafı olması ve sonraki paragrafla 'Peki ama...' gibi bir geçiş cümlesi.",
                                icon: <FileText className="w-6 h-6 text-blue-500" />
                            },
                            {
                                title: "Teknik Terim Politikası",
                                desc: "Teknik bir terimi ilk kez kullandığınızda parantez içinde kısa tanımını verin. İkinci kullanımdan itibaren doğrudan kullanabilirsiniz. Eğer bir formül varsa, formülün her sembolünün ne anlama geldiğini mutlaka açıklayın.",
                                example: "\"Bir cismin toplam mekanik enerjisi (kinetik + potansiyel enerji toplamı, E = KE + PE) korunan bir büyüklüktür.\"",
                                icon: <BookOpen className="w-6 h-6 text-violet-500" />
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                                <div className="p-5">
                                    <h4 className="font-black text-lg flex items-center gap-2 mb-2">{item.icon} {item.title}</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">{item.desc}</p>
                                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Örnek:</span>
                                        <p className="text-sm italic text-zinc-700 dark:text-zinc-300 m-0">{item.example}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── SECTION 4: Kaynak & Referans Standartları ── */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-red-500">
                        <ShieldCheck className="w-8 h-8" />
                        4. Kaynak & Referans Standartları
                    </h2>
                    <p>
                        Samimi dil kullanmak; verileri çarpıtmak veya literatürü ezmek demek değildir. Aksine, popülerleştirilmiş bilimin omurgasını taşıyan şey <strong>matematiksel ve ampirik dayanaklarıdır.</strong> Dezenformasyonun viral bir pandemi gibi yayıldığı bu çağda, FizikHub'ın tek aşısı "kaynak denetimidir." 
                    </p>
                    <blockquote className="border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 p-4 text-red-900 dark:text-red-200 font-bold italic rounded-r-lg my-6">
                        "Referanssız bir fenomenolojik iddia, sadece süslü bir peri masalıdır. Arkasında DOI gölgesi olmayan her bilgi şüphelidir."
                    </blockquote>

                    <div className="space-y-4 not-prose my-8">
                        <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                            <h4 className="font-black text-emerald-500 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Güvenilir Kaynak Türleri (Tier 1)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {[
                                    { name: "Nature, Science, Physical Review Letters", desc: "En üst düzey hakemli dergiler" },
                                    { name: "arXiv.org", desc: "Ön baskı sunucusu — referans verilirken 'henüz hakemli değil' notu düşülmeli" },
                                    { name: "NASA, ESA, CERN", desc: "Resmi kurumsal kaynaklar" },
                                    { name: "PubMed, IEEE Xplore", desc: "Tıp ve mühendislik için hakemli veritabanları" },
                                    { name: "Üniversite Press Yayınları", desc: "Cambridge, Oxford, MIT Press gibi akademik yayınevleri" },
                                    { name: "Textbook Referansları", desc: "Griffiths, Feynman Lectures gibi standart ders kitapları" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                                        <ExternalLink className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold text-xs">{item.name}</span>
                                            <p className="text-[11px] text-muted-foreground m-0">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                            <h4 className="font-black text-amber-500 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Dikkatli Kullanılacak Kaynaklar (Tier 2)
                            </h4>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">⚠</span> Wikipedia — Sadece genel bilgi almak için; referans olarak gösterilmez, ama kendi kaynakçasından orijinal makaleye ulaşılabilir.</li>
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">⚠</span> Popüler bilim siteleri (ScienceDaily, Phys.org) — Haber kaynağı olarak kullanılabilir ama asıl makaleye link verilmeli.</li>
                                <li className="flex gap-2"><span className="text-amber-500 font-bold">⚠</span> YouTube videoları — Eğitim amaçlı referans olabilir ama birincil kaynak olarak kabul edilmez.</li>
                            </ul>
                        </div>

                        <div className="bg-background border-2 border-red-500/30 rounded-xl p-5">
                            <h4 className="font-black text-red-500 mb-3 flex items-center gap-2">
                                <AlertOctagon className="w-5 h-5" /> ASLA Kaynak Olarak Kullanılmayacaklar
                            </h4>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> Kişisel bloglar ve forum yazıları (Reddit, Ekşi Sözlük vb.)</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> Sosyal medya paylaşımları (Twitter/X, Instagram vb.)</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> Kaynaksız haber siteleri ve "clickbait" içerikler</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">✗</span> AI tarafından üretilmiş ve doğrulanmamış içerikler</li>
                            </ul>
                        </div>
                    </div>

                    <div className="not-prose bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 mb-8">
                        <h4 className="font-black text-sm uppercase tracking-wider mb-3 text-muted-foreground">Kaynak Ekleme Format Rehberi</h4>
                        <div className="space-y-3 text-sm">
                            <div className="bg-background p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">Akademik Makale:</span>
                                <code className="text-xs">Başlık: "Observation of Gravitational Waves..." | Yazarlar: Abbott et al. | Yıl: 2016 | DOI: 10.1103/PhysRevLett.116.061102</code>
                            </div>
                            <div className="bg-background p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">Ders Kitabı:</span>
                                <code className="text-xs">Başlık: "Introduction to Quantum Mechanics" | Yazarlar: David J. Griffiths | Yayıncı: Cambridge University Press | Yıl: 2018</code>
                            </div>
                            <div className="bg-background p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">Kurum Kaynağı:</span>
                                <code className="text-xs">Başlık: "Hubble Deep Field" | Yazarlar: NASA/ESA | URL: https://hubblesite.org/... | Yıl: 2023</code>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 mb-0">
                            <strong>Kural:</strong> Her spesifik bilimsel iddia için en az bir kaynak gösterin. Genel kültür cümleleri kaynak gerektirmez, ama "deneysel olarak kanıtlandı" veya "araştırmalar gösteriyor ki" gibi cümleler mutlaka referans taşımalıdır.
                        </p>
                    </div>

                    {/* ── SECTION 5: Görsel Seçimi ── */}
                    <div className="bg-zinc-900 text-white p-8 md:p-10 rounded-3xl mt-12 relative overflow-hidden">
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                        
                        <h2 className="text-white mt-0 border-none relative z-10 flex items-center gap-3">
                            <ImageIcon className="w-8 h-8 text-primary" /> 
                            5. Görsel Seçimi ve Telif Etiği
                        </h2>
                        <div className="relative z-10">
                            <p className="text-zinc-300">
                                Nöral ağlarımız görselleri metinden çok daha hızlı işler. FizikHub, bilimin o görsel şölenine en estetik şekilde sahip çıkar. Lakin bu görsellik "kopyala-yapıştır" tembelliğine veya izinsiz kullanıma dönüştüğünde, etik ihlal kaçınılmazdır.
                            </p>
                            
                            <div className="bg-black/50 border border-zinc-700/50 p-5 rounded-lg mt-6">
                                <h4 className="text-lg font-bold text-emerald-400 mt-0 mb-3">Güvenli Görsel Kaynakları:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-300">
                                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                                        <strong className="text-white block mb-1">🛰️ NASA/ESA/JAXA Arşivleri</strong>
                                        Uzay görselleri genellikle Public Domain'dir. Hubble, James Webb fotoğrafları serbestçe kullanılabilir.
                                    </div>
                                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                                        <strong className="text-white block mb-1">⚛️ CERN Document Server</strong>
                                        Parçacık fiziği görselleri ve detektör fotoğrafları CC-BY lisansıyla erişilebilir.
                                    </div>
                                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                                        <strong className="text-white block mb-1">📸 Unsplash / Pexels</strong>
                                        Genel bilim temalı görseller için. Lisans: Ücretsiz, atıf isteğe bağlı.
                                    </div>
                                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                                        <strong className="text-white block mb-1">🎨 Kendi Çizimleriniz</strong>
                                        Mermaid şemaları, elle çizimler veya editörle oluşturulan diyagramlar — en güvenli yol!
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-zinc-700/50">
                                <span className="font-mono text-xs text-zinc-500 block mb-2">Zorunlu Görsel Atıf Formatı:</span>
                                <code className="bg-zinc-800 text-primary px-3 py-2 rounded block text-sm">Görsel: [Sanatçı/Araştırmacı Adı] / [Kurum: Örn. ESA] / [Lisans: CC-BY veya Public Domain]</code>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mt-4">
                                <p className="text-red-300 text-sm m-0 flex gap-2">
                                    <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span><strong>UYARI:</strong> Google Görseller'den direkt indirip kullanmak kesinlikle yasaktır. Her görselin orijinal kaynağına gidip lisansını doğrulayın. Telif ihlali, yazarın hesabının askıya alınmasına neden olur.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 6: Makale Editörü Rehberi ── */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-violet-500">
                        <FileText className="w-8 h-8" />
                        6. Makale Editörü: Teknik Rehber
                    </h2>
                    <p>
                        FizikHub editörü, profesyonel bilim yazarlığı için tasarlanmış güçlü bir araçtır. İşte editörünüzü en verimli şekilde kullanmanın yolu:
                    </p>

                    <div className="space-y-3 not-prose my-8">
                        {[
                            { tool: "Başlık Hiyerarşisi (H1, H2, H3)", desc: "Makalenin ana başlığı otomatik oluşturulur. İçerikte H2 ve H3 başlıklarını kullanarak bölümler oluşturun. Her bölüm mantıksal bir akışa sahip olmalı." },
                            { tool: "Matematik Formülleri (LaTeX)", desc: "Hesap makinesi ikonuna tıklayarak LaTeX formülleri ekleyebilirsiniz. E = mc², ∑, ∫ gibi semboller hazır şablon olarak sunulmaktadır." },
                            { tool: "Mermaid Şemaları (YENİ!)", desc: "Git Branch ikonuna (⑄) tıklayarak akış diyagramları, durum diyagramları, sıralama diyagramları ve pasta grafikleri ekleyebilirsiniz. Hazır fizik şablonları mevcuttur." },
                            { tool: "Görseller", desc: "Sürükle-bırak veya 'Resim Ekle' butonu ile görsel yükleyin. Kapak görseli 16:9 oranında olmalıdır. İçerik görselleri otomatik sıkıştırılır." },
                            { tool: "Bağlantılar & YouTube", desc: "Metin seçip link ekleyebilir, YouTube videoları embed edebilirsiniz. Simülasyonları da iframe olarak ekleyebilirsiniz." },
                            { tool: "Kaynaklar Bölümü", desc: "Editörün altındaki 'Kaynaklar' bölümünde yapılandırılmış referanslar ekleyin: URL, DOI, Yazar, Yayıncı, Yıl. Her kaynak yapay zeka tarafından güvenilirlik açısından analiz edilir." },
                            { tool: "Otomatik Kayıt", desc: "Taslağınız her 5 saniyede yerel olarak kaydedilir. Sayfayı yanlışlıkla kapatırsanız, çalışmanız otomatik geri yüklenir." },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <span className="text-primary font-black text-lg w-6 flex-shrink-0">{i + 1}</span>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">{item.tool}</h4>
                                    <p className="text-xs text-muted-foreground m-0">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── SECTION 7: AI İnceleme Süreci ── */}
                    <hr className="border-black dark:border-zinc-800 border-2 my-12" />

                    <h2 className="flex items-center gap-3 text-violet-500">
                        <Fingerprint className="w-8 h-8" />
                        7. FizikHubGPT-1.0 AI İnceleme Süreci
                    </h2>
                    <p>
                        Makalenizi onaya gönderdiğinizde, <strong>FizikHubGPT-1.0 AI</strong> sistemi makaleyi otomatik olarak analiz eder. AI, 5 ana kategoride 0-100 puan vererek detaylı rapor oluşturur:
                    </p>

                    <div className="space-y-4 not-prose my-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { category: "İçerik Doğruluğu", desc: "Makaledeki bilimsel iddiaların doğruluğu kontrol edilir. Yanlış veya şüpheli bilgiler tespit edilir.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
                                { category: "Yazım & Dilbilgisi", desc: "Türkçe yazım hataları, noktalama ve cümle yapısı sorunları tespit edilir.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                                { category: "Kaynak Güvenilirliği", desc: "Verilen kaynakların akademik, güvenilir ve erişilebilir olup olmadığı değerlendirilir.", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/10" },
                                { category: "Kaynak-İçerik Uyumu", desc: "Makaledeki iddialar ile kaynaklardaki bilgiler arasındaki tutarlılık kontrol edilir.", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10" },
                            ].map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 ${item.bg}`}>
                                    <h4 className={`font-black ${item.color} mb-1 text-sm`}>{item.category}</h4>
                                    <p className="text-xs text-muted-foreground m-0">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 m-0">
                                <strong>Not:</strong> AI incelemesinden sonra makale Yazar Ekibi Paneline düşer. Ekip üyeleri makaleyi inceleyebilir, not bırakabilir ve onaylayabilir. Bir makale yayınlanmak için <strong>4 yazar onayı</strong> gerektirir.
                            </p>
                        </div>
                    </div>

                    {/* ── SECTION 8: CheckList ── */}
                    <h2 className="mt-16">8. Otokontrol ve Son Kalibrasyon (Yayından Önceki Checklist)</h2>
                    <p>
                        Bir FizikHub yazarı, taslağını onaya göndermeden önce, aşağıdaki kontrol listesini kendi metni üzerinde soğukkanlılıkla gerçekleştirmek zorundadır:
                    </p>
                    
                    <div className="space-y-4 not-prose">
                        {[
                            { question: "1. Terminolojik Filtrasyon", desc: "Bu metni fizik okumayan, kafedeki bir lise arkadaşıma anlatsam 'Bu ne demek?' deyip kopar mıydı? En komplike kavramı bile günlük bir metaforla köprüledin mi?" },
                            { question: "2. Kaynakça Zırhı", desc: "Metinde 'deneylerle gösterildi' dediğin her spesifik datanın yanında bir DOI çapası veya akademik referans duruyor mu?" },
                            { question: "3. Başlık Kontrolü", desc: "Başlığın merak uyandırıyor mu? Arama motorlarında birisi bu konuyu aratsa, tıklamak ister miydi?" },
                            { question: "4. Görsel Telif Güvenliği", desc: "Kullandığın görseller lisanslı mı? Public Domain veya CC havuzlarından mı alınmış? Atıf sentaksı doğru mu?" },
                            { question: "5. Giriş Kancası (Hook)", desc: "İlk paragrafın tetiği çekip, okuyucunun 'Bunu okumazsam eksik kalırım' hissiyle devam etmesini sağladı mı?" },
                            { question: "6. Analoji Doğruluğu", desc: "Kullandığın analojiler bilimsel gerçekliği çarpıtmıyor mu? Analojinin sınırlarını belirttiniz mi?" },
                            { question: "7. Akış Kontrolü", desc: "Paragraflar arasında mantıksal geçişler var mı? Okuyucu bir konudan diğerine sürüklenebiliyor mu?" },
                            { question: "8. 'Aha!' Anı (Evreka)", desc: "Okuyucu son cümleyi bitirdiğinde, dünyaya olan bakış açısında nanometrik düzeyde bile olsa bir paradigma kayması yaşadı mı?" }
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
