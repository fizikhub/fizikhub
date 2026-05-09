export const SEO_PRIORITY_ARTICLES = [
    {
        slug: "kuantum-fiziginin-baslangici-kara-cisim-isimasi-1766099948990",
        title: "Siyah Cisim Işıması Nedir?",
        description: "Kara cisim ışıması, morötesi felaket ve Planck'ın kuantum fikri.",
        keywords: ["siyah cisim ışıması", "kara cisim ışıması", "morötesi felaket"],
    },
    {
        slug: "fizikte-ritmi-yakalamak-basit-harmonik-hareket-nedir-mk9qw6u9gcj",
        title: "Periyodik Hareket Nedir?",
        description: "Basit harmonik hareket, periyot, frekans ve salınım örnekleri.",
        keywords: ["periyodik hareket nedir", "basit harmonik hareket", "salınım"],
    },
    {
        slug: "entropi-nedir-evrenin-sonu-nasil-gelecek-1767534266662",
        title: "Entropi Nedir?",
        description: "Entropi ne demek, yüksek entropi ve termodinamikte entropi artışı.",
        keywords: ["entropi nedir", "entropi ne demek", "yüksek entropi"],
    },
] as const;

export const SEO_PRIORITY_SLUGS = SEO_PRIORITY_ARTICLES.map((article) => article.slug);

export const SEO_PRIORITY_SLUG_SET = new Set<string>(SEO_PRIORITY_SLUGS);

