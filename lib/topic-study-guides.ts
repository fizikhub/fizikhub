import type { SeoTopicCluster } from "@/lib/seo-topic-clusters";

export type TopicStudyGuide = {
    summary: string;
    keyIdeas: string[];
    studySteps: string[];
    commonPitfall: string;
    formulaFocus: string[];
};

const WEAK_TOPIC_GUIDES: Record<string, TopicStudyGuide> = {
    "newton-yasalari": {
        summary: "Newton yasaları, hareketi kuvvet ve ivme diliyle açıklamanın temelidir. Bir problemi çözerken önce cisme etki eden kuvvetleri ayırmak, sonra net kuvvetin hareketi nasıl değiştirdiğini okumak gerekir.",
        keyIdeas: ["Eylemsizlik cismin mevcut hareket durumunu koruma eğilimidir.", "Net kuvvet sıfır değilse ivme oluşur.", "Etki-tepki kuvvetleri farklı cisimler üzerinde olduğu için birbirini yok etmez."],
        studySteps: ["Serbest cisim diyagramı çiz.", "Yatay ve düşey kuvvetleri ayrı yaz.", "Net kuvvetten ivmeyi bul ve hareket yorumuna bağla."],
        commonPitfall: "Etki ve tepki kuvvetlerini aynı cisme uygulanıyormuş gibi sadeleştirmek en yaygın hatadır.",
        formulaFocus: ["Fnet = m.a", "a = Δv / Δt"],
    },
    "kuvvet-hareket": {
        summary: "Kuvvet ve hareket konusu, cismin konum, hız ve ivmesinin zamanla nasıl değiştiğini inceler. Kinematik hareketi betimler; dinamik ise bu hareketin nedenini kuvvetlerle açıklar.",
        keyIdeas: ["Hız konumun, ivme hızın değişim hızıdır.", "Sabit ivmeli hareket grafiklerle hızlı okunur.", "Kuvvet hareketin kendisini değil hareket değişimini belirler."],
        studySteps: ["Verilenleri konum-hız-ivme olarak sınıflandır.", "Grafikte eğim ve alan anlamlarını ayır.", "Kuvvet varsa net kuvvet yönünü ivme yönüyle eşleştir."],
        commonPitfall: "Hız yönü ile ivme yönünü her zaman aynı sanmak, yavaşlayan hareket sorularında hataya götürür.",
        formulaFocus: ["v = v0 + a.t", "x = x0 + v0.t + 1/2.a.t²"],
    },
    "is-enerji-guc": {
        summary: "İş, enerji ve güç; hareketi kuvvet yerine enerji dönüşümleriyle okumayı sağlar. Özellikle sürtünme, yükseklik ve yay gibi durumlarda enerji yaklaşımı işlemleri kısaltır.",
        keyIdeas: ["İş enerji değişimidir.", "Mekanik enerji korunumu sürtünmesiz ideal durumlarda geçerlidir.", "Güç, enerji aktarımının ne kadar hızlı olduğunu söyler."],
        studySteps: ["Başlangıç ve son enerji türlerini yaz.", "Korunum mu dış iş mi olduğunu seç.", "Zaman bilgisi varsa güç bağlantısını kur."],
        commonPitfall: "Enerji korunuyor derken sürtünme veya dış kuvvet işini gözden kaçırmak sonucu değiştirir.",
        formulaFocus: ["W = F.d.cosθ", "Ek = 1/2.m.v²", "Ep = m.g.h", "P = W / t"],
    },
    "momentum-carpisma": {
        summary: "Momentum ve çarpışma, kısa süreli etkileşimlerde kuvvet-zaman etkisini ve sistemin toplam hareket miktarını takip eder. Çarpışmalarda momentum korunabilir, fakat kinetik enerji yalnızca esnek çarpışmada korunur.",
        keyIdeas: ["Momentum vektörel bir büyüklüktür.", "Kapalı sistemde toplam momentum korunur.", "İmpuls momentum değişimine eşittir."],
        studySteps: ["Sistemi seç ve dış kuvvet var mı bak.", "Çarpışma öncesi ve sonrası momentumu yönleriyle yaz.", "Esnek/inelastik ayrımına göre enerji kontrolü yap."],
        commonPitfall: "Momentum korunuyor diye kinetik enerjinin de her çarpışmada korunacağını varsaymak yanlıştır.",
        formulaFocus: ["p = m.v", "J = F.Δt = Δp", "Σpönce = Σpsonra"],
    },
    "tork-denge": {
        summary: "Tork ve denge, dönme etkilerini anlamak için kullanılır. Bir cismin dengede kalması için hem net kuvvetin hem de seçilen noktaya göre net torkun sıfır olması gerekir.",
        keyIdeas: ["Tork kuvvetin döndürme etkisidir.", "Kuvvet kolu arttıkça aynı kuvvet daha büyük tork üretir.", "Denge sorularında nokta seçimi işlemi sadeleştirir."],
        studySteps: ["Dönme noktasını seç.", "Saat yönü ve tersi torkları ayrı yaz.", "Kuvvet dengesi ile tork dengesini birlikte çöz."],
        commonPitfall: "Sadece net kuvveti sıfırlayıp net torku kontrol etmemek denge sorularında eksik çözümdür.",
        formulaFocus: ["τ = F.r.sinθ", "ΣF = 0", "Στ = 0"],
    },
    "dalgalar": {
        summary: "Dalgalar enerji taşır, maddeyi zorunlu olarak taşımaz. Dalga boyu, frekans, hız ve genlik arasındaki ilişki; ses, ışık ve su dalgalarını aynı çerçevede okumayı sağlar.",
        keyIdeas: ["Frekans kaynağa, dalga hızı ortama bağlıdır.", "Genlik taşınan enerjiyle ilişkilidir.", "Girişim ve süperpozisyon dalgaların üst üste binmesini açıklar."],
        studySteps: ["Dalganın türünü ve ortamını belirle.", "v = λ.f bağıntısında değişen büyüklüğü seç.", "Girişim varsa faz farkını yorumla."],
        commonPitfall: "Ortam değişince frekansın da değiştiğini sanmak özellikle ışık ve ses sorularında hataya yol açar.",
        formulaFocus: ["v = λ.f", "T = 1 / f"],
    },
    "optik": {
        summary: "Optik, ışığın yayılması, yansıması, kırılması ve görüntü oluşturmasını inceler. Sorularda ışının hangi ortamdan hangi ortama geçtiği ve normale göre açıların nasıl değiştiği belirleyicidir.",
        keyIdeas: ["Yansıma açısı gelme açısına eşittir.", "Kırılmada hız değişimi ışının yönünü değiştirir.", "Yoğun ortamdan az yoğun ortama geçişte tam yansıma oluşabilir."],
        studySteps: ["Normal çizgisini çiz.", "Ortamların kırılma indislerini karşılaştır.", "Işının normale yaklaşıp uzaklaştığını yorumla."],
        commonPitfall: "Açıları yüzeye göre değil normale göre ölçmeyi unutmak Snell yasasını ters uygulatır.",
        formulaFocus: ["n1.sinθ1 = n2.sinθ2", "n = c / v"],
    },
    "elektrik-alan": {
        summary: "Elektrik alan, yüklerin çevresinde başka yüklere kuvvet uygulama kapasitesini gösterir. Alan çizgileri görünmez etkiyi yön ve yoğunluk bilgisiyle okunur hale getirir.",
        keyIdeas: ["Pozitif yükten çıkan, negatif yüke giren alan çizgileri kullanılır.", "Alan şiddeti uzaklık arttıkça azalır.", "Bir noktadaki net alan vektörel toplamla bulunur."],
        studySteps: ["Yük işaretlerini belirle.", "Her yükün noktadaki alan yönünü çiz.", "Büyüklükleri ters kare ilişkisiyle karşılaştırıp vektörel topla."],
        commonPitfall: "Elektrik alan yönünü negatif deneme yüküne göre seçmek işaret hatası üretir.",
        formulaFocus: ["E = k.q / r²", "F = q.E"],
    },
    "devreler": {
        summary: "Elektrik devreleri; akım, gerilim ve direncin enerji aktarımındaki rolünü inceler. Seri ve paralel bağlantıları ayırmak, eşdeğer direnç ve akım paylaşımını doğru kurmanın ilk adımıdır.",
        keyIdeas: ["Seri devrede akım aynı, gerilim paylaşılır.", "Paralel devrede gerilim aynı, akım kollara ayrılır.", "Direnç arttıkça aynı gerilimde akım azalır."],
        studySteps: ["Bağlantının seri mi paralel mi olduğunu işaretle.", "Eşdeğer direnci sadeleştir.", "Ohm yasasıyla akım ve gerilimleri sırayla bul."],
        commonPitfall: "Paralel dirençlerde eşdeğer direncin en küçük dirençten büyük çıkması işlem hatası işaretidir.",
        formulaFocus: ["V = I.R", "P = V.I", "1/Reş = 1/R1 + 1/R2"],
    },
    manyetizma: {
        summary: "Manyetizma, hareketli yüklerin ve mıknatısların oluşturduğu alanları inceler. Manyetik kuvvet çoğu durumda hıza dik olduğu için parçacığın yönünü değiştirir, hız büyüklüğünü doğrudan artırmaz.",
        keyIdeas: ["Manyetik alan çizgileri kapalı eğriler gibi düşünülebilir.", "Yüklü parçacığa etki eden kuvvet hız ve alana diktir.", "Akım taşıyan tel çevresinde manyetik alan oluşur."],
        studySteps: ["Yük işaretini ve hız yönünü belirle.", "Sağ el kuralıyla kuvvet yönünü bul.", "Dairesel hareket varsa merkezcil kuvvet bağlantısını kur."],
        commonPitfall: "Manyetik kuvvetin yaptığı işi sıfır kabul etmeyi unutmak enerji yorumunu bozar.",
        formulaFocus: ["F = q.v.B.sinθ", "F = B.I.L.sinθ"],
    },
    "elektromanyetik-induksiyon": {
        summary: "Elektromanyetik indüksiyon, değişen manyetik akının elektriksel etki üretmesini açıklar. Jeneratörlerden trafolara kadar birçok sistem bu ilkeye dayanır.",
        keyIdeas: ["Manyetik akı değişirse indüksiyon emk'si oluşur.", "Lenz yasası oluşan etkinin değişime karşı koyduğunu söyler.", "Sarım sayısı ve akı değişim hızı emk'yi etkiler."],
        studySteps: ["Manyetik akının artıp azaldığını belirle.", "Lenz yasasıyla akım yönünü yorumla.", "Zamanla değişim bilgisi varsa Faraday bağıntısını uygula."],
        commonPitfall: "Sadece manyetik alanın varlığını yeterli sanmak yanlıştır; indüksiyon için akı değişimi gerekir.",
        formulaFocus: ["ε = -N.ΔΦ / Δt", "Φ = B.A.cosθ"],
    },
    akiskanlar: {
        summary: "Akışkanlar konusu sıvı ve gazların basınç, kaldırma kuvveti ve akış hızı davranışını inceler. Günlük hayattaki uçak kanadı, gemi yüzmesi ve su basıncı örnekleri aynı temel ilkelerle açıklanır.",
        keyIdeas: ["Basınç derinlikle artar.", "Kaldırma kuvveti yer değiştiren akışkanın ağırlığına bağlıdır.", "Akış hızı artan yerde basınç azalabilir."],
        studySteps: ["Akışkan durgun mu akıyor mu ayır.", "Derinlik ve yoğunluk bilgilerini yaz.", "Bernoulli veya kaldırma kuvveti yaklaşımını seç."],
        commonPitfall: "Basıncı sadece kuvvet büyüklüğüyle düşünüp yüzey alanını hesaba katmamak eksik yorumdur.",
        formulaFocus: ["P = F / A", "P = h.d.g", "Fk = Vbatan.d.g"],
    },
    "atom-modelleri": {
        summary: "Atom modelleri, maddenin yapısını açıklamak için deney sonuçlarına göre gelişen fikirlerdir. Thomson, Rutherford ve Bohr modelleri birbirini tamamen silmez; her biri yeni bir gözlemin açıklama ihtiyacından doğar.",
        keyIdeas: ["Thomson elektronu modele dahil etti.", "Rutherford çekirdeğin küçük ve yoğun olduğunu gösterdi.", "Bohr enerji düzeyleri fikriyle çizgi spektrumlarını açıkladı."],
        studySteps: ["Modeli hangi deneyin desteklediğini eşleştir.", "Modelin neyi açıkladığını ve nerede yetersiz kaldığını ayır.", "Enerji düzeyi geçişlerini foton enerjisiyle bağla."],
        commonPitfall: "Atom modellerini tarih sırası ezberi gibi görmek, deney-sonuç ilişkisini kaçırır.",
        formulaFocus: ["E = h.f", "ΔE = Efoton"],
    },
    "nukleer-fizik": {
        summary: "Nükleer fizik, atom çekirdeğinin yapısını, radyoaktiviteyi ve çekirdek tepkimelerindeki enerji dönüşümünü inceler. Kütle-enerji ilişkisi bu konunun merkezindedir.",
        keyIdeas: ["Kararsız çekirdekler radyoaktif bozunma yapar.", "Fisyon ağır çekirdeğin bölünmesi, füzyon hafif çekirdeklerin birleşmesidir.", "Bağlanma enerjisi çekirdek kararlılığını açıklar."],
        studySteps: ["Tepkimede kütle ve yük numaralarını koru.", "Bozunma türünü parçacık değişiminden tanı.", "Enerji açığa çıkışını kütle farkıyla ilişkilendir."],
        commonPitfall: "Fisyon ve füzyonu yalnızca isim olarak ezberleyip çekirdek kütlesi ve enerji koşullarını ayırmamak kafa karıştırır.",
        formulaFocus: ["E = m.c²", "A ve Z korunumu"],
    },
    "ozel-gorelilik": {
        summary: "Özel görelilik, ışık hızına yakın hareketlerde zaman, uzunluk ve eşzamanlılık kavramlarının gözlemciye bağlı olduğunu gösterir. Günlük sezgi bu hızlarda yeterli değildir.",
        keyIdeas: ["Işık hızı tüm eylemsiz gözlemciler için aynıdır.", "Hız arttıkça zaman genişlemesi ölçülür.", "Enerji ve kütle ilişkisi relativistik çerçevede birleşir."],
        studySteps: ["Gözlemci çerçevelerini ayır.", "Hızın ışık hızına yakın olup olmadığını kontrol et.", "Zaman genişlemesi veya uzunluk büzülmesi etkisini seç."],
        commonPitfall: "Görelilik etkilerini günlük düşük hızlara doğrudan uygulamak anlamı abartır; etkiler ışık hızına yakın hızlarda belirginleşir.",
        formulaFocus: ["γ = 1 / √(1 - v²/c²)", "E = m.c²"],
    },
    "tyt-ayt-yks-fizik": {
        summary: "TYT, AYT ve YKS fizik çalışması; konu bilgisini soru okuma, grafik yorumlama ve işlem stratejisiyle birleştirmeyi gerektirir. En verimli rota kısa konu tekrarı, örnek soru ve hata defteri döngüsüdür.",
        keyIdeas: ["TYT daha temel kavram ve yorum ağırlıklıdır.", "AYT formül, model ve çok adımlı problem çözmeyi daha fazla ister.", "Yanlış analizi net konu tekrarından daha değerlidir."],
        studySteps: ["Konu başlığını küçük alt parçalara böl.", "Her alt parça için 10-15 soru çöz.", "Yanlışları formül, kavram veya dikkat hatası diye etiketle."],
        commonPitfall: "Sadece test çözmek, eksik kavramı kapatmadan aynı hatayı büyütebilir.",
        formulaFocus: ["Birim kontrolü", "Grafik eğim-alan okuması", "Korunum yasaları"],
    },
    "deney-ve-simulasyonlar": {
        summary: "Deney ve simülasyonlar, fizik kavramlarını değişkenleri oynatarak görmeyi sağlar. Bir simülasyonun değeri yalnızca animasyonda değil, hangi değişkenin hangi sonucu değiştirdiğini test etmesindedir.",
        keyIdeas: ["Değişken kontrolü bilimsel düşünmenin temelidir.", "Simülasyon ideal koşulları görünür kılar.", "Gerçek deneyde ölçüm hatası ve ortam etkisi ayrıca düşünülmelidir."],
        studySteps: ["Tek değişken değiştir ve sonucu gözlemle.", "Beklentini ölçümden önce yaz.", "Sonucu formül veya grafikle ilişkilendir."],
        commonPitfall: "Aynı anda çok değişkeni değiştirmek neden-sonuç bağını belirsizleştirir.",
        formulaFocus: ["Bağımsız değişken", "Bağımlı değişken", "Kontrol değişkeni"],
    },
};

export function isThinTopicCluster(cluster: SeoTopicCluster) {
    return cluster.articleSlugs.length === 0;
}

export function getTopicStudyGuide(cluster: SeoTopicCluster): TopicStudyGuide {
    return WEAK_TOPIC_GUIDES[cluster.slug] || {
        summary: `${cluster.title} konusu Fizikhub'da ilişkili makaleler, sözlük maddeleri, testler ve simülasyonlarla birlikte okunur. Bu hub, konuyu tek bir kanonik öğrenme sayfasında toplar.`,
        keyIdeas: [
            `${cluster.title} kavramını önce temel tanım, sonra örnek ve uygulama sırasıyla çalış.`,
            cluster.aliases[0] ? `${cluster.aliases[0]} bağlantısını ana kavramla ilişkilendir.` : "Ana kavramı alt kavramlarla ilişkilendir.",
            "İlgili kaynakları sırayla okuyarak kısa cevap, formül ve uygulama bağlamını birleştir.",
        ],
        studySteps: [
            "Kısa cevabı oku ve bilmediğin terimleri sözlükte aç.",
            "Varsa makale ve simülasyon bağlantılarıyla örnekleri incele.",
            "Forum veya test bağlantılarıyla kendi anlayışını kontrol et.",
        ],
        commonPitfall: `${cluster.title} konusunu tek bir formül ezberi gibi görmek, kavramlar arası bağlantıyı zayıflatır.`,
        formulaFocus: cluster.aliases.slice(0, 3),
    };
}

export function weakTopicGuideCoverage() {
    return Object.keys(WEAK_TOPIC_GUIDES);
}
