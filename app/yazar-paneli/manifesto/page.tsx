import { 
    Sparkles, Quote, Target, PenTool, AlertTriangle, 
    FileText, Bot, ImageIcon, Link2, LayoutTemplate, Zap, Search, Library, CheckCircle2, FileCode2, FlaskConical, Scale, Database, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-2xl bg-yellow-400 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
                            <Sparkles className="w-12 h-12 text-black" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase italic drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)] dark:drop-shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">FizikHub Yazar Manifestosu</h1>
                    <p className="text-xl md:text-2xl font-bold bg-black text-white dark:bg-white dark:text-black inline-block px-4 py-2 border-[3px] border-yellow-400 transform rotate-1 uppercase tracking-widest">
                        Bilimi &quot;Bizden Biri&quot; Gibi Anlatma Rehberi
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Intro Section: FizikHub'ın Önemi */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden">
                        <Quote className="absolute -top-6 -left-6 w-32 h-32 text-yellow-100 dark:text-zinc-800 opacity-50 -z-10" />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-14 h-14 rounded-full bg-yellow-400 border-[3px] border-black flex items-center justify-center shrink-0">
                                <FlaskConical className="w-7 h-7 text-black" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black dark:text-white">Neden Buradayız? FizikHub&apos;ın Misyonu</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-5 text-lg font-medium relative z-10">
                            <p>
                                İnsanlık tarihi tek bir sorunun etrafında örülen devasa bir halıdır: <strong>&quot;Bu dünya nasıl çalışıyor?&quot;</strong> Gökyüzündeki yıldızların hareketinden, hücrenin derinliklerindeki katlanmalara kadar her şey merakımızın bir parçası... Fakat zamanla bilim; içine kapalı, steril, yüksek duvarları olan, sadece &quot;seçilmişlerin&quot; anladığı bir laboratuvara dönüştü.
                            </p>
                            <p className="text-xl font-bold border-l-4 border-yellow-400 pl-4 py-1 italic">
                                FizikHub tam da bu kopukluğu gidermek, fildişi kulelerin kapılarını ardına kadar kırmak ve bilimi ait olduğu yere, sokağın sıcaklığına geri döndürmek için doğdu.
                            </p>
                            <p>
                                <strong>&quot;Bizden Biri&quot;</strong> anlatım tarzı sıradan bir üslup seçimi değil, bir direniştir. Karmaşık kavramların arkasına saklanarak zeka gösterisi yapmayı reddeden, bunun yerine &quot;Gel sana evrenin en havalı sırrını anlatayım&quot; diyen dostane bir tavırdır. Bizim için bilim iletişimi sadece bilgi aktarmak değil; o bilgiyi bir hikayeye, tutkuya ve toplumsal bilince dönüştürme sanatıdır.
                            </p>
                        </div>
                    </section>

                    {/* Section 1: Bilim Anlatıcılığı Nasıl Yapılır */}
                    <section className="bg-blue-50 dark:bg-blue-950 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="md:w-1/3">
                                <div className="w-14 h-14 rounded-xl bg-blue-500 border-[3px] border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tight italic mb-4 whitespace-pre-line">
                                    Bilim{"\n"}Anlatıcılığı{"\n"}Nasıl Yapılır?
                                </h2>
                                <p className="font-bold text-blue-800 dark:text-blue-300">
                                    &quot;Anlaşılmayan konu yoktur, henüz yeterince iyi anlatılmamış konu vardır.&quot;
                                </p>
                            </div>
                            <div className="md:w-2/3 grid gap-4">
                                {[
                                    { title: "Jargon Kullanma (Ya da Çevir)", desc: "'Miyokard enfarktüsü' deme. 'Kalp krizi' de. Eğer bilimsel terimi kullanman şartsa, hemen yanında sokağın dilindeki karşılığını ver." },
                                    { title: "Günlük Hayat Benzetmesi", desc: "Soyut kavramların en büyük düşmanı somut benzetmelerdir. Bir karadeliği mutfak lavabosundaki girdapla, genetik mutasyonu matbaa hatasıyla anlat." },
                                    { title: "Hikaye Anlat", desc: "Bilim statik değildir. O formülün nasıl bulunduğu, o bilim insanının yaşadığı hüsran, okuyucuyu metne kilitler." },
                                    { title: "Pratik Değer (Neden Önemli?)", desc: "Okuyucunun sessizce sorduğu 'Peki bu benim ne işime yarayacak?' sorusuna metnin ilk birkaç pragrafında cevap ver." }
                                ].map((rule, i) => (
                                    <div key={i} className="flex gap-4 p-5 border-[3px] border-black rounded-lg bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(59,130,246,1)] transition-all">
                                        <div className="flex-shrink-0">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xl border-2 border-black">{i + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase text-lg text-black dark:text-white mb-1">{rule.title}</h4>
                                            <p className="font-medium text-zinc-700 dark:text-zinc-300">{rule.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Bilimsel Yazı Anatomisi */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-purple-500 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black dark:text-white">Bilimsel Bir Yazı Nasıl Yazılır?</h2>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border-[3px] border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-6">
                            <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                                Bilim iletişimi makalesi yazmak, akademik bir paper yazmaktan farklıdır. Amacımız literatür taraması yapmak değil, o literatürdeki harika bilgiyi okunabilir kılmaktır. İşte kusursuz bir FizikHub makalesinin anatomisi:
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 border-[3px] border-black rounded-lg relative bg-white dark:bg-zinc-800 pt-10">
                                <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-sm rounded border-2 border-purple-500">1. Kanca (Giriş)</div>
                                <h3 className="text-xl font-black text-black dark:text-white mb-2">Merakı Ateşle</h3>
                                <p className="font-medium text-muted-foreground">Okuyucuyu ilk cümleden yakalaman lazım. Çarpıcı bir soru sor, bilinen bir yanlışı düzelt veya şaşırtıcı bir istatistik ver. İlk 3 paragraf, okuyucunun devam edip etmeyeceğine karar verdiği yerdir.</p>
                            </div>
                            <div className="p-6 border-[3px] border-black rounded-lg relative bg-white dark:bg-zinc-800 pt-10">
                                <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-sm rounded border-2 border-purple-500">2. Gövde (Gelişme)</div>
                                <h3 className="text-xl font-black text-black dark:text-white mb-2">Kanıtları Diz</h3>
                                <p className="font-medium text-muted-foreground">İddialarını alt başlıklarla böl (H2, H3). Uzun duvar gibi paragraflardan kaçın. Her alt başlıkta okuyucuya bir şeyler öğretirken, aralara &quot;Bizden Biri&quot; tarzıyla yorumlar serpiştirin.</p>
                            </div>
                            <div className="p-6 border-[3px] border-black rounded-lg relative bg-white dark:bg-zinc-800 pt-10">
                                <div className="absolute -top-4 left-4 bg-black text-white px-3 py-1 font-black uppercase text-sm rounded border-2 border-purple-500">3. Vuruş (Sonuç)</div>
                                <h3 className="text-xl font-black text-black dark:text-white mb-2">Büyük Resme Bağla</h3>
                                <p className="font-medium text-muted-foreground">Yazıyı sadece özetleyerek bitirme. &quot;Bu anlattıklarım insanlık için neden önemli?&quot;, &quot;Gelecekte bizi bu konuda neler bekliyor?&quot; diyerek yazıyı güçlü ve ilham verici bir şekilde noktala.</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Section 3: Kaynaklar */}
                    <section className="bg-yellow-400 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                                <Library className="w-7 h-7 text-yellow-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black">Kaynakların Efendisi Olmak</h2>
                        </div>
                        <p className="text-xl font-bold text-black mb-8 border-b-2 border-black pb-4">
                            &quot;Ben öyle duydum, internette okudum&quot; kaynak değildir. Evrenin sırrını da açıklasanız arkasında kaynakça yoksa, o yazı FizikHub için sadece bir iddiadır.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white border-[3px] border-black rounded-xl p-6">
                                <h3 className="flex items-center gap-2 text-2xl font-black uppercase mb-4 text-black">
                                    <Search className="w-6 h-6 text-yellow-500" /> Nereden Bulunur?
                                </h3>
                                <ul className="space-y-3 font-medium text-black">
                                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" /> <span className="underline decoration-2 decoration-yellow-400 font-bold">Google Scholar:</span> Akademik makale aramanın temel merkezi.</li>
                                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" /> <span className="underline decoration-2 decoration-yellow-400 font-bold">arXiv.org:</span> Özellikle Fizik, Matematik ve Bilgisayar Bilimleri için yayınlanmamış ön baskı (preprint) cenneti.</li>
                                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" /> <span className="underline decoration-2 decoration-yellow-400 font-bold">PubMed:</span> Tıp ve Yaşam Bilimleri için mutlak güvenilir kaynak.</li>
                                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" /> <span className="underline decoration-2 decoration-yellow-400 font-bold">Nature &amp; Science:</span> Popülerleşen makalelerin çıkış noktası olan saygın dergiler. Buralardaki &quot;News/Features&quot; kısımları harika fikir verir.</li>
                                </ul>
                            </div>
                            
                            <div className="bg-white border-[3px] border-black rounded-xl p-6">
                                <h3 className="flex items-center gap-2 text-2xl font-black uppercase mb-4 text-black">
                                    <Link2 className="w-6 h-6 text-yellow-500" /> Nasıl Belirtilir?
                                </h3>
                                <div className="space-y-4">
                                    <p className="font-medium text-black">
                                        FizikHub&apos;da bir makale yayınlarken kaynaklar <strong>DOI (Dijital Nesne Tanımlayıcı)</strong> veya link üzerinden metin içine yedirilir veya yazı sonundaki &quot;Kaynakça&quot; bölümüne eklenir.
                                    </p>
                                    <div className="bg-zinc-100 p-4 rounded border-2 border-black font-mono text-sm">
                                        <strong>Yanlış:</strong> &quot;Bilim insanları kara deliğin fotoğrafını çekti.&quot;<br/>
                                        <strong className="text-green-600 mt-2 block">Doğru:</strong> &quot;EHT işbirliğinin 2019&apos;da yayınladığı çalışmaya göre...&quot; (Çalışma kelimesine link vererek)
                                    </div>
                                    <p className="font-bold text-sm bg-yellow-100 p-3 rounded border border-yellow-500 text-yellow-900 mt-2">
                                        💡 Eğer bilimsel bir iddiada bulunuyorsanız, o cümlenin sonuna veya direkt kelimenin üstüne makale linkini iliştirin. Başka yazılardan (blog post) kaynak vermek yerine asıl kağıda (paper) inin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Görseller ve Telif */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-xl bg-orange-500 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <ImageIcon className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black dark:text-white">Görsel Evreni ve Telif Mayınları</h2>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-950 border-l-8 border-red-500 p-6 mb-8 rounded-r-lg">
                            <h3 className="flex items-center gap-2 text-xl font-black text-red-700 dark:text-red-400 uppercase mb-2">
                                <Scale className="w-6 h-6" /> Kırmızı Çizgi: Telif Hakları
                            </h3>
                            <p className="text-red-900 dark:text-red-200 font-medium">
                                Google Görseller&apos;de aratıp önünüze çıkan ilk fotoğrafı <strong>KULLANAMAZSINIZ.</strong> Başkalarının emeğini izinsiz kullanmak suçtur ve FizikHub&apos;dan doğrudan ihraç sebebidir. Sadece telifsiz (Public Domain / CC0) veya atıf yapılarak kullanılmasına izin verilen görselleri kullanabilirsiniz.
                            </p>
                        </div>

                        <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-4 italic">Telifsiz (Harika) Görselleri Nereden Bulacağız?</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: "Wikimedia Commons", desc: "Bilimsel şemalar, tarihi portreler ve CC lisanslı her şey." },
                                { name: "NASA Image Lib.", desc: "Uzay, roket, yıldız derseniz NASA'nın galerisi tamamen public domain'dir!" },
                                { name: "Unsplash / Pexels", desc: "Soyut kavramlar veya kaliteli stok fotoğraflar için en iyi ücretsiz adresler." },
                                { name: "Kendi Üretimin!", desc: "Canva'da veya Figma'da yarattığın basit bir şema paha biçilemez." }
                            ].map((source, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-lg border-2 border-black text-center group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default">
                                    <h4 className="font-black uppercase mb-2">{source.name}</h4>
                                    <p className="text-sm font-medium opacity-80">{source.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-sm font-bold text-center italic text-muted-foreground bg-zinc-100 dark:bg-zinc-800 py-3 rounded border border-dashed border-zinc-400 dark:border-zinc-700">
                            <strong>Altın Kural:</strong> Görseli nereden alırsan al, yazının altında veya görselin hemen caption kısmında kaynağını belirt! (Örn: Görsel: NASA/JPL-Caltech)
                        </p>
                    </section>

                    {/* Section 5: Yazar Editörü */}
                    <section className="bg-emerald-50 dark:bg-emerald-950 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-emerald-500 border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <LayoutTemplate className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black dark:text-white">Kokpit: Yazar Editörü Nasıl Kullanılır?</h2>
                        </div>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-lg font-medium space-y-4 text-emerald-950 dark:text-emerald-100 mb-8">
                            <p>
                                FizikHub&apos;ın kalbi, o yazıları yazdığınız editördür. Korkmanıza gerek yok, temel kuralları bilmek yeterlidir:
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-xl p-6">
                                <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2 text-black dark:text-white"><FileCode2 className="w-5 h-5"/> Zengin Metin (Rich Text)</h3>
                                <ul className="space-y-3 font-medium text-black dark:text-white">
                                    <li>Önemli kelimeleri kalın, vurguları eğik yazmaktan çekinmeyin.</li>
                                    <li>Başlıklar için editör menüsünden daima <strong>Büyük Başlık (H2) veya Alt Başlık (H3)</strong> formatını seçin. Yazıyı paragraflara bölün.</li>
                                    <li>Alıntı yapıyorsanız, menüden alıntı blokunu kullanın.</li>
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-xl p-6">
                                <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2 text-black dark:text-white"><ImageIcon className="w-5 h-5"/> Multimedya Gücü</h3>
                                <ul className="space-y-3 font-medium text-black dark:text-white">
                                    <li><strong>Görsel Ekleme:</strong> Editördeki dağ ikonuna tıklayarak doğrudan bilgisayarınızdan telifsiz görselleri yükleyebilirsiniz. </li>
                                    <li><strong>Kod Blokları:</strong> Yazılım dillerinden bahsediyorsanız veya formül gösterecekseniz kod bloklarını kullanın.</li>
                                    <li><strong>Linkleme:</strong> Dış bağlantıları (özellikle kaynakları) menüdeki zincir ikonuyla kelimelere gömün. URL yığınları okumayı zorlaştırır.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    
                    {/* Section 6: FizikHubGPT */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] relative">
                        <div className="absolute top-4 right-4 animate-pulse">
                            <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-zinc-900 border-[3px] border-yellow-400 flex items-center justify-center shrink-0">
                                <Bot className="w-7 h-7 text-yellow-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-black dark:text-white">FizikHubGPT Makaleyi Nasıl Değerlendirir?</h2>
                        </div>
                        <p className="font-bold text-lg text-muted-foreground mb-8">
                            Yazıyı gönder butonuna bastığınızda, hemen insan editörlerin önüne düşmez. Önce platformumuzun yapay zekası FizikHubGPT tarafından sıkı bir ön denetime girer.
                        </p>
                        
                        <div className="grid gap-4">
                            {[
                                { title: "Bilimsel Tutarlılık (Halüsinasyon Testi)", desc: "AI, yazdığın komplo teorilerini veya uydurma iddiaları gerçek fizik kurallarıyla kıyaslar. Kaynaksız asılsız iddialar anında kırmızı bayrak taşır." },
                                { title: "Ton ve Akış Analizi (Sıkıcılık Testi)", desc: "'Bizden Biri' kuralına uyulmuş mu? Paragraflar çok mu ağdalı? FizikHubGPT makalenin okunabilirlik analizini yapar ve çok akademik yerleri yumuşatmanı önerebilir." },
                                { title: "Bağlam ve Kaynakça", desc: "Verdiğin linklerin çalışıp çalışmadığını, iddia ile kaynağın uyumlu olup olmadığını hızlıca kontrol eder." }
                            ].map((rule, i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-4 p-5 bg-zinc-100 dark:bg-zinc-800 border-2 border-black rounded-lg">
                                    <h4 className="font-black uppercase text-xl shrink-0 md:w-1/4 text-black dark:text-white">{rule.title}</h4>
                                    <p className="font-medium text-black dark:text-zinc-300">{rule.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-3 items-center bg-black text-white p-4 rounded border-2 border-yellow-400">
                            <Database className="w-6 h-6 shrink-0 text-yellow-400" />
                            <p className="font-bold text-sm">
                                Korkmayın! FizikHubGPT yazınızı sizden habersiz değiştirmez. O, yazınızın en kaliteli haliyle insan editörlere ulaşmasını sağlayan mükemmel bir ön filtredir.
                            </p>
                        </div>
                    </section>

                    {/* Section 7: Başlık Mimarisi */}
                    <section className="bg-pink-50 dark:bg-pink-950/30 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-pink-500 border-2 border-black flex items-center justify-center">
                                <PenTool className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Başlık ve Alt Başlık Mimarisi</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-pink-600 dark:text-pink-400">Popüler Kültür Köprüsü</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Bilimi okuyucunun sevdiği bir popüler figür veya konseptle paketleyin.</p>
                                <div className="bg-pink-100 dark:bg-pink-900/40 text-pink-900 dark:text-pink-200 text-sm p-3 rounded border-2 border-black font-bold italic">
                                    Örn: &quot;Influencer Değil, İnfluenza: Virüslerin &apos;Viral&apos; Olma Stratejileri&quot;
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 border-2 border-black p-5 rounded-xl shadow-[4px_4px_0px_#000]">
                                <h4 className="font-black uppercase text-sm mb-1 text-blue-600 dark:text-blue-400">Ters Köşe Paradoksu</h4>
                                <p className="text-sm opacity-80 mb-3 font-bold text-black dark:text-white">Bilişsel çelişki yaratın. İmkansız görünen iddialarla merak uyandırın.</p>
                                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 text-sm p-3 rounded border-2 border-black font-bold italic">
                                    Örn: &quot;Bakarsan Dağılırım: Kuantum Dünyasının Utangaç Parçacıkları&quot;
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 8: Anayasamız */}
                    <section className="bg-white dark:bg-zinc-900 border-[3px] border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight italic text-black dark:text-white">Anayasamız: Kesin Kurallar</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 rounded-lg">
                                <p className="text-lg font-bold text-black dark:text-white">
                                    &quot;Ben öyle duydum&quot; dediğiniz hiçbir yer olamaz. Her ciddi iddianızın arkasında bir DOI linki veya makale olmalıdır.
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 bg-red-50 dark:bg-red-900/10 border-l-8 border-red-500 rounded-lg">
                                <p className="text-lg font-bold text-black dark:text-white">
                                    Görselleriniz mutlaka telifsiz olmalıdır. Aksi, o muhteşem yazınızın maalesef ret yemesine sebep olur.
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 border-l-8 border-black dark:border-white rounded-lg">
                                <p className="text-lg font-bold text-black dark:text-white">
                                    Cümleleri kısa tutun. Eğer cümleniz üç satırı geçiyorsa, ikiye bölün.
                                </p>
                            </div>
                            <div className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 border-l-8 border-black dark:border-white rounded-lg">
                                <p className="text-lg font-bold text-black dark:text-white">
                                    <strong>De/Da</strong> ve <strong>Ki</strong> yazımına takıntılıyız. En büyük prestij kaybı kelime bozukluklarıdır.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="bg-black text-white p-10 rounded-2xl border-[4px] border-yellow-400 relative overflow-hidden text-center shadow-[12px_12px_0px_0px_#facc15] hover:shadow-[16px_16px_0px_0px_#facc15] transition-shadow">
                        <PenTool className="absolute -bottom-6 -right-6 w-48 h-48 text-white opacity-5" />
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-yellow-500 mb-6 italic transform -skew-x-6">Sıra Sende Koskoca Yazar!</h2>
                        <div className="max-w-3xl mx-auto space-y-6">
                            <p className="text-xl font-medium leading-relaxed opacity-90 pb-6 border-b-2 border-zinc-800">
                                FizikHub&apos;da biz bilgiyi sadece taşımıyor, karanlıkta çakmak çakıyoruz. Kendi sesini bul, mizahını bilimin içine gizle ve en önemlisi yazdığın her kelimeden önce kendine o soruyu sor:
                            </p>
                            <div className="bg-yellow-400 text-black py-4 px-8 rounded-xl inline-block font-black text-2xl md:text-3xl uppercase tracking-tighter transform -rotate-2 border-2 border-white shadow-[0px_0px_30px_rgba(250,204,21,0.5)]">
                                &quot;Bunu arkadaşıma anlatsam heyecanlanır mıydı?&quot;
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Link href="/yazar/yeni">
                                <button className="group relative bg-[#FFBD2E] text-black font-black text-2xl py-4 px-10 rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-3 uppercase italic">
                                    Yazmaya Başla <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
