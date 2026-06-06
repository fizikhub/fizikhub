import { AI_CRAWLER_USER_AGENTS, AI_DISCOVERY_ROUTES } from "@/lib/ai-discovery";
import { getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 3600;

const PUBLIC_ALLOW_PATHS = [
    "/",
    "/makale/",
    "/blog/",
    "/konular/",
    "/sozluk/",
    "/forum/",
    "/simulasyonlar/",
    "/testler/",
    "/hakkimizda",
    "/iletisim",
    "/paylas",
    "/rozetler",
    "/siralamalar",
    "/puanlar-nedir",
    "/yazar/rehber",
    "/kullanici/",
    "/indexnow-key.txt",
    ...AI_DISCOVERY_ROUTES.map((route) => route.path),
];

const COMMON_DISALLOW_PATHS = [
    "/api/",
];

const SEARCH_CRAWLERS = [
    "Googlebot",
    "Googlebot-Image",
    "Googlebot-News",
    "Bingbot",
    "Yandex",
    "YandexBot",
    "DuckDuckBot",
    "Applebot",
    "Baiduspider",
    "SeznamBot",
    "Naverbot",
];

const YANDEX_CLEAN_PARAM_RULES = [
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&utm_id&fbclid&gclid&yclid&ysclid&mc_cid&mc_eid&ref&source /",
    "Clean-param: sort&filter /makale",
    "Clean-param: sort&filter /forum",
    "Clean-param: filter /sozluk",
];

const SITEMAP_PATHS = [
    "/sitemap-index.xml",
    "/sitemap.xml",
    "/topic-sitemap.xml",
    "/article-sitemap.xml",
    "/forum-sitemap.xml",
    "/dictionary-sitemap.xml",
    "/news-sitemap.xml",
    "/ai-sitemap.xml",
    "/author-sitemap.xml",
];

function renderGroup(userAgent: string, options: { crawlDelay?: number; includeCleanParams?: boolean } = {}) {
    return [
        `User-agent: ${userAgent}`,
        ...PUBLIC_ALLOW_PATHS.map((path) => `Allow: ${path}`),
        ...COMMON_DISALLOW_PATHS.map((path) => `Disallow: ${path}`),
        options.crawlDelay ? `Crawl-delay: ${options.crawlDelay}` : null,
        ...(options.includeCleanParams ? YANDEX_CLEAN_PARAM_RULES : []),
    ]
        .filter(Boolean)
        .join("\n");
}

export function GET() {
    const baseUrl = getSiteUrl();
    const groups = [
        ...AI_CRAWLER_USER_AGENTS.map((bot) => renderGroup(bot, { crawlDelay: 2 })),
        ...SEARCH_CRAWLERS.map((bot) => renderGroup(bot, {
            crawlDelay: bot === "Bingbot" || bot.startsWith("Yandex") ? 2 : undefined,
            includeCleanParams: bot === "Yandex" || bot === "YandexBot",
        })),
        renderGroup("*", { crawlDelay: 1, includeCleanParams: true }),
    ];

    const text = [
        "# Fizikhub crawler policy",
        "# Public educational pages are crawlable; API endpoints are not search surfaces.",
        ...groups,
        ...SITEMAP_PATHS.map((path) => `Sitemap: ${baseUrl}${path}`),
        "",
    ].join("\n\n");

    return new Response(text, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
