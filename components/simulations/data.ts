import {
    Activity,
    Zap,
    Sparkles,
    Target,
    Atom,
    Lightbulb,
    Orbit,
    Combine,
    type LucideIcon,
} from "lucide-react";

export type Simulation = {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    formula: string;
    difficulty: "Kolay" | "Orta" | "Zor";
    tags: string[];
    seo?: {
        title: string;
        description: string;
        keywords: string[];
    };
    content?: {
        theory: string;
        formulas: string[];
        objectives: string[];
    };
    learning: {
        bigQuestion: string;
        outcome: string;
        estimatedMinutes: number;
        prerequisite?: string;
        checkpoints: string[];
        quickCheck: string;
        relatedResources: {
            label: string;
            href: string;
            type: "Makale" | "Test" | "Sözlük" | "Konu" | "Forum";
        }[];
    };
};

export const simulations: Simulation[] = [
    {
        id: "projectile",
        slug: "atis-hareketi",
        title: "Atış Hareketi",
        description: "Bir cismin yerçekimi altındaki hareketini, hız, açı ve yükseklik parametreleriyle inceleyin.",
        icon: Target,
        color: "#E8590C",
        formula: "R = v²sin(2θ)/g",
        difficulty: "Kolay",
        tags: ["Mekanik", "Kinematik", "Vektörler"],
        seo: {
            title: "Atış Hareketi Simülasyonu - Eğik Atış ve Serbest Düşme | FizikHub",
            description: "Eğik atış ve yatay atış hareketlerini interaktif simülasyonla öğrenin. Yerçekimi, ilk hız, açı ve menzil hesaplamalarını görselleştirerek test edin.",
            keywords: ["atış hareketi", "eğik atış", "yatay atış", "menzil formülü", "fizik simülasyonu", "kinematik"]
        },
        learning: {
            bigQuestion: "Aynı ilk hızla en uzağa gitmek için neden 45 derece özel bir açı olur?",
            outcome: "Yatay ve düşey hareketin birbirinden bağımsız ilerlediğini, menzil ve maksimum yükseklik ilişkisiyle açıklayabilir.",
            estimatedMinutes: 9,
            prerequisite: "Hız vektörleri, sinüs-kosinüs ve yerçekimi ivmesi",
            checkpoints: [
                "Açıyı değiştirirken havada kalma süresi ve menzili karşılaştır.",
                "Yerçekimini azaltıp aynı atışın neden daha uzağa gittiğini gözlemle.",
                "90 derece atışta yatay hız bileşeninin ne olduğunu yorumla."
            ],
            quickCheck: "Hava direnci yoksa 30 derece ve 60 derece atışların menzili neden aynıdır?",
            relatedResources: [
                { label: "Fizik testleri", href: "/testler", type: "Test" },
                { label: "Mekanik konu rehberleri", href: "/konular", type: "Konu" },
                { label: "Forumda atış sorusu sor", href: "/forum", type: "Forum" }
            ]
        }
    },
    {
        id: "optics",
        slug: "optik-laboratuvari",
        title: "Optik Laboratuvarı",
        description: "Işığın kırılma (Snell Yasası) ve tam yansıma olaylarını interaktif olarak keşfedin.",
        icon: Lightbulb,
        color: "#0C8CE9",
        formula: "n₁sinθ₁ = n₂sinθ₂",
        difficulty: "Orta",
        tags: ["Optik", "Kırılma", "Yansıma"],
        seo: {
            title: "Optik Laboratuvarı Simülasyonu - Işığın Kırılması ve Snell Yasası | FizikHub",
            description: "Işığın farklı ortamlardaki kırılma ve yansıma davranışını simüle edin. Snell yasası, kırıcılık indisi ve tam yansıma açısını interaktif olarak keşfedin.",
            keywords: ["optik", "ışığın kırılması", "snell yasası", "tam yansıma", "kırıcılık indisi", "optik simülasyonu"]
        },
        learning: {
            bigQuestion: "Işık bir ortamdan diğerine geçerken neden yön değiştirir?",
            outcome: "Kırıcılık indisi, geliş açısı ve kırılma açısı arasındaki Snell yasası ilişkisini yorumlayabilir.",
            estimatedMinutes: 8,
            prerequisite: "Açı ölçme, sinüs kavramı ve ışığın doğrusal yayılması",
            checkpoints: [
                "Havadan cama geçerken ışının normale yaklaşıp yaklaşmadığını gözlemle.",
                "Kırıcılık indisini büyüttüğünde kırılma açısının nasıl değiştiğini takip et.",
                "Tam yansımanın hangi koşulda oluştuğunu kendi cümlenle açıkla."
            ],
            quickCheck: "Işık yoğun ortamdan az yoğun ortama geçerken hangi durumda tam yansıma oluşur?",
            relatedResources: [
                { label: "Optik başlıklarını keşfet", href: "/konular", type: "Konu" },
                { label: "Bilim sözlüğü", href: "/sozluk", type: "Sözlük" },
                { label: "Fizik testleri", href: "/testler", type: "Test" }
            ]
        }
    },
    {
        id: "pendulum",
        slug: "basit-sarkac",
        title: "Basit Sarkaç",
        description: "Sarkaç periyodunun ip uzunluğu ve yerçekimi ivmesiyle ilişkisini gözlemleyin.",
        icon: Activity,
        color: "#D97706",
        formula: "T = 2π√(L/g)",
        difficulty: "Kolay",
        tags: ["Harmonik Hareket", "Mekanik"],
        seo: {
            title: "Basit Sarkaç Simülasyonu - Harmonik Hareket ve Periyot | FizikHub",
            description: "Sarkaç hareketini etkileyen yerçekimi ve ip uzunluğu gibi parametreleri değiştirerek basit harmonik hareketi ve periyot formülünü interaktif olarak deneyimleyin.",
            keywords: ["basit sarkaç", "harmonik hareket", "sarkaç periyodu", "yerçekimi ivmesi", "fizik simülasyonu"]
        },
        learning: {
            bigQuestion: "Sarkaç periyodu neden kütleden çok uzunluk ve yerçekimine bağlıdır?",
            outcome: "Basit sarkacın periyodunu ip uzunluğu ve yerçekimi ivmesi üzerinden tahmin edebilir.",
            estimatedMinutes: 7,
            prerequisite: "Periyot, frekans ve basit harmonik hareket fikri",
            checkpoints: [
                "İp uzunluğunu iki katına çıkar ve periyodun doğrusal mı köklü mü arttığını gözlemle.",
                "Yerçekimi ivmesini azaltınca salınımın neden yavaşladığını açıkla.",
                "Küçük açı yaklaşımının neden gerekli olduğunu tartış."
            ],
            quickCheck: "Aynı sarkaç Ay'da mı Dünya'da mı daha yavaş salınır?",
            relatedResources: [
                { label: "Basit harmonik hareket makalesi", href: "/makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj", type: "Makale" },
                { label: "Fizik testleri", href: "/testler", type: "Test" },
                { label: "Harmonik hareket forumu", href: "/forum", type: "Forum" }
            ]
        }
    },
    {
        id: "spring",
        slug: "yay-kutle",
        title: "Yay-Kütle Sistemi",
        description: "Hooke yasası, potansiyel enerji ve kinetik enerji dönüşümlerini keşfedin.",
        icon: Zap,
        color: "#2563EB",
        formula: "F = -kx",
        difficulty: "Orta",
        tags: ["Enerji", "Harmonik Hareket"],
        seo: {
            title: "Yay Kütle Sistemi Simülasyonu - Hooke Yasası | FizikHub",
            description: "Yay sabiti ve kütle değişiminin basit harmonik harekete etkisini interaktif olarak inceleyin. Hooke yasası ve enerji dönüşümü simülasyonu.",
            keywords: ["yay sarkacı", "hooke yasası", "basit harmonik hareket", "yay potansiyel enerjisi", "fizik simülasyonu"]
        },
        learning: {
            bigQuestion: "Yay sertleştiğinde sistem neden daha hızlı titreşir?",
            outcome: "Hooke yasasını kuvvet, enerji ve periyot grafikleriyle ilişkilendirebilir.",
            estimatedMinutes: 10,
            prerequisite: "Kuvvet, enerji dönüşümü ve periyot",
            checkpoints: [
                "Yay sabitini artır ve periyottaki değişimi kaydet.",
                "Kütleyi artırınca sistemin neden ağırlaştığını enerji diliyle açıkla.",
                "Denge noktasında hız ve ivmenin değerlerini karşılaştır."
            ],
            quickCheck: "Genlik artarsa periyot değişir mi, yoksa sadece enerji mi değişir?",
            relatedResources: [
                { label: "Basit harmonik hareket makalesi", href: "/makale/fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj", type: "Makale" },
                { label: "Fizik testleri", href: "/testler", type: "Test" },
                { label: "Sözlükte Hooke yasasını ara", href: "/sozluk", type: "Sözlük" }
            ]
        },
        content: {
            theory: `### Basit Harmonik Hareket ve Yaylar
Esnek bir yay, denge konumundan uzaklaştırıldığında, onu tekrar denge konumuna getirmeye çalışan bir **geri çağırıcı kuvvet** (Restoring Force) oluşur. Bu kuvvet, uzama miktarı ile doğru orantılıdır ancak yönü terstir.

Bu ilişki **Hooke Yasası** ile ifade edilir: **F = -k · x**

Burada:
*   **F**: Yay kuvveti (Newton)
*   **k**: Yay sabiti (N/m) - Yayın sertliğini ifade eder.
*   **x**: Denge konumundan uzaklaşma miktarı (metre)

Cisim serbest bırakıldığında, bu kuvvetin etkisiyle **Basit Harmonik Hareket (BHH)** yapar. Sürtünmesiz ortamda bu hareket sonsuza kadar devam eder.

### Periyot ve Frekans
Yay sarkacının periyodu (tam bir salınım için geçen süre), kütleye ve yay sabitine bağlıdır, ancak **genliğe (uzama miktarına) bağlı değildir**.

*   Kütle (m) artarsa, eylemsizlik artar ve periyot uzar (hareket yavaşlar).
*   Yay sabiti (k) artarsa, geri çağırıcı kuvvet artar ve periyot kısalır (hareket hızlanır).`,
            formulas: [
                "F_{yay} = -k \\cdot x",
                "T = 2\\pi \\sqrt{\\frac{m}{k}}",
                "E_{pot} = \\frac{1}{2} k x^2",
                "E_{kin} = \\frac{1}{2} m v^2"
            ],
            objectives: [
                "Yay sabiti (k) arttığında periyodun nasıl değiştiğini gözlemlemek.",
                "Kütle (m) arttığında hareketin nasıl yavaşladığını anlamak.",
                "Maksimum uzanım noktalarında (genlik) hızın sıfır, ivmenin maksimum olduğunu görmek.",
                "Denge noktasından geçerken hızın maksimum, ivmenin sıfır olduğunu keşfetmek."
            ]
        }
    },
    {
        id: "wave",
        slug: "dalga-girisimi",
        title: "Dalga Girişimi",
        description: "Çift yarık deneyi ve dalgaların süperpozisyon ilkesini görselleştirin.",
        icon: Sparkles,
        color: "#16A34A",
        formula: "y = A sin(kx - ωt)",
        difficulty: "Zor",
        tags: ["Dalgalar", "Optik"],
        seo: {
            title: "Dalga Girişimi ve Çift Yarık Deneyi Simülasyonu | FizikHub",
            description: "Young deneyi ve çift yarıkta girişim desenlerini görselleştirin. Işığın ve su dalgalarının dalga doğasını, yapıcı ve yıkıcı girişimi simüle ederek öğrenin.",
            keywords: ["dalga girişimi", "çift yarık deneyi", "young deneyi", "süperpozisyon", "optik simülasyonu"]
        },
        learning: {
            bigQuestion: "İki dalga karşılaştığında neden bazen büyür, bazen birbirini söndürür?",
            outcome: "Süperpozisyon, yapıcı girişim, yıkıcı girişim ve frekans farkının desen üzerindeki etkisini açıklayabilir.",
            estimatedMinutes: 11,
            prerequisite: "Dalga boyu, frekans, genlik ve faz kavramları",
            checkpoints: [
                "İki dalganın frekansını eşitleyip toplam genliğin nasıl değiştiğini izle.",
                "Frekansları az farklı yap ve vurma benzeri genlik değişimini yakala.",
                "Bireysel dalgaları kapatıp yalnızca süperpozisyonu yorumla."
            ],
            quickCheck: "Aynı genlikte ters fazlı iki dalga üst üste gelirse toplam dalga ne olur?",
            relatedResources: [
                { label: "Optik ve dalgalar başlıkları", href: "/konular", type: "Konu" },
                { label: "Fizik testleri", href: "/testler", type: "Test" },
                { label: "Forumda girişim sorusu sor", href: "/forum", type: "Forum" }
            ]
        }
    },
    {
        id: "photoelectric",
        slug: "fotoelektrik-olay",
        title: "Fotoelektrik Olay",
        description: "Foton enerjisi, eşik frekansı, iş fonksiyonu ve elektron kopması arasındaki ilişkiyi keşfedin.",
        icon: Sparkles,
        color: "#8B5CF6",
        formula: "Kmax = hf - φ",
        difficulty: "Orta",
        tags: ["Modern Fizik", "Kuantum", "Optik"],
        seo: {
            title: "Fotoelektrik Olay Simülasyonu - Eşik Frekansı ve Foton Enerjisi | FizikHub",
            description: "Fotoelektrik olayı interaktif simülasyonla öğrenin. Dalga boyu, ışık şiddeti ve iş fonksiyonunu değiştirerek elektron kopması, Kmax ve durdurma potansiyelini görün.",
            keywords: ["fotoelektrik olay", "eşik frekansı", "iş fonksiyonu", "foton enerjisi", "durdurma potansiyeli", "kuantum fiziği simülasyonu"]
        },
        learning: {
            bigQuestion: "Işığın şiddeti artınca neden elektronların enerjisi değil sayısı artar?",
            outcome: "Fotoelektrik olayda foton enerjisi, iş fonksiyonu, eşik frekansı ve maksimum kinetik enerji ilişkisini açıklayabilir.",
            estimatedMinutes: 10,
            prerequisite: "Frekans, dalga boyu, enerji ve elektron kavramları",
            checkpoints: [
                "Dalga boyunu azaltıp foton enerjisinin nasıl arttığını gözlemle.",
                "İş fonksiyonunu değiştirerek eşik dalga boyunun kaymasını yorumla.",
                "Işık şiddetini artırınca elektron sayısı ve Kmax değişimini karşılaştır."
            ],
            quickCheck: "Eşik frekansın altındaki ışık ne kadar şiddetli olursa olsun neden elektron koparamaz?",
            relatedResources: [
                { label: "Fotoelektrik olay konu hub'ı", href: "/konular/fotoelektrik-olay", type: "Konu" },
                { label: "Fotoelektrik olay makalesi", href: "/makale/klasik-fizige-vurulan-ikinci-darbe-fotoelektrik-olay-1766621600619", type: "Makale" },
                { label: "Sözlükte foton ve eşik frekansı", href: "/sozluk", type: "Sözlük" }
            ]
        }
    },
    {
        id: "solar",
        slug: "gunes-sistemi",
        title: "Güneş Sistemi",
        description: "Gezegenlerin yörünge hareketlerini ve kütleçekim kuvvetini 3 boyutlu inceleyin.",
        icon: Atom,
        color: "#7C3AED",
        formula: "F = G(m₁m₂)/r²",
        difficulty: "Orta",
        tags: ["Astronomi", "Kütleçekim"],
        seo: {
            title: "Güneş Sistemi Simülasyonu - Kütleçekim ve Yörüngeler | FizikHub",
            description: "Gezegenlerin yörünge hareketlerini Newton'un evrensel kütleçekim yasasıyla 3 boyutlu olarak inceleyin. Kepler yasaları ve yörünge mekaniği simülasyonu.",
            keywords: ["güneş sistemi", "kütleçekim", "yörünge", "kepler yasaları", "astronomi simülasyonu", "newton kütleçekim"]
        },
        learning: {
            bigQuestion: "Gezegenler Güneş'e düşmeden nasıl sürekli yörüngede kalır?",
            outcome: "Kütleçekim kuvveti, yörünge hızı ve uzaklık ilişkisini nitel olarak açıklayabilir.",
            estimatedMinutes: 12,
            prerequisite: "Merkezcil hareket, kuvvet ve temel astronomi kavramları",
            checkpoints: [
                "Güneş'e yakın ve uzak gezegenlerin yörünge sürelerini karşılaştır.",
                "Uzaklık arttıkça kütleçekim etkisinin nasıl azaldığını yorumla.",
                "Yörüngeyi düşme ve ileri hızın dengesi olarak açıkla."
            ],
            quickCheck: "Bir gezegenin hızı çok azalırsa yörüngesi nasıl değişir?",
            relatedResources: [
                { label: "Uzay ve kozmoloji konuları", href: "/konular", type: "Konu" },
                { label: "Karanlık madde nedir?", href: "/makale/karanlik-madde-nedir-nasil-gorunur", type: "Makale" },
                { label: "Astronomi soruları", href: "/forum", type: "Forum" }
            ]
        }
    },
    {
        id: "electric",
        slug: "elektrik-alan",
        title: "Elektrik Alan ve Konumları",
        description: "Noktasal elektrik yüklerinin etrafında oluşan alan çizgilerini ve dipol yapısını inceleyin.",
        icon: Orbit,
        color: "#0891B2",
        formula: "E = k·q/r²",
        difficulty: "Orta",
        tags: ["Elektromanyetizma", "Alan Çizgileri"],
        seo: {
            title: "Elektrik Alan Çizgileri Simülasyonu - Coulomb Yasası | FizikHub",
            description: "Noktasal elektrik yüklerinin etrafında oluşan elektrik alan çizgilerini çizin. Artı ve eksi yüklerin etkileşimini ve Coulomb kuvvetini interaktif olarak görün.",
            keywords: ["elektrik alan", "elektrik alan çizgileri", "coulomb yasası", "elektromanyetizma", "noktasal yük", "fizik simülasyonu"]
        },
        learning: {
            bigQuestion: "Elektrik alan çizgileri bize görünmeyen kuvveti nasıl tarif eder?",
            outcome: "Pozitif ve negatif yüklerin alan yönünü, alan şiddetini ve dipol desenini açıklayabilir.",
            estimatedMinutes: 9,
            prerequisite: "Elektrik yükü, vektör ve ters kare yasası",
            checkpoints: [
                "Tek pozitif yük ve tek negatif yük için alan yönlerini karşılaştır.",
                "Yük miktarını değiştirip çizgi yoğunluğunu yorumla.",
                "Dipol düzeninde alan çizgilerinin neden bir yükten diğerine aktığını açıkla."
            ],
            quickCheck: "Elektrik alan çizgileri neden pozitif yükten çıkıp negatif yüke girer?",
            relatedResources: [
                { label: "Elektromanyetizma başlıkları", href: "/konular", type: "Konu" },
                { label: "Bilim sözlüğü", href: "/sozluk", type: "Sözlük" },
                { label: "Fizik testleri", href: "/testler", type: "Test" }
            ]
        }
    },
    {
        id: "circuit",
        slug: "ohm-devresi",
        title: "Ohm Devresi",
        description: "Seri ve paralel dirençlerde eşdeğer direnç, akım, gerilim düşümü ve elektriksel gücü inceleyin.",
        icon: Zap,
        color: "#F59E0B",
        formula: "V = I·R",
        difficulty: "Kolay",
        tags: ["Elektrik Devreleri", "Ohm Yasası", "Enerji"],
        seo: {
            title: "Ohm Devresi Simülasyonu - Seri ve Paralel Dirençler | FizikHub",
            description: "Ohm yasası, seri devre, paralel devre, eşdeğer direnç, akım ve elektriksel güç ilişkilerini interaktif devre simülasyonuyla öğrenin.",
            keywords: ["ohm yasası", "seri devre", "paralel devre", "eşdeğer direnç", "elektriksel güç", "devre simülasyonu"]
        },
        learning: {
            bigQuestion: "Aynı pilde paralel devre neden seri devreden daha fazla akım çeker?",
            outcome: "Seri ve paralel devrelerde eşdeğer direnç, toplam akım, gerilim paylaşımı ve güç ilişkisini hesaplayabilir.",
            estimatedMinutes: 9,
            prerequisite: "Akım, gerilim, direnç ve temel cebir",
            checkpoints: [
                "Seri modda R1 ve R2 değerlerini değiştirip eşdeğer direnci topla.",
                "Paralel modda eşdeğer direncin en küçük dirençten küçük olduğunu gözlemle.",
                "Gerilimi artırınca akım ve gücün nasıl değiştiğini karşılaştır."
            ],
            quickCheck: "Paralel devrede toplam akım neden kollardaki akımların toplamıdır?",
            relatedResources: [
                { label: "Elektrik devreleri konu hub'ı", href: "/konular/devreler", type: "Konu" },
                { label: "Sözlükte Ohm yasasını aç", href: "/sozluk/ohm-yasasi", type: "Sözlük" },
                { label: "Fizik testleri", href: "/testler", type: "Test" }
            ]
        }
    },
    {
        id: "collision",
        slug: "1d-carpisma",
        title: "Parçacık Çarpışmaları (1D)",
        description: "Farklı kütle ve hızlara sahip cisimlerin esnek ve inelastik çarpışmalarını inceleyin.",
        icon: Combine,
        color: "#DC2626",
        formula: "P_i = P_f",
        difficulty: "Orta",
        tags: ["Mekanik", "Momentum", "Enerji"],
        seo: {
            title: "Esnek ve Esnek Olmayan Çarpışma Simülasyonu (1D) | FizikHub",
            description: "Tek boyutta momentumun korunumu ve çarpışmaları inceleyin. Kütle ve hızları değiştirerek esnek ile inelastik çarpışma arasındaki enerji farklarını görün.",
            keywords: ["çarpışma", "momentum korunumu", "esnek çarpışma", "inelastik çarpışma", "kinetik enerji", "fizik simülasyonu"]
        },
        learning: {
            bigQuestion: "Çarpışmada momentum korunurken kinetik enerji neden her zaman korunmayabilir?",
            outcome: "Esnek ve esnek olmayan çarpışmaları momentum ve enerji korunumu açısından ayırt edebilir.",
            estimatedMinutes: 10,
            prerequisite: "Momentum, kinetik enerji ve hızın yönlü büyüklük olması",
            checkpoints: [
                "Eşit kütleli iki cismin esnek çarpışmada hızlarını nasıl değiştirdiğini gözlemle.",
                "Kütleleri farklılaştırıp momentum paylaşımını yorumla.",
                "İnelastik çarpışmada enerjinin nereye gidebileceğini tartış."
            ],
            quickCheck: "İki cisim yapışıp birlikte hareket ederse hangi büyüklük kesin korunur?",
            relatedResources: [
                { label: "Mekanik konu rehberleri", href: "/konular", type: "Konu" },
                { label: "Fizik testleri", href: "/testler", type: "Test" },
                { label: "Forumda momentum sorusu sor", href: "/forum", type: "Forum" }
            ]
        }
    },
    {
        id: "spacex",
        slug: "spacex-yorunge-mekanigi",
        title: "SpaceX Starship Yörünge Mekaniği",
        description: "Starship'in yörüngeye fırlatılışını, yerçekimi dönüşünü ve dikey iniş mekaniğini interaktif modelleyin.",
        icon: Orbit,
        color: "#A78BFA",
        formula: "v = \\sqrt{G \\cdot M / r}",
        difficulty: "Zor",
        tags: ["Mekanik", "Kütleçekim", "Roket Fiziği"],
        seo: {
            title: "SpaceX Starship Yörünge Mekaniği ve Yerçekimi Dönüşü Simülasyonu | FizikHub",
            description: "SpaceX Starship'in yörüngeye fırlatma, gravity turn, orbital velocity ve atmosfere giriş aşamalarını 3D interaktif fizik simülatörüyle öğrenin.",
            keywords: ["spacex simülasyonu", "yörünge mekaniği", "gravity turn", "orbital velocity", "starship iniş", "fizik simülasyonu", "roket fiziği"]
        },
        learning: {
            bigQuestion: "Bir roket yörüngeye yerleşmek için neden sadece yukarı gitmez, yan yatarak hızlanır?",
            outcome: "Yörünge hızının yerçekimi ivmesi ve yükseklikle ilişkisini, merkezcil kuvvet ve kütleçekim formülüyle açıklar.",
            estimatedMinutes: 12,
            prerequisite: "Newton Kütleçekim Yasası, merkezcil kuvvet ve atmosferik sürtünme",
            checkpoints: [
                "10 km irtifada yerçekimi dönüşü (gravity turn) başlatarak yatay hız kazan.",
                "150 km irtifada dairesel yörünge hızına (yaklaşık 7.8 km/s) ulaşmayı dene.",
                "Yörüngeden çıkmak için ters yönde yanma (retro-burn) yaparak güvenli iniş rotası çiz."
            ],
            quickCheck: "Yörünge yüksekliği arttıkça kararlı yörüngede kalmak için gereken hız neden azalır?",
            relatedResources: [
                { label: "Gezegenlerin yörünge simülasyonu", href: "/simulasyonlar/gunes-sistemi", type: "Makale" },
                { label: "Uzay ve kozmoloji konuları", href: "/konular", type: "Konu" },
                { label: "Yerçekimi makalesi", href: "/makale/sessiz-bir-varsayim-yercekimi", type: "Makale" }
            ]
        }
    }
];

