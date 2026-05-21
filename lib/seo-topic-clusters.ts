export type SeoTopicCluster = {
    slug: string;
    title: string;
    aliases: string[];
    intentQuestions: string[];
    articleSlugs: string[];
    termSlugs: string[];
    quizSlugs: string[];
    simulationSlugs: string[];
};

export const SEO_TOPIC_CLUSTERS: SeoTopicCluster[] = [
    {
        slug: "newton-yasalari",
        title: "Newton yasaları",
        aliases: ["hareket yasaları", "eylemsizlik", "dinamik"],
        intentQuestions: ["Newton yasaları nelerdir?", "Eylemsizlik günlük hayatta nasıl görülür?"],
        articleSlugs: [],
        termSlugs: ["newton-yasalari", "ivme", "kuvvet"],
        quizSlugs: [],
        simulationSlugs: ["atis-hareketi"],
    },
    {
        slug: "kuvvet-hareket",
        title: "Kuvvet ve hareket",
        aliases: ["kinematik", "ivmeli hareket", "atış hareketi"],
        intentQuestions: ["Kuvvet hareketi nasıl değiştirir?", "Atış hareketinde menzil nasıl bulunur?"],
        articleSlugs: [],
        termSlugs: ["kuvvet", "ivme", "hiz"],
        quizSlugs: [],
        simulationSlugs: ["atis-hareketi"],
    },
    {
        slug: "is-enerji-guc",
        title: "İş, enerji ve güç",
        aliases: ["mekanik enerji", "kinetik enerji", "potansiyel enerji"],
        intentQuestions: ["İş ve enerji arasındaki ilişki nedir?", "Güç nasıl hesaplanır?"],
        articleSlugs: [],
        termSlugs: ["is", "enerji", "guc", "kinetik-enerji", "potansiyel-enerji"],
        quizSlugs: [],
        simulationSlugs: ["yay-kutle", "1d-carpisma"],
    },
    {
        slug: "momentum-carpisma",
        title: "Momentum ve çarpışma",
        aliases: ["impuls", "esnek çarpışma", "inelastik çarpışma"],
        intentQuestions: ["Momentum korunumu ne zaman geçerlidir?", "Esnek ve inelastik çarpışma farkı nedir?"],
        articleSlugs: [],
        termSlugs: ["momentum", "impuls", "carpisma"],
        quizSlugs: [],
        simulationSlugs: ["1d-carpisma"],
    },
    {
        slug: "tork-denge",
        title: "Tork ve denge",
        aliases: ["moment", "denge şartları", "ağırlık merkezi"],
        intentQuestions: ["Tork nasıl hesaplanır?", "Denge şartları nelerdir?"],
        articleSlugs: [],
        termSlugs: ["tork", "denge", "agirlik-merkezi"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "basit-harmonik-hareket",
        title: "Basit harmonik hareket",
        aliases: ["BHH", "periyodik hareket", "sarkaç", "yay-kütle"],
        intentQuestions: ["Basit harmonik hareket nedir?", "Sarkaç periyodu nelere bağlıdır?"],
        articleSlugs: ["fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj"],
        termSlugs: ["basit-harmonik-hareket", "harmonik-hareket", "periyodik-hareket", "periyot"],
        quizSlugs: [],
        simulationSlugs: ["basit-sarkac", "yay-kutle"],
    },
    {
        slug: "dalgalar",
        title: "Dalgalar",
        aliases: ["dalga hareketi", "girişim", "süperpozisyon"],
        intentQuestions: ["Dalga boyu ve frekans ilişkisi nedir?", "Girişim nasıl oluşur?"],
        articleSlugs: [],
        termSlugs: ["dalga", "frekans", "dalga-boyu", "girişim"],
        quizSlugs: [],
        simulationSlugs: ["dalga-girisimi"],
    },
    {
        slug: "optik",
        title: "Optik",
        aliases: ["ışık", "kırılma", "yansıma", "Snell yasası"],
        intentQuestions: ["Snell yasası nedir?", "Tam yansıma hangi koşulda olur?"],
        articleSlugs: [],
        termSlugs: ["optik", "snell-yasasi", "kirilma", "yansima"],
        quizSlugs: [],
        simulationSlugs: ["optik-laboratuvari", "dalga-girisimi"],
    },
    {
        slug: "elektrik-alan",
        title: "Elektrik alan",
        aliases: ["Coulomb", "alan çizgileri", "noktasal yük"],
        intentQuestions: ["Elektrik alan nasıl hesaplanır?", "Alan çizgileri neyi gösterir?"],
        articleSlugs: [],
        termSlugs: ["elektrik-alan", "coulomb-yasasi", "elektrik-yuku"],
        quizSlugs: [],
        simulationSlugs: ["elektrik-alan"],
    },
    {
        slug: "devreler",
        title: "Elektrik devreleri",
        aliases: ["Ohm yasası", "akım", "gerilim", "direnç"],
        intentQuestions: ["Ohm yasası nasıl kullanılır?", "Seri ve paralel devre farkı nedir?"],
        articleSlugs: [],
        termSlugs: ["ohm-yasasi", "akim", "gerilim", "direnc"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "manyetizma",
        title: "Manyetizma",
        aliases: ["manyetik alan", "Lorentz kuvveti", "mıknatıs"],
        intentQuestions: ["Manyetik alan nedir?", "Yüklü parçacık manyetik alanda nasıl hareket eder?"],
        articleSlugs: [],
        termSlugs: ["manyetizma", "manyetik-alan", "lorentz-kuvveti"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "elektromanyetik-induksiyon",
        title: "Elektromanyetik indüksiyon",
        aliases: ["Faraday yasası", "Lenz yasası", "indüksiyon akımı"],
        intentQuestions: ["Faraday yasası nedir?", "Lenz yasası yönü nasıl belirler?"],
        articleSlugs: [],
        termSlugs: ["faraday-yasasi", "lenz-yasasi", "induksiyon"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "termodinamik",
        title: "Termodinamik",
        aliases: ["ısı", "sıcaklık", "enerji dönüşümü"],
        intentQuestions: ["Termodinamik yasaları nelerdir?", "Isı ve sıcaklık farkı nedir?"],
        articleSlugs: ["entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662"],
        termSlugs: ["termodinamik", "isi", "sicaklik", "entropi"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "entropi",
        title: "Entropi",
        aliases: ["düzensizlik", "zaman oku", "ikinci yasa"],
        intentQuestions: ["Entropi nedir?", "Evrenin ısı ölümü ne anlama gelir?"],
        articleSlugs: ["entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662"],
        termSlugs: ["entropi", "termodinamigin-ikinci-yasasi", "zaman-oku"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "akiskanlar",
        title: "Akışkanlar",
        aliases: ["Bernoulli", "basınç", "kaldırma kuvveti"],
        intentQuestions: ["Bernoulli ilkesi nedir?", "Basınç derinlikle nasıl değişir?"],
        articleSlugs: [],
        termSlugs: ["bernoulli-ilkesi", "basinc", "kaldirma-kuvveti"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "modern-fizik",
        title: "Modern fizik",
        aliases: ["kuantum", "görelilik", "atom fiziği"],
        intentQuestions: ["Modern fizik hangi problemlerden doğdu?", "Klasik fizik neden yetmedi?"],
        articleSlugs: [
            "kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990",
            "klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619",
        ],
        termSlugs: ["modern-fizik", "kuantum", "foton", "planck-sabiti"],
        quizSlugs: [],
        simulationSlugs: ["dalga-girisimi"],
    },
    {
        slug: "fotoelektrik-olay",
        title: "Fotoelektrik olay",
        aliases: ["foton", "eşik frekansı", "Einstein"],
        intentQuestions: ["Fotoelektrik olay nedir?", "Işık şiddeti elektron enerjisini neden artırmaz?"],
        articleSlugs: ["klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619"],
        termSlugs: ["fotoelektrik-olay", "foton", "esik-frekansi"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "kara-cisim-isimasi",
        title: "Kara cisim ışıması",
        aliases: ["Planck", "ultraviyole felaketi", "siyah cisim"],
        intentQuestions: ["Kara cisim ışıması nedir?", "Planck sabiti neden önemlidir?"],
        articleSlugs: ["kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990"],
        termSlugs: ["kara-cisim-isimasi", "siyah-cisim-isimasi", "planck-sabiti"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "atom-modelleri",
        title: "Atom modelleri",
        aliases: ["Bohr", "Rutherford", "Thomson"],
        intentQuestions: ["Atom modelleri nasıl gelişti?", "Bohr modeli neyi açıklar?"],
        articleSlugs: [],
        termSlugs: ["atom", "bohr-modeli", "rutherford-deneyi"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "kuantum-fizigi",
        title: "Kuantum fiziği",
        aliases: ["belirsizlik", "dalga fonksiyonu", "süperpozisyon"],
        intentQuestions: ["Kuantum fiziği nedir?", "Tanrı zar atar mı tartışması ne anlatır?"],
        articleSlugs: [
            "tanri-zar-atar-mi-1767761695497",
            "kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990",
            "klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619",
        ],
        termSlugs: ["kuantum", "belirsizlik-ilkesi", "superpozisyon", "dalga-fonksiyonu"],
        quizSlugs: [],
        simulationSlugs: ["dalga-girisimi"],
    },
    {
        slug: "parcacik-fizigi",
        title: "Parçacık fiziği",
        aliases: ["standart model", "kuark", "lepton", "bozon"],
        intentQuestions: ["Standart Model nedir?", "Temel parçacıklar hangileridir?"],
        articleSlugs: ["parcacik-fizigine-giris-evrenin-perde-arkasi-1767186788291"],
        termSlugs: ["standart-model", "kuark", "lepton", "bozon"],
        quizSlugs: [],
        simulationSlugs: ["1d-carpisma"],
    },
    {
        slug: "nukleer-fizik",
        title: "Nükleer fizik",
        aliases: ["radyoaktivite", "fişyon", "füzyon"],
        intentQuestions: ["Radyoaktivite nedir?", "Fisyon ve füzyon farkı nedir?"],
        articleSlugs: [],
        termSlugs: ["radyoaktivite", "fisyon", "fuzyon", "cekirdek"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "ozel-gorelilik",
        title: "Özel görelilik",
        aliases: ["Einstein", "zaman genişlemesi", "ışık hızı"],
        intentQuestions: ["Özel görelilik nedir?", "Zaman genişlemesi nasıl oluşur?"],
        articleSlugs: [],
        termSlugs: ["ozel-gorelilik", "zaman-genislemesi", "isik-hizi"],
        quizSlugs: [],
        simulationSlugs: [],
    },
    {
        slug: "genel-gorelilik",
        title: "Genel görelilik",
        aliases: ["uzay-zaman", "kütleçekim", "Einstein alan denklemleri"],
        intentQuestions: ["Genel görelilik nedir?", "Kütle uzay-zamanı nasıl büker?"],
        articleSlugs: ["kara-delige-dusersek-ne-olur-1766107168421"],
        termSlugs: ["genel-gorelilik", "uzay-zaman", "kutlecekim"],
        quizSlugs: [],
        simulationSlugs: ["gunes-sistemi"],
    },
    {
        slug: "kara-delikler",
        title: "Kara delikler",
        aliases: ["olay ufku", "tekillik", "Hawking radyasyonu"],
        intentQuestions: ["Kara deliğe düşersek ne olur?", "Olay ufku nedir?"],
        articleSlugs: ["kara-delige-dusersek-ne-olur-1766107168421"],
        termSlugs: ["karadelik", "kara-delik", "olay-ufku", "tekillik"],
        quizSlugs: [],
        simulationSlugs: ["gunes-sistemi"],
    },
    {
        slug: "kozmoloji",
        title: "Kozmoloji",
        aliases: ["Büyük Patlama", "evrenin genişlemesi", "kızıl kayma"],
        intentQuestions: ["Evren nasıl genişliyor?", "Kızıl kayma neyi gösterir?"],
        articleSlugs: ["evrenin-derinliklerine-bakis-james-webb-uzay-teleskobu"],
        termSlugs: ["kozmoloji", "buyuk-patlama", "kizila-kayma"],
        quizSlugs: [],
        simulationSlugs: ["gunes-sistemi"],
    },
    {
        slug: "karanlik-madde-enerji",
        title: "Karanlık madde ve karanlık enerji",
        aliases: ["galaksi dönüş eğrileri", "evrenin ivmeli genişlemesi"],
        intentQuestions: ["Karanlık madde nedir?", "Karanlık enerji evreni nasıl etkiler?"],
        articleSlugs: ["karanlik-madde-nedir-nasil-gorunur"],
        termSlugs: ["karanlik-madde", "karanlik-enerji", "galaksi"],
        quizSlugs: [],
        simulationSlugs: ["gunes-sistemi"],
    },
    {
        slug: "yildizlar-astrofizik",
        title: "Yıldızlar ve astrofizik",
        aliases: ["yıldız evrimi", "süpernova", "James Webb"],
        intentQuestions: ["Yıldızlar nasıl doğar?", "James Webb teleskobu neyi gözlemler?"],
        articleSlugs: ["evrenin-derinliklerine-bakis-james-webb-uzay-teleskobu"],
        termSlugs: ["yildiz", "supernova", "astrofizik"],
        quizSlugs: [],
        simulationSlugs: ["gunes-sistemi"],
    },
    {
        slug: "tyt-ayt-yks-fizik",
        title: "TYT, AYT ve YKS fizik",
        aliases: ["sınav fiziği", "TYT fizik", "AYT fizik"],
        intentQuestions: ["TYT fizik nasıl çalışılır?", "AYT fizikte hangi konular önemlidir?"],
        articleSlugs: [],
        termSlugs: ["fizik", "formul", "birim"],
        quizSlugs: [],
        simulationSlugs: ["atis-hareketi", "elektrik-alan", "optik-laboratuvari"],
    },
    {
        slug: "deney-ve-simulasyonlar",
        title: "Deney ve simülasyonlar",
        aliases: ["interaktif fizik", "laboratuvar", "generative UI"],
        intentQuestions: ["Fizik simülasyonları ne işe yarar?", "Deneyle konu anlatımı nasıl pekişir?"],
        articleSlugs: [],
        termSlugs: ["deney", "simulasyon", "model"],
        quizSlugs: [],
        simulationSlugs: ["atis-hareketi", "optik-laboratuvari", "basit-sarkac", "yay-kutle", "dalga-girisimi", "gunes-sistemi", "elektrik-alan", "1d-carpisma"],
    },
];

export function getClustersForArticleSlug(slug?: string | null) {
    if (!slug) return [];
    return SEO_TOPIC_CLUSTERS.filter((cluster) => cluster.articleSlugs.includes(slug));
}

export function getClustersForTermSlug(slug?: string | null) {
    if (!slug) return [];
    return SEO_TOPIC_CLUSTERS.filter((cluster) => cluster.termSlugs.includes(slug));
}

export function getClustersForSimulationSlug(slug?: string | null) {
    if (!slug) return [];
    return SEO_TOPIC_CLUSTERS.filter((cluster) => cluster.simulationSlugs.includes(slug));
}

export function getRelatedUrlsForCluster(cluster: SeoTopicCluster) {
    return [
        ...cluster.articleSlugs.map((slug) => ({ href: `/makale/${slug}`, label: "Makale" })),
        ...cluster.termSlugs.map((slug) => ({ href: `/sozluk/${slug}`, label: "Sözlük" })),
        ...cluster.quizSlugs.map((slug) => ({ href: `/testler/${slug}`, label: "Test" })),
        ...cluster.simulationSlugs.map((slug) => ({ href: `/simulasyonlar/${slug}`, label: "Simülasyon" })),
    ];
}

export function getPrimaryClusterHref(cluster: SeoTopicCluster) {
    return cluster.articleSlugs[0]
        ? `/makale/${cluster.articleSlugs[0]}`
        : cluster.simulationSlugs[0]
            ? `/simulasyonlar/${cluster.simulationSlugs[0]}`
            : cluster.termSlugs[0]
                ? `/sozluk/${cluster.termSlugs[0]}`
                : "/konular";
}
