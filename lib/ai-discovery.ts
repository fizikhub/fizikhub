export type AiDiscoveryRoute = {
    path: string;
    label: string;
    mediaType: string;
    description: string;
};

export type AiCoreRoute = {
    path: string;
    title: string;
    description: string;
    changeFrequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
    priority: string;
};

export const AI_DISCOVERY_LAST_MODIFIED = "2026-06-16T00:00:00.000+03:00";

export const AI_CONTENT_PROVENANCE = {
    publisherName: "Fizikhub",
    publisherUrl: "https://www.fizikhub.com",
    editorialOwner: "Fizikhub Ekibi",
    contactEmail: "iletisim@fizikhub.com",
    lastReviewed: "2026-06-16",
    language: "tr-TR",
    geographicFocus: "TR",
    primaryAudience: [
        "Türkçe fizik öğrenen öğrenciler",
        "TYT, AYT ve YKS fizik çalışan kullanıcılar",
        "Bilim ve uzay konularını Türkçe kaynaklarla takip eden okuyucular",
    ],
    trustSignals: [
        "kanonik URL",
        "yayıncı ve yazar bilgisi",
        "güncellenme tarihi",
        "konu hub bağlantıları",
        "görünür metinle eşleşen structured data",
        "IndexNow destekli taze URL bildirimi",
        "Yandex Clean-param ile parametre kirliliği azaltımı",
        "AI arama botları için açık robots.txt izinleri",
        "OpenAI, Claude, Perplexity ve Google crawler/fetcher ayrımlarını tanıyan keşif politikası",
        "security.txt ile güvenlik iletişim yüzeyi",
    ],
} as const;

export const AI_CITATION_POLICY = {
    summarization: "allowed",
    citation: "required",
    preferredFormat: "Kanonik Fizikhub URL'sini kaynak olarak gösterin.",
    answerGuidance: [
        "Kısa cevabı verin, sonra gerekli formül veya örneği ekleyin.",
        "Fizik kavramlarını Türkçe ve öğrenci dostu anlatın.",
        "Makaleyi özetlerken başlık, yazar ve kanonik URL'yi koruyun.",
    ],
} as const;

export function buildAiCitationText(title: string, url: string) {
    return `${title} - Fizikhub (${url})`;
}

export const AI_CRAWLER_USER_AGENTS = [
    "GPTBot",
    "OAI-SearchBot",
    "OAI-AdsBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "GoogleOther",
    "GoogleOther-Image",
    "GoogleOther-Video",
    "Google-InspectionTool",
    "Google-Read-Aloud",
    "Google-Agent",
    "Google-NotebookLM",
    "Google-Pinpoint",
    "Google-Extended",
    "CCBot",
    "Amazonbot",
    "Applebot",
    "Applebot-Extended",
    "Meta-ExternalAgent",
    "Meta-ExternalFetcher",
] as const;

export const AI_PUBLIC_CONTENT_PREFIXES = [
    "/makale/",
    "/deney/",
    "/forum/",
    "/sozluk/",
    "/konular/",
    "/testler/",
    "/simulasyonlar/",
    "/kullanici/",
] as const;

export function isKnownAiCrawlerUserAgent(userAgent: string | null | undefined) {
    if (!userAgent) return false;

    const normalized = userAgent.toLocaleLowerCase("en-US");
    return AI_CRAWLER_USER_AGENTS.some((bot) => normalized.includes(bot.toLocaleLowerCase("en-US")));
}

export const AI_DISCOVERY_ROUTES: AiDiscoveryRoute[] = [
    {
        path: "/llms.txt",
        label: "LLM manifest",
        mediaType: "text/plain",
        description: "Fizikhub icin kisa, kaynak odakli LLM giris rehberi.",
    },
    {
        path: "/ai-index.json",
        label: "AI index",
        mediaType: "application/json",
        description: "Kanonik URL, konu, sema tipi ve iliski verisi tasiyan makine okunabilir indeks.",
    },
    {
        path: "/simulation-learning.json",
        label: "Simulation learning graph",
        mediaType: "application/json",
        description: "Interaktif fizik simulasyonlari icin hedef, kontrol noktasi, kavram ve related URL grafigi.",
    },
    {
        path: "/ai-sitemap.xml",
        label: "AI sitemap",
        mediaType: "application/xml",
        description: "AI arama ve cevap motorlari icin yuksek sinyal tasiyan public sayfalar.",
    },
    {
        path: "/author-sitemap.xml",
        label: "Author sitemap",
        mediaType: "application/xml",
        description: "Indexlenebilir Fizikhub yazar ve topluluk profilleri.",
    },
    {
        path: "/sitemap-index.xml",
        label: "Sitemap index",
        mediaType: "application/xml",
        description: "Tum klasik SEO sitemap yuzeylerini birlestiren sitemap indeksi.",
    },
    {
        path: "/feed.xml",
        label: "RSS feed",
        mediaType: "application/rss+xml",
        description: "Yeni makaleler icin yayin akisi.",
    },
];

export const AI_CORE_ROUTES: AiCoreRoute[] = [
    {
        path: "/",
        title: "Fizikhub ana sayfa",
        description: "Turkce fizik, uzay, bilim ve egitim toplulugu.",
        changeFrequency: "daily",
        priority: "1.0",
    },
    {
        path: "/makale",
        title: "Bilim makaleleri",
        description: "Fizik, astronomi, kuantum ve populer bilim makale arsivi.",
        changeFrequency: "daily",
        priority: "0.90",
    },
    {
        path: "/konular",
        title: "Fizik konu rehberleri",
        description: "GEO topic hub yapisinda fizik konu kumeleri.",
        changeFrequency: "weekly",
        priority: "0.88",
    },
    {
        path: "/forum",
        title: "Bilim ve fizik forumu",
        description: "TYT, AYT ve YKS fizik sorusu sorma, aciklamali cevaplar ve bilim toplulugu tartismalari.",
        changeFrequency: "hourly",
        priority: "0.90",
    },
    {
        path: "/sozluk",
        title: "Bilim sozlugu",
        description: "Fizik ve bilim terimleri icin tanim sayfalari.",
        changeFrequency: "weekly",
        priority: "0.82",
    },
    {
        path: "/simulasyonlar",
        title: "Interaktif fizik simulasyonlari",
        description: "Fizik konularini deneyerek ogrenme merkezi.",
        changeFrequency: "monthly",
        priority: "0.76",
    },
    {
        path: "/testler",
        title: "Fizik testleri",
        description: "TYT, AYT ve YKS odakli fizik testleri.",
        changeFrequency: "weekly",
        priority: "0.72",
    },
    {
        path: "/hakkimizda",
        title: "Fizikhub hakkinda",
        description: "Yayinci, misyon ve guven sinyalleri.",
        changeFrequency: "monthly",
        priority: "0.50",
    },
    {
        path: "/iletisim",
        title: "Fizikhub iletisim",
        description: "Yayinci iletisim ve destek bilgileri.",
        changeFrequency: "monthly",
        priority: "0.45",
    },
];
