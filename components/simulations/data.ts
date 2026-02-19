import {
    Activity,
    Zap,
    Sparkles,
    Target,
    Magnet,
    Atom,
    Dna,
    Lightbulb, // Import Lightbulb for Optics
    Orbit,
    Combine
} from "lucide-react";

export type Simulation = {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: any;
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
};

export const simulations: Simulation[] = [
    {
        id: "projectile",
        slug: "atis-hareketi",
        title: "Atış Hareketi",
        description: "Bir cismin yerçekimi altındaki hareketini, hız, açı ve yükseklik parametreleriyle inceleyin.",
        icon: Target,
        color: "#FF6B6B", // Soft Vibrant Red
        formula: "R = v²sin(2θ)/g",
        difficulty: "Kolay",
        tags: ["Mekanik", "Kinematik", "Vektörler"]
    },
    {
        id: "optics",
        slug: "optik-laboratuvari",
        title: "Optik Laboratuvarı",
        description: "Işığın kırılma (Snell Yasası) ve tam yansıma olaylarını interaktif olarak keşfedin.",
        icon: Lightbulb,
        color: "#38BDF8", // Sky Blue
        formula: "n₁sinθ₁ = n₂sinθ₂",
        difficulty: "Orta",
        tags: ["Optik", "Kırılma", "Yansıma"]
    },
    {
        id: "pendulum",
        slug: "basit-sarkac",
        title: "Basit Sarkaç",
        description: "Sarkaç periyodunun ip uzunluğu ve yerçekimi ivmesiyle ilişkisini gözlemleyin.",
        icon: Activity,
        color: "#FCD34D", // Soft Amber
        formula: "T = 2π√(L/g)",
        difficulty: "Kolay",
        tags: ["Harmonik Hareket", "Mekanik"]
    },
    {
        id: "spring",
        slug: "yay-kutle",
        title: "Yay-Kütle Sistemi",
        description: "Hooke yasası, potansiyel enerji ve kinetik enerji dönüşümlerini keşfedin.",
        icon: Zap,
        color: "#60A5FA", // Soft Blue
        formula: "F = -kx",
        difficulty: "Orta",
        tags: ["Enerji", "Harmonik Hareket"],
        seo: {
            title: "Yay Kütle Sistemi Simülasyonu - Hooke Yasası | FizikHub",
            description: "Yay sabiti ve kütle değişiminin basit harmonik harekete etkisini interaktif olarak inceleyin. Hooke yasası ve enerji dönüşümü simülasyonu.",
            keywords: ["yay sarkacı", "hooke yasası", "basit harmonik hareket", "yay potansiyel enerjisi", "fizik simülasyonu"]
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
        color: "#4ADE80", // Soft Green
        formula: "y = A sin(kx - ωt)",
        difficulty: "Zor",
        tags: ["Dalgalar", "Optik"]
    },
    {
        id: "solar",
        slug: "gunes-sistemi",
        title: "Güneş Sistemi",
        description: "Gezegenlerin yörünge hareketlerini ve kütleçekim kuvvetini 3 boyutlu inceleyin.",
        icon: Atom,
        color: "#A78BFA", // Soft Purple
        formula: "F = G(m₁m₂)/r²",
        difficulty: "Orta",
        tags: ["Astronomi", "Kütleçekim"]
    },
    {
        id: "electric",
        slug: "elektrik-alan",
        title: "Elektrik Alan ve Konumları",
        description: "Noktasal elektrik yüklerinin etrafında oluşan alan çizgilerini ve dipol yapısını inceleyin.",
        icon: Orbit,
        color: "#4ADE80", // Soft Green
        formula: "E = k·q/r²",
        difficulty: "Orta",
        tags: ["Elektromanyetizma", "Alan Çizgileri"]
    },
    {
        id: "collision",
        slug: "1d-carpisma",
        title: "Parçacık Çarpışmaları (1D)",
        description: "Farklı kütle ve hızlara sahip cisimlerin esnek ve inelastik çarpışmalarını inceleyin.",
        icon: Combine,
        color: "#F87171", // Soft Red
        formula: "P_i = P_f",
        difficulty: "Orta",
        tags: ["Mekanik", "Momentum", "Enerji"]
    }
];
