import { BookOpen, Lightbulb, FileText, Shield, Eye, PenTool, Bot, CheckCircle2, ExternalLink, Image as ImageIcon, Link2, Globe, AlertTriangle } from "lucide-react";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">FizikHub Yazar Rehberi</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Bilimi herkes için anlaşılır ve doğru şekilde anlatmanın kapsamlı kılavuzu.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* 1. Bilim Anlatıcılığının Önemi */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-black">1. Bilim Anlatıcılığının Önemi</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>FizikHub&apos;da yazdığınız her makale, bilimi herkes için erişilebilir kılma misyonunun bir parçasıdır. Amacımız, karmaşık fizik kavramlarını günlük dile çevirmek ve okuyucunun &quot;Aha, şimdi anladım!&quot; demesini sağlamaktır.</p>
                            <ul>
                                <li><strong>Doğruluk her şeyden önce gelir.</strong> Yanlış bilgi yaymak, hiç bilgi vermemekten daha zararlıdır.</li>
                                <li><strong>Sadelik, basitlik değildir.</strong> Karmaşık kavramları basitleştirirken doğruluğundan ödün vermeyin.</li>
                                <li><strong>Her okuyucu potansiyel bir bilim insanıdır.</strong> Onlara ilham verin, merak uyandırın.</li>
                                <li><strong>Kaynağınız yoksa iddianız da yoktur.</strong> Her bilimsel ifade bir kaynağa dayanmalıdır.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 2. Profesyonel Başlık Oluşturma */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <PenTool className="w-5 h-5 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black">2. Başlık Nasıl Oluşturulur?</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>Başlık, okuyucunun makaleye tıklamasını sağlayan ilk unsurdur. İyi bir başlık merak uyandırır ve içeriği doğru yansıtır.</p>
                            <h4>✅ Doğru Başlık Örnekleri:</h4>
                            <ul>
                                <li>&quot;Kara Delikler Gerçekten Her Şeyi Yutar mı? Hawking Radyasyonunun Sırları&quot;</li>
                                <li>&quot;Kuantum Dolanıklık: Einstein&apos;ın &apos;Ürkütücü Uzaktan Etki&apos; Dediği Fenomen&quot;</li>
                                <li>&quot;Işık Hızını Neden Aşamayız? Özel Görelilik Basitçe Anlatılıyor&quot;</li>
                                <li>&quot;Higgs Bozonu: Evrendeki Kütlenin Kaynağını Keşfetmek&quot;</li>
                            </ul>
                            <h4>❌ Kaçınılması Gereken Başlıklar:</h4>
                            <ul>
                                <li>&quot;Fizik Hakkında&quot; — <em>Çok genel, merak uyandırmaz</em></li>
                                <li>&quot;Kuantum Fiziği&quot; — <em>Başlık değil, konu adı</em></li>
                                <li>&quot;ŞOK! Bilim insanları evreni çözdü!!!&quot; — <em>Clickbait, bilime saygısızlık</em></li>
                            </ul>
                            <h4>🎯 Başlık Formülleri:</h4>
                            <ol>
                                <li><strong>Soru Formülü:</strong> &quot;[Konu] Gerçekten [İddia] mı?&quot;</li>
                                <li><strong>Açıklama Formülü:</strong> &quot;[Konu]: [Alt Başlık ile Derinleştirme]&quot;</li>
                                <li><strong>Sayı Formülü:</strong> &quot;[Konu] Hakkında Bilmeniz Gereken [N] Şey&quot;</li>
                                <li><strong>Tarihsel Formül:</strong> &quot;[Bilim İnsanı]&apos;nın [Konu] Hakkındaki Keşfi&quot;</li>
                            </ol>
                        </div>
                    </section>

                    {/* 3. İçerik Yazım Kuralları */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black">3. İçerik Yazma Kuralları</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <h4>Giriş Paragrafı (Kanca)</h4>
                            <p>İlk 2 cümle okuyucuyu yakalamalıdır. Bir soru, şaşırtıcı bir gerçek veya günlük hayattan bir bağlantı kullanın.</p>
                            <blockquote>&quot;Elinizde tuttuğunuz telefonun ekranı, kuantum mekaniğinin keşfi olmadan var olamazdı. Peki bu gizemli kuram gerçekte ne anlatıyor?&quot;</blockquote>

                            <h4>Analoji Kullanımı</h4>
                            <p>Soyut kavramları somutlaştırın. Okuyucunun bildiği şeylerle bağ kurun:</p>
                            <ul>
                                <li>&quot;Uzay-zaman eğriliğini düşünün: bir trambolinin üzerine bowling topu koyduğunuzda çevresindeki mermerler nasıl çekiliyorsa, güneş de uzay-zamanı öyle büker.&quot;</li>
                                <li>&quot;Dalga-parçacık ikiliği, suyun hem dalgalar oluşturması hem de damla damla akmasına benzer.&quot;</li>
                            </ul>

                            <h4>Paragraf Yapısı</h4>
                            <ul>
                                <li>Her paragraf <strong>tek bir fikir</strong> etrafında şekillensin</li>
                                <li>Paragraflar <strong>3-5 cümle</strong> arasında olsun</li>
                                <li>900-2500 kelime arası ideal makale uzunluğu</li>
                                <li>Her 300-400 kelimede bir <strong>alt başlık</strong> koyun</li>
                            </ul>

                            <h4>Teknik Terim Politikası</h4>
                            <p>Teknik terimleri ilk kez kullandığınızda mutlaka açıklayın:</p>
                            <ul>
                                <li>✅ &quot;Entropi (düzensizlik ölçüsü), kapalı bir sistemde her zaman artar.&quot;</li>
                                <li>❌ &quot;Entropinin artışı adiabatik sistemlerde geri dönüşümsüzdür.&quot; — <em>Açıklama olmadan jargon</em></li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. KAYNAK REHBERİ — DETAYLI */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-violet-500" />
                            </div>
                            <h2 className="text-2xl font-black">4. Kaynak & Referans Rehberi</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>Kaynaklar makalenizin güvenilirliğini belirler. FizikHub&apos;da kaynak kalitesi, FizikHubGPT-1.0 AI tarafından otomatik olarak değerlendirilir.</p>

                            <h4>🥇 Tier-1 Kaynaklar (En Güvenilir)</h4>
                            <p>Bu kaynaklardan alınan bilgiler en yüksek güvenilirlik puanını alır:</p>
                            <div className="not-prose">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Nature</strong> — <a href="https://www.nature.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nature.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Dünyanın en prestijli bilimsel dergisi. Fizik, kimya, biyoloji makaleleri.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Science (AAAS)</strong> — <a href="https://www.science.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">science.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Amerikan Bilim Geliştirme Derneği dergisi. Hakemli araştırma makaleleri.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">arXiv</strong> — <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">arxiv.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Fizik, matematik ve bilgisayar bilimleri ön baskı sunucusu. Ücretsiz erişim.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Physical Review Letters (PRL)</strong> — <a href="https://journals.aps.org/prl/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">journals.aps.org/prl</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Amerikan Fizik Derneği&apos;nin amiral gemisi dergisi. Fizik araştırmalarının altın standardı.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">NASA</strong> — <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nasa.gov</a> · <a href="https://science.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">science.nasa.gov</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Uzay ve astrofizik için birincil kaynak. Görseller de telif ücretsiz.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">ESA</strong> — <a href="https://www.esa.int" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">esa.int</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Avrupa Uzay Ajansı. Uzay araştırmaları ve görseller.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">CERN</strong> — <a href="https://home.cern" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">home.cern</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Parçacık fiziği araştırmaları. LHC verileri ve keşifler.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Google Scholar</strong> — <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">scholar.google.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Akademik makale arama motoru. Atıf sayılarını gösterir, güvenilirlik belirler.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="mt-6">🥈 Tier-2 Kaynaklar (Kabul Edilebilir)</h4>
                            <div className="not-prose">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                        <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-amber-700 dark:text-amber-400">Scientific American</strong> — <a href="https://www.scientificamerican.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">scientificamerican.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Popüler bilim dergisi. Genel kitle için yazılmış, ama güvenilir.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                        <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-amber-700 dark:text-amber-400">Quanta Magazine</strong> — <a href="https://www.quantamagazine.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">quantamagazine.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Simons Vakfı tarafından desteklenen kaliteli bilim gazeteciliği.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                        <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-amber-700 dark:text-amber-400">TÜBİTAK Bilim ve Teknik</strong> — <a href="https://bilimteknik.tubitak.gov.tr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bilimteknik.tubitak.gov.tr</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Türkiye&apos;nin resmi bilim dergisi. Türkçe kaynak olarak ideal.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                        <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-amber-700 dark:text-amber-400">Wikipedia</strong> — <a href="https://en.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">wikipedia.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Genel bilgi için kullanılabilir ama TEK BAŞINA kaynak olmamalı. Sayfanın altındaki kaynakları inceleyin.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                                        <Globe className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-amber-700 dark:text-amber-400">Phys.org</strong> — <a href="https://phys.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">phys.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Bilim haberleri. Haber olarak güvenilir, ama orijinal çalışmaya da referans verin.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="mt-6">🚫 Yasak Kaynaklar (Kesinlikle Kullanmayın)</h4>
                            <div className="not-prose">
                                <div className="grid gap-2 text-sm">
                                    {["Reddit, Ekşi Sözlük, Quora — Kullanıcı tarafından oluşturulan, doğrulanmamış içerik", "Kişisel bloglar — Hakemli süreçten geçmemiş, doğruluğu belirsiz", "YouTube yorumları — Hiçbir bilimsel geçerliliği yok", "Sosyal medya paylaşımları — Twitter/X, Instagram, Facebook gönderimleri", "Haber siteleri (tek başına) — Haberi orijinal araştırma ile destekleyin"].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-red-700 dark:text-red-400">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h4 className="mt-6">📋 Kaynak Nasıl Belirlenir?</h4>
                            <ol>
                                <li><strong>DOI numarası var mı?</strong> DOI (Digital Object Identifier) olan kaynaklar akademik ve hakemli süreçten geçmiştir. Örn: <code>10.1038/s41586-024-07998-0</code></li>
                                <li><strong>Yazar(lar) belirtilmiş mi?</strong> Anonim kaynaklar güvenilirlik açısından zayıftır.</li>
                                <li><strong>Hangi kuruma ait?</strong> Üniversite (.edu), devlet kurumu (.gov), bilimsel kuruluş (CERN, NASA) — güvenilir. Ticari siteler (.com) — dikkatli olun.</li>
                                <li><strong>Yayın tarihi ne?</strong> Fizik hızla değişen bir alandır. 10 yıldan eski kaynaklarda güncellik kontrolü yapın.</li>
                                <li><strong>Atıf sayısı ne?</strong> Google Scholar&apos;da yüksek atıf alan çalışmalar daha güvenilirdir.</li>
                                <li><strong>Hakemli dergi mi?</strong> Peer review sürecinden geçen makaleler en güvenilirdir.</li>
                            </ol>

                            <h4>📐 Kaynak Format Rehberi</h4>
                            <p>Kaynak eklerken editörün kaynak bölümünde şu alanları doldurun:</p>
                            <ul>
                                <li><strong>Başlık:</strong> Kaynağın tam başlığı</li>
                                <li><strong>URL:</strong> Web adresi (varsa)</li>
                                <li><strong>Yazar(lar):</strong> Soyadı, Ad baş harfi. Örn: &quot;Einstein, A.&quot;</li>
                                <li><strong>Yayıncı/Dergi:</strong> Nature, Science, PRL vs.</li>
                                <li><strong>Yıl:</strong> Yayın yılı</li>
                                <li><strong>DOI:</strong> Varsa DOI numarası</li>
                            </ul>
                        </div>
                    </section>

                    {/* 5. GÖRSEL REHBERİ — DETAYLI */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-pink-500" />
                            </div>
                            <h2 className="text-2xl font-black">5. Görsel Seçimi ve Telif Hakları</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>Görseller makalenizi zenginleştirir ve okuyucunun dikkatini çeker. Ancak telif haklarına dikkat etmek zorunludur.</p>

                            <h4>🖼️ Ücretsiz ve Güvenli Görsel Kaynakları</h4>
                            <div className="not-prose">
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">NASA Image Gallery</strong> — <a href="https://images.nasa.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">images.nasa.gov</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Uzay görselleri, gezegen fotoğrafları, teleskop görüntüleri. Telif ücretsiz (Public Domain).</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">ESA/Hubble</strong> — <a href="https://esahubble.org/images/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">esahubble.org/images</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Hubble ve James Webb teleskop görselleri. CC BY 4.0 lisansı (kaynak belirtin).</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Unsplash</strong> — <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">unsplash.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Yüksek kaliteli, tamamen ücretsiz fotoğraflar. Bilim, doğa, teknoloji görselleri mükemmel.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Pexels</strong> — <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pexels.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Ücretsiz stok fotoğraf ve video. Ticari kullanıma açık.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Wikimedia Commons</strong> — <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">commons.wikimedia.org</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Bilimsel diyagramlar, tarihsel görseller, şemalar. Lisansı her görselde kontrol edin.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">Pixabay</strong> — <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pixabay.com</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Ücretsiz görseller, illüstrasyonlar ve vektörler. Bilim temalı görseller zengin.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                        <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-emerald-700 dark:text-emerald-400">CERN Document Server</strong> — <a href="https://cds.cern.ch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cds.cern.ch</a>
                                            <p className="text-xs text-muted-foreground mt-0.5">Parçacık fiziği görselleri, diyagramlar. Açık erişim görseller mevcuttur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="mt-6">⚠️ Görsel Kullanım Kuralları</h4>
                            <ul>
                                <li><strong>Google Görseller&apos;den rastgele indirmeyin.</strong> Çoğu görsel telif korumalıdır.</li>
                                <li><strong>Her görsele alt metin (alt text) ekleyin.</strong> Editörde görsele tıklayıp açıklama yazabilirsiniz.</li>
                                <li><strong>Görsel kaynağını belirtin.</strong> &quot;Kaynak: NASA/JPL-Caltech&quot; formatını kullanın.</li>
                                <li><strong>Kapak görseli 16:9 oranında olmalı.</strong> Editör otomatik kırpmayı destekler.</li>
                                <li><strong>Dosya boyutu en fazla 10MB</strong> olabilir. Sistem otomatik olarak sıkıştırma yapar.</li>
                                <li><strong>Desteklenen formatlar:</strong> JPG, PNG, WebP, GIF</li>
                            </ul>
                        </div>
                    </section>

                    {/* 6. Editör Kullanım Rehberi */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                <PenTool className="w-5 h-5 text-cyan-500" />
                            </div>
                            <h2 className="text-2xl font-black">6. Makale Editörü Kullanımı</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>FizikHub editörü profesyonel bir yazım ortamı sunar. İşte tüm araçların detaylı rehberi:</p>
                            <div className="not-prose">
                                <div className="grid gap-3 text-sm">
                                    {[
                                        { icon: "B", title: "Metin Biçimlendirme", desc: "Kalın (B), İtalik (I), Altı Çizili (U) butonları ile metni vurgulayın." },
                                        { icon: "H", title: "Başlıklar (H1, H2, H3)", desc: "İçeriği bölümleyin. H1 ana başlık, H2 alt bölüm, H3 detay için." },
                                        { icon: "≡", title: "Listeler ve Alıntılar", desc: "Madde işareti, numaralı liste ve blok alıntı oluşturun." },
                                        { icon: "🔗", title: "Bağlantı Ekle", desc: "Seçili metne URL bağlantısı atayın. Dış kaynaklara link verin." },
                                        { icon: "🖼️", title: "Görsel Ekle", desc: "Bilgisayarınızdan görsel yükleyin. Otomatik sıkıştırma ve kırpma desteği. Max 10MB." },
                                        { icon: "▶️", title: "YouTube Video", desc: "YouTube bağlantısı yapıştırarak video gömün. Video direkt makalede oynar." },
                                        { icon: "📐", title: "Simülasyon (Embed)", desc: "PhET, GeoGebra gibi simülasyonları iframe ile gömün." },
                                        { icon: "∑", title: "Matematik Formülü", desc: "LaTeX kullanarak E=mc² gibi formüller ekleyin. Canlı önizleme ve hazır semboller." },
                                        { icon: "⑄", title: "Mermaid Şema", desc: "Akış diyagramları, durum diyagramları ve pasta grafikleri oluşturun. Hazır fizik şablonları var." },
                                    ].map((tool) => (
                                        <div key={tool.title} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                            <span className="flex-shrink-0 w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-sm">{tool.icon}</span>
                                            <div>
                                                <strong>{tool.title}</strong>
                                                <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h4 className="mt-4">💾 Taslak & Otomatik Kaydetme</h4>
                            <p>Editör taslağınızı her 5 saniyede bir tarayıcınıza otomatik kaydeder. Sayfa kazara kapansa bile taslağınız korunur. Makaleyi gönderdikten sonra taslak otomatik silinir.</p>
                        </div>
                    </section>

                    {/* 7. FizikHubGPT-1.0 AI */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-violet-500" />
                            </div>
                            <h2 className="text-2xl font-black">7. FizikHubGPT-1.0 AI İnceleme</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p>Makaleniz gönderildiğinde FizikHubGPT-1.0 AI otomatik olarak analiz eder. AI şunları kontrol eder:</p>
                            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {[
                                    { label: "İçerik Doğruluğu", desc: "Bilimsel iddiaların doğruluğu (%30 ağırlık)", color: "emerald" },
                                    { label: "Yazım & Dilbilgisi", desc: "Türkçe yazım ve noktalama hataları (%20 ağırlık)", color: "blue" },
                                    { label: "Kaynak Güvenilirliği", desc: "Kaynakların akademik kalitesi (%20 ağırlık)", color: "violet" },
                                    { label: "Kaynak-İçerik Uyumu", desc: "İddia ve kaynak tutarlılığı (%20 ağırlık)", color: "amber" },
                                    { label: "Okunabilirlik", desc: "Kavramların anlaşılırlığı ve anlatım kalitesi (%10 ağırlık)", color: "pink" },
                                    { label: "Üslup Analizi", desc: "Makalenin tonu: akademik, popüler bilim, teknik vb.", color: "cyan" },
                                ].map((cat) => (
                                    <div key={cat.label} className={`p-3 rounded-lg bg-${cat.color}-50 dark:bg-${cat.color}-900/10 border border-${cat.color}-200 dark:border-${cat.color}-900/30`}>
                                        <strong className={`text-${cat.color}-700 dark:text-${cat.color}-400`}>{cat.label}</strong>
                                        <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <h4 className="mt-4">📊 Puan Anlamları</h4>
                            <ul>
                                <li><strong className="text-emerald-500">80-100:</strong> Harika! Yayına hazır.</li>
                                <li><strong className="text-amber-500">60-79:</strong> İyi ama iyileştirilebilir. AI önerilerini dikkate alın.</li>
                                <li><strong className="text-red-500">0-59:</strong> Ciddi sorunlar var. Makaleyi gözden geçirin.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 8. Yayın Öncesi Checklist */}
                    <section className="border-2 border-black dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black">8. Yayın Öncesi Kontrol Listesi</h2>
                        </div>
                        <div className="not-prose">
                            <div className="space-y-2 text-sm">
                                {[
                                    "Başlık en az 10 karakter, ilgi çekici ve içeriği yansıtıyor",
                                    "Makale en az 50 kelime içeriyor (ideal: 900-2500 kelime)",
                                    "Kategori doğru seçildi",
                                    "Kapak görseli eklendi ve düzgün görünüyor",
                                    "En az 1 güvenilir kaynak (Tier-1 veya Tier-2) referans verildi",
                                    "Teknik terimler ilk kullanımda açıklandı",
                                    "Görsellere alt metin ve kaynak bilgisi eklendi",
                                    "Makale baştan sona okundu ve akıcı bir anlatım sağlandı",
                                    "Yazım hataları kontrol edildi",
                                    "Özet kısmı dolduruldu (isteğe bağlı ama önerilir)",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                                        <div className="w-6 h-6 rounded border-2 border-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-emerald-500">{i + 1}</span>
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
