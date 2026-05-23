export type BadgeRequirementType =
    | "manual"
    | "reputation"
    | "question_count"
    | "article_count"
    | "accepted_answer_count"
    | "following_count"
    | "follower_count";

export type BadgeCatalogItem = {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    requirement_type: BadgeRequirementType;
    requirement_value: number;
};

export const BADGE_CATEGORY_LABELS: Record<string, string> = {
    milestone: "Kilometre Taşları",
    interaction: "Etkileşim",
    contribution: "Katkı",
    reputation: "İtibar & Seviye",
    social: "Topluluk",
    expertise: "Uzmanlık",
    secret: "Gizli",
    special: "Özel",
    General: "Genel",
    Special: "Özel",
    Milestone: "Kilometre Taşı",
    Engagement: "Etkileşim",
    Contribution: "Katkı",
};

export const BADGE_CATEGORY_ICONS: Record<string, string> = {
    milestone: "🚀",
    interaction: "💬",
    contribution: "✍️",
    reputation: "⭐",
    social: "🤝",
    expertise: "🧠",
    secret: "🔮",
    special: "🌙",
};

export const DEFAULT_BADGES: BadgeCatalogItem[] = [
    { id: "merhaba-dunya", name: "Merhaba Dünya", description: "FizikHub'a hoş geldin! Bu alemdeki ilk izin.", icon: "zap", category: "milestone", requirement_type: "manual", requirement_value: 0 },
    { id: "soru-isareti", name: "Soru İşareti", description: "İlk sorusunu sorarak merakını evrene duyuranlara.", icon: "help-circle", category: "interaction", requirement_type: "question_count", requirement_value: 1 },
    { id: "einsteinin-mirasi", name: "Einstein'ın Mirası", description: "İlk makalesini yazarak bilime kalıcı bir iz bırakanlara.", icon: "book-open", category: "contribution", requirement_type: "article_count", requirement_value: 1 },
    { id: "newtonun-elmasi", name: "Newton'un Elması", description: "İlk doğru cevabı verenlere.", icon: "check-circle", category: "interaction", requirement_type: "accepted_answer_count", requirement_value: 1 },
    { id: "sorun-cozucu", name: "Sorun Çözücü", description: "10 cevabı kabul edilerek ustalaşanlara.", icon: "check-square", category: "expertise", requirement_type: "accepted_answer_count", requirement_value: 10 },
    { id: "gozlemci", name: "Gözlemci", description: "100 HubPuan'a ulaşarak uzayı izlemeye başlayanlara.", icon: "eye", category: "reputation", requirement_type: "reputation", requirement_value: 100 },
    { id: "cirak", name: "Çırak", description: "500 HubPuan'a ulaşarak mekanizmaları çözenlere.", icon: "tool", category: "reputation", requirement_type: "reputation", requirement_value: 500 },
    { id: "teorisyen", name: "Teorisyen", description: "1.000 HubPuan'a ulaşarak kendi teorilerini üretenlere.", icon: "edit-3", category: "reputation", requirement_type: "reputation", requirement_value: 1000 },
    { id: "profesor", name: "Profesör", description: "2.500 HubPuan'a ulaşıp kürsü sahibi olanlara.", icon: "award", category: "reputation", requirement_type: "reputation", requirement_value: 2500 },
    { id: "kozmolog", name: "Kozmolog", description: "5.000 HubPuan'a ulaşıp evrenin sınırlarını zorlayanlara.", icon: "globe", category: "reputation", requirement_type: "reputation", requirement_value: 5000 },
    { id: "kuantum-mekanigi", name: "Kuantum Mekaniği", description: "10.000 HubPuan efsanesi. Mikro alemlerin hakimi.", icon: "aperture", category: "reputation", requirement_type: "reputation", requirement_value: 10000 },
    { id: "populer", name: "Popüler", description: "İçeriklerinden biri 50+ beğeni alan parlayan yıldızlara.", icon: "heart", category: "social", requirement_type: "manual", requirement_value: 50 },
    { id: "bilge-baykus", name: "Bilge Baykuş", description: "Gece gündüz demeden bilgelik dağıtan kütüphane muhafızlarına.", icon: "book", category: "expertise", requirement_type: "manual", requirement_value: 0 },
    { id: "gece-kusu", name: "Gece Kuşu", description: "Gece yarısı içerik giren uykusuz fizikçilere.", icon: "moon", category: "special", requirement_type: "manual", requirement_value: 0 },
    { id: "seri-okuyucu", name: "Seri Okuyucu", description: "Kısa sürede 50 makale okuyup okuma ritmini güçlendirenlere.", icon: "book-open", category: "interaction", requirement_type: "manual", requirement_value: 50 },
    { id: "sosyal-kelebek", name: "Sosyal Kelebek", description: "5 farklı kişiyi takip eden topluluk üyelerine.", icon: "users", category: "social", requirement_type: "following_count", requirement_value: 5 },
    { id: "fikir-onderi", name: "Fikir Önderi", description: "Fikirleriyle 50 takipçiye ulaşan topluluk liderlerine.", icon: "star", category: "social", requirement_type: "follower_count", requirement_value: 50 },
    { id: "keskin-goz", name: "Keskin Göz", description: "Sözlüğe ilk akademik terimini ekleyen dikkatli araştırmacılara.", icon: "search", category: "contribution", requirement_type: "manual", requirement_value: 1 },
    { id: "teslanin-kivilcimi", name: "Tesla'nın Kıvılcımı", description: "Bir günde 5'ten fazla cevap veren enerji patlamalarına.", icon: "zap", category: "interaction", requirement_type: "manual", requirement_value: 0 },
    { id: "karadelik", name: "Karadelik", description: "Merakına karşı koyamayıp sitenin her köşesini keşfedenlere.", icon: "target", category: "secret", requirement_type: "manual", requirement_value: 0 },
];

export function getBadgeCategoryLabel(category?: string | null) {
    if (!category) return "Diğer";
    return BADGE_CATEGORY_LABELS[category] ?? category;
}

export function getBadgeCategoryTitle(category?: string | null) {
    const key = category ?? "";
    const icon = BADGE_CATEGORY_ICONS[key];
    const label = getBadgeCategoryLabel(category);
    return icon ? `${icon} ${label}` : `🏷️ ${label}`;
}

export function getBadgeRequirementLabel(type?: string | null, value?: number | null) {
    const safeValue = value ?? 0;

    if (type === "reputation") return `${safeValue} HubPuan`;
    if (type === "question_count") return `${safeValue} Soru`;
    if (type === "article_count") return `${safeValue} Makale`;
    if (type === "accepted_answer_count") return `${safeValue} Kabul Edilen Cevap`;
    if (type === "following_count") return `${safeValue} Takip`;
    if (type === "follower_count") return `${safeValue} Takipçi`;

    return null;
}
