import {
    Activity,
    Zap,
    Sparkles,
    Target,
    Magnet,
    Atom
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
};

export const simulations: Simulation[] = [
    {
        id: "projectile",
        slug: "atis-hareketi",
        title: "Atış Hareketi",
        description: "Bir cismin yerçekimi altındaki hareketini, hız, açı ve yükseklik parametreleriyle inceleyin.",
        icon: Target,
        color: "#EF4444",
        formula: "R = v²sin(2θ)/g",
        difficulty: "Kolay",
        tags: ["Mekanik", "Kinematik", "Vektörler"]
    },
    {
        id: "pendulum",
        slug: "basit-sarkac",
        title: "Basit Sarkaç",
        description: "Sarkaç periyodunun ip uzunluğu ve yerçekimi ivmesiyle ilişkisini gözlemleyin.",
        icon: Activity,
        color: "#FFC800",
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
        color: "#3B82F6",
        formula: "F = -kx",
        difficulty: "Orta",
        tags: ["Enerji", "Harmonik Hareket"]
    },
    {
        id: "wave",
        slug: "dalga-girisimi",
        title: "Dalga Girişimi",
        description: "Çift yarık deneyi ve dalgaların süperpozisyon ilkesini görselleştirin.",
        icon: Sparkles,
        color: "#22C55E",
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
        color: "#A855F7",
        formula: "F = G(m₁m₂)/r²",
        difficulty: "Orta",
        tags: ["Astronomi", "Kütleçekim"]
    }
];
